const fs = require('fs');
const path = require('path');
const parsed = require('./parsedRaw.json');

// Let's create the division-to-courses mapping: each division gets 4 relevant courses
const divisionCourseMap = {
  'CSE': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'PHY10010', name: 'Engineering Physics', credits: 3, faculty: 'Dr. Suresh Patil' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'AIDS': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'UNC10160', name: 'AI for Everyone', credits: 2, faculty: 'Prof. Sunita Deshmukh' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Sunita Deshmukh' }
  ],
  'CSF': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSF10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Vikas Shinde' },
    { code: 'CSF10020', name: 'Foundations of Computer Architecture and System Design', credits: 4, faculty: 'Dr. Amit Trivedi' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'CLOUD': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Neha Deshpande' },
    { code: 'CSE10010', name: 'Foundations of Programming', credits: 4, faculty: 'Prof. Anand Kulkarni' },
    { code: 'CSE10020', name: 'Foundations of Computer Architecture and System Design', credits: 4, faculty: 'Dr. Amit Trivedi' },
    { code: 'CSE10040', name: 'Python Programming', credits: 2, faculty: 'Prof. Rashmi Joshi' }
  ],
  'ECE': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Milind Kadam' },
    { code: 'ECE10070', name: 'Basics of Electrical and Electronics Engineering', credits: 4, faculty: 'Prof. Rajesh Shinde' },
    { code: 'ECE10050', name: 'Digital Electronics', credits: 4, faculty: 'Dr. Pradeep Jadhav' },
    { code: 'ECE10030', name: 'Python Programming', credits: 1, faculty: 'Prof. Anjali More' }
  ],
  'AIML': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Milind Kadam' },
    { code: 'ECE10070', name: 'Basics of Electrical and Electronics Engineering', credits: 4, faculty: 'Prof. Rajesh Shinde' },
    { code: 'ECE20370', name: 'Analog and Digital Electronics', credits: 4, faculty: 'Dr. Pradeep Jadhav' },
    { code: 'ECE10030', name: 'Python Programming', credits: 1, faculty: 'Prof. Anjali More' }
  ],
  'MECH': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'MEC10021', name: 'Engineering Graphics', credits: 3, faculty: 'Prof. Meera Joshi' },
    { code: 'MEC10010', name: 'Ideas and Innovations in Manufacturing', credits: 1, faculty: 'Prof. Pravin Pawar' },
    { code: 'PHY10010', name: 'Engineering Physics', credits: 3, faculty: 'Dr. Suresh Patil' }
  ],
  'CIVIL': [
    { code: 'EMT11011', name: 'Linear Algebra and Differential Calculus', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'CIV10010', name: 'Engineering Mechanics', credits: 3, faculty: 'Prof. Nitin Patil' },
    { code: 'CIV10020', name: 'Surveying Field Practices', credits: 2, faculty: 'Prof. Santosh Gite' },
    { code: 'CHM10011', name: 'Engineering Chemistry', credits: 3, faculty: 'Dr. Swati Kulkarni' }
  ],
  'BIO': [
    { code: 'EMT11150', name: 'Mathematics for Bioengineers-I', credits: 3, faculty: 'Dr. Sandeep Koli' },
    { code: 'BIE20010', name: 'Cell and Molecular Biology', credits: 3, faculty: 'Prof. Sneha Kadam' },
    { code: 'BIE20020', name: 'Human Anatomy and Physiology', credits: 2, faculty: 'Dr. Rakesh Salunke' },
    { code: 'CHM10011', name: 'Engineering Chemistry', credits: 3, faculty: 'Dr. Swati Kulkarni' }
  ]
};

// Map each division string to the right curriculum
function getCoursesForDivision(divName) {
  if (divName.includes('CSF')) return divisionCourseMap['CSF'];
  if (divName.includes('CLOUD')) return divisionCourseMap['CLOUD'];
  if (divName.includes('AIDS')) return divisionCourseMap['AIDS'];
  if (divName.includes('AIML')) return divisionCourseMap['AIML'];
  if (divName.includes('ECE') || divName.includes('E&CE') || divName.includes('SEM VLSI')) return divisionCourseMap['ECE'];
  if (divName.includes('MECH') || divName.includes('REN ENE')) return divisionCourseMap['MECH'];
  if (divName.includes('CIVIL')) return divisionCourseMap['CIVIL'];
  if (divName.includes('BIO') || divName.includes('CHEM') || divName.includes('MSE') || divName.includes('PETRO')) return divisionCourseMap['BIO'];
  return divisionCourseMap['CSE'];
}

// Extract distinct divisions
const allDivisions = [...new Set(parsed.students.map(s => s.division))].sort((a,b) => {
  const numA = parseInt(a.split('-')[0]) || 0;
  const numB = parseInt(b.split('-')[0]) || 0;
  return numA - numB;
});

const coordinators = [
  {
    id: 'coord-1',
    name: 'Prof. Dr. Anand Kulkarni',
    email: 'anand.kulkarni@mitwpu.edu.in',
    department: 'School of Computer Science & Engineering',
    assignedDivisions: ['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE'],
    subjects: ['CSE10010 - Foundations of Programming', 'CSE10040 - Python Programming']
  },
  {
    id: 'coord-2',
    name: 'Prof. Sunita Deshmukh',
    email: 'sunita.deshmukh@mitwpu.edu.in',
    department: 'School of CSE (AI & Data Science)',
    assignedDivisions: ['8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS'],
    subjects: ['UNC10160 - AI for Everyone', 'CSE10040 - Python Programming']
  },
  {
    id: 'coord-3',
    name: 'Prof. Rajesh Shinde',
    email: 'rajesh.shinde@mitwpu.edu.in',
    department: 'School of Electronics & Communication',
    assignedDivisions: ['15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML'],
    subjects: ['ECE10070 - Basics of Electrical and Electronics Engineering', 'ECE10050 - Digital Electronics']
  },
  {
    id: 'coord-4',
    name: 'Prof. Meera Joshi',
    email: 'meera.joshi@mitwpu.edu.in',
    department: 'School of Mechanical Engineering',
    assignedDivisions: ['22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO'],
    subjects: ['MEC10021 - Engineering Graphics', 'MEC10010 - Ideas and Innovations in Manufacturing']
  },
  {
    id: 'coord-5',
    name: 'Prof. Nitin Patil',
    email: 'nitin.patil@mitwpu.edu.in',
    department: 'School of Civil Engineering',
    assignedDivisions: ['29 - FY CIVIL', '30 - FY CIVIL SMART'],
    subjects: ['CIV10010 - Engineering Mechanics', 'CIV10020 - Surveying Field Practices']
  },
  {
    id: 'coord-6',
    name: 'Prof. Sneha Kadam',
    email: 'sneha.kadam@mitwpu.edu.in',
    department: 'School of Chemical & Bioengineering',
    assignedDivisions: ['31 - FY BIO', '32 - FY BIO', '26 - FY CHEM'],
    subjects: ['BIE20010 - Cell and Molecular Biology', 'BIE20020 - Human Anatomy and Physiology']
  }
];

const feedbackQuestions = [
  {
    id: 'q1',
    category: 'Teaching Effectiveness',
    text: 'How clearly does the instructor explain key concepts and theoretical principles?',
    type: 'rating_5',
    description: '1: Very Poor, 2: Poor, 3: Average, 4: Good, 5: Excellent'
  },
  {
    id: 'q2',
    category: 'Course Delivery & Pace',
    text: 'The pace of syllabus coverage and adherence to lecture schedules is appropriate.',
    type: 'rating_5',
    description: '1: Strongly Disagree to 5: Strongly Agree'
  },
  {
    id: 'q3',
    category: 'Practical & Lab Engagement',
    text: 'Hands-on practicals, lab exercises, and assignments support better understanding of the subject.',
    type: 'rating_5',
    description: '1: Inadequate to 5: Highly Effective'
  },
  {
    id: 'q4',
    category: 'Doubt Resolution & Support',
    text: 'The faculty member is accessible and effectively resolves student doubts inside and outside class.',
    type: 'rating_5',
    description: '1: Rarely to 5: Always Accessible'
  },
  {
    id: 'q5',
    category: 'Course Material & Resources',
    text: 'Quality and usefulness of study notes, slides, and reference materials provided on LMS.',
    type: 'rating_5',
    description: '1: Very Poor to 5: Comprehensive & High Quality'
  },
  {
    id: 'q6',
    category: 'Suggestions & Feedback',
    text: 'Constructive suggestions for syllabus enrichment or faculty teaching methodology (Optional)',
    type: 'text',
    description: 'Open text feedback'
  }
];

// Pre-generate seed responses for first few divisions so coordinator dashboard displays realistic % metrics
const seedResponses = [];
const commentsSample = [
  "Sir explains coding logic very clearly with step-by-step trace tables.",
  "Pace was slightly fast during integration module, but doubt sessions helped.",
  "Excellent laboratory demonstration and helpful guidance in debugging syntax errors.",
  "Great real-world examples given during lectures. Highly engaging class.",
  "Need more practice questions for Mid-Term examination preparation."
];

parsed.students.forEach((s, idx) => {
  // Let 60% of students in Division 1, 2, 8, 15, 22 have filled some forms
  if (['1 - FY CSE', '2 - FY CSE', '8 - FY CSE AIDS', '15 - FY ECE', '22 - FY MECH'].includes(s.division)) {
    const courses = getCoursesForDivision(s.division);
    // Student fills 2 to 4 subjects
    const numFilled = (idx % 3 === 0) ? 4 : (idx % 2 === 0 ? 3 : 2);
    for (let i = 0; i < numFilled; i++) {
      const course = courses[i];
      seedResponses.push({
        id: `resp-${s.prn}-${course.code}`,
        studentPrn: s.prn,
        studentName: s.name,
        division: s.division,
        batch: s.batch,
        courseCode: course.code,
        courseName: course.name,
        faculty: course.faculty,
        submittedAt: new Date(Date.now() - (idx * 3600000 + i * 600000)).toISOString(),
        ratings: {
          q1: 3 + ((idx + i) % 3), // 3, 4, 5
          q2: 4 + ((idx * 2 + i) % 2), // 4, 5
          q3: 3 + ((idx + 2) % 3),
          q4: 4 + (idx % 2),
          q5: 3 + ((idx + i) % 3)
        },
        comment: (idx % 4 === 0) ? commentsSample[(idx + i) % commentsSample.length] : ""
      });
    }
  }
});

const fileContent = `// MIT-WPU First Year Engineering Student Feedback Portal Data
export const STUDENTS = ${JSON.stringify(parsed.students, null, 2)};

export const COURSES = ${JSON.stringify(parsed.courses, null, 2)};

export const ALL_DIVISIONS = ${JSON.stringify(allDivisions, null, 2)};

export const DEFAULT_PASSWORDS = {
  student: 'Student@123',
  teacher: 'Teacher@123',
  admin: 'Admin@123'
};

export const COORDINATORS = ${JSON.stringify(coordinators, null, 2)};

export const FEEDBACK_QUESTIONS = ${JSON.stringify(feedbackQuestions, null, 2)};

export const DIVISION_COURSE_MAP = ${JSON.stringify(divisionCourseMap, null, 2)};

export function getCoursesForDivision(divName) {
  if (!divName) return DIVISION_COURSE_MAP['CSE'];
  if (divName.includes('CSF')) return DIVISION_COURSE_MAP['CSF'];
  if (divName.includes('CLOUD')) return DIVISION_COURSE_MAP['CLOUD'];
  if (divName.includes('AIDS')) return DIVISION_COURSE_MAP['AIDS'];
  if (divName.includes('AIML')) return DIVISION_COURSE_MAP['AIML'];
  if (divName.includes('ECE') || divName.includes('E&CE') || divName.includes('SEM VLSI')) return DIVISION_COURSE_MAP['ECE'];
  if (divName.includes('MECH') || divName.includes('REN ENE')) return DIVISION_COURSE_MAP['MECH'];
  if (divName.includes('CIVIL')) return DIVISION_COURSE_MAP['CIVIL'];
  if (divName.includes('BIO') || divName.includes('CHEM') || divName.includes('MSE') || divName.includes('PETRO')) return DIVISION_COURSE_MAP['BIO'];
  return DIVISION_COURSE_MAP['CSE'];
}

export const INITIAL_RESPONSES = ${JSON.stringify(seedResponses, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialData.js'), fileContent);
console.log('Successfully generated src/data/initialData.js with seed responses: ' + seedResponses.length);
