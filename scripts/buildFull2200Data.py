import csv
import json
import os
import re
import openpyxl

# Paths
CSV_PATH = r'C:\Users\neela\.gemini\antigravity\brain\aa746811-6eb6-49ed-a258-32656d886aec\.user_uploaded\media_1795326583115_1aa233b0.csv'
SUBJECTS_PATH = r'C:\Users\neela\.gemini\antigravity\brain\aa746811-6eb6-49ed-a258-32656d886aec\.user_uploaded\media_1795326593237_206a88bb.xlsx'
FACULTY_CSV_PATH = r'C:\Users\neela\.gemini\antigravity\scratch\mitwpu-feedback-portal\src\data\Faculty_Allocations_2026.csv'

OUTPUT_JS = r'C:\Users\neela\.gemini\antigravity\scratch\mitwpu-feedback-portal\src\data\initialData.js'
OUTPUT_SQL = r'C:\Users\neela\.gemini\antigravity\scratch\mitwpu-feedback-portal\src\data\supabaseFull2200Seed.sql'
OUTPUT_SCHEMA_SQL = r'C:\Users\neela\.gemini\antigravity\scratch\mitwpu-feedback-portal\src\data\supabaseSchema.sql'

# 1. Parse Students
students = []
unique_divs = set()
with open(CSV_PATH, encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    for r in reader:
        batch_val = r.get('Practical Batch', '1').strip()
        try:
            batch_num = int(batch_val)
        except:
            batch_num = 1
        div = r['Division'].strip()
        unique_divs.add(div)
        students.append({
            'prn': r['PRN'].strip(),
            'name': r['Student Name'].strip(),
            'branch': r['Branch'].strip(),
            'division': div,
            'batch': batch_num
        })

def div_sort_key(d):
    parts = d.split(' - ')
    if parts[0].isdigit():
        return int(parts[0])
    return 999

all_divisions = sorted(list(unique_divs), key=div_sort_key)
print(f"Parsed {len(students)} students across {len(all_divisions)} divisions.")

# 2. Parse Subjects
subjects = []
wb = openpyxl.load_workbook(SUBJECTS_PATH)
ws = wb.active
for row in ws.iter_rows(values_only=True):
    if row[0] and str(row[0]).strip() != 'CourseCode':
        code = str(row[0]).strip()
        name = str(row[1]).strip() if len(row) > 1 and row[1] else ''
        credits = row[2] if len(row) > 2 and row[2] is not None else 3
        subjects.append({
            'code': code,
            'name': name,
            'credits': credits
        })

print(f"Parsed {len(subjects)} subjects.")

# 3. Parse 80 Faculty Allocations
div_map = {}
for d in all_divisions:
    num = d.split(' - ')[0]
    div_map[f"division {num}"] = d
    div_map[num] = d

faculty_members = []
with open(FACULTY_CSV_PATH, encoding='utf-8') as f:
    for row in csv.DictReader(f):
        raw_divs = row['Assigned Divisions'].strip()
        assigned_divs = []
        if raw_divs.lower() == 'all divisions':
            assigned_divs = list(all_divisions)
        else:
            div_tokens = [t.strip() for t in raw_divs.split(',') if t.strip()]
            for dt in div_tokens:
                dt_lower = dt.lower()
                if dt_lower in div_map:
                    assigned_divs.append(div_map[dt_lower])
                else:
                    m = re.search(r'\d+', dt)
                    if m and m.group() in div_map:
                        assigned_divs.append(div_map[m.group()])

        raw_subj = row['Assigned Subjects'].strip()
        if raw_subj == '—' or not raw_subj:
            subjs = []
        else:
            subjs = [s.strip() for s in raw_subj.split(',') if s.strip()]

        emp_id = row['Employee ID'].strip()
        name = row['Full Name'].strip()
        email = row['Institutional Email'].strip()

        faculty_members.append({
            'id': emp_id,
            'name': name,
            'designation': row['Official Designation'].strip(),
            'role': row['Assigned Rank / Role'].strip(),
            'email': email,
            'department': row['Department'].strip(),
            'subjects': subjs,
            'rawSubjects': raw_subj,
            'assignedDivisions': assigned_divs,
            'status': row['Status'].strip()
        })

print(f"Parsed {len(faculty_members)} faculty members.")

# 4. Coordinators
coordinators = [
    {
        'id': 'coord-1',
        'name': 'Prof. Dr. Anand Kulkarni',
        'email': 'anand.kulkarni@mitwpu.edu.in',
        'department': 'School of Computer Science & Engineering',
        'designation': 'Professor & Head of FY CSE',
        'assignedDivisions': ['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE']
    },
    {
        'id': 'coord-2',
        'name': 'Prof. Dr. Rajesh Joshi',
        'email': 'rajesh.joshi@mitwpu.edu.in',
        'department': 'School of Computer Science & Engineering',
        'designation': 'Associate Professor',
        'assignedDivisions': ['5 - FY CSE', '6 - FY CSE', '7 - FY CSE']
    },
    {
        'id': 'coord-3',
        'name': 'Prof. Sunita Deshmukh',
        'email': 'sunita.deshmukh@mitwpu.edu.in',
        'department': 'School of Computer Science & Engineering (AI/DS)',
        'designation': 'Assistant Professor & AIDS Coordinator',
        'assignedDivisions': ['8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS']
    },
    {
        'id': 'coord-4',
        'name': 'Prof. Amit Shinde',
        'email': 'amit.shinde@mitwpu.edu.in',
        'department': 'School of Computer Science & Engineering (Cyber/Cloud)',
        'designation': 'Assistant Professor',
        'assignedDivisions': ['13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE']
    },
    {
        'id': 'coord-5',
        'name': 'Prof. Dr. Priya Sharma',
        'email': 'priya.sharma@mitwpu.edu.in',
        'department': 'School of Electronics & Communication Engineering',
        'designation': 'Associate Professor',
        'assignedDivisions': ['16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML']
    },
    {
        'id': 'coord-6',
        'name': 'Prof. Neha Patil',
        'email': 'neha.patil@mitwpu.edu.in',
        'department': 'School of Electrical & Electronics Engineering',
        'designation': 'Assistant Professor',
        'assignedDivisions': ['19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH']
    },
    {
        'id': 'coord-7',
        'name': 'Prof. Vikram Shinde',
        'email': 'vikram.shinde@mitwpu.edu.in',
        'department': 'School of Mechanical Engineering',
        'designation': 'Associate Professor & FY Mech Head',
        'assignedDivisions': ['23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO']
    },
    {
        'id': 'coord-8',
        'name': 'Prof. Deepa Iyer',
        'email': 'deepa.iyer@mitwpu.edu.in',
        'department': 'School of Chemical & Materials Engineering',
        'designation': 'Assistant Professor',
        'assignedDivisions': ['26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO']
    },
    {
        'id': 'coord-9',
        'name': 'Prof. Kavita Rao',
        'email': 'kavita.rao@mitwpu.edu.in',
        'department': 'School of Civil & Environmental Engineering',
        'designation': 'Assistant Professor',
        'assignedDivisions': ['29 - FY CIVIL', '30 - FY CIVIL SMART']
    },
    {
        'id': 'coord-10',
        'name': 'Prof. Suresh Nair',
        'email': 'suresh.nair@mitwpu.edu.in',
        'department': 'School of Bioengineering & Sciences',
        'designation': 'Associate Professor',
        'assignedDivisions': ['31 - FY BIO', '32 - FY BIO']
    }
]

# 5. Questions
questions = [
    {
        'id': 'q1',
        'category': 'Teaching & Pedagogy',
        'text': 'The instructor explained core concepts with clarity and demonstrated thorough subject depth.',
        'type': 'rating_5',
        'order': 1
    },
    {
        'id': 'q2',
        'category': 'Delivery & Pace',
        'text': 'The pace of lectures was well-regulated and facilitated active understanding during class.',
        'type': 'rating_5',
        'order': 2
    },
    {
        'id': 'q3',
        'category': 'Practical & Lab Relevance',
        'text': 'Practical laboratory demonstrations, coding sessions, and hands-on examples effectively complemented theoretical topics.',
        'type': 'rating_5',
        'order': 3
    },
    {
        'id': 'q4',
        'category': 'Doubt Resolution & Support',
        'text': 'The faculty was approachable, encouraged questions, and provided timely academic assistance.',
        'type': 'rating_5',
        'order': 4
    },
    {
        'id': 'q5',
        'category': 'Learning Resources & LMS',
        'text': 'Course syllabus, lecture notes, assignments, and digital resources uploaded on LMS were comprehensive and timely.',
        'type': 'rating_5',
        'order': 5
    }
]

default_passwords = {
    'student': 'Student@123',
    'teacher': 'Teacher@123',
    'admin': 'Admin@123'
}

portal_settings = {
    'passwords': default_passwords,
    'academicYear': '2024-2025',
    'term': 'First Year Engineering (AY 2024-25)',
    'feedbackActive': True
}

# 6. Core Curricular Subject Mapping by Division
division_course_map = {
    'CSE': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Prof. Jyoti Pulgam'},
        {'code': 'CHM10011', 'name': 'Engineering Chemistry', 'credits': 3, 'faculty': 'Dr. Kiran Kokate'},
        {'code': 'CSE10010', 'name': 'Foundations of Programming', 'credits': 4, 'faculty': 'Prof. Dr. Anand Kulkarni'},
        {'code': 'CIV10010', 'name': 'Engineering Mechanics', 'credits': 3, 'faculty': 'Dr. Siddharth Chakrabarti'}
    ],
    'AIDS': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Dr. Rupal Shroff'},
        {'code': 'CSE10040', 'name': 'Python Programming', 'credits': 2, 'faculty': 'Prof. Sunita Deshmukh'},
        {'code': 'CHM10011', 'name': 'Engineering Chemistry', 'credits': 3, 'faculty': 'Dr. Pallavi Kadam'},
        {'code': 'CIV10010', 'name': 'Engineering Mechanics', 'credits': 3, 'faculty': 'Dr. Arunabh Pandey'}
    ],
    'CSF': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Prof. Apoorva Wadje'},
        {'code': 'CSE10010', 'name': 'Foundations of Programming', 'credits': 4, 'faculty': 'Prof. Amit Shinde'},
        {'code': 'CHM10011', 'name': 'Engineering Chemistry', 'credits': 3, 'faculty': 'Dr. Sukruti Joshi'},
        {'code': 'CIV10010', 'name': 'Engineering Mechanics', 'credits': 3, 'faculty': 'Dr. Akshay Bura'}
    ],
    'CLOUD': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Dr. Shyam Dhamapurkar'},
        {'code': 'CSE10040', 'name': 'Python Programming', 'credits': 2, 'faculty': 'Dr. Renuka Mane'},
        {'code': 'CHM10011', 'name': 'Engineering Chemistry', 'credits': 3, 'faculty': 'Dr. Pallavi Kadam'},
        {'code': 'CIV10010', 'name': 'Engineering Mechanics', 'credits': 3, 'faculty': 'Dr. D. G. Gaidhankar'}
    ],
    'AIML': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Prof. Jayashree Aher'},
        {'code': 'CSE10040', 'name': 'Python Programming', 'credits': 2, 'faculty': 'Deepa Sapkal'},
        {'code': 'PHY10010', 'name': 'Engineering Physics', 'credits': 3, 'faculty': 'Dr. Rahul Aher'},
        {'code': 'ECE10010', 'name': 'Basic Electronics Engineering', 'credits': 3, 'faculty': 'Smita Paithankar'}
    ],
    'ECE': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Prof. Sayali Thorat'},
        {'code': 'PHY10010', 'name': 'Engineering Physics', 'credits': 3, 'faculty': 'Dr. Geetanjali Dagoankar'},
        {'code': 'CSE10010', 'name': 'Foundations of Programming', 'credits': 4, 'faculty': 'Shirish Paygude'},
        {'code': 'ECE10010', 'name': 'Basic Electronics Engineering', 'credits': 3, 'faculty': 'Dr. Sanjay Kinge'}
    ],
    'MECH': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Prof. Rutuja Lakhe'},
        {'code': 'MEC10021', 'name': 'Engineering Graphics', 'credits': 3, 'faculty': 'Prof. Ravindra Pawarkar'},
        {'code': 'PHY10010', 'name': 'Engineering Physics', 'credits': 3, 'faculty': 'Anupama Jagtap'},
        {'code': 'ECE10010', 'name': 'Basic Electronics Engineering', 'credits': 3, 'faculty': 'Rajkumar Komati'}
    ],
    'CIVIL': [
        {'code': 'EMT11011', 'name': 'Linear Algebra and Differential Calculus', 'credits': 3, 'faculty': 'Dr. Gajanan Birajdar'},
        {'code': 'MEC10021', 'name': 'Engineering Graphics', 'credits': 3, 'faculty': 'Shrikant Nimbalkar'},
        {'code': 'PHY10010', 'name': 'Engineering Physics', 'credits': 3, 'faculty': 'Dr. Shital Kahane'},
        {'code': 'ECE10010', 'name': 'Basic Electronics Engineering', 'credits': 3, 'faculty': 'Aarti Vagga'}
    ],
    'BIO': [
        {'code': 'EMT11150', 'name': 'Mathematics for Bioengineers-I', 'credits': 3, 'faculty': 'Dr. Sandeep Singhal'},
        {'code': 'MEC10021', 'name': 'Engineering Graphics', 'credits': 3, 'faculty': 'Dr. Ashish Utage'},
        {'code': 'CSE10010', 'name': 'Foundations of Programming', 'credits': 4, 'faculty': 'Dr. Chaitanya Burande'},
        {'code': 'ECE10010', 'name': 'Basic Electronics Engineering', 'credits': 3, 'faculty': 'Mina Vagha'}
    ]
}

# Write JS file
js_content = f"""// MIT-WPU First Year Engineering Student Feedback Portal Data
// Complete dataset: all {len(students)} verified students across all 32 divisions
export const STUDENTS = {json.dumps(students, indent=2)};

export const ALL_DIVISIONS = {json.dumps(all_divisions, indent=2)};

export const DEFAULT_PASSWORDS = {json.dumps(default_passwords, indent=2)};

export const COORDINATORS = {json.dumps(coordinators, indent=2)};

export const FACULTY_MEMBERS = {json.dumps(faculty_members, indent=2)};

export const SUBJECTS = {json.dumps(subjects, indent=2)};
export const COURSES = SUBJECTS;

export const FEEDBACK_QUESTIONS = {json.dumps(questions, indent=2)};

export const PORTAL_SETTINGS = {json.dumps(portal_settings, indent=2)};

export const DIVISION_COURSE_MAP = {json.dumps(division_course_map, indent=2)};

export function getCoursesForDivision(divName, customAllocations = null) {{
  let baseCourses;
  if (!divName) baseCourses = DIVISION_COURSE_MAP['CSE'];
  else if (divName.includes('CSF')) baseCourses = DIVISION_COURSE_MAP['CSF'];
  else if (divName.includes('CLOUD')) baseCourses = DIVISION_COURSE_MAP['CLOUD'];
  else if (divName.includes('AIDS')) baseCourses = DIVISION_COURSE_MAP['AIDS'];
  else if (divName.includes('AIML')) baseCourses = DIVISION_COURSE_MAP['AIML'];
  else if (divName.includes('ECE') || divName.includes('E&CE') || divName.includes('SEM VLSI')) baseCourses = DIVISION_COURSE_MAP['ECE'];
  else if (divName.includes('MECH') || divName.includes('REN ENE')) baseCourses = DIVISION_COURSE_MAP['MECH'];
  else if (divName.includes('CIVIL')) baseCourses = DIVISION_COURSE_MAP['CIVIL'];
  else if (divName.includes('BIO') || divName.includes('CHEM') || divName.includes('MSE') || divName.includes('PETRO')) baseCourses = DIVISION_COURSE_MAP['BIO'];
  else baseCourses = DIVISION_COURSE_MAP['CSE'];

  // If custom allocations exist from Admin Panel, override faculty names accordingly
  if (customAllocations && Array.isArray(customAllocations)) {{
    return baseCourses.map(course => {{
      const match = customAllocations.find(fa => 
        (fa.assignedDivisions.includes(divName) || fa.assignedDivisions.includes('All Divisions')) &&
        (fa.subjects.some(s => s.toLowerCase().includes(course.name.toLowerCase()) || course.name.toLowerCase().includes(s.toLowerCase()) || s.includes(course.code)))
      );
      if (match) {{
        return {{
          ...course,
          faculty: match.name
        }};
      }}
      return course;
    }});
  }}

  return baseCourses;
}}

// User specified NO dummy data - starts completely clean
export const INITIAL_RESPONSES = [];
"""

with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated {OUTPUT_JS} with {len(students)} students and {len(faculty_members)} faculty allocations.")

# Generate complete SQL Script
sql_parts = []
sql_parts.append("""-- ==============================================================================
-- MIT World Peace University, Pune - Faculty of Engineering & Technology
-- FY Engineering Feedback Portal - Complete PostgreSQL Schema & Initial Data
-- Project ID: gnwhigxywondejqroeiq
-- URL: https://gnwhigxywondejqroeiq.supabase.co
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.students (
    prn VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    division VARCHAR(100) NOT NULL,
    batch INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coordinators (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    designation VARCHAR(255),
    assigned_divisions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faculty_allocations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    designation VARCHAR(255),
    role VARCHAR(100),
    department VARCHAR(255),
    assigned_subjects TEXT[] NOT NULL DEFAULT '{}',
    assigned_divisions TEXT[] NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    credits INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feedback_questions (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'rating_5',
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portal_settings (
    key VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feedback_responses (
    id VARCHAR(100) PRIMARY KEY,
    student_prn VARCHAR(20) REFERENCES public.students(prn) ON DELETE CASCADE,
    student_name VARCHAR(255),
    division VARCHAR(100) NOT NULL,
    batch INT DEFAULT 1,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255),
    ratings JSONB NOT NULL,
    comment TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read students" ON public.students;
CREATE POLICY "Allow anon read students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon all coordinators" ON public.coordinators;
CREATE POLICY "Allow anon all coordinators" ON public.coordinators FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all faculty" ON public.faculty_allocations;
CREATE POLICY "Allow anon all faculty" ON public.faculty_allocations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all subjects" ON public.subjects;
CREATE POLICY "Allow anon all subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all questions" ON public.feedback_questions;
CREATE POLICY "Allow anon all questions" ON public.feedback_questions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all settings" ON public.portal_settings;
CREATE POLICY "Allow anon all settings" ON public.portal_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read responses" ON public.feedback_responses;
CREATE POLICY "Allow anon read responses" ON public.feedback_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert responses" ON public.feedback_responses;
CREATE POLICY "Allow anon insert responses" ON public.feedback_responses FOR INSERT WITH CHECK (true);

-- 3. Initial Portal Settings
INSERT INTO public.portal_settings (key, data)
VALUES ('auth_passwords', '{"student": "Student@123", "teacher": "Teacher@123", "admin": "Admin@123"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 4. Initial Coordinators
""")

for c in coordinators:
    divs_arr = "ARRAY[" + ", ".join([f"'{d}'" for d in c['assignedDivisions']]) + "]"
    sql_parts.append(f"""INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('{c['id']}', '{c['name'].replace("'", "''")}', '{c['email']}', '{c['department'].replace("'", "''")}', '{c['designation'].replace("'", "''")}', {divs_arr})
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
""")

sql_parts.append(f"\n-- 5. Initial Faculty Allocations ({len(faculty_members)} faculty records)\n")
for f in faculty_members:
    divs_arr = "ARRAY[" + ", ".join(["'" + d + "'" for d in f['assignedDivisions']]) + "]"
    subjs_escaped = ["'" + s.replace("'", "''") + "'" for s in f['subjects']]
    subjs_arr = "ARRAY[" + ", ".join(subjs_escaped) + "]"
    name_clean = f['name'].replace("'", "''")
    desig_clean = f['designation'].replace("'", "''")
    role_clean = f['role'].replace("'", "''")
    dept_clean = f['department'].replace("'", "''")
    sql_parts.append(f"""INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('{f['id']}', '{name_clean}', '{f['email']}', '{desig_clean}', '{role_clean}', '{dept_clean}', {subjs_arr}, {divs_arr}, '{f['status']}')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
""")

sql_parts.append("\n-- 6. Initial Subjects (52 Courses)\n")
for s in subjects:
    name_clean = s['name'].replace("'", "''")
    sql_parts.append(f"""INSERT INTO public.subjects (code, name, credits)
VALUES ('{s['code']}', '{name_clean}', {s['credits']})
ON CONFLICT (code) DO NOTHING;
""")

sql_parts.append("\n-- 7. Initial Feedback Evaluation Questions\n")
for q in questions:
    text_clean = q['text'].replace("'", "''")
    sql_parts.append(f"""INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('{q['id']}', '{q['category']}', '{text_clean}', '{q['type']}', {q['order']})
ON CONFLICT (id) DO NOTHING;
""")

sql_parts.append(f"\n-- 8. Initial Students ({len(students)} actual records across all 32 divisions)\n")
chunk_size = 100
for i in range(0, len(students), chunk_size):
    chunk = students[i:i+chunk_size]
    val_lines = []
    for s in chunk:
        name_clean = s['name'].replace("'", "''")
        branch_clean = s['branch'].replace("'", "''")
        div_clean = s['division'].replace("'", "''")
        val_lines.append(f"('{s['prn']}', '{name_clean}', '{branch_clean}', '{div_clean}', {s['batch']})")
    sql_parts.append("INSERT INTO public.students (prn, name, branch, division, batch)\nVALUES\n  " + ",\n  ".join(val_lines) + "\nON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;\n")

full_sql = "".join(sql_parts)

with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write(full_sql)

with open(OUTPUT_SCHEMA_SQL, 'w', encoding='utf-8') as f:
    f.write(full_sql)

print(f"Generated {OUTPUT_SQL} ({len(full_sql)} bytes).")
