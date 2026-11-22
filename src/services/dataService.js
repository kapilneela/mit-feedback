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
        name: 'Dean - Academic Quality & Evaluation',
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

export async function removeFeedbackResponse({ responseId, studentPrn, courseCode }) {
  const current = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
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
  }

  return updated;
}

export async function removeStudentAllFeedbacks(studentPrn) {
  const current = getStoredItem(KEY_RESPONSES, INITIAL_RESPONSES);
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
  }

  return updated;
}

export async function clearAllFeedbacks() {
  setStoredItem(KEY_RESPONSES, []);

  if (isSupabaseConnected()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('feedback_responses').delete().neq('id', 'placeholder');
      }
    } catch (err) {
      console.warn('Supabase remote clear all warning:', err);
    }
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

  const questions = getStoredItem(KEY_QUESTIONS, FEEDBACK_QUESTIONS).filter(q => q.type.startsWith('rating'));
  const parameterAverages = questions.map(q => {
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
      question: q.text,
      average: parseFloat(avg),
      count
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
  return getStoredItem(KEY_QUESTIONS, FEEDBACK_QUESTIONS);
}

export function saveFeedbackQuestions(questions) {
  setStoredItem(KEY_QUESTIONS, questions);
  return questions;
}

export function getAllCoursesList() {
  return getStoredItem(KEY_COURSES, COURSES);
}

export function addNewCourse(course) {
  const courses = getAllCoursesList();
  courses.unshift({
    id: `course-${Date.now()}`,
    ...course
  });
  setStoredItem(KEY_COURSES, courses);
  return courses;
}

export function deleteCourse(code) {
  const courses = getAllCoursesList().filter(c => c.code !== code);
  setStoredItem(KEY_COURSES, courses);
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
