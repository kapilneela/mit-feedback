import {
  STUDENTS,
  COURSES,
  ALL_DIVISIONS,
  DEFAULT_PASSWORDS,
  COORDINATORS,
  FACULTY_MEMBERS,
  FEEDBACK_QUESTIONS,
  getCoursesForDivision,
  INITIAL_RESPONSES
} from '../data/initialData';
import { getSupabase, isSupabaseConnected } from './supabaseClient';

// Local storage keys (bumped to v2200 to load all 2,201 students, 52 courses, and 80 faculty)
const KEY_PASSWORDS = 'mitwpu_auth_passwords_v2';
const KEY_RESPONSES = 'mitwpu_feedback_responses_v2'; // fresh key to ensure 0 dummy data!
const KEY_QUESTIONS = 'mitwpu_feedback_questions_v2';
const KEY_COURSES = 'mitwpu_courses_v52';
const KEY_COORDINATORS = 'mitwpu_coordinators_v32';
const KEY_FACULTY = 'mitwpu_faculty_allocations_v80_exact';
const KEY_STUDENTS = 'mitwpu_students_v2200';
const KEY_SUBJECT_CONFIGS = 'mitwpu_subject_configs_v1';

function getStoredItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// 1. Passwords
export function getAuthPasswords() {
  return getStoredItem(KEY_PASSWORDS, DEFAULT_PASSWORDS);
}

export function updateAuthPassword(role, newPassword) {
  const current = getAuthPasswords();
  current[role] = newPassword;
  setStoredItem(KEY_PASSWORDS, current);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('portal_settings').upsert({
          key: 'auth_passwords',
          data: current,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase password sync warning:', e);
    }
  }

  return current;
}

// 2. UNIFIED AUTHENTICATION - Single login for all roles
export async function unifiedLogin(identifier, password) {
  const passwords = getAuthPasswords();
  const cleanId = (identifier || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    throw new Error('Please enter both your PRN / Email and Password.');
  }

  // A. Check Admin
  if (cleanId.toLowerCase() === 'admin@mitwpu.edu.in' || cleanId.toLowerCase() === 'admin') {
    if (cleanPass === passwords.admin) {
      return {
        role: 'admin',
        name: 'Administrator',
        email: 'admin@mitwpu.edu.in',
        department: 'Central Academic Administration, MIT-WPU'
      };
    } else {
      throw new Error(`Incorrect Admin password. (Default is ${passwords.admin})`);
    }
  }

  // B. Check Faculty & Course Coordinators (Unified Faculty Directory)
  const facultyList = getAllFacultyAllocations();
  const matchedTeacher = facultyList.find(f => 
    f.email.toLowerCase() === cleanId.toLowerCase() || 
    f.id.toLowerCase() === cleanId.toLowerCase()
  );

  if (matchedTeacher) {
    if (cleanPass === passwords.teacher) {
      return {
        ...matchedTeacher,
        facultyRole: matchedTeacher.role,
        role: 'teacher',
        isCoordinator: matchedTeacher.role === 'Course Coordinator',
        assignedDivisions: matchedTeacher.assignedDivisions || []
      };
    } else {
      throw new Error(`Incorrect Faculty / Coordinator password. (Default is ${passwords.teacher})`);
    }
  }

  // C. Check Students (by PRN or exact match)
  const students = getStoredItem(KEY_STUDENTS, STUDENTS);
  const foundStudent = students.find(s => s.prn === cleanId);
  if (foundStudent) {
    if (cleanPass === passwords.student) {
      return {
        role: 'student',
        ...foundStudent
      };
    } else {
      throw new Error(`Incorrect Student password. (Default is ${passwords.student})`);
    }
  }

  throw new Error(`No student with PRN "${cleanId}" or faculty member found. Please check your credentials.`);
}

// Legacy helper for direct role switching in dev
export async function authenticate(role, identifier, password) {
  return unifiedLogin(identifier, password);
}

// 3. Student & Subjects
export function getStudentEnrolledSubjects(studentPrn) {
  const students = getStoredItem(KEY_STUDENTS, STUDENTS);
  const student = students.find(s => s.prn === studentPrn);
  if (!student) return [];

  const facultyAllocations = getAllFacultyAllocations();
  const divisionCourses = getCoursesForDivision(student.division, facultyAllocations);
  const responses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);

  return divisionCourses.map(course => {
    const submission = responses.find(r => r.studentPrn === studentPrn && r.courseCode === course.code);
    return {
      ...course,
      division: student.division,
      batch: student.batch,
      isSubmitted: Boolean(submission),
      submittedAt: submission ? submission.submittedAt : null,
      submissionData: submission || null
    };
  });
}

// 4. Submit Feedback
export async function submitStudentFeedback(feedbackData) {
  const responses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  
  const filtered = responses.filter(r => !(r.studentPrn === feedbackData.studentPrn && r.courseCode === feedbackData.courseCode));
  const newResponse = {
    id: `resp-${feedbackData.studentPrn}-${feedbackData.courseCode}-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    ...feedbackData
  };

  filtered.unshift(newResponse);
  setStoredItem(KEY_RESPONSES, filtered);

  // Sync with Supabase if connected
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('feedback_responses').upsert({
          id: newResponse.id,
          student_prn: newResponse.studentPrn,
          student_name: newResponse.studentName,
          division: newResponse.division,
          batch: newResponse.batch,
          course_code: newResponse.courseCode,
          course_name: newResponse.courseName,
          faculty: newResponse.faculty,
          ratings: newResponse.ratings,
          comment: newResponse.comment || '',
          submitted_at: newResponse.submittedAt
        });
      }
    } catch (err) {
      console.warn('Supabase remote insert warning:', err);
    }
  }

  return newResponse;
}

// 4b. Admin: Remove / Delete Feedback Submissions
export function getAllFeedbackResponses() {
  return getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
}

// Helper to persist deleted response tombstones in Supabase portal_settings and delete from feedback_responses
export async function markFeedbackResponsesDeletedInSupabase(deletedIds) {
  if (!deletedIds || deletedIds.length === 0 || !isSupabaseConnected()) return;
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    // 1. Fetch current deleted_feedback_ids
    const { data } = await supabase
      .from('portal_settings')
      .select('data')
      .eq('key', 'deleted_feedback_ids')
      .maybeSingle();

    const existing = Array.isArray(data?.data) ? data.data : [];
    const merged = Array.from(new Set([...existing, ...deletedIds]));

    // 2. Persist tombstone list to portal_settings
    await supabase.from('portal_settings').upsert({
      key: 'deleted_feedback_ids',
      data: merged,
      updated_at: new Date().toISOString()
    });

    // 3. Attempt direct delete on feedback_responses table
    for (const id of deletedIds) {
      await supabase.from('feedback_responses').delete().eq('id', id);
    }
  } catch (err) {
    console.warn('Supabase markFeedbackResponsesDeleted warning:', err);
  }
}

export async function removeFeedbackResponse({ responseId, studentPrn, courseCode }) {
  const current = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  
  // Collect matching IDs to ensure complete tombstone & remote deletion
  const toDelete = current.filter(r => {
    if (responseId && r.id === responseId) return true;
    if (studentPrn && courseCode && r.studentPrn === studentPrn && r.courseCode === courseCode) return true;
    return false;
  });
  const deletedIds = toDelete.map(r => r.id).filter(Boolean);
  if (responseId && !deletedIds.includes(responseId)) {
    deletedIds.push(responseId);
  }

  const updated = current.filter(r => {
    if (responseId && r.id === responseId) return false;
    if (studentPrn && courseCode && r.studentPrn === studentPrn && r.courseCode === courseCode) return false;
    return true;
  });

  setStoredItem(KEY_RESPONSES, updated);

  // Sync delete to Supabase if connected
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        if (responseId) {
          await supabase.from('feedback_responses').delete().eq('id', responseId);
        } else if (studentPrn && courseCode) {
          await supabase.from('feedback_responses').delete()
            .eq('student_prn', studentPrn)
            .eq('course_code', courseCode);
        }
      }
    } catch (err) {
      console.warn('Supabase remote delete warning:', err);
    }
    await markFeedbackResponsesDeletedInSupabase(deletedIds);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), responseCount: updated.length, status: 'LIVE' }
    }));
  }

  return updated;
}

export async function removeStudentAllFeedbacks(studentPrn) {
  const current = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  const toDelete = current.filter(r => r.studentPrn === studentPrn);
  const deletedIds = toDelete.map(r => r.id).filter(Boolean);

  const updated = current.filter(r => r.studentPrn !== studentPrn);
  setStoredItem(KEY_RESPONSES, updated);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('feedback_responses').delete().eq('student_prn', studentPrn);
      }
    } catch (err) {
      console.warn('Supabase remote delete student feedback warning:', err);
    }
    await markFeedbackResponsesDeletedInSupabase(deletedIds);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), responseCount: updated.length, status: 'LIVE' }
    }));
  }

  return updated;
}

export async function clearAllFeedbacks() {
  const current = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  const allIds = current.map(r => r.id).filter(Boolean);

  setStoredItem(KEY_RESPONSES, []);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('feedback_responses').delete().neq('id', 'placeholder');
        const clearedAt = new Date().toISOString();
        await supabase.from('portal_settings').upsert([
          {
            key: 'all_feedbacks_cleared_at',
            data: clearedAt,
            updated_at: clearedAt
          },
          {
            key: 'deleted_feedback_ids',
            data: allIds,
            updated_at: clearedAt
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase remote clear all warning:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), responseCount: 0, status: 'LIVE' }
    }));
  }

  return [];
}

// 5. Coordinator Analytics for Assigned Subject(s) & Divisions
export function isCoordinatorSubject(courseCode, courseName, facultyName, coord) {
  if (!coord) return false;

  // 1. Check faculty name match
  if (facultyName && coord.name) {
    const cleanF = facultyName.toLowerCase().replace(/^(prof|dr|mr|ms|mrs)\.?\s+/i, '').trim();
    const cleanC = coord.name.toLowerCase().replace(/^(prof|dr|mr|ms|mrs)\.?\s+/i, '').trim();
    if (cleanF && cleanC && (cleanF.includes(cleanC) || cleanC.includes(cleanF))) {
      return true;
    }
  }

  // 2. Check subject match against coordinator's assigned subjects
  const subjects = coord.subjects || [];
  if (subjects.length === 0) {
    return false;
  }

  const codeLow = (courseCode || '').toLowerCase().trim();
  const nameLow = (courseName || '').toLowerCase().trim();

  return subjects.some(s => {
    const sLow = s.toLowerCase().trim();
    if (codeLow && (sLow.includes(codeLow) || codeLow.includes(sLow))) return true;
    if (nameLow && (sLow.includes(nameLow) || nameLow.includes(sLow))) return true;
    
    // Check subject code prefix/acronym e.g. EC, BEEE, EP, EM, PPS, LADC, EGR
    const m = sLow.match(/^([a-z]+)\b/);
    if (m) {
      const acr = m[1];
      if (codeLow && codeLow.includes(acr)) return true;
      if (nameLow && nameLow.includes(acr)) return true;
    }
    return false;
  });
}

export function getCoordinatorDashboardData(coordinatorEmail) {
  const facultyList = getAllFacultyAllocations();
  const cleanEmail = (coordinatorEmail || '').toLowerCase();
  
  // Find coordinator in the unified faculty directory
  const foundFaculty = facultyList.find(f => 
    f.email.toLowerCase() === cleanEmail || 
    f.id.toLowerCase() === cleanEmail
  );
  
  let coord = foundFaculty || facultyList[0];
  let assignedDivisions = coord.assignedDivisions || [];
  let assignedSubjects = coord.subjects || [];

  const allStudents = getStoredItem(KEY_STUDENTS, STUDENTS);
  const allResponses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);

  const relevantStudents = allStudents.filter(s => 
    assignedDivisions.includes(s.division) || assignedDivisions.includes('All Divisions')
  );
  const totalEnrolledStudents = relevantStudents.length;

  // Breakdown for each assigned division — strictly for coordinator's assigned subject(s)!
  const divisionStats = assignedDivisions.map(divName => {
    const divStudents = allStudents.filter(s => s.division === divName);
    const divStudentPrns = new Set(divStudents.map(s => s.prn));
    const divCourses = getCoursesForDivision(divName, facultyList);
    
    // Filter to coordinator's subjects in this division
    const coordCourses = divCourses.filter(c => isCoordinatorSubject(c.code, c.name, c.faculty, coord));
    const effectiveCourses = coordCourses.length > 0 ? coordCourses : (assignedSubjects.length > 0 ? assignedSubjects.map(s => ({ code: s, name: s, faculty: coord.name })) : divCourses.slice(0, 1));
    const totalExpectedSubmissions = divStudents.length * effectiveCourses.length;

    // Submissions for this coordinator's subject ONLY
    const divResponses = allResponses.filter(r => 
      divStudentPrns.has(r.studentPrn) && 
      isCoordinatorSubject(r.courseCode, r.courseName, r.faculty, coord)
    );
    
    const studentsSubmitted = new Set(divResponses.map(r => r.studentPrn)).size;

    const completionPercent = totalExpectedSubmissions > 0 
      ? Math.round((divResponses.length / totalExpectedSubmissions) * 100) 
      : 0;
    
    const studentParticipationPercent = divStudents.length > 0
      ? Math.round((studentsSubmitted / divStudents.length) * 100)
      : 0;

    const branchName = divStudents.length > 0 ? divStudents[0].branch : 'First Year Engineering';

    return {
      division: divName,
      branch: branchName,
      totalStudents: divStudents.length,
      expectedSubmissions: totalExpectedSubmissions,
      actualSubmissions: divResponses.length,
      studentsStarted: studentsSubmitted,
      studentsFullyCompleted: studentsSubmitted,
      completionPercent,
      studentParticipationPercent,
      courses: effectiveCourses
    };
  });

  const totalExpectedAll = divisionStats.reduce((sum, d) => sum + d.expectedSubmissions, 0);
  const totalActualAll = divisionStats.reduce((sum, d) => sum + d.actualSubmissions, 0);
  const overallCompletionPercentage = totalExpectedAll > 0 
    ? Math.round((totalActualAll / totalExpectedAll) * 100) 
    : 0;

  const relevantStudentPrns = new Set(relevantStudents.map(s => s.prn));
  // Filter all coordinator responses to ONLY the coordinator's assigned subjects
  const coordinatorResponses = allResponses.filter(r => 
    relevantStudentPrns.has(r.studentPrn) &&
    isCoordinatorSubject(r.courseCode, r.courseName, r.faculty, coord)
  );

  const primarySubject = assignedSubjects[0] || '';
  const allSubjQuestions = getAllQuestionsForSubject(primarySubject).filter(q => q.type.startsWith('rating'));
  const parameterAverages = allSubjQuestions.map(q => {
    let sum = 0;
    let count = 0;
    coordinatorResponses.forEach(r => {
      if (r.ratings && r.ratings[q.id]) {
        sum += Number(r.ratings[q.id]);
        count++;
      }
    });
    const avg = count > 0 ? (sum / count).toFixed(2) : '0.00';
    return {
      id: q.id,
      category: q.category,
      question: q.text || q.question || '',
      text: q.text || q.question || '',
      average: parseFloat(avg),
      count,
      isSubjectSpecific: !!q.isSubjectSpecific
    };
  });

  const comments = coordinatorResponses
    .filter(r => r.comment && r.comment.trim().length > 0)
    .map(r => ({
      courseCode: r.courseCode,
      courseName: r.courseName,
      division: r.division,
      faculty: r.faculty,
      comment: r.comment,
      submittedAt: r.submittedAt
    }));

  return {
    coordinator: coord,
    assignedDivisions,
    assignedSubjects,
    totalEnrolledStudents,
    totalExpectedSubmissions: totalExpectedAll,
    totalActualSubmissions: totalActualAll,
    overallCompletionPercentage,
    divisionStats,
    parameterAverages,
    comments
  };
}

// 6. Admin Panel Statistics across ALL 32 Divisions
export function getAllDivisionsDetailedStats() {
  const allStudents = getAllStudentsList();
  const allResponses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);

  return ALL_DIVISIONS.map(divName => {
    const divStudents = allStudents.filter(s => s.division === divName);
    const divStudentPrns = new Set(divStudents.map(s => s.prn));
    const divCourses = getCoursesForDivision(divName);
    const expected = divStudents.length * divCourses.length;
    const actual = allResponses.filter(r => divStudentPrns.has(r.studentPrn)).length;
    const studentsSubmitted = new Set(allResponses.filter(r => divStudentPrns.has(r.studentPrn)).map(r => r.studentPrn)).size;
    const percent = expected > 0 ? Math.round((actual / expected) * 100) : 0;

    return {
      division: divName,
      studentCount: divStudents.length,
      expected,
      actual,
      studentsSubmitted,
      percent
    };
  });
}

export function getAllCoordinators() {
  const faculty = getAllFacultyAllocations();
  return faculty.filter(f => f.role === 'Course Coordinator');
}

export function updateCoordinatorAssignments(coordinatorId, assignedDivisions, subjects) {
  const faculty = getAllFacultyAllocations();
  const updated = faculty.map(f => {
    if (f.id === coordinatorId || f.email.toLowerCase() === coordinatorId.toLowerCase()) {
      return {
        ...f,
        assignedDivisions: assignedDivisions || f.assignedDivisions,
        subjects: subjects || f.subjects
      };
    }
    return f;
  });
  setStoredItem(KEY_FACULTY, updated);
  return updated.filter(f => f.role === 'Course Coordinator');
}

export function getFeedbackQuestions() {
  const qs = getStoredItem(KEY_QUESTIONS, FEEDBACK_QUESTIONS);
  return (qs || []).map(q => ({
    ...q,
    text: q.text || q.question || '',
    question: q.text || q.question || ''
  }));
}

export function saveFeedbackQuestions(questions) {
  setStoredItem(KEY_QUESTIONS, questions);
  
  // Sync to Supabase
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('portal_settings').upsert({
          key: 'feedback_questions',
          data: questions,
          updated_at: new Date().toISOString()
        }).then(() => {});

        // Direct delete removed questions from feedback_questions table
        const activeIds = (questions || []).map(q => q.id).filter(Boolean);
        if (activeIds.length > 0) {
          supabase.from('feedback_questions')
            .delete()
            .not('id', 'in', `(${activeIds.join(',')})`)
            .then(() => {});
        }
      }
    } catch (e) {
      console.warn('Supabase saveFeedbackQuestions warning:', e);
    }
  }

  return questions;
}

// 5c. Course Outcomes (CO) & Subject-Specific Feedback Questions (Configured by Course Coordinators)
export const SUBJECT_ALIAS_MAP = {
  'EC': 'CHM10011',
  'LADC': 'EMT11011',
  'EP': 'PHY10010',
  'EGR': 'MEC10021',
  'EM': 'CIV10010',
  'PPS': 'CSE10120',
  'BEEE': 'ECE10010',
  'PYTHON PROGRAMMING': 'CSE10040',
  'CAM': 'MEC10030',
  'DELD': 'ESV10020',
  'IIM': 'MEC10010',
  'AEC': 'CDC10010',
  'YOGA': 'YOG10010'
};

export function normalizeSubjectKey(input, courseName = '') {
  if (!input && !courseName) return '';
  const s = (input || '').trim();
  const name = (courseName || '').trim();
  const courses = getAllCoursesList();

  // 1. Direct code match in catalog
  if (s) {
    const direct = courses.find(c => c.code.toLowerCase() === s.toLowerCase());
    if (direct) return direct.code;
  }

  // 2. Direct name match in catalog
  if (name) {
    const byName = courses.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (byName) return byName.code;
  }
  if (s) {
    const bySName = courses.find(c => c.name.toLowerCase() === s.toLowerCase());
    if (bySName) return bySName.code;
  }

  // 3. Extract text inside parentheses, e.g. "EC (Engineering Chemistry)" -> "Engineering Chemistry"
  const parenMatch = s.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].trim().toLowerCase();
    const matched = courses.find(c => c.name.toLowerCase().includes(inside) || inside.includes(c.name.toLowerCase()));
    if (matched) return matched.code;
  }

  // 4. Extract prefix acronym, e.g. "EC" or "PYTHON PROGRAMMING"
  const prefixMatch = s.match(/^([A-Za-z0-9\- ]+)/);
  if (prefixMatch) {
    const prefix = prefixMatch[1].trim().toUpperCase();
    if (SUBJECT_ALIAS_MAP[prefix]) return SUBJECT_ALIAS_MAP[prefix];
  }

  // 5. Check if string contains any acronym from SUBJECT_ALIAS_MAP
  const sUpper = s.toUpperCase();
  for (const [acr, code] of Object.entries(SUBJECT_ALIAS_MAP)) {
    if (sUpper.includes(acr)) return code;
  }

  // 6. Partial name match
  if (s) {
    const sLow = s.toLowerCase();
    const partial = courses.find(c => sLow.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(sLow));
    if (partial) return partial.code;
  }

  return (s || name).toUpperCase();
}

export const DEFAULT_COURSE_OUTCOMES = {
  EMT11011: `CO1: Apply matrix algebra and determinants to solve systems of linear equations and analyze engineering transformations.
CO2: Utilize differential and integral calculus concepts to model and analyze physical and dynamical engineering systems.
CO3: Evaluate eigenvalues, eigenvectors, and diagonalization for stability analysis in engineering problems.
CO4: Formulate and solve first and higher-order ordinary differential equations applicable to engineering models.
CO5: Apply multivariable calculus tools and gradient vectors to optimize multivariable engineering functions.`,

  CHM10011: `CO1: Comprehend chemical bonding, molecular structure, and periodic properties in engineering materials.
CO2: Analyze electrochemical systems, battery technologies, energy storage, and corrosion prevention mechanisms.
CO3: Understand spectroscopic techniques (UV-Vis, IR, NMR) for characterization of chemical compounds and polymers.
CO4: Evaluate water quality parameters, water treatment methodologies, and green chemistry principles in industrial applications.
CO5: Demonstrate safe handling of chemical reagents, experimental analysis, and laboratory precision.`,

  PHY10010: `CO1: Apply wave optics, interference, diffraction, and polarization principles to precision engineering measurement.
CO2: Understand quantum mechanics principles governing semiconductors, superconductors, and nanomaterials.
CO3: Analyze electromagnetic fields and Maxwell's equations in the context of wave propagation and optical communication.
CO4: Comprehend principles of lasers, fiber optics, and photonics applications in contemporary technologies.
CO5: Demonstrate laboratory competencies in experimental optical and electronic instrumentation.`,

  MEC10021: `CO1: Understand principles of engineering graphics, orthographic projections, and isometric views.
CO2: Construct projections of points, lines, planes, and solid objects in various engineering orientations.
CO3: Develop sectional views and surface development of engineering components and assemblies.
CO4: Utilize modern computer-aided drafting (CAD) software tools for 2D drafting and 3D geometric modeling.
CO5: Interpret standard engineering drawing conventions, dimensioning, tolerances, and design specifications.`,

  CSE10011: `CO1: Understand algorithmic problem-solving techniques and computational thinking methodologies.
CO2: Design, implement, and debug structured programs using Python syntax, data types, and control flow.
CO3: Apply data structures including lists, tuples, dictionaries, and sets to manage structured data.
CO4: Implement modular programming through functions, file handling, and standard library modules.
CO5: Solve real-world computational problems through algorithmic decomposition and rigorous testing.`,

  CSE10040: `CO1: Understand Python fundamental syntax, data types, conditional flow, and iterations.
CO2: Design modular programs utilizing functions, recursion, and object-oriented paradigms.
CO3: Apply data manipulation utilizing standard libraries for structured data processing.
CO4: Implement error handling, file I/O operations, and unit testing practices.
CO5: Develop algorithmic solutions to computational and data-driven engineering problems.`
};

export function getDefaultCourseOutcomes(courseCode, courseName = '') {
  const norm = normalizeSubjectKey(courseCode, courseName);
  if (norm && DEFAULT_COURSE_OUTCOMES[norm]) {
    return DEFAULT_COURSE_OUTCOMES[norm];
  }
  if (courseCode) {
    const clean = courseCode.trim().toUpperCase();
    if (DEFAULT_COURSE_OUTCOMES[clean]) {
      return DEFAULT_COURSE_OUTCOMES[clean];
    }
    for (const [key, val] of Object.entries(DEFAULT_COURSE_OUTCOMES)) {
      if (clean.includes(key) || key.includes(clean)) return val;
    }
  }
  return `CO1: Understand and demonstrate proficiency in foundational theoretical concepts of the course.
CO2: Apply analytical, mathematical, and algorithmic principles to formulate and solve engineering problems.
CO3: Implement practical solutions, lab demonstrations, and interpret laboratory / computational outcomes.
CO4: Evaluate contemporary engineering tools and methodologies to address real-world technical challenges.
CO5: Adhere to professional ethics, continuous self-learning, and clear technical communication.`;
}

export function getAllSubjectConfigs() {
  return getStoredItem(KEY_SUBJECT_CONFIGS, {});
}

export function getSubjectConfig(courseCode, courseName = '') {
  const cleanCode = (courseCode || '').trim();
  const cleanName = (courseName || '').trim();
  if (!cleanCode && !cleanName) {
    return {
      courseOutcomes: getDefaultCourseOutcomes(''),
      subjectQuestions: []
    };
  }

  const normKey = normalizeSubjectKey(cleanCode, cleanName);
  const allConfigs = getAllSubjectConfigs();

  // 1. Direct check with normalized key (e.g. CHM10011)
  if (normKey && allConfigs[normKey]) {
    return {
      courseOutcomes: allConfigs[normKey].courseOutcomes || getDefaultCourseOutcomes(normKey),
      subjectQuestions: Array.isArray(allConfigs[normKey].subjectQuestions) ? allConfigs[normKey].subjectQuestions : []
    };
  }

  // 2. Direct checks with raw strings
  if (cleanCode && allConfigs[cleanCode.toUpperCase()]) {
    return {
      courseOutcomes: allConfigs[cleanCode.toUpperCase()].courseOutcomes || getDefaultCourseOutcomes(normKey || cleanCode),
      subjectQuestions: Array.isArray(allConfigs[cleanCode.toUpperCase()].subjectQuestions) ? allConfigs[cleanCode.toUpperCase()].subjectQuestions : []
    };
  }
  if (cleanCode && allConfigs[cleanCode]) {
    return {
      courseOutcomes: allConfigs[cleanCode].courseOutcomes || getDefaultCourseOutcomes(normKey || cleanCode),
      subjectQuestions: Array.isArray(allConfigs[cleanCode].subjectQuestions) ? allConfigs[cleanCode].subjectQuestions : []
    };
  }
  if (cleanName && allConfigs[cleanName.toUpperCase()]) {
    return {
      courseOutcomes: allConfigs[cleanName.toUpperCase()].courseOutcomes || getDefaultCourseOutcomes(normKey || cleanName),
      subjectQuestions: Array.isArray(allConfigs[cleanName.toUpperCase()].subjectQuestions) ? allConfigs[cleanName.toUpperCase()].subjectQuestions : []
    };
  }

  // 3. Scan all saved keys in allConfigs by normalizing them
  for (const [k, v] of Object.entries(allConfigs)) {
    const kNorm = normalizeSubjectKey(k);
    if (kNorm && normKey && kNorm === normKey) {
      return {
        courseOutcomes: v.courseOutcomes || getDefaultCourseOutcomes(normKey),
        subjectQuestions: Array.isArray(v.subjectQuestions) ? v.subjectQuestions : []
      };
    }
  }

  return {
    courseOutcomes: getDefaultCourseOutcomes(normKey || cleanCode, cleanName),
    subjectQuestions: []
  };
}

export function saveSubjectConfig(courseCode, config, courseName = '') {
  if (!courseCode && !courseName) return;
  const cleanCode = (courseCode || '').trim();
  const cleanName = (courseName || '').trim();
  const normKey = normalizeSubjectKey(cleanCode, cleanName);

  const allConfigs = getAllSubjectConfigs();
  const existingConfig = getSubjectConfig(cleanCode, cleanName);

  const updatedForCode = {
    courseOutcomes: config.courseOutcomes !== undefined ? config.courseOutcomes : (existingConfig.courseOutcomes || getDefaultCourseOutcomes(normKey || cleanCode)),
    subjectQuestions: config.subjectQuestions !== undefined ? config.subjectQuestions : (existingConfig.subjectQuestions || [])
  };

  // Save under normalized code (e.g. CHM10011), the raw code, and uppercase
  if (normKey) {
    allConfigs[normKey] = updatedForCode;
  }
  if (cleanCode) {
    allConfigs[cleanCode] = updatedForCode;
    allConfigs[cleanCode.toUpperCase()] = updatedForCode;
  }
  if (cleanName) {
    allConfigs[cleanName] = updatedForCode;
    allConfigs[cleanName.toUpperCase()] = updatedForCode;
  }

  setStoredItem(KEY_SUBJECT_CONFIGS, allConfigs);

  // Sync to Supabase portal_settings
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('portal_settings').upsert({
          key: 'subject_configs',
          data: allConfigs,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase saveSubjectConfig warning:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), status: 'LIVE' }
    }));
    window.dispatchEvent(new CustomEvent('mitwpu_subject_config_updated', {
      detail: { courseCode: cleanCode, normKey, config: updatedForCode }
    }));
  }

  return updatedForCode;
}

export function saveCourseOutcomes(courseCode, outcomesText, courseName = '') {
  const current = getSubjectConfig(courseCode, courseName);
  return saveSubjectConfig(courseCode, {
    ...current,
    courseOutcomes: outcomesText
  }, courseName);
}

export function addSubjectQuestion(courseCode, { category, text }, courseName = '') {
  const current = getSubjectConfig(courseCode, courseName);
  const normKey = normalizeSubjectKey(courseCode, courseName);
  const newQuestion = {
    id: `sq_${(normKey || courseCode).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
    category: category ? category.trim() : 'Course Specific Parameter',
    text: text ? text.trim() : '',
    type: 'rating_5',
    isSubjectSpecific: true
  };
  const updatedQuestions = [...current.subjectQuestions, newQuestion];
  saveSubjectConfig(courseCode, {
    ...current,
    subjectQuestions: updatedQuestions
  }, courseName);
  return newQuestion;
}

export function deleteSubjectQuestion(courseCode, questionId, courseName = '') {
  const current = getSubjectConfig(courseCode, courseName);
  const updatedQuestions = current.subjectQuestions.filter(q => q.id !== questionId);
  saveSubjectConfig(courseCode, {
    ...current,
    subjectQuestions: updatedQuestions
  }, courseName);
  return updatedQuestions;
}

export function getAllQuestionsForSubject(courseCode, courseName = '') {
  const institutionalQuestions = getFeedbackQuestions();
  const subjectConfig = getSubjectConfig(courseCode, courseName);
  const subjectQuestions = (subjectConfig.subjectQuestions || []).map(q => ({
    ...q,
    text: q.text || q.question || '',
    question: q.text || q.question || '',
    isSubjectSpecific: true
  }));
  return [...institutionalQuestions, ...subjectQuestions];
}

export function getAllCoursesList() {
  return getStoredItem(KEY_COURSES, COURSES);
}

export function addNewCourse(course) {
  const courses = getAllCoursesList();
  const newCourseObj = {
    id: `course-${Date.now()}`,
    ...course
  };
  courses.unshift(newCourseObj);
  setStoredItem(KEY_COURSES, courses);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('subjects').upsert({
          code: newCourseObj.code,
          name: newCourseObj.name,
          credits: Number(newCourseObj.credits) || 3
        }).then(() => {});

        supabase.from('portal_settings').upsert({
          key: 'subjects',
          data: courses,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase addNewCourse warning:', e);
    }
  }

  return courses;
}

export function deleteCourse(code) {
  const courses = getAllCoursesList().filter(c => c.code !== code);
  setStoredItem(KEY_COURSES, courses);

  // Sync deletion directly to Supabase subjects table & portal_settings
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('subjects').delete().eq('code', code).then(() => {});
        supabase.from('portal_settings').upsert({
          key: 'subjects',
          data: courses,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase deleteCourse warning:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), status: 'LIVE' }
    }));
  }

  return courses;
}

export function getAllStudentsList() {
  return getStoredItem(KEY_STUDENTS, STUDENTS);
}

// 6b. Detailed Per-Student Feedback Status (Filled vs Remaining Subjects)
export function getStudentFeedbackSummary(studentPrn) {
  const students = getStoredItem(KEY_STUDENTS, STUDENTS);
  const student = students.find(s => s.prn === studentPrn);
  if (!student) return null;

  const enrolled = getStudentEnrolledSubjects(studentPrn);
  const submittedSubjects = enrolled.filter(c => c.isSubmitted);
  const remainingSubjects = enrolled.filter(c => !c.isSubmitted);

  return {
    student,
    enrolledSubjects: enrolled,
    submittedSubjects,
    remainingSubjects,
    submittedCount: submittedSubjects.length,
    remainingCount: remainingSubjects.length,
    totalCount: enrolled.length,
    completionPercent: enrolled.length > 0 ? Math.round((submittedSubjects.length / enrolled.length) * 100) : 0
  };
}

export function getAllStudentsFeedbackOverview() {
  const allStudents = getAllStudentsList();
  const allResponses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  const facultyAllocations = getAllFacultyAllocations();

  // Create response lookup map: studentPrn -> Map(courseCode -> response)
  const responseMap = new Map();
  allResponses.forEach(r => {
    if (!responseMap.has(r.studentPrn)) {
      responseMap.set(r.studentPrn, new Map());
    }
    responseMap.get(r.studentPrn).set(r.courseCode, r);
  });

  // Cache courses by division to avoid recalculating
  const divCourseCache = new Map();

  return allStudents.map(student => {
    if (!divCourseCache.has(student.division)) {
      divCourseCache.set(student.division, getCoursesForDivision(student.division, facultyAllocations));
    }
    const divisionCourses = divCourseCache.get(student.division);
    const studentSubmissions = responseMap.get(student.prn);

    const submittedSubjects = [];
    const remainingSubjects = [];

    divisionCourses.forEach(course => {
      const sub = studentSubmissions ? studentSubmissions.get(course.code) : null;
      if (sub) {
        submittedSubjects.push({
          ...course,
          submittedAt: sub.submittedAt,
          submissionData: sub
        });
      } else {
        remainingSubjects.push(course);
      }
    });

    const submittedCount = submittedSubjects.length;
    const totalCount = divisionCourses.length;
    const remainingCount = totalCount - submittedCount;
    const completionPercent = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

    return {
      ...student,
      totalCount,
      submittedCount,
      remainingCount,
      completionPercent,
      submittedSubjects,
      remainingSubjects,
      allCourses: divisionCourses
    };
  });
}

export function getDivisionsList() {
  return ALL_DIVISIONS;
}

export function getOverallAdminStats() {
  const allStudents = getAllStudentsList();
  const allResponses = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
  const coords = getAllCoordinators();
  const totalStudents = allStudents.length;
  const totalDivisions = ALL_DIVISIONS.length;

  const totalExpectedFeedbacks = totalStudents * 4;
  const totalSubmitted = allResponses.length;
  const overallPercentage = totalExpectedFeedbacks > 0 
    ? Math.round((totalSubmitted / totalExpectedFeedbacks) * 100) 
    : 0;

  const uniqueParticipatingStudents = new Set(allResponses.map(r => r.studentPrn)).size;
  const studentParticipationPercent = totalStudents > 0 
    ? Math.round((uniqueParticipatingStudents / totalStudents) * 100) 
    : 0;

  let totalRatingSum = 0;
  let totalRatingCount = 0;
  allResponses.forEach(r => {
    if (r.ratings) {
      Object.values(r.ratings).forEach(val => {
        if (typeof val === 'number') {
          totalRatingSum += val;
          totalRatingCount++;
        }
      });
    }
  });

  const overallAvgRating = totalRatingCount > 0 
    ? (totalRatingSum / totalRatingCount).toFixed(2) 
    : '0.00';

  return {
    totalStudents,
    totalDivisions,
    totalCoordinators: coords.length,
    totalSubmitted,
    totalExpectedFeedbacks,
    overallPercentage,
    uniqueParticipatingStudents,
    studentParticipationPercent,
    overallAvgRating
  };
}

// 7. FACULTY & SUBJECT ALLOCATIONS
export function getAllFacultyAllocations() {
  return getStoredItem(KEY_FACULTY, FACULTY_MEMBERS);
}

export function updateFacultyAllocation(facultyId, updatedFields) {
  const current = getAllFacultyAllocations();
  const updated = current.map(f => {
    if (f.id === facultyId || f.email.toLowerCase() === facultyId.toLowerCase()) {
      return {
        ...f,
        ...updatedFields
      };
    }
    return f;
  });
  setStoredItem(KEY_FACULTY, updated);

  // Sync to Supabase if connected
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      const updatedItem = updated.find(f => f.id === facultyId || f.email.toLowerCase() === facultyId.toLowerCase());
      if (supabase && updatedItem) {
        supabase.from('faculty_allocations').upsert({
          id: updatedItem.id,
          name: updatedItem.name,
          email: updatedItem.email,
          designation: updatedItem.designation,
          role: updatedItem.role,
          department: updatedItem.department,
          assigned_subjects: updatedItem.subjects,
          assigned_divisions: updatedItem.assignedDivisions,
          status: updatedItem.status || 'ACTIVE',
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase faculty sync warning:', e);
    }
  }

  syncFacultyListToSupabase(updated);
  return updated;
}

export function toggleFacultyRole(facultyId) {
  const current = getAllFacultyAllocations();
  let targetName = '';
  let newRole = '';
  const updated = current.map(f => {
    if (f.id === facultyId || f.email.toLowerCase() === facultyId.toLowerCase()) {
      newRole = f.role === 'Course Coordinator' ? 'Teaching Faculty' : 'Course Coordinator';
      targetName = f.name;
      return {
        ...f,
        role: newRole
      };
    }
    return f;
  });
  setStoredItem(KEY_FACULTY, updated);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      const updatedItem = updated.find(f => f.id === facultyId || f.email.toLowerCase() === facultyId.toLowerCase());
      if (supabase && updatedItem) {
        supabase.from('faculty_allocations').upsert({
          id: updatedItem.id,
          role: updatedItem.role,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase toggle role sync warning:', e);
    }
  }

  syncFacultyListToSupabase(updated);
  return { updatedList: updated, targetName, newRole };
}

export function addNewFacultyAllocation(newFaculty) {
  const current = getAllFacultyAllocations();
  const newId = newFaculty.id || `EMP-${Date.now().toString().slice(-5)}`;
  const facultyRecord = {
    id: newId,
    name: newFaculty.name,
    email: newFaculty.email,
    designation: newFaculty.designation || 'Faculty',
    role: newFaculty.role || 'Teaching Faculty',
    department: newFaculty.department || 'Department of First Year B. Tech.',
    subjects: newFaculty.subjects || [],
    rawSubjects: (newFaculty.subjects || []).join(', '),
    assignedDivisions: newFaculty.assignedDivisions || [],
    status: 'ACTIVE'
  };

  current.unshift(facultyRecord);
  setStoredItem(KEY_FACULTY, current);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('faculty_allocations').upsert({
          id: facultyRecord.id,
          name: facultyRecord.name,
          email: facultyRecord.email,
          designation: facultyRecord.designation,
          role: facultyRecord.role,
          department: facultyRecord.department,
          assigned_subjects: facultyRecord.subjects,
          assigned_divisions: facultyRecord.assignedDivisions,
          status: 'ACTIVE',
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase new faculty sync error:', e);
    }
  }

  syncFacultyListToSupabase(current);
  return current;
}

export function deleteFacultyAllocation(facultyId) {
  const current = getAllFacultyAllocations();
  const updated = current.filter(f => f.id !== facultyId && f.email.toLowerCase() !== facultyId.toLowerCase());
  setStoredItem(KEY_FACULTY, updated);
  syncFacultyListToSupabase(updated);

  // Direct delete from faculty_allocations table in Supabase
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('faculty_allocations').delete().eq('id', facultyId).then(() => {});
        supabase.from('faculty_allocations').delete().eq('email', facultyId).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase deleteFacultyAllocation warning:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', {
      detail: { timestamp: new Date().toISOString(), status: 'LIVE' }
    }));
  }

  return updated;
}

// Helper to keep entire faculty allocations list synced to portal_settings in Supabase
export function syncFacultyListToSupabase(facultyList) {
  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('portal_settings').upsert({
          key: 'faculty_allocations',
          data: facultyList,
          updated_at: new Date().toISOString()
        }).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase faculty sync to portal_settings error:', e);
    }
  }
}

// 7. Auto-Sync Re-exports
export {
  syncWithSupabase,
  initAutoSyncWithSupabase,
  getAutoSyncState,
  setupSupabaseRealtime
} from './supabaseSyncService';
