-- ==============================================================================
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
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-1', 'Prof. Dr. Anand Kulkarni', 'anand.kulkarni@mitwpu.edu.in', 'School of Computer Science & Engineering', 'Professor & Head of FY CSE', ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-2', 'Prof. Dr. Rajesh Joshi', 'rajesh.joshi@mitwpu.edu.in', 'School of Computer Science & Engineering', 'Associate Professor', ARRAY['5 - FY CSE', '6 - FY CSE', '7 - FY CSE'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-3', 'Prof. Sunita Deshmukh', 'sunita.deshmukh@mitwpu.edu.in', 'School of Computer Science & Engineering (AI/DS)', 'Assistant Professor & AIDS Coordinator', ARRAY['8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-4', 'Prof. Amit Shinde', 'amit.shinde@mitwpu.edu.in', 'School of Computer Science & Engineering (Cyber/Cloud)', 'Assistant Professor', ARRAY['13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-5', 'Prof. Dr. Priya Sharma', 'priya.sharma@mitwpu.edu.in', 'School of Electronics & Communication Engineering', 'Associate Professor', ARRAY['16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-6', 'Prof. Neha Patil', 'neha.patil@mitwpu.edu.in', 'School of Electrical & Electronics Engineering', 'Assistant Professor', ARRAY['19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-7', 'Prof. Vikram Shinde', 'vikram.shinde@mitwpu.edu.in', 'School of Mechanical Engineering', 'Associate Professor & FY Mech Head', ARRAY['23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-8', 'Prof. Deepa Iyer', 'deepa.iyer@mitwpu.edu.in', 'School of Chemical & Materials Engineering', 'Assistant Professor', ARRAY['26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-9', 'Prof. Kavita Rao', 'kavita.rao@mitwpu.edu.in', 'School of Civil & Environmental Engineering', 'Assistant Professor', ARRAY['29 - FY CIVIL', '30 - FY CIVIL SMART'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.coordinators (id, name, email, department, designation, assigned_divisions)
VALUES ('coord-10', 'Prof. Suresh Nair', 'suresh.nair@mitwpu.edu.in', 'School of Bioengineering & Sciences', 'Associate Professor', ARRAY['31 - FY BIO', '32 - FY BIO'])
ON CONFLICT (id) DO UPDATE SET assigned_divisions = EXCLUDED.assigned_divisions;

-- 5. Initial Faculty Allocations (80 faculty records)
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP72539', 'Aarti Vagga', 'aarti.vagga@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['26 - FY CHEM', '29 - FY CIVIL'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP43060', 'Anupama Jagtap', 'anupama.jagtap@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EP (Engineering Physics)'], ARRAY['22 - FY MECH', '27 - FY MSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP82213', 'Atul Palange', 'atul.palange@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['27 - FY MSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP54287', 'Dean Academic Office', 'dean.engineering@mitwpu.edu.in', 'Dean', 'Dean', 'School of Engineering & Technology', ARRAY[], ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE', '5 - FY CSE', '6 - FY CSE', '7 - FY CSE', '8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS', '13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML', '19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO', '26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO', '29 - FY CIVIL', '30 - FY CIVIL SMART', '31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP56518', 'Deepa Sapkal', 'deepa.sapkal@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['16 - FY ECE', '17 - FY ECE AIML', '19 - FY E&CE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP95109', 'Dhruvil Parekh', 'dhruvil.parekh@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['21 - FY REN ENE', '24 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP27207', 'Dr. Akshay Bura', 'akshay.bura@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['13 - FY CSE CSF'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP22242', 'Dr. Arunabh Pandey', 'arunabh.pandey@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['9 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP64759', 'Dr. Ashish Utage', 'ashish.utage@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP54085', 'Dr. Chaitanya Burande', 'chaitanya.burande@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP34637', 'Dr. D. G. Gaidhankar', 'darshan.gaidhankar@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['14 - FY CSE CLOUD'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP95867', 'Dr. Dattatreya Tripathy', 'dattatreya.tripathy@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['7 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP27144', 'Dr. Gajanan Birajdar', 'gajanan.birajdar@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['29 - FY CIVIL'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP60927', 'Dr. Geetanjali Dagoankar', 'geetanjali.dagoankar@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EP (Engineering Physics)'], ARRAY['16 - FY ECE', '19 - FY E&CE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP72017', 'Dr. Kiran Kokate', 'kiran.kokate@mitwpu.edu.in', 'Course Coordinator', 'Course Coordinator', 'Department of First Year B. Tech.', ARRAY['EC (Engineering Chemistry)'], ARRAY['1 - FY CSE', '11 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP68692', 'Dr. Mangesh Shendkar', 'mangesh.shendkar@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['6 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP46712', 'Dr. Manojkumar Hambarde', 'manojkumar.hambarde@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['31 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP12840', 'Dr. P. K. Ghosh', 'p..k..ghosh@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EP (Engineering Physics)'], ARRAY['24 - FY MECH ROBO', '28 - FY PETRO', '30 - FY CIVIL SMART'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP20724', 'Dr. Pallavi Kadam', 'pallavi.kadam@mitwpu.edu.in', 'Teaching Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EC (Engineering Chemistry)'], ARRAY['10 - FY CSE AIDS', '14 - FY CSE CLOUD', '8 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-677', 'Dr. Parimal Bhambare', 'parimal.bhambare@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY[], ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE', '5 - FY CSE', '6 - FY CSE', '7 - FY CSE', '8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS', '13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML', '19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO', '26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO', '29 - FY CIVIL', '30 - FY CIVIL SMART', '31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-19', 'Dr. Pradnya Deshpande', 'pradnya.deshpande@mitwpu.edu.in', 'Program Director', 'Program Director', 'Department of First Year B. Tech.', ARRAY[], ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE', '5 - FY CSE', '6 - FY CSE', '7 - FY CSE', '8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS', '13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML', '19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO', '26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO', '29 - FY CIVIL', '30 - FY CIVIL SMART', '31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP37721', 'Dr. Pralhad Pesode', 'pralhad.pesode@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['26 - FY CHEM'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP59737', 'Dr. Prasanta Ghosh', 'prasanta.ghosh@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['24 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP31591', 'Dr. Prashant Patane', 'prashant.patane@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EGR (Engineering Graphics)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['28 - FY PETRO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP90247', 'Dr. Priyanka Kumari', 'priyanka.kumari@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'LADC (Linear Algebra and Differential Calculus)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['26 - FY CHEM'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP28795', 'Dr. Rahul Aher', 'rahul.aher@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EP (Engineering Physics)', 'PES (Physics for Energy System)'], ARRAY['17 - FY ECE AIML', '21 - FY REN ENE', '26 - FY CHEM'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP11908', 'Dr. Raju Ingale', 'raju.ingale@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['19 - FY E&CE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-17', 'Dr. Renuka Mane', 'renuka.suryawanshi@mitwpu.edu.in', 'Program Co-ordinator', 'Program Coordinator', 'Department of First Year B. Tech.', ARRAY['PYTHON PROGRAMMING (Python Programming)'], ARRAY['14 - FY CSE CLOUD'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP95552', 'Dr. Rohini Kale', 'rohini.kale@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['DELD (Digital Electronics and Logic Design)'], ARRAY['20 - FY SEM VLSI'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP99690', 'Dr. Rupal Shroff', 'rupal.shroff@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['8 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP99490', 'Dr. Rupali Chavan', 'rupali.chavan@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EC (Engineering Chemistry)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['12 - FY CSE AIDS', '3 - FY CSE', '9 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP95568', 'Dr. Samidha Jawade', 'samidha.jawade@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['31 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP58296', 'Dr. Sandeep Sathe', 'sandeep.sathe@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EM (Engineering Mechanics)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'YOGA (Yoga and Meditation)'], ARRAY['3 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP26989', 'Dr. Sandeep Singhal', 'sandeep.singhal@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['IMB (Introductory Mathematics for Bioengineering)', 'LADC (Linear Algebra and Differential Calculus)'], ARRAY['15 - FY ECE', '22 - FY MECH', '31 - FY BIO', '7 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP45081', 'Dr. Sanjay Kinge', 'sanjay.kinge@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['15 - FY ECE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP12048', 'Dr. Shailendra Shisode', 'shailendra.shisode@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EGR (Engineering Graphics)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['25 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP98710', 'Dr. Shailendrasingh Girase', 'shailendrasingh.girase@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['24 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP88837', 'Dr. Shantaram Dond', 'shantaram.dond@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['IEEE (Introduction to Electrical and Electronics Engineering)'], ARRAY['25 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP36293', 'Dr. Shital Kahane', 'shital.kahane@mitwpu.edu.in', 'Teaching Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EP (Engineering Physics)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['15 - FY ECE', '29 - FY CIVIL', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP35713', 'Dr. Shyam Dhamapurkar', 'shyam.dhamapurkar@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['14 - FY CSE CLOUD', '28 - FY PETRO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP54286', 'Dr. Siddharth Chakrabarti', 'siddharth.chakrabarti@mitwpu.edu.in', 'Dean', 'Dean', 'School of Engineering & Technology', ARRAY['EM (Engineering Mechanics)'], ARRAY['1 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('TCH-2026-01', 'Dr. Snehal Kulkarni', 'snehal.kulkarni@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY[], ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE', '5 - FY CSE', '6 - FY CSE', '7 - FY CSE', '8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS', '13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML', '19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO', '26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO', '29 - FY CIVIL', '30 - FY CIVIL SMART', '31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP41348', 'Dr. Sudhir Patil', 'sudhir.patil@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['11 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP17162', 'Dr. Sukruti Joshi', 'sukruti.joshi@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EC (Engineering Chemistry)'], ARRAY['13 - FY CSE CSF', '4 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP75489', 'Dr. Sumant Shinde', 'sumant.shinde@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EM (Engineering Mechanics)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['10 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP25416', 'Dr. Vaishali Gaikwad', 'vaishali.gaikwad@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EC (Engineering Chemistry)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['5 - FY CSE', '6 - FY CSE', '7 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP12291', 'Dr. Vinayak Gaikwad', 'vinayak.gaikwad@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'BEEE (Basics of Electrical and Electronics Engineering)', 'EFES (Electrical Fundamentals for Energy Systems)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['21 - FY REN ENE', '30 - FY CIVIL SMART'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP67813', 'Dr. Vivek Patel', 'vivek.patel@mitwpu.edu.in', 'Associate Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EMES (Engineering Mechanics for Energy Systems)'], ARRAY['21 - FY REN ENE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP25425', 'Kshama Karpe', 'kshama.karpe@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)', 'IEEE (Introduction to Electrical and Electronics Engineering)'], ARRAY['19 - FY E&CE', '24 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP78060', 'Mina Vagha', 'mina.vagha@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP54444', 'Ms. Tanvi Patil', 'ms..tanvi.patil@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EM (Engineering Mechanics)'], ARRAY['12 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP79709', 'Prof. Anil Singh', 'anil.singh@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['CAM (Computer Aided Modelling)'], ARRAY['28 - FY PETRO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-991', 'Prof. Aparna Nagure', 'aparna.nagure@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['8 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP28537', 'Prof. Apoorva Wadje', 'apoorva.wadje@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['13 - FY CSE CSF', '20 - FY SEM VLSI'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP50372', 'Prof. Jayashree Aher', 'jayashree.aher@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['17 - FY ECE AIML'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP51067', 'Prof. Jyoti Pulgam', 'jyoti.pulgam@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['1 - FY CSE', '30 - FY CIVIL SMART'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP81080', 'Prof. Kundan Nagare', 'kundan.nagare@mitwpu.edu.in', 'Teaching Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'LADC (Linear Algebra and Differential Calculus)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['27 - FY MSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP12186', 'Prof. Mangesh Khemnar', 'mangesh.khemnar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['IMB (Introductory Mathematics for Bioengineering)', 'LADC (Linear Algebra and Differential Calculus)'], ARRAY['10 - FY CSE AIDS', '14 - FY CSE CLOUD', '25 - FY MECH ROBO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-842', 'Prof. Manisha Ingle', 'manisha.ingle@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'DELD (Digital Electronics and Logic Design)', 'IEST (Intro to Electronics and Semiconductor Technology)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['20 - FY SEM VLSI'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-804', 'Prof. Manisha Wani', 'manisha.wani@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['16 - FY ECE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-993', 'Prof. Mrunal Salwadkar', 'mrunal.salwadkar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['17 - FY ECE AIML'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP76939', 'Prof. Nikhil Soniminde', 'nikhil.soniminde@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'IIM (Industry Immersion & Workshop Practice)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['11 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP55418', 'Prof. Pratibha Kshirsagar', 'pratibha.kshirsagar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'IIM (Industry Immersion & Workshop Practice)', 'LADC (Linear Algebra and Differential Calculus)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['5 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP17541', 'Prof. Ramaa Sandu', 'ramaa.sandu@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['21 - FY REN ENE', '3 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP79559', 'Prof. Ravindra Pawarkar', 'ravindra.pawarkar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'EGR (Engineering Graphics)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['22 - FY MECH'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP85278', 'Prof. Rutuja Lakhe', 'rutuja.lakhe@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'IIM (Industry Immersion & Workshop Practice)', 'LADC (Linear Algebra and Differential Calculus)', 'PYTHON PROGRAMMING (Python Programming)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['12 - FY CSE AIDS', '23 - FY MECH', '9 - FY CSE AIDS'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP34348', 'Prof. Sayali Nikam', 'sayali.nikam@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['18 - FY ECE AIML', '4 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP49601', 'Prof. Sayali Thorat', 'sayali.thorat@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['16 - FY ECE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-613', 'Prof. Shrihari Bondar', 'shrihari.bondar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['AEC (Ability Enhancement Course)', 'SELF-LEARNING (Self-Learning)', 'YOGA (Yoga and Meditation)'], ARRAY['23 - FY MECH'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP70731', 'Prof. Tanishqa Veer', 'tanishqa.veer@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['24 - FY MECH ROBO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP42600', 'Prof. Tarishi Baranwal', 'tarishi.baranwal@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['11 - FY CSE AIDS', '19 - FY E&CE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP65084', 'Prof. Vaishali Joshi', 'vaishali.joshi@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['LADC (Linear Algebra and Differential Calculus)'], ARRAY['6 - FY CSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP37834', 'Prof. Vrunda Agarkar', 'vrunda.agarkar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY[], ARRAY['1 - FY CSE', '2 - FY CSE', '3 - FY CSE', '4 - FY CSE', '5 - FY CSE', '6 - FY CSE', '7 - FY CSE', '8 - FY CSE AIDS', '9 - FY CSE AIDS', '10 - FY CSE AIDS', '11 - FY CSE AIDS', '12 - FY CSE AIDS', '13 - FY CSE CSF', '14 - FY CSE CLOUD', '15 - FY ECE', '16 - FY ECE', '17 - FY ECE AIML', '18 - FY ECE AIML', '19 - FY E&CE', '20 - FY SEM VLSI', '21 - FY REN ENE', '22 - FY MECH', '23 - FY MECH', '24 - FY MECH ROBO', '25 - FY MECH ROBO', '26 - FY CHEM', '27 - FY MSE', '28 - FY PETRO', '29 - FY CIVIL', '30 - FY CIVIL SMART', '31 - FY BIO', '32 - FY BIO'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP64438', 'Rajkumar Komati', 'rajkumar.komati@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['22 - FY MECH'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP72930', 'Shirish Paygude', 'shirish.paygude@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['15 - FY ECE', '18 - FY ECE AIML'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-847', 'Shrikant Nimbalkar', 'shrikant.nimbalkar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['29 - FY CIVIL'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP26926', 'Shrikant Yadav', 'shrikant.yadav@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['EGR (Engineering Graphics)'], ARRAY['20 - FY SEM VLSI'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP69716', 'Smita Lokare', 'smita.lokare@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['PPS (Programming and Problem Solving)'], ARRAY['20 - FY SEM VLSI', '22 - FY MECH', '23 - FY MECH'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP-2026-563', 'Smita Paithankar', 'smita.paithankar@mitwpu.edu.in', 'Assistant Professor', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['18 - FY ECE AIML'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;
INSERT INTO public.faculty_allocations (id, name, email, designation, role, department, assigned_subjects, assigned_divisions, status)
VALUES ('EMP32820', 'Ujjwala Rawandale', 'ujjwala.rawandale@mitwpu.edu.in', 'Faculty', 'Teaching Faculty', 'Department of First Year B. Tech.', ARRAY['BEEE (Basics of Electrical and Electronics Engineering)'], ARRAY['27 - FY MSE'], 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET assigned_subjects = EXCLUDED.assigned_subjects, assigned_divisions = EXCLUDED.assigned_divisions;

-- 6. Initial Subjects (52 Courses)
INSERT INTO public.subjects (code, name, credits)
VALUES ('EMT11011', 'Linear Algebra and Differential Calculus', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CHM10011', 'Engineering Chemistry', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('PHY10010', 'Engineering Physics', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MEC10021', 'Engineering Graphics', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MEC10010', 'Ideas and Innovations in Manufacturing', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSE10040', 'Python Programming', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10030', 'Environment and Sustainability', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('YOG10010', 'Yoga - I', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10060', 'Financial Literacy', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10080', 'Indian Constitution', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10100', 'Sports', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CDC10010', 'Ability Enhancement Course', 0)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CIV10010', 'Engineering Mechanics', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSE10010', 'Foundations of Programming', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('EMT11140', 'Discrete Mathematics with Graph Theory', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSE10020', 'Foundations of Computer Architecture and 
System Design', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('YOG10020', 'Yoga - II', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10070', 'Co-Creation', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10090', 'Indian Knowledge System', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('PCE10010', 'Foundations of Peace', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSF10010', 'Foundations of Programming', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSF10020', 'Foundations of Computer Architecture and System Design', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CSE10120', 'Programming and Problem Solving', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE10070', 'Basics of Electrical and Electronics Engineering', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE10030', 'Python Programming', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('EMT11111', 'Integral Calculus', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE10050', 'Digital Electronics', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('UNC10160', 'AI for everyone', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ESV10010', 'Introduction to Electronics & Semiconductor Technology', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ESV10020', 'Digital Electronics and Logic Design', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ESV10030', 'Computer System Architecture', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE20190', 'Electronic Devices and Circuits', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ERE10010', 'Electrical Fundamentals for Energy Systems', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('PHY10030', 'Physics for Energy Systems', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MEC10040', 'Engineering Mechanics for Energy Systems', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE20370', 'Analog and Digital Electronics', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ERE10030', 'Materials for Energy Systems', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE10010', 'Basics of Electrical and Electronics Engineering', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MEC10030', 'Computer Aided Modelling', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MRA10010', 'Python Programming', 1)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('ECE10060', 'Introduction to Electrical and Electronics Engineering', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CHM10021', 'Physical Chemistry', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CHE20250', 'Introduction to Chemical Engineering Practices', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('MSE20010', 'Introduction to Materials Science and Engineering', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('EMT00010', 'Introductory Mathematics for Bioengineers', 0)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('EMT11150', 'Mathematics for Bioengineers-I', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('BIE20010', 'Cell and Molecular Biology', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('BIE20020', 'Human Anatomy and Physiology', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('PET10010', 'Petroleum Engineering Practices', 3)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CIV10041', 'Engineering Mechanics', 4)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CIV10020', 'Surveying Field Practices', 2)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.subjects (code, name, credits)
VALUES ('CIV11020', 'Surveying Field Practices', 2)
ON CONFLICT (code) DO NOTHING;

-- 7. Initial Feedback Evaluation Questions
INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('q1', 'Teaching & Pedagogy', 'The instructor explained core concepts with clarity and demonstrated thorough subject depth.', 'rating_5', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('q2', 'Delivery & Pace', 'The pace of lectures was well-regulated and facilitated active understanding during class.', 'rating_5', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('q3', 'Practical & Lab Relevance', 'Practical laboratory demonstrations, coding sessions, and hands-on examples effectively complemented theoretical topics.', 'rating_5', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('q4', 'Doubt Resolution & Support', 'The faculty was approachable, encouraged questions, and provided timely academic assistance.', 'rating_5', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.feedback_questions (id, category, text, type, display_order)
VALUES ('q5', 'Learning Resources & LMS', 'Course syllabus, lecture notes, assignments, and digital resources uploaded on LMS were comprehensive and timely.', 'rating_5', 5)
ON CONFLICT (id) DO NOTHING;

-- 8. Initial Students (2201 actual records across all 32 divisions)
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272260395', 'Aarna Anand Naware', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261002', 'Abeer Agrawal', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261789', 'Aditya Prakash', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261342', 'Ansh Deepak Shivangi', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261863', 'Aryan Tomar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272262303', 'Atharva Priyesh Veedu', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272262151', 'Ayaan Sheikh', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261692', 'Ayush Dubey', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272262479', 'Dhruva Parag Chitnis', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272260488', 'Hamdan Bin Shiejeeb', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272260703', 'Mehul Patidar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261857', 'Parinith Shetty', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261923', 'Saksham Santosh Raje', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261545', 'Saloni Santosh Shrivastav', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261022', 'Shabd Wankhede', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272260527', 'Simran Ravikumar Gandhi', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272260706', 'Tanmay Kumar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261010', 'Vidhi Tulsyan', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 1),
  ('1272261568', 'Aayushi Vilas Umbare', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261177', 'Agrima Raghuvanshi', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262240', 'Arjun Pramod Kachare', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261953', 'Ark Raj', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262072', 'Atharv Gajanan Dhakre', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262428', 'Harsh Satysen Patil', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261587', 'Ira Chandrashekhar Bandekar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261087', 'Khadija Irshad Godme', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272260444', 'Krish Rupesh Gopani', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261980', 'Mahak Ghanshyam Laddha', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262524', 'Manasvi Jayesh Mutha', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261088', 'Piyush Pitre', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261058', 'Rishika Shivadharlal Shiva', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262410', 'Rishita Prashant Kavishwar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272260528', 'Shivani Arun Seena', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261037', 'Sohan Arvind Narkhede', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272262493', 'Swanandi Shekhar Deshmukh', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261445', 'Utkarsh Shantilal Mohalkar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261746', 'Wilyn Nimish Saraf', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 2),
  ('1272261573', 'Ananya Vivek Temkar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261107', 'Aum Abhijeet Kolte', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261332', 'Dhyan Piyushkumar Patel', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261277', 'Ishwari Rajendra Mali', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1262260376', 'Kosh Jain', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261236', 'Lekh Chawda', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1262260343', 'Manas Sunil Tale', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272260451', 'Prisha Prasad Kunder', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261878', 'Ronak Vilasrao Patil', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272260562', 'Sarthak Jitendra Patil', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272262287', 'Sarvesh Sachin Wagh', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272262251', 'Shaunak Abhay Karekar', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261488', 'Shreya Sanjay Lakhade', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261976', 'Tanish Chandra', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272260940', 'Vedant Hanmant Bakal', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272262063', 'Vihaan Ajay Pawal', 'B.Tech Computer Science and Engineering', '1 - FY CSE', 3),
  ('1272261712', 'Aarnavi Kashyap', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261047', 'Aditya Nandkishor Aher', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261585', 'Akshat Vivek Bhardwaj', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261059', 'Aryansh Alok Singh', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261494', 'Ayush Singh', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272262134', 'Dhruv Tambi', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261032', 'Hardik Rahul Shelke', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261052', 'Jyotmeher Bedi', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272262452', 'Krushna Anil Bahirat', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261018', 'Mihir Mukund Pendse', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261674', 'Parth Parag Patil', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272260984', 'Rajasi Nerkar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261855', 'Samarth Tanaji Godage', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261922', 'Shreya Mahesh Kolhe', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272262166', 'Shreya Mahesh Zawar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261444', 'Smit Nileshbhai Kavathiya', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261470', 'Tanushree Santosh Bhoite', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272262258', 'Vedangi Vinod Naik', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261309', 'Vihan Vivek Butley', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 1),
  ('1272261547', 'Akshat Mahavir Durugkar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261511', 'Arjun Deepak Patil', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262235', 'Aroushi Vishwakarma', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261113', 'Atharva Hemant Neve', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272260284', 'Debadrish Bhowmick', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262080', 'Ekta Abhay Wagadre', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261185', 'Khushi Paras Khinvasara', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262321', 'Mayank Bijarniya', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262520', 'Nikhil Khera', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261543', 'Pragya Arora', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261244', 'Rishika Vishal Bafna', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272260097', 'Saideep Prashant Barge', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261653', 'Shivanjali Mishra', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262541', 'Shrikant Kishor Gawande', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272262545', 'Soham Nitin Badge', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261068', 'Sonkee Milind Joshi', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261251', 'Yash Pandurang Shelar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 2),
  ('1272261176', 'Arush Jha', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261803', 'Avaneesh Shirish Deshpande', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272262393', 'Aviral Gothwal', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261711', 'Divyanshu Singh', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272260670', 'Jaganadh Ms', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261227', 'Lisha Tejas Patil', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272262144', 'Mahak Agarwal', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261646', 'Nityam Nileshbhai Lathiya', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1262261064', 'Omkar Hemant Dhimte', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261988', 'Parth Pravinkumar Pawar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272262031', 'Prakash Sakharam Choudhary', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261223', 'Priyal Alok Khandelwal', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261117', 'Saanvi Chikyala', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272262529', 'Samarth Navanath Shinde', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261737', 'Sarthak Mahesh Pawar', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261556', 'Surabhi Pramod Dhore', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272260707', 'Vedant Sunil Sakore', 'B.Tech Computer Science and Engineering', '2 - FY CSE', 3),
  ('1272261540', 'Aarsh Chetan Jain', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261125', 'Advaet Umesh Chintakunta', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272260102', 'Anand Lakshmikanth', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261847', 'Anshul Amit Gosavi', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261462', 'Aryarajsinh Kishorsinh Jadeja', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272262304', 'Bhumika Dilip Dhamane', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261435', 'Chhand Tyagi', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261532', 'Kabir Pramod Pardeshi', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261351', 'Minakshi Sachin Zope', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272262283', 'Nishita Vinay Thombre', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261144', 'Parth Gorakhnath Jadhav', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261592', 'Rajiv Ajit Shinde', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272262447', 'Saee Sachin Siddhe', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272260664', 'Samarth Ganesh Dombe', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272260944', 'Sharvi Jindhar Chougule', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261921', 'Swar Sagar Gandhi', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261085', 'Tanvi Basawaraj Somashetti', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272262164', 'Uzair Zaheer Rawal', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272261159', 'Vinayak Dhanyakumar Kolhe', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 1),
  ('1272262280', 'Aaryan Ajit Kavitake', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261216', 'Abhinav Kumar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261204', 'Akshay Srinivasa', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272260532', 'Arjun Rastogi', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261184', 'Atharva Sunil Patil', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272262544', 'Hitesh Rajpal', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261092', 'Khushi Milind Prabhudesai', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1262262099', 'Mohammad Hamdaan Valsangkar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261710', 'Neev Nileshkumar Panchal', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272262549', 'Pranjal Sharma', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261610', 'Rohit Manglani', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261346', 'Sanika Sanjay Vaidya', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261049', 'Shivansh Saurabh Vijayvergiya', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272262284', 'Shreyas Ramdas Dhage', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272260490', 'Sonu Kumar Chaurasiya', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261659', 'Yash Rajanikant Mane', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 2),
  ('1272261188', 'Aadit Kaul', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261460', 'Aditya Narendra Chavan', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261666', 'Animesh Misra', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272262415', 'Anoushka Ranjit Ganguly', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261103', 'Aryan Sagar Bandekar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1262260908', 'Atharva Nitin Bauskar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272262255', 'Ayush Pramod Nalavade', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261560', 'Drishti Satish Rai', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261421', 'Jahnavi Sarang Deshkar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261050', 'Maithili Ashtaputre', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261155', 'Ojas Manish Khodaskar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272262478', 'Pranjal Bujetya Mukesh Kumar Meena', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261331', 'Purushottam Shyam Jadhav', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261457', 'Sachi Shamrao Gade', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1262260940', 'Sarthak Dhyani', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261036', 'Shriya Yati Kokare', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261795', 'Swara Kandalkar', 'B.Tech Computer Science and Engineering', '3 - FY CSE', 3),
  ('1272261241', 'Aarvi Manish Rathod', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1262261119', 'Aditya Anand Ashtekar', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261398', 'Advait Agrahari', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272262068', 'Alyssa Deepak Dhembre', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261938', 'Anushka Ganesh Bhoite', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272262320', 'Anvay Bhatli', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272260673', 'Arijit Pattanaik', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261464', 'Chhavi Chandrabhushan Singh', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272262453', 'Chitranshu Sahu', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261480', 'Hasan Murtaza Chasmawala', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261034', 'Mrudula Sunil Dere', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272260337', 'Parth Mahesh Pharande', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261334', 'Rajveer Gaurav Sanghavi', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272262206', 'Shayaan Shahnawaz Khan', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272260672', 'Soham Sudhir Mahadik', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261203', 'Tejaswi Shivraj Mone', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261667', 'Vinayak Jay Sharma', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 1),
  ('1272261760', 'Abhiraj Singh Chauhan', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272260396', 'Aliza Naseem Shirshikar', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261420', 'Arnav Atul Bhusari', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272260719', 'Atharva Prashant Shinde', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261131', 'Ishaan Udaya Mogaveera', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261030', 'Krishna Sudhir Aklade', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1262260493', 'Namasvi Shantaram Mahajan', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272262347', 'Omkar Rajesh Mane', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261748', 'Pranav Prasad Haldule', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261810', 'Rudra Shitalkumar Dhole', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272262449', 'Sarthak Sanjay Parkhe', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261220', 'Shlesha Sanjay Ghare', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272260100', 'Shlok Yogesh Bute', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261443', 'Sourav Mishra', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272262276', 'Tanish Mantri', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261339', 'Varun Maruti Maskar', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261967', 'Vatsa Shashin Deputy', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 2),
  ('1272261599', 'Aaditya Balsara', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1262261606', 'Aayush Rajesh Hambarde', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272260671', 'Aditya Kulkarni', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261438', 'Anish Prakash Jadhav', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272260691', 'Avaneesh Sambhaji Bhosale', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261183', 'Dwij Dipu Prasad', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261518', 'Jainam Mahesh Jain', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272262372', 'Kriyan Shah', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261399', 'Manasdeep Nitin Borole', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272262237', 'Meet Nitin Gidwani', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261652', 'Omkar Narendra Kulkarni', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261406', 'Pushpak Agrawal', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272260735', 'Sahil Kudi', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272262125', 'Samey Rahul Kothavade', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261065', 'Saumya Samit Patil', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261143', 'Shruti Ramji Gupta', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272260388', 'Swarali Shreekanth Joshi', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272262386', 'Taksh Jain', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261013', 'Vedant Mahesh Jadhav', 'B.Tech Computer Science and Engineering', '4 - FY CSE', 3),
  ('1272261801', 'Aarya Agrawal', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261089', 'Advika Aniket Bakore', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261015', 'Antariksh Pramod Papade', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261126', 'Asmita Manoj Dalvi', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261486', 'Chhavi Goyal', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262257', 'Jay', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272260334', 'Karan Ramesh Nair', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261237', 'Mrudula Sanjay Maske', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261168', 'Philip Bentolouis Fernandes', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262465', 'Priyansh Nitin Anasane', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272260560', 'Ranvijay Nilesh Jagtap', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261024', 'Samiksha Patrikar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262281', 'Saptarchi Manna', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262222', 'Sarthak Santosh Dhage', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262361', 'Sarthak Ravindra Choudhari', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262005', 'Satyam Vishnu Tambade', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272262497', 'Shandra Jiss', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272260491', 'Vishnu Ashok Bhandare', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 1),
  ('1272261366', 'Adbhut Khandelwal', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261266', 'Arnav Sameer Zagade', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261433', 'Ishan Ravindra Pawar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262279', 'Kavya Ashish Bansal', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262081', 'Nikita Abhijit Deokule', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272260342', 'Nimai Gaurang Gorasiya', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262118', 'Palak Sagar Baldota', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272260489', 'Pranit Santosh Dere', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262509', 'Ritesh Bajaj', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261791', 'Sanyat Sharma', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262488', 'Shahzeb Irfan Kazi', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261097', 'Shourya Santosh Karkar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261007', 'Sradha Saiju', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272262282', 'Tanvi Madhav Rathod', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261388', 'Varun Singhal', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261949', 'Yash Rajendra Wankhede', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 2),
  ('1272261528', 'Aditya Bind', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272262443', 'Akshara Rameshwar Maniyar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261123', 'Anisha Aniket Inamdar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1262253115', 'Aryan Prafulla Taralekar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272260430', 'Aryan Pankaj Hedaoo', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272260332', 'Avni Manoj Madhavan', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1262261019', 'Ethan Luell Lopes', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261678', 'Eva Santhosh', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261128', 'Jayesh Mahendra Jagtap', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261189', 'Manthankumar Sandip Keni', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272260448', 'Owais Arzam', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272262248', 'Prutha Preshit Todkari', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261405', 'Rachit Rahul Gandhewar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261983', 'Satyam Kumar', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261450', 'Sayyam Gautam Soni', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261147', 'Shubh Singh', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261019', 'Swarnim Suhas Pande', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272262391', 'Tanmay Sharma', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261660', 'Vedika Shantibhushan Suryawanshi', 'B.Tech Computer Science and Engineering', '5 - FY CSE', 3),
  ('1272261491', 'Aatish Naveen Das', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261390', 'Aayush Jha', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262078', 'Aditi Navnath Jadhav', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262318', 'Ammar Kausar Khan', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262507', 'Anshi Jain', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261724', 'Anuj Adhik Gurav', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261328', 'Chinmay Amit Kulkarni', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262483', 'Lakshika Yashpal Satija', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272260956', 'Muhammed Shezin', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261455', 'Piyush Jain', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261294', 'Riddhi Jain', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261083', 'Sammit Santosh Kharolkar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261753', 'Shiv Shailesh Kawalkar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262195', 'Shreyash Rangnath Khaire', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261931', 'Shrikar Nitin Zargad', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261127', 'Soham Kedar Mulay', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261497', 'Trisha Pankaj Jambhale', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272262475', 'Vedika Shivraj Lokhande', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272261825', 'Vivek Chandora', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 1),
  ('1272260695', 'Amey Maheshkumar Inamdar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261471', 'Arnav Bhati', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261368', 'Atharva Sudhakar Patil', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261869', 'Chirag Manoj Jadhav', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261003', 'Dhanush Sri Shanmugam Mudhaliar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272262487', 'Ipshita Manish Solanki', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261461', 'Ishant Santosh Mahadik', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1262260703', 'Jiya Chandani', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261808', 'Kulshree Sharma', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261027', 'Niral Aparish Shetty', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261004', 'Prathamesh Kishor Pawar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261487', 'Rutuja Dhananjay Gurav', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272262076', 'Sanchit Rauniyar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272260961', 'Sarah Zubair Ahmed Sarguroh', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272262522', 'Sarthak Ravikant Chavan', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261028', 'Shreeom Deepak Paigude', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272262224', 'Srushti Pramod Soma', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261347', 'Stuti Jain', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272261960', 'Yashraj Kiran Patil', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 2),
  ('1272262051', 'Aadima Kiran Galande', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261040', 'Aditya Patel', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262148', 'Akshat Farkya', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261385', 'Anishk Sharma', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261201', 'Avnish Mukesh Agarwal', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261706', 'Gaurav Kumar Singh', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262188', 'Harshawardhan Ashok Kale', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272260454', 'Jimee Jain', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262253', 'Kanishka Gupta', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261245', 'Meera Vaibhav Kulkarni', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262439', 'Mugdha Ghanashyam Kirve', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262204', 'Naman Dipak Rathi', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261276', 'Radha Vinay Joshi', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272260620', 'Sakshi Sharma Belbase', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261728', 'Sejal Sandip Akkangire', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261048', 'Siddhesh Patil', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272261363', 'Tahir Suhail Inamdar', 'B.Tech Computer Science and Engineering', '6 - FY CSE', 3),
  ('1272262128', 'Aayush Nitin Ghumare', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262120', 'Abhinav Agrawal', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262060', 'Anurag Shukla', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261408', 'Anushka Nitin Desai', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261996', 'Aryaa Sandip Jadhav', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261689', 'Crystal Thagunna', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261234', 'Hiren Dev', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262421', 'Joshua Noble', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261106', 'Ketaki Ajay Gadgil', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262419', 'Kunal Kautik Khadke', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262178', 'Manan Bharat Panchal', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261067', 'Nandit Goyal', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261695', 'Piyush Raj', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262504', 'Purvesh Vijay Darwatkar', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261180', 'Rishan Sharma', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272262313', 'Sarvesh Sahebrao Gawande', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261807', 'Unmil Atul Jawale', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272261946', 'Varun Amol Tarte', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 1),
  ('1272260583', 'Ananya Shivaprasad', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272262374', 'Anirudh Soni', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261975', 'Anwesha Alok Kumar Sinha', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272260949', 'Arnav Jakkapalli', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261124', 'Dhruv Hemant Sonawane', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272262200', 'Drishti Ravi Israni', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261138', 'Harshil Niravbhai Shukla', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261665', 'Ishmeetsingh Surjeetsingh Sawlani', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272262557', 'Jose Fernandes Bimbi Dombaxi Andre', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1262260881', 'Lakshya Singh', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261133', 'Niranjan Ranjith', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272260997', 'Prathvi Raju Poojari', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261376', 'Ryan Sushant Narkar', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272262077', 'Sakshi Sunil Kanjwani', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272260975', 'Stuti Kashyap', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272260338', 'Vedanshi Sagar Vadher', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 2),
  ('1272261361', 'Aarna Samesh Shah', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261285', 'Aditya Prashant Yewale', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261173', 'Anishka Adarsh Upadhye', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262494', 'Atharv Mahindra Katkar', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262403', 'Bhoomi Esarka', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261413', 'Jonathan Bijoy Cheliparambil', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262402', 'Kunal Ravindra Shinde', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261754', 'Pall Rajubhai', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262226', 'Prasanna Pravin Joshi', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262434', 'Priyal Sunil Gadekar', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262202', 'Pruthviraj Prashant Eakde', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261082', 'Rahul Singh', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261271', 'Sejal Amit Suryavanshi', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261156', 'Siddhi Laxmikant Joshi', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272262196', 'Subhikshan Kumar Nadar', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261198', 'Vibha Manoj Nair', 'B.Tech Computer Science and Engineering', '7 - FY CSE', 3),
  ('1272261150', 'Aarav Anil Kumar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260145', 'Abhyuday Tripathi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261872', 'Achyut Ajit Torvekar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261033', 'Aishwarya Bhushan Godbole', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260611', 'Anya Gaur', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260957', 'Auhona Chakraborty', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261233', 'Devanshi Nishant Chordia', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261729', 'Garima Thanwani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261333', 'Joanne Joseph Fernandes', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261359', 'Lakshika Nandkishor Kabra', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272262528', 'Mayuresh Nitinkumar Bulbule', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261086', 'Nandini Ajay Rohilla', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260677', 'Prabal Bhugoo', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261890', 'Pragya Sinha Mahapatra', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272262032', 'Renuka Subhash Kale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261584', 'Sanidhya Ravikant Shandilya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260994', 'Shivam Nitin Thakare', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260482', 'Soham Mandar Sathe', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261383', 'Tanish Sudhakar Sail', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272262436', 'Tanish Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272262238', 'Tanmay Tushar Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272260413', 'Venkatesh Sandeep Likhite', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 1),
  ('1272261415', 'Aarnavi Nilesh Tanpure', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272262146', 'Adeetya Nitin Agarwal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260598', 'Anant Kumar Jaiswal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261597', 'Aryan Anup Mahajan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261229', 'Ayush Amrut Dabhekar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261934', 'Hardik Bachhawat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261364', 'Harshita Vashistha', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261524', 'Kathan Sunil Patel', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261195', 'Maina Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261589', 'Nikhil Makarand Chitale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260361', 'Pranay Suman', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261986', 'Qusai Asif Sathalyawala', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272262495', 'Raj Dilip Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260434', 'Rian Najar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260414', 'Sahir Mohammad Alam', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261831', 'Satish Bhuraram Choudhary', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272262085', 'Shivani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261377', 'Shreyas Dinesh Deore', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272262270', 'Soham Sanjay Khodke', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272261709', 'Toshik Alam Haq', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1262260667', 'Yash Rajesh Chiney', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260704', 'Yashasvi Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 2),
  ('1272260359', 'Aditya Renjit', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272262183', 'Akshat Agarwal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261467', 'Anshul Aditya Verma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272262515', 'Anvee Atul Phalke', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272260678', 'Ashwin Ajay Ghare', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272260958', 'Daksh Dwivedi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261631', 'Eshal Asif', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272262055', 'Harsh Deepak Angane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261465', 'Ishika Neeraj Mehta', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261948', 'Kaif Yusuf Mahedvi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272260410', 'Krish Rahul Durve', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272260967', 'Mohammed Adnan Mohammed Rayees', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272262288', 'Nikhil Ganesh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261134', 'Pahel Dinesh Gandhi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261080', 'Pratishtha Thakre', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261356', 'Rishikesh Prashant Kherde', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261744', 'Saksham Aggarwal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272260698', 'Shantanu Santosh Chhettiar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261060', 'Siddharth Sameer Sharma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272262228', 'Tanvi Ravi Lot', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261757', 'Varad Vivek Chandankhede', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '8 - FY CSE AIDS', 3),
  ('1272261154', 'Aarav Prashant Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262400', 'Anushka Vikas Gorde', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261162', 'Archit Sandip Bhole', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262246', 'Arshita Chauhan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1262260414', 'Darsh Mohit Gupta', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261437', 'Deven Haridas Sonawane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261137', 'Leisha Manish Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261078', 'Nandini Navin Zamvar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262217', 'Parth Sunil Vaidya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262404', 'Pauravi Manish Phuke', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272260449', 'Prachi Shailesh Thanki', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262519', 'Pritesh Shravan Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261463', 'Rajvi Sagar Dudhat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261296', 'Rutuja Rahul Mohite', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261196', 'Sanjit Rajan Dhole', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262000', 'Shifaniya Shemeem', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272260632', 'Shivam Khera', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272260524', 'Soham Sandeep Charde', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261997', 'Sujeet Kapoor', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261548', 'Tanishka Uttam Khedkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262444', 'Vaishnavi Ranjan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272262135', 'Vasishth Gupta', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272260486', 'Vibha Vignesh Iyer', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 1),
  ('1272261984', 'Aarav Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262091', 'Aaryan Chaudhari', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261856', 'Anaya Yogesh Phalke', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1262262364', 'Anwesha Shailendra Vaidya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261357', 'Aryan Pradeep Kumar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262484', 'Chetana Amit Katariya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1262260709', 'Daksh Gala', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262474', 'Durva Deepak Dalvi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262145', 'Ishwar Anand Shankar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262049', 'Ishwari Vishal Pimple', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1262260321', 'Madhav Unnikrishnan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262273', 'Malay Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272260676', 'Manas Suhas Adhatrao', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261861', 'Nikhil Udayakumar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261933', 'Pratham Prataprao Deshmukh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262267', 'Shambhavi Palak Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262405', 'Shreya Shridhar Sawant', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261407', 'Shritej Paresh Shirude', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262396', 'Siddhi Purushottam Gohokar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261066', 'Supriya Netaji Mahadik', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261798', 'Trambkeshwar Omshankar Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261206', 'Yashraj Sandip Botre', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272262223', 'Yatik Tanmay Doshi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 2),
  ('1272261202', 'Aditya Amrut Bangar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261064', 'Anshuman Amit Kulkarni', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272262505', 'Anushri Thopte', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261787', 'Asmi Aniket Bhagwat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272262293', 'Atharva Vishnu Naik', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272260899', 'Darsheel Chhajed', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272260408', 'Fawwaz Arshad', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272262197', 'Harsh Deepak More', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272260680', 'Ishita Satyajit Patki', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261968', 'Kanak Paryani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261062', 'Krishna Sachin Tamgole', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261008', 'Mrigesh Milind Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261207', 'Palak Prasad Dhoot', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261213', 'Prayusha Mohnish Chordiya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261544', 'Rudra Sunil Shinde', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261192', 'Samprikta Banerjee', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272260579', 'Shanvi Shaw', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272262165', 'Shruti Rani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272261529', 'Swanandi Mangesh Mahajan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1262261147', 'Swapnil Rajeshwar Patnaik', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261136', 'Ved Khodaskar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '9 - FY CSE AIDS', 3),
  ('1272262446', 'Aditya Sunil Mohite', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261255', 'Akshara Anand Rathod', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261243', 'Arin Virendra Nadgir', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272260399', 'Avi Bansal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272260439', 'Devika Ambat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261512', 'Gaurav Nilesh Agarwal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262124', 'Harpreet Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261839', 'Himanshi Ravi Agrawal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272260341', 'Leo George Thomas', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261930', 'Madan Varalaxmaiah Pagadala', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262547', 'Mohammed Iqbal Patel', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262221', 'Nimit Parag Mehta', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261141', 'Saanvi Sammit Potdar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261163', 'Sarang Sandesh Nair', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261718', 'Shorya Pratap Singh Rathore', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262249', 'Siddharth Harish Shetty', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272260716', 'Sonit Sanjay Hanumante', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261139', 'Tanmay Santosh Khaire', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1262260706', 'Tejas Bharatrao Lahane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262138', 'Vihaan Rajput', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272261070', 'Vinayak Sanjeev Kumar Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 1),
  ('1272262155', 'Aarush Arvind Bodgal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261061', 'Adinath Shrikant Amale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260584', 'Angad Kaul', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261598', 'Aryandra Shrivastava', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261469', 'Chaitanya Bipinkumar Patel', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261562', 'Diggaj Ganesh Shete', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260522', 'Hetvi Hiteshkumar Zanzmeria', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272262462', 'Himesh Maroti Atkari', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260485', 'Manav R Nair', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261051', 'Nishita Nilesh Thorat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272262047', 'Om Bhavankumar Mishra', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272262480', 'Om Bhushan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272262265', 'Pranav Shatendra Rao', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261326', 'Prapti Dashrath Chende', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261942', 'Ritvik Avinashchander Sharma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272262543', 'Sayma Sahil Mhatre', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261476', 'Sejal Kiran Karale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260133', 'Shritej Mohan Ghule', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261719', 'Surya Verma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260596', 'Unmesh Kiran Shinde', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272260487', 'Yazeed Sarwar Hafiz', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 2),
  ('1272261292', 'Aadheesh Amit Rane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261023', 'Aditya Pala', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261908', 'Aditya Abhijit Mudhole', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261338', 'Athaang Sanket Jambhekar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262131', 'Ayaan Intekhab Shaikh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261169', 'Ishwaryaa Sethuraman Tamaram', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261432', 'Krishna Gaurav Laad', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262297', 'Mitali Ajitkumar Sancheti', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262126', 'Mokshi Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261418', 'Mrudula Shriram Deshpande', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262190', 'Ojas Dhananjay Ahirrao', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261135', 'Paras Abhaykumar Sakale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261963', 'Piyush Mangesh Mahadik', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261172', 'Preksha Pankaj Mehta', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262503', 'Pruthviraj Murlidhar Huple', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261110', 'Samridhi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262244', 'Sanvi Amol Jagtap', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272260970', 'Sidharth Sanjay Nair', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261171', 'Swara Sameer Barmukh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261297', 'Vedant Sachin Sane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272262262', 'Zuhair Zulfikar Kurane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '10 - FY CSE AIDS', 3),
  ('1272261380', 'Akshay Suhas Joglekar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1262260101', 'Aryan Ravindra Bhagwat', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261119', 'Devin Johnson Rodrigues', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272260340', 'Gavin Nathan Pinto', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261181', 'Junaid Chand Nadaf', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272260571', 'Liteel Raj', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272262486', 'Manasvi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261775', 'Neha Ravindra Dhokale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272260711', 'Prajwal Manoj Dhumal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272262472', 'Rachit Mitesh Thacker', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261820', 'Raushan Raj Raj', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272262261', 'Rutwej Ravindra Nagare', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272260455', 'Sabel Daniel George', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272260576', 'Saransh Rampal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272262534', 'Shaikh Mohammed Athar Ali', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261466', 'Shouryan Santosh Baradkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261848', 'Sonu Kumar Sah', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261926', 'Swajit Jitendra Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261745', 'Tanvi Umesh Arote', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272261816', 'Yash Shivaji Ingulkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 1),
  ('1272262161', 'Aazain Adil Shaikh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261472', 'Aditi Bhardwaj', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261118', 'Ankita Pramod Reghate', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261956', 'Anushka Ravikiran Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272260406', 'Aryaraj Yuvraj Mhetre', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261454', 'Chandraprakash Ummed Kumar Pareek', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272260623', 'Duruwank Dinesh Pai', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272260417', 'Khadija Husain Sheikh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1262260675', 'Manish Mohan Choudhary', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261786', 'Om Sumit Shete', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261167', 'Prateekshya Pradhan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272262272', 'Prathamesh Bandu Pawar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261475', 'Rishi Pandharish Kulkarni', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272262364', 'Rudra Sandeep Dudhale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261498', 'Saksham Sujit Bora', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272260362', 'Shaanvir Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261005', 'Siddhant Sameer Deosthale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261490', 'Suryaprakash Sanwarmal Sharma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261696', 'Unnati Satanappa Hurdale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272260415', 'Vaidehi Raosaheb Pandit', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261853', 'Yuvraj Pankaj Jaju', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 2),
  ('1272261038', 'Advaya Aashlesh Shrikhande', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261353', 'Anushka Rathore', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261792', 'Atharva Prashant Balwadkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261100', 'Deepankar Shrikant Shukla', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261809', 'Ganesh Chetan Prajapati', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261044', 'Janhvi Abhijit Kharade', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262094', 'Joravar Singh Jolly', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261132', 'Kshitij Rajesh Gaikwad', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262422', 'Madhur Satish Kabra', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261751', 'Mubeen Muzammil Kazi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261114', 'Piyush Vijaykumar Chavan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262264', 'Rishika Vivek Zavar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262502', 'Rishika Singh Gehlot', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272260411', 'Rumaysa Khan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262450', 'Samarth Suganchand Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261411', 'Sanchita Sadashiv Deshmane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262236', 'Sharvil Rajendra Yadav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272260440', 'Sneha Dinesh Shet', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261742', 'Swarangi Santosh Sutar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262227', 'Tanish Hitesh Kapadia', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272261379', 'Vedant Vinod Peshane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272262476', 'Yash Khatri', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '11 - FY CSE AIDS', 3),
  ('1272260615', 'Aarjav Ajmera', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272260699', 'Alweena Cyril Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261941', 'Atharv Jain', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261395', 'Ayush Rohit Nagpure', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261055', 'Dhanashri Vishal Sawant', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272260589', 'Harshit Avdesh Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272260457', 'Kanhaal Kunnungaparambil Pramodh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272260466', 'Madhav Raj', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261282', 'Nidhi Mukeshkumar Gosai', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261439', 'Reeva Bhavesh Palrecha', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272262394', 'Rhucha Vijay Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261391', 'Sahil Ashish Loya', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261120', 'Sarhaan Riaz Mulani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261586', 'Shravani Abhijit Belose', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272262451', 'Shreyansh Sachin Dharne', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272262245', 'Shubham Mangesh Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272262271', 'Shubham Kishor Vishe', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272260700', 'Soumya Kushwaha', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261063', 'Tisha Uday Jivrajani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261535', 'Yash Prakash Sutar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 1),
  ('1272261053', 'Aditya Rajesh Jadhav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261165', 'Anshika Sharma', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261000', 'Ashwath Nitesh Gaonkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261081', 'Chinmayee Jagdish Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261616', 'Dhruv Kalal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261098', 'Eeshita Mukesh Gurubhaiye', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261966', 'Ishan Samir Dalvi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261197', 'Khushi Manish Yermal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272262286', 'Manshi Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261091', 'Mohammed Shariq', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261730', 'Ovi Vivek Jahagirdar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261650', 'Pratham', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261533', 'Rishi Dilip Kumar Gogad', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272260971', 'Saksham Panchal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261747', 'Siddharth Singh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272260109', 'Sumit Sunil Lokhande', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261337', 'Suryavansh Bakshi', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272261436', 'Vaishnavi Rajendra Kale', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272260901', 'Yuvraj Soni', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272262471', 'Zahin Amir Pathan', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 2),
  ('1272260325', 'Aanya Sehgal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261367', 'Advika Kolharkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261969', 'Anaya Avinash Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261686', 'Anvi Avinash Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261977', 'Aryan Bankat Dhakane', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261910', 'Atharv Niwrti Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261565', 'Atharva Atul Patil', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272260339', 'Ganta Arjun', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272262514', 'Gauri Naresh Yadav', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261647', 'Jay Jagdish Patel', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261713', 'Kunsh Sanjay Agarwal', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272260351', 'Naina Kakwani', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261708', 'Nilakshi Amol Deshmukh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261563', 'Poorvi Kothari', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261186', 'Priyam Dey', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261335', 'Sania Khurshid Ahmed Chaudhary', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261011', 'Shavez Parveez Shaikh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261623', 'Sneha Avinash Mahindkar', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261859', 'Tabish Imran Shaikh', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261235', 'Vedanta Sandeep Kanpile', 'B.Tech Computer Science and Engineering (Artificial Intelligence & Data Science)', '12 - FY CSE AIDS', 3),
  ('1272261263', 'Aayushi Vasantbhai Patel', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261605', 'Anika Chandra', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261372', 'Anvi Jain', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261319', 'Arush Gupta', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260976', 'Aryan Gourish Suktekar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261360', 'Ayaan Firoj Attar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261894', 'Ayush Amol Warudkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260441', 'Catherine Jaboy Varghese', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262290', 'Chaitanya Yogesh Jaipurkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261522', 'Disha Patel', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262263', 'Govind Mangilal Choudhari', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261130', 'Jaanhavi Harish Kotian', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261693', 'Jyotsav Singh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261348', 'Kaustub Prasad Rao', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261550', 'Madhura Pradip Nandkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260602', 'Mohammed Ali Shaikh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262181', 'Mohammed Gorachwala', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260904', 'Nirmit Pratik Patel', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260376', 'Ojas Abhinandan Shah', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272260393', 'Paxton Luis Fernandes', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261394', 'Priyanshi Rakesh Rajkule', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1262260228', 'Raayna Gautam Wahi', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261758', 'Rujula Virdhaval Jadhav', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262043', 'Sairaj Laxmanrao Dakhore', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262254', 'Sawani Sambhaji Ambre', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261012', 'Shakshi Gupta', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1262260684', 'Shihij Kaushik', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261226', 'Sonde Kartik Dharmaraj', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261673', 'Tanmay Vaidya', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261703', 'Vedant Jain', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261858', 'Viraj Sachin Kundkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272262127', 'Yashraj Deepak Swamy', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 1),
  ('1272261613', 'Aaryan Dhirajprasad Hanchanalkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262526', 'Aditya Umashankar Singh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262298', 'Anshul Jitendra Patil', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261441', 'Arush Amit Mahajan', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261865', 'Ayush Kumar Singh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261094', 'Dev Suhas Harishchandre', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262147', 'Dhruv Goyal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261662', 'Harsha Vilas Adav', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261225', 'Janhavi Girish Dahiwale', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261393', 'Kalp Hiten Shah', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261943', 'Lavanya Hrishikesh Chaudhari', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261045', 'Meghana Thalakola', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261153', 'Om Suryakant Nalawade', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262071', 'Parikshit Bhatt', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272260373', 'Pranav Mohan Agrawal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261115', 'Rajdeep Sharad Naik', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262231', 'Ritwik Raj', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261396', 'Rucha Pramod Ballal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261468', 'Ryan Mike Dsouza', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261145', 'Samruddhi Sanjaykumar Salunke', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1262260747', 'Shivraj Udhav Dhepe', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262209', 'Shloka Nilesh Amritkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261649', 'Shreya Sandeep Gadhave', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261434', 'Snehal Dattatray Chopdar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261583', 'Swayam Dinkar Dakare', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272262420', 'Tanvesha Venkat Bhosle', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261112', 'Vanshika Rathore', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261837', 'Vidya Sunil Vaid', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261378', 'Yahvi Aditya Modi', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261940', 'Yashaswa Goel', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 2),
  ('1272261290', 'Aayusha Dilip Lekule', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272262137', 'Adityavardhan Ashish Bopche', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261571', 'Anam Javed', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272262177', 'Annie Tiwari', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261628', 'Anujay Jaynath Singh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260973', 'Arnav Sunil Shinde', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261350', 'Aryaman Ashutosh Dubey', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261870', 'Atharv Prashant Ugile', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261020', 'Atharva Vinus Karnwal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1262261311', 'Ayush Avinash Talele', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261362', 'Ayush Deb', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261315', 'Devanshi Chetia', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261001', 'Ishita Neel Patil', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261806', 'Janvi Vishwanath Sanap', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261325', 'Kashish Amol Mudholkar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260650', 'Lavanya Vyas', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261945', 'Lokesh Rajesh Sonekar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261323', 'Mohammad Yasin Mithwale', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260348', 'Nirmal Byju Iyyani', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260992', 'Param Vikas Jain', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260428', 'Prince Choudhary', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261161', 'Razeen Riyas', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261073', 'Rujuka Abhijit Danke', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260459', 'Rylan Rodrigues', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261519', 'Saumya Saumin Patel', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261970', 'Shubhanshu Kumar Singh', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261759', 'Shubhra Shashikant Tiwari', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261588', 'Soham Jyotiba Kumbhar', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261851', 'Tanishq Gajanan Gunjal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261694', 'Vedansh Agarwal', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261804', 'Vignesh Prakash Poojari', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272261715', 'Yashaswini Pathak', 'B.Tech Computer Science and Engineering (Cyber Security & Forensics)', '13 - FY CSE CSF', 3),
  ('1272260996', 'Aarya Kedar Borkar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261447', 'Aditi Rakesh Kadam', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272262192', 'Akshat Singh', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261212', 'Anshuman Behera', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261349', 'Arush Ashish Gupta', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261756', 'Dakshesh Sharma', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272262333', 'Dhruv Jain', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272260661', 'Hitansh Chandan Jain', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261182', 'Kaavya Sundaresan', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261818', 'Kshitij Ramdas Ubhe', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272262322', 'Maroushka Reginald Mendes', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261539', 'Mayank Maheshkumar Jain', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272260662', 'Nishita Sharma', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261303', 'Riya Rahul Jadhav', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261093', 'Sai Pranav Anil Attili', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261782', 'Sanskriti Mohanta', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261231', 'Shreyas Rajendra Yelalwar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261341', 'Siddhi Bansal', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272262426', 'Sushant Rameshwar Mugal', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1272261925', 'Swasti Anil Patil', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261819', 'Ujjwal Kumar Singh', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261655', 'Yuvraj Gupta', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 1),
  ('1272261812', 'Aarti', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261039', 'Aaryan Chandrakant Mahalle', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261193', 'Aditi Tiwari', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261211', 'Arushee Pravin Dudhe', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261199', 'Avani Vikas Tembhare', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272262296', 'Bhaavvya Anil', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272262409', 'Dhruvi Jain', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261230', 'Gitesh Shirish Patil', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261142', 'Indraneil Prem Thanekar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261099', 'Kapil Deepak Neela', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272260708', 'Kush Raghuwanshi', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261567', 'Mayuresh Sanju Mandrup', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272262501', 'Pratik Pravin Tompe', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261149', 'Ranvir Rameshwar Kale', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261687', 'Sanidhya Amol Shinde', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261221', 'Shardul Rahul Velhal', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261854', 'Shreyash Ravindra Mamidwar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272262185', 'Tanya Saharan', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261354', 'Utsav Chaudhari', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272262448', 'Vishwa Nilesh Chipade', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 2),
  ('1272261205', 'Ajinkya Ameya Kulkarni', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272260648', 'Chinmay Gupta', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262294', 'Diya Jolly', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262417', 'Gayatri Anil Sonawane', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261224', 'Gracy Budhwani', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261178', 'Ishan Jitendra Pawar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261043', 'Krish Satish Kale', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272260972', 'Mahak Sharma', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272260979', 'Mohammad Arsh Mohammad Sadique Shaikh', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261238', 'Om Vijay Zotey', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272260405', 'Sai Nilesh Deshmukh', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262275', 'Shourya Pratap Singh', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262464', 'Shravan Bhagwan Patil', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261026', 'Shreya Jaiswal', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261345', 'Shwetank Kashyap', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272260932', 'Sumedh Dixit', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261973', 'Trupti Balavant Bugge', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262179', 'Utkarsh Kumar', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272262229', 'Utpreksha Mahendra Gajbhiye', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1272261416', 'Yash Bhushan Mohole', 'B.Tech Computer Science and Engineering (Cloud Computing)', '14 - FY CSE CLOUD', 3),
  ('1262261622', 'Aaditya Modi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262356', 'Akshata Sanjay Nikam', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262548', 'Alina Anthonamit Gonsalves', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261724', 'Anukalp Tibrewal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262089', 'Anushree Ankush Sawant', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262063', 'Arya Manish Tappe', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261899', 'Aryan Chetan Rasal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262002', 'Aryan Singh', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261502', 'Athashri Prakash Thakre', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262260680', 'Hitarth Chintan Shukla', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261634', 'Janhavi Sunil Bhise', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262375', 'Kaushik Surendra Hiware', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262141', 'Keyur Pramod Chaudhari', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261214', 'Komya Kirti Kumar Patel', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261609', 'Maithili Abhijeet Khiratkar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262260340', 'Megha Yogeshkumar Modi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261129', 'Neha Malatesh Mariyappalavar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262408', 'Raksha Anand Gajbi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262260337', 'Ronak Sunil Sharma', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262260166', 'Saumil Ulhas Ranade', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261691', 'Tanishka Sameer Rajopadhye', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261071', 'Urvaraj Sunil Jadhav', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262001', 'Vedant Singh Chauhan', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261796', 'Veer Jain', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262262411', 'Vishrut Rahul Vaishampayan', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262261320', 'Yug Utpal Panchal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 1),
  ('1262260630', 'Aarya Dilipchand Jaiswal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261928', 'Aditya Raviraj Gurav', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262525', 'Aditya Mahesh Chaudhari', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261212', 'Aryan Sanjeev Kamthe', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261883', 'Avinash Sarangi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262513', 'Avneesh Prasad Nair', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262260640', 'Ipshita Mishra', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261765', 'Jyot Sanjaybhai Chandan', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261680', 'Latesh Tushar Deshmukh', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261966', 'Laukik Nitin Gadiya', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261512', 'Manasi Santosh Nimbulkar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261038', 'Om Suraj Patil', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262157', 'Om Ishwar Agarwal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262463', 'Parshva Arvindbhai Ahir', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262606', 'Pranav Girish Chhatwani', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261868', 'R Srijan Reddy', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262286', 'Raj Siddheshwar Masal', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261380', 'Rugved Laxmikant Kawale', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262335', 'Sangini Akshay Mungantiwar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262262549', 'Sanjana Dalvirsingh Chauhan', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262260661', 'Sharvin Chetan Deore', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261104', 'Varad Bhaskar Khadakbhavi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1272261031', 'Varad Dnyaneshwar Kajale', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261655', 'Vishal Singh Tanwar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 2),
  ('1262261065', 'Aashi Pandey', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262543', 'Aleya Yaduvanshi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260629', 'Aniket Sarkar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262575', 'Anish Shukla', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261382', 'Arundhati Vishwajit Patil', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261187', 'Athang Anant Joshi', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261592', 'Farhan Tariq Bharde', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262262057', 'Garvit Rao', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262479', 'Harshit Ajay Shah', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262373', 'Ishaan Sandeep Dixit', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260325', 'Ishan Yogesh Kulkarni', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261920', 'Maahika Yuvraj Khanna', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260400', 'Manini Mathur', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262500', 'Mishthi Doomra', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262593', 'Pragyan Tiwary', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261704', 'Prajakta Prashant Chaudhari', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260719', 'Rishi Vicky Bhai Mehta', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261373', 'Shrawan Santosh Sawant', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262418', 'Shruti Sandeep Bonde', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262340', 'Shubham Rinku Gupta', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261874', 'Switykumari Dinesh Kumar Yadav', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262261667', 'Uddeshya Vishvkarma', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260994', 'Vedang Pankaj Itkalkar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262515', 'Vedant Vijay Kute', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262354', 'Vedika Rajesh Sagavekar', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262260664', 'Vivan Hitesh Koshiya', 'B.Tech Electronics and Communication Engineering', '15 - FY ECE', 3),
  ('1262262221', 'Akarsh Ashish Chaturvedi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262260351', 'Arjun Rajesh Nair', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261651', 'Aryan Gautam Karajkhede', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261286', 'Indraneel Amit Shelar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262260354', 'Jay Chetanbhai Datta', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262256', 'Krushna Pratap Jawale', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262516', 'Kush Virendra Hanamsheth', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261766', 'Lakshya Mehta', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261329', 'Manas Madhav Oza', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261127', 'Melvin Cherian', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261376', 'Neil Vijay Varghese', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262553', 'Om Nagesh Pawar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262501', 'Parth Rakesh Vaidya', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262316', 'Pradyun Rege', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261422', 'Pritish Nitin Mudgal', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262260673', 'Savani Sameer Kulkarni', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261468', 'Shivanjali Mahadev Powar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261608', 'Spandan Rushikesh Chaudhari', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261882', 'Tirth Tejas Chovatia', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261692', 'Vanshika Pandurang Yesade', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261151', 'Viraj Vilas Gaikwad', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262261777', 'Zayaan Ghazali Syed', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 1),
  ('1262262297', 'Aashvi Pushpak', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262508', 'Abhishek Prasad Upadhye', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261676', 'Aneesh Milind Vyawahare', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262534', 'Anwesha Nilesh Taru', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260188', 'Arnav Anurag Gandhi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260506', 'Ashish Kumar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261548', 'Bhargav Pankaj Joshi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261806', 'Divyansh Girish Kumar Chaudhary', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260736', 'Moksh Damodhar Shivankar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262025', 'Mukesh Kumar Manikant Roy', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262336', 'Ninad Mangesh There', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262150', 'Nishil Patel', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261613', 'Pracheeta Arunkumar Chandak', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260974', 'Rakshit Srivastava', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262361', 'Rujula Nana Gaikwad', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260268', 'Rutuja Prasad Kalghatgi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262262462', 'Sarthak Sachin Rochakri', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262260454', 'Shoumik Kaustubh Bedekar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261347', 'Swanand Jitendra Maheshmalkar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261251', 'Vivan Monteiro', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 2),
  ('1262261130', 'Abhijith D', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261701', 'Anish Rahul Mujumdar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262260381', 'Arush Manoj Alat', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261555', 'Atharva Lakshman Umate', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261350', 'Bhavin Mayur Sancheti', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262509', 'Chitra Narayan Kochak', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262288', 'Divija Rahul Gudadhe', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261255', 'Janhavi Sandesh Deshmukh', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262449', 'Kiranmayi Taniparthi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261782', 'Kishan Naarayanan S S', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262371', 'Mahant Prabhu Das', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261315', 'Mahir Bhushan Gandhi', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261005', 'Mayank Prithviraj Patil', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262539', 'Mitali Sachin Mutha', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261375', 'Pranav Gholkar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262260979', 'Rohan Siddharth Devasthali', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261270', 'Sanchi Sachin Patil', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261484', 'Shaurya Prakash Khandekar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261525', 'Shubham Basagonda Chhapari', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261975', 'Soham Amol Junnarkar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262262068', 'Swarada Jitendra Barve', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262260609', 'Tanaya Amarnath Selmokar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261756', 'Umaima Hatim Darugar', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261221', 'Vedant Jayesh Patil', 'B.Tech Electronics and Communication Engineering', '16 - FY ECE', 3),
  ('1262261822', 'Aayush Pawar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261438', 'Aditya Amol Utpat', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261621', 'Agrima Belchandan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262287', 'Ahmed Aazim Shahid', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261326', 'Anushka Amol Punde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262210', 'Anushka Pradip Shimpi', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262051', 'Arpit Gupta', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261353', 'Atharva Bhadale Bhadale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262260998', 'Daksh Dipesh Thakur', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262493', 'Darshil Jain', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262594', 'Dinesh Naringram Choudhari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262417', 'Harshita Durgesh Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261389', 'Kartik Bhardwaj', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262251', 'Kumkum Kaushik', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262260686', 'Medha Girish Chaudhari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261933', 'Moksha Simhadri', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261101', 'Nishad Vipul Katulwar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261275', 'Omkar Dinesh Anpat', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261941', 'Piyush Prashant Alange', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261215', 'Pratyush Pradeep Bhumkar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262260456', 'Rohan Rajkumar Belel', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261037', 'Sai Charan Venkata Ghali', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262139', 'Sanjeev Virendra Yadav', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262260991', 'Shambhavi Ballal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262560', 'Shlok Raju Dayal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262112', 'Shravani Rahul Garud', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261324', 'Shreya Sachin Chougule', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261028', 'Snigdha Parashar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262428', 'Srushti Ajay Telang', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261709', 'Tanishka Amol Shinde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262485', 'Varad Mahesh Bhosale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261607', 'Ved Sohan Nikam', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262261769', 'Vipul Vijay Jagadhane', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262066', 'Vivikth Kiran Sunkeshwari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 1),
  ('1262262325', 'Aaron Abi Varghese', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262207', 'Aarush Aniruddha Kadam', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261011', 'Aarya Ashwin Karnik', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262071', 'Abhedika Sachin Deshmukh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262105', 'Abhinav Pravin Chaudhari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261267', 'Aditi Raju Dhondge', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261200', 'Aditya Vijay Gawade', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262255', 'Aditya Kumar Mishra', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262629', 'Amit Santosh Pawar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261355', 'Ananya Richesh Singh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261293', 'Arjun Vinesh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262049', 'Arya Vikram Datar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261605', 'Aviraj Pramod Shukla', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262082', 'Chaitanya Ajay Gude', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260937', 'Harsh Sandesh Pawar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261449', 'Harshit Umesh Garudkar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262031', 'Hriday Moondra', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262195', 'Jay Vijay Rathod', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261418', 'Jeel Ketanbhai Akbari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261414', 'Kunal Pankaj Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260550', 'Mohammad Hatim Motagam', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261081', 'Ojas Shekhar Khairnar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261626', 'Parth Vijay Agale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261601', 'Rishhit Prasad', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262419', 'Riya Sunil Timmewar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262236', 'Rucha Abhishek Haldipur', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260741', 'Saachi Sarin', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260486', 'Samarbir Singh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261188', 'Sarvesh Rahul Deshpande', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262565', 'Shivam Kumar Singh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261729', 'Shubh Deepak Saklani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262262590', 'Tanvi Narendra Zinjad', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261428', 'Trisha Pravin Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260679', 'Vedant Abhishek Juvekar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262261549', 'Yashaswi Deshmukh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 2),
  ('1262260365', 'Aashman Pradeepkumar Bhutada', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260421', 'Aditya Aryan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261074', 'Advika Kedar Joshi', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262586', 'Ankush Hitesh Dubey', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261165', 'Arnav Yogesh Pandey', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262429', 'Atharv Manoj Kumbhar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262175', 'Bharatkumar Amarchand Choudhary', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261731', 'Chinmay Prashant Panchwagh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261229', 'Ira Rahul Joglekar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260247', 'Isha Arora', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262352', 'Janhavi Sandeep Deshmukh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261032', 'Jordan Kaleekal Thomas', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262259', 'Khushi Sachin Shinde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261809', 'Lymaraina Manoj Jiviam', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262625', 'Mohit Chetangiri Goswami', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262472', 'Navya Chouksey', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261711', 'Ojus Nitin Yeola', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262146', 'Paras Mohan Rajoba', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262178', 'Parth Jagdish Jawrani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260856', 'Payas Mittal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260192', 'Raghunath Ravindra Shirodker', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261388', 'Sachit Hrishikesh Thombare', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262015', 'Sagar Ramesh Ramnani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260695', 'Saranaya Ghosal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261887', 'Sejal Sandip Karbhal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261196', 'Shravani Harshal Darkunde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262294', 'Shreeya Ritesh Fating', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261061', 'Siddhi Mangesh Salunkhe', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261371', 'Swastika Dokania', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262262241', 'Tushar Jadwani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261570', 'Vaidehi Ashishkumar Nayak', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261728', 'Vedika Santosh Shinde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262260756', 'Yogit Mehta', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '17 - FY ECE AIML', 3),
  ('1262261869', 'Aarsh Atul Jain', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262521', 'Aarya Narendra Bharati', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261543', 'Adarsh Badi', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261103', 'Aditya Mandal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262367', 'Ahana Lahariya', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261473', 'Akshit Amit Kulkarni', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262510', 'Aryan Shamkant Kale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262570', 'Ashita Jain', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261100', 'Avani Kedar Patwardhan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262160', 'Ayan Kumar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261486', 'Devansh Sunil Karne', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262020', 'Dksh Vipin Hinger', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262182', 'Eshan Mohan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261384', 'Gargee Deepak Gugale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261884', 'Jashpreet Singh', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261269', 'Krishna Mahendra Vithlani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262413', 'Manjiri Kishor Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261172', 'Mohak Abhijeet Khare', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262645', 'Parth Sunil Rajput', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261678', 'Prince Manik Rahangdale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262260554', 'Rhythma Shukla', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261094', 'Rijul Rupesh Udar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261066', 'Rituraj Megharaj Pawar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262561', 'Saksham Garg', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261801', 'Sakshi Bansode', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262447', 'Shourya Jain', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261409', 'Shriya Aniruddha Karanjekar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261582', 'Sujal Suresh Rajput', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262602', 'Suraj Pramod Mete', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262093', 'Tanishka Nilesh Chavan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261904', 'Tanmay Kartik Wagdeo', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261475', 'Vedant Vinayak Velapure', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262262635', 'Yugang Gajanan Jaiswal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 1),
  ('1262261529', 'Aaryan Ghat', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261476', 'Adrian Vijay Abraham', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261333', 'Anishka Amrit Dey', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262341', 'Arjit Mehrotra', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261817', 'Arnav Prashant Ghongade', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262119', 'Arya Amol Doifode', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262456', 'Aryan Nilesh Jaiswal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261776', 'Ayushi Yogesh Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261800', 'Divya Aditya Choudha', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261790', 'Gaurava Chandra', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261898', 'Harshvardhan Avinash Kolte', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261083', 'Jiya Nikesh Raval', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262260958', 'Lakshya Sharma', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262180', 'M. Shreyam', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262088', 'Manasvi Sharanya Mattangi', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261980', 'Naitik Agarwal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261557', 'Naman Vats', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262039', 'Nandini Raut', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261504', 'Ojas Bhushan Dongare', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262260669', 'Parvathi Kavungal Manoj', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262307', 'Pushpendra Sahu', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262422', 'Rajnandini Hemant Tarwate', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262260966', 'Rishi Pradipkumar Kumavat', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262618', 'Samuel Robert Kamble', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261390', 'Sanskruti Vikas Kushare', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262262237', 'Sanskruti Rahul Tapkir', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262260738', 'Satvik Sandeep Pagar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261847', 'Shourya Rungta', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261123', 'Shurbhi Mandal', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261070', 'Swasti Shailesh Doshi', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261370', 'Tvisha Gupta', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261239', 'Vedant Harshal Nashte', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261647', 'Yashmit Yogesh Pokale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 2),
  ('1262261719', 'Aditya Sambhaji Choudhari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261659', 'Adwait Vaishampayan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262555', 'Anuj Dinesh Narkhede', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262603', 'Aradhya Deepak Jain', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261492', 'Atharv Pramod Shinde', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261265', 'Chinmay Chintamani Lonkar', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261974', 'Darshan Chenaram Chaudhary', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262474', 'Dhanush Dheeraj Kudale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262260711', 'Eshkol Godfrey Dsouza', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262401', 'Inaya Rehman', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261207', 'Kalyani Naran Tukadiya', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262260088', 'Kanav Amit Tejwani', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261445', 'Manas Deshpande', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261021', 'Navneeth K L', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261273', 'Om Laxman Jarande', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262096', 'Om Dilip Hinge', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261496', 'Pragyan Katyayan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262137', 'Prisha Mohan Shete', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262315', 'Prutha Suresh Mungse', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262362', 'Rahul Domajee Patle', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261552', 'Rajdeep Pradeep Nimhan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261481', 'Riya Yogesh Tiwari', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261679', 'Sai Surendra Soni', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261657', 'Shaarav Santosh Patil', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261437', 'Shravani Prafulla Deshpande', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262431', 'Shreyansh Shreeharsh Sahu', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261737', 'Siddhi Vivek Sharma', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262198', 'Swara Vinay Tamhan', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261266', 'Tanaya Dinesh Nirawane', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262262492', 'Tanishka Devadatta Navale', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261989', 'Vastvi Nitin Gulati', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262260133', 'Ved Vinay Kulkarni', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261060', 'Veeha Fadadu', 'B.Tech Electronics and Communication Engineering (Artificial Intelligence and Machine Learning)', '18 - FY ECE AIML', 3),
  ('1262261507', 'Aarush Manjit Jadhav', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261343', 'Adarsh Pradhan', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260526', 'Akshay Tejpal Choudhary', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261423', 'Anant Sharma', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261812', 'Arnav Kaustubh Kamerkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261962', 'Aryan Girish Suryawanshi', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262040', 'Aryan Devidas Pokharikar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262343', 'D Immanuel', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261310', 'Dheer Vijaykumar Wanwani', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260967', 'Gauraang Paragkumar Thorat', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262634', 'Harsh Tarun Sahani', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261802', 'Kartik', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261174', 'Krishna Bramha Suryawanshi', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260845', 'Mayank Manish Kolhe', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261456', 'Mitika Vikrant Maggu', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261109', 'Mrudula Pradeep Rane', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261595', 'Neel Prerak Shah', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260478', 'Paridhi Vinodkumar Budhwar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261587', 'Pratik Gurunath Bhere', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261086', 'Rudra Sachin Hinwar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262258', 'Samiksha Sachin Pawar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261558', 'Sarthak Rahul Holkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260992', 'Shlok Rupesh Ranaware', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262605', 'Shreya Sachin Domale', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260997', 'Siddhi Sandeep Patil', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261162', 'Suraj Subhash Mane', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262111', 'Swanandi Suresh Gaikwad', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262262090', 'Trisha Prafulla Mahalle', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260585', 'Vedant Nagraj Nagannawar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261520', 'Vishwatej Mahadev Gidde', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262260852', 'Yash Karabasappa Khajurkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 1),
  ('1262261250', 'Aman Srivastava', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261076', 'Archit Chandan Nene', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262272', 'Areeb Darvesh Khan', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262247', 'Aryaman Rajeev Ranjan Singh', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262262', 'Atharva Pradeep Patil', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260909', 'Gauri Sachin Shrivastav', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260369', 'Hrushal Nikhare', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261716', 'Keya Sachin Kanhe', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261830', 'Krishna Shamkant Patil', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262017', 'Krushnakant Rakesh Tarachand', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261138', 'Mayank Satish Suryawanshi', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260410', 'Mohammad Anas Arif', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261625', 'Nakul Nitin Levharkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260395', 'Neil Santosh Potdar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261988', 'Nimish Milind Mone', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261886', 'Prarthana Pradeepkumar Yadav', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261723', 'Priyanka Prakash Kadam', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262204', 'Rijul Bharat Patil', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261639', 'Sakshi Swapnil Deshpande', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262276', 'Samyak Jitendra Dongare', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260855', 'Sarthak Sanjay Elmame', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262616', 'Shaurya Sharma', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261559', 'Shourya Surve', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262262473', 'Shriya Pankaj Ejantkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261467', 'Simran Kaur Gurbachan Singh Chugh', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261656', 'Swastika Sudesh Shinde', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261405', 'Utkarsh Ramehswar Jadhav', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261513', 'Viraj Kiran Rohokale', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262260843', 'Yug Jagdish Patel', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 2),
  ('1262261944', 'Aaryan Sunil Choudhary', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262628', 'Aayushi Bhuyan', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261191', 'Aman Kumar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261921', 'Arjun Girish Nayak', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261213', 'Aryan Santosh Nere', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261741', 'Darshan Madhavrao Patil', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261227', 'Eshaan Tushar Folane', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262101', 'Harsidak Singh Gulati', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261840', 'Hatim Bohra', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261432', 'Kamal', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261044', 'Laksh Narayan Kunbi', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261811', 'Meher N Khedkar', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260648', 'Mohammed Hozefa Hilal', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261768', 'Naman Nainwani', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260653', 'Nikhil Prasad', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262177', 'Om Milind Chavan', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262388', 'Piyush Santosh Sawant', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261565', 'Prathamesh Prashant Khond', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262076', 'Prithvi Anand Rai', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261424', 'Priyansh', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262260', 'Riya Kiran Desale', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260707', 'Samruddhi Sagar Parakh', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262497', 'Shorya Chaudhary', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260746', 'Shrey Singhal', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262060', 'Siddhi Nilesh Gunjal', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262295', 'Sneha Ranjeet Ghule', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262262219', 'Soumya Milind Choudhari', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261430', 'Sujal Pradeep Goyal', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261152', 'Tanishka Rajkumar Kadam', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260627', 'Varad Vijay Deo', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262261208', 'Vishnu Ramesh Prajapati', 'B.Tech Electrical & Computer Engineering', '19 - FY E&CE', 3),
  ('1262260702', 'Abhishek Kumar Singh', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261699', 'Adyut Kumar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262248', 'Ananya Pandey', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261234', 'Arnesh Roy', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261813', 'Aryan Sanjay Kshirsagar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262480', 'Atharva Shyam Kherdekar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262320', 'Avadhoot Janardhan Kekan', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261042', 'Ayush Suresh Chougule', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262037', 'Bhavitavya Dhananjay Singh', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262260989', 'Divyansh Bhardwaj', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261289', 'Jaanavi Warlyani', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262523', 'Jayant Kumar Agarwal', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261826', 'Mayank Sandeep Modale', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262095', 'Mohan Saurabh Jalgaonkar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262260552', 'Nihar Sanjay Shimpi', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261008', 'Rishi Kalra', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262468', 'Sagar Ramu Dhangar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262069', 'Sanyam Vikram Sharma', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261366', 'Sarvesh Deshmukh', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261854', 'Shuban Kumaar Salunkhe', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262174', 'Shweta Shantaram Dadghaye', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262346', 'Soha Tariq Bootwala', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262262244', 'Srujan Ghansham Ugale', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262260650', 'Sumbly Vivek Harshil', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261279', 'Vedant Santosh Tandale', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261030', 'Zidaan Bilal Attar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 1),
  ('1262261931', 'Aarya Suhas Bawker', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261805', 'Achint Aggarwal', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262404', 'Aditi Vishal Jagtap', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262274', 'Ajmeera Nachiket Naik', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261118', 'Akshita Sisodiya', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260977', 'Arav Sharma', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260359', 'Arya Yogesh Apte', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262201', 'Aryan Sandeep Ghumare', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261169', 'Atharva Avinash Ghogare', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261856', 'Gargee Chandrashekhar Bhalerao', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260722', 'Harshil Patel', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260716', 'Hemang Bothra', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261323', 'Kanad Prasad Kantak', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260378', 'Mayuresh Pravin Patil', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261708', 'Parth Manoj Chorge', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261994', 'Parth Akash Jadhav', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262366', 'Ritvika Bokade', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261787', 'Ritwik Bali', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262202', 'Sai Mahesh Vyavahare', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261352', 'Samarth Ganesh Jadhav', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262261841', 'Shravani Shekhar Kharde', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262260450', 'Tanvi Sandeep Chougule', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262526', 'Tushita Basantani', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262395', 'Varun Sameer Dahake', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 2),
  ('1262262522', 'Aayush Prashant Patil', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261050', 'Aditya Singh Rajawat', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261537', 'Adwit Aryan', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261367', 'Arnav Rajan Thorat', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262262142', 'Aryan Anil Sangle', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260353', 'Astha Saravat', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261153', 'Atharva Sachin Kolhe', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261597', 'Dhruv Badal', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260943', 'Gaurangi Bagla', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261159', 'Harshit Snehalkumar Punamiya', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261710', 'Iraa Balkrishna Shelar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262262544', 'Izaan Akhtar Shaikh', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262262118', 'Kaushal Prashant Bodhe', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260578', 'Kaustubh Anil Sonar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260721', 'Khush Yogeshbhai Aghara', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261413', 'Mythili Mitesh Patel', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261014', 'Pranaya Amol Malokar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260988', 'Prathmesh Sainath Hangirgekar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261434', 'Rucha Sandeep Hartalkar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261930', 'Saanvi Sandip Kute', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261063', 'Sarthak Avinash Chaudhari', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261029', 'Shaunak Yogesh Khardikar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261435', 'Shriniwas Govind Gawande', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262262243', 'Siddhanth Krishnan', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261056', 'Sparsh Akshay Shah', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262260452', 'Taran Kamtikar', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261852', 'Vidhit Mahesh Kore', 'B.Tech Electronics (Semiconductor and VLSI Design)', '20 - FY SEM VLSI', 3),
  ('1262261161', 'Abhir Mahesh Deshpande', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260500', 'Adwaiya Tushar Narkhede', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261575', 'Arya Ajay Daundkar', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262262296', 'Arya Pravin Deshmukh', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1272261387', 'Bhoomi Mahendra Patel', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262262365', 'Dnyaneshwar Balasaheb Katkade', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262262491', 'Harsh Vardhan Nehra', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261902', 'Ishan Vivek Avachat', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261748', 'Mahek Mayur Makadia', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260617', 'Mann Mukesh Agarwal', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262262319', 'Mrugaja Devendra Patil', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261863', 'Prathamesh Hanumant Badge', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260647', 'Prayag Yogesh Joshi', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261793', 'Rishid Shailendra Dubey', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261471', 'Samarth Vinay Tapdiya', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261497', 'Shreeda Milind Baxi', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261671', 'Shruthi S', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261511', 'Sukhad Sandeep Birwadkar', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261099', 'Suyog Nilesh Shinde', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261000', 'Sydelle Stanley', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260726', 'Udeet Ammolh Sanas', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261993', 'Urvish Maslekar', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262262097', 'Vedashree Shrikant Joshi', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260434', 'Yashivdev Puthiya Veettil', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262261673', 'Zaid Abdul Wahid Shaikh', 'B.Tech Renewable Energy Engineering', '21 - FY REN ENE', 1),
  ('1262260984', 'Aadityaraje Sanjay Desai', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261080', 'Aditya Sudhir Bharambe', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262396', 'Adwait Nikhil Lonikar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261041', 'Alok Dayanand Vangari', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261016', 'Arnav Hastak', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262484', 'Arrya Abhishek Bavadhankar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261247', 'Atharva Rahul Pawar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261903', 'Bhavya Santosh', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262504', 'Dhairya Haresh Rajput', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262260158', 'Ekagra Kapoor', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262323', 'Gyanbir Singh Sahney', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261141', 'Jay Pavankumar Patodi', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261479', 'Jeet Niraj Mody', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261453', 'Manav Sunil Gopal', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261973', 'Mohan Raitani', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262610', 'Neil Bhushan Wavikar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262260880', 'Nilay Nitesh Waghode', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261356', 'Pulkit Nandkumar Jaithalia', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262579', 'Purnanand Mukund Pohakar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262260698', 'Rishabh Mahesh Nikam', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261509', 'Sahil Shailesh Joshi', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262260670', 'Samarth Santosh Jadhav', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261058', 'Shreeram Narasimha Raichur', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262464', 'Shreyansh Vats', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261396', 'Shriyash Uttam Patil', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261996', 'Siddhant Sumit Dandekar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261018', 'Siddharth Chandrashekhar Dere', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262260655', 'Sriyansh Kumar Singh', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261248', 'Sushrut Shantanu Adhe', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261131', 'Tanushree Santosh Patil', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262261128', 'Varad Keshavprasad Hosur', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262021', 'Vishwajit Jitendra Dhurjad', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262260476', 'Zoaib Bhimji', 'B.Tech Mechanical Engineering', '22 - FY MECH', 1),
  ('1262262370', 'Aarav Jignesh Gandhi', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261742', 'Aayush Mahendra Pawar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260134', 'Aditya Vijay Chavan', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261098', 'Akhilesh Jitendra Patil', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261772', 'Amogh Abhinay Deo', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262013', 'Anantt Vishwajeet Kamble', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260602', 'Archit Sumit Save', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261190', 'Arshaan Ladlemashak Choudhari', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262621', 'Aryan Ashish Shetye', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260971', 'Ayden Ambrose', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261429', 'Dev Ajit Bache', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262430', 'Harshada Indrajeet Chandgude', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262070', 'Khush Verma', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261348', 'Krishna Vilas Kirdak', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261900', 'Meghnav Oodunt', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262206', 'Mohak Batham', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260723', 'Mustafa Husain Mhowwala', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261815', 'Om Mahesh Jadhav', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261466', 'Prachi Pandurang Raut', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262478', 'Prathamesh Amar Zavar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261781', 'Rajas Sandeep Sabale', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261669', 'Rohan Rajesh Shinde', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261814', 'Sairaj Baban Mutke', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261798', 'Sanay Gupta', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261312', 'Sejal Kaur', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260373', 'Shreya Nilesh Ghodnadikar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261135', 'Shuban Prashant Khadji', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261901', 'Silroy Palha', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262499', 'Sujay Dhawade', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262378', 'Swarnit Ashish Kulkarni', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262262598', 'Tanishq Rajendra Mendigiri', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262260962', 'Vedant Prasad Dhumal', 'B.Tech Mechanical Engineering', '22 - FY MECH', 2),
  ('1262261441', 'Abhinav Vinod Menon', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261205', 'Aditya Ajay Ghorpade', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262260651', 'Aneeket Kale', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261112', 'Arib Nadim Dawe', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261379', 'Atharav Dhananjay Bhairavkar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262387', 'Atharv Shashank Gunjal', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262461', 'Brajesh Pravin Bang', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262291', 'Chetan Channabasavanna Mangalore', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262260969', 'Haresh Rishikesh Sane', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261824', 'Jainam Deepak Ranka', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262632', 'Jay Hirenbhai Morabiya', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261115', 'Mahi Devendra Sonsare', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261346', 'Mohammad Zaid Sayed', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261586', 'Neil Shailesh Parulekar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262009', 'Niharika Nitin More', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261125', 'Parth Narendra Chavhan', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262200', 'Parth Singh', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261055', 'Pranshu Prashant Jha', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261337', 'Rajveer Rahul Kadam', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261652', 'Rupareliya Parthiv Rajeshbhai', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262018', 'Saiaditya Singanamala', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261740', 'Samaraditya Sanjay Jagtap', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262260844', 'Shaswat Kumar Shah', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261707', 'Shourya Anantsagar Medshinge', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262559', 'Shravan Yogesh Dasgude', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262260087', 'Shreyas Prachetas Kale', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261336', 'Shubham Rajesh Mallah', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262083', 'Soham Vilas Nalavade', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262261556', 'Tanishka Kiran Wakhare', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262242', 'Tanmay Prashant Kowadkar', 'B.Tech Mechanical Engineering', '22 - FY MECH', 3),
  ('1262262611', 'Aaditya Nilesh Sangwai', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261186', 'Aashman Rupesh Musale', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262260636', 'Aditya Kumar Sehra', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262188', 'Aditya Rajesh Savadi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261416', 'Aman Nachiket Bamb', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262263', 'Anish Dattatray Gavane', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262260374', 'Felix Siby Kurian', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262502', 'Harsh Kiran Yadav', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261446', 'Harshvardhan Santosh Chaudhari', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262260226', 'Jyotiraditya Dhairyasheel Khot', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261619', 'Meet Sagar Jage', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261703', 'Om Navin Sharma', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262481', 'Omkar Pankaj Bhardwaj', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261926', 'Pawan Kailas Dighe', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261550', 'Radha Rahul Satpute', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262588', 'Rishi Warale', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261226', 'Riya Rahul Date', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261302', 'Sahithi Goldsmith', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261198', 'Samiran Abhijit Dadegaonkar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261627', 'Sarvesh Milind Dole', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262260622', 'Shrestha Tripathy', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261049', 'Shreya Kumar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261542', 'Shruti Amol Kalgaonkar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262369', 'Siddhant Swapnil Patil', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262313', 'Soha Salil Koli', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262265', 'Spandan Annasaheb Bhor', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262262506', 'Stalin Johnson', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262012', 'Tanmay Rajendra Shitole', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262197', 'Varad Ojha', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261092', 'Varun Brijesh Kalore', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262405', 'Vatsal Prakash Patil', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262262159', 'Yuvrajsinh Chavda', 'B.Tech Mechanical Engineering', '23 - FY MECH', 1),
  ('1262261412', 'Aditya Vaibhav Shinde', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262550', 'Akshaya Venkatesh Iyer', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261374', 'Anaya Samir Boghara', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262190', 'Ansh Ravindra Dusad', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262079', 'Anshika Sushil Singh', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261369', 'Arhan Puneet Rastogi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261116', 'Aryan Maheshkumar Jagtap', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260947', 'Atharva Tripathi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262627', 'Avani Rahul Lakshetti', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260957', 'Ayush Kunal Dedge', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260993', 'Durva Ganesh Darban', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262498', 'Ikshita Raina', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260488', 'Jahanvi Vijit Ved', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262042', 'Janhavi Prasanna Godbole', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261689', 'Kunal Ganesh Patel', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260955', 'Mihir Paresh Raithatha', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262427', 'Nishant Dharmendra Singh', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260367', 'Parth Sachin Pednekar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262231', 'Parth Amol Patki', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261439', 'Rajas Makarand Athavale', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261136', 'Romir Jaiswal', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260840', 'Sankalp Dwivedi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261431', 'Sanvi Sachin Gawade', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260778', 'Shain Elijah Marie', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262000', 'Sharvil Nitin Deodhar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261317', 'Shreyansh Ganesh Zarkar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261072', 'Shubham Nilesh Patil', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261541', 'Simran Sachin Paranjpe', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261022', 'Tanish Bhupendra Mendhura', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261536', 'Varad Mangesh Kulkarni', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262261697', 'Vedant Pravan Thorat', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262475', 'Vedant Sharad Kute', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262262326', 'Vibha Vivek Ghatge', 'B.Tech Mechanical Engineering', '23 - FY MECH', 2),
  ('1262260507', 'Abid Mohmed Zakria', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261093', 'Anish Sudhir Bhole', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261444', 'Arnav Deshpande', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261048', 'Azlaan Yusuf Khan', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261690', 'Dhruv Rajesh Manurkar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260449', 'Divyanga Pratim Dowarah', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261663', 'Jayesh Bharat Arya', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262465', 'Kaustubh Dipak Nigade', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260424', 'Mamidi Vilok Reddy', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260379', 'Mohammed Rehan Khan', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262184', 'Neev Mittal', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260652', 'Nikhil Vijay Palwe', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260589', 'Om Shrikant Deshpande', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261201', 'Parth Prashant Mali', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261803', 'Pradnesh Mahesh Chavan', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261834', 'Pranshul Salunkhe', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261599', 'Rayirth Manish Sharma', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261133', 'Rushikesh Rahul Kale', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261661', 'Saket Govind Agrawal', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262293', 'Shashwat Amit Ghaisas', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262022', 'Shaunak Amit Tembhurnikar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260983', 'Shaurya Sandesh Khedekar', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261791', 'Shivam Ravindra Halkatti', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261364', 'Shreyash Shirish Suryawanshi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261387', 'Siddarth Nair', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260371', 'Soham Naresh Sonone', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260288', 'Tanmay Prachi Joshi', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261354', 'Varad Prasad Kulkarni', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262496', 'Vedaant Gajanan Prabhu', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262260743', 'Vikhyaat Thapa', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262262600', 'Viraj Mandar Patil', 'B.Tech Mechanical Engineering', '23 - FY MECH', 3),
  ('1262261017', 'Aarein Gaurav Karhadkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261985', 'Aaryan Dilip Gangras', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261562', 'Abbhinav Sunil Shinde', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261211', 'Advait Ajit Dharap', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261838', 'Aniket Devadiga', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260246', 'Arjun Virendra Salvi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262587', 'Bhavi Nilesh Shah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261848', 'Bhoomika Prasad Modak', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262576', 'Harshit Vijay Mishra', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261934', 'Himesh Sohanlal Choudhary', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260713', 'Ishika Subhashchandra Yadav', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261505', 'Krushnakant Chandrakant Chavan', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261220', 'Mohammed Ayaan Imran Parwani', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260588', 'Paras Pratap Salunkhe', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260430', 'Poorwa Sandeep Jambhulkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260683', 'Raaid Sharique Pathan', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262056', 'Rajat Chandrakant Gugale', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262260458', 'Rishabh Jayesh Surani', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261268', 'Saanvi Arora', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261249', 'Sarthak Jagadish Soundalgekar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261819', 'Siddharth Ritesh Birari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262494', 'Stavya Shankar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261672', 'Steven Vijay Monteiro', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261243', 'Vaishnavi Dattatray Kad', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262321', 'Vedant Rupesh Pawar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262261271', 'Vishal Rajeshkumar Manglani', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 1),
  ('1262262517', 'Aaron Jerry Varghese', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262270', 'Abhay Raj', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261858', 'Abid Amjad Banedar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262595', 'Aditya Digambar Katore', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261385', 'Ahan Atul Kardile', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261547', 'Ansh Nitin Dhembare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262073', 'Anuj Ramchandra Kalaskar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261295', 'Arnav Mahesh Gosavi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261571', 'Bharat Amit Jangid', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261105', 'Devashish Sachin Kavishwar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261563', 'Hardik Kiran Patil', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262169', 'Hemant Rana', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261069', 'Jay Hitesh Gandhi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261961', 'Jessica Anil Jain', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262213', 'Kanak Abhijeet Kanade', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262148', 'Manthan Ramesh Jadhav', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261732', 'Naman Jethi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262260715', 'Parth Pipaliya', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261231', 'Prem Mangesh Nimbalkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262260319', 'Raunak Ravindra Kulkarni', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261148', 'Sakshi Vinayak Mahamuni', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262262331', 'Sanika Sunil Chandurkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261292', 'Shardul Atul Lhayakar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261795', 'Soham Anand Sonna', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262260386', 'Ubai Hatim Partapurwala', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261514', 'Vedant Sanjay Kadam', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261025', 'Yadnya Nitin Tarte', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 2),
  ('1262261351', 'Aarush Vinayak Chavan', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261604', 'Aditya Dipak Bhole', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261501', 'Aman Sarika', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262048', 'Angel Ajay Jain', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261062', 'Ansh Gupta', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262538', 'Arash Siddheshwar Andhale', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261218', 'Archin Abhay Joshi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261654', 'Aryan Vaibhav Joshi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261564', 'Bhavya Rahul Trivedi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262047', 'Diva Ashish Khandelwal', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262377', 'Eshan Rajesh Khole', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261003', 'Harshvardhan Sachin Kadam', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262445', 'Hrushikesh Dnyaneshwar Mankari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261415', 'Joel Franki Pinto', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262311', 'Manthan Kiritkumar Panchal', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262072', 'Nemai Pal', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261885', 'Nitya Viralbhai Shah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261209', 'Parth Mukesh Deshpande', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262260135', 'Richie Joy Hiwale', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262162', 'Riddhima Pravin Mhaske', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262260975', 'Rudrasen Vishwajeet Shinde', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261087', 'Sanjeet Chetan Kurkure', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262260324', 'Soham Shirish Lele', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262262613', 'Soham Sandip Kadam', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261949', 'Soumik Sachin Pathak', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261913', 'Veeghnesh Rahul Nalawade', 'B.Tech Mechanical Engineering (Robotics and Automation)', '24 - FY MECH ROBO', 3),
  ('1262261864', 'Abhay Dinesh Pardeshi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261126', 'Advait Dani', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262332', 'Ameya Mandar Joshi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260976', 'Anish Swapnil Attarde', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260689', 'Arnav Manish Vaidya', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262251330', 'Ashutosh Sanjay Bhalghare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261955', 'Atharv Makarand Apte', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261106', 'Ayush Dheeraj Birajdar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260285', 'Deepanshu Ajay Lokhande', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261593', 'Hamshad Majid Jamadar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260972', 'Jaival Vimal Shah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262584', 'Jinay Bhavesh Shah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262005', 'Kush Keshar Mahar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261630', 'Mrunali Pradeep Shinde', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260729', 'Parina Paritosh Gombi', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260370', 'Rachit Mukesh Kothari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261002', 'Rishi Amit Sankpal', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261844', 'Sairaj Sharda', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261425', 'Shambhavi Nilesh Bharekar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262380', 'Swanand Milind Hardikar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262128', 'Taher Ali Mudris', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262054', 'Vaishnavi Tanaji Balgude', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260935', 'Varun Vishwas Nagawade', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262260462', 'Vrushabh Bharat Wagadare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262262505', 'Yash Ganesh Kubde', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 1),
  ('1262261508', 'Aarush Nitin Pohare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261478', 'Adhiraj Ravindra Wale', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262260457', 'Alvis Binu Raj', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261610', 'Ansh Vijay Barhate', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262102', 'Avani Amol Borkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261045', 'Bhargav Chetan Karmarkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262299', 'Dharmendra Suthar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261786', 'Dhruv Girish Patil', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262368', 'Kavya Mayuresh Rashinkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261192', 'Mihir Rahul Apte', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261991', 'Neil Deepak Saharkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261426', 'Nikunj Manish Sah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261281', 'Parth Amit Gundecha', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261180', 'Prisha Sanjay Patil', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262591', 'Rohit Prashant Lingayat', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261943', 'Roodra Arvind Mehta', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262260481', 'Rudra Abhijit Pagare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261001', 'Sanchit Yugesh Deshpande', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262134', 'Sayan Krishanu Roy', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262260336', 'Sharneet Singh Makhija', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261837', 'Soham Jagdish Talole', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262355', 'Varad Sayalee Pathak', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261696', 'Vedant Mahesh Utekar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262262569', 'Vishwanand Kailas Idhole', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261173', 'Yug Manoj Thakkar', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 2),
  ('1262261442', 'Aarya Shivgir Gir', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261807', 'Aditya Shantanu Parvati', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261567', 'Archis Aniket Gokhale', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262223', 'Arnav Raj Yadav', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261797', 'Atharva Parag Kulkarni', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262260708', 'Ayaan Amjad Khan', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262620', 'Ayush Sudhir Tiwari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261443', 'Bhoomi Dipen Gogari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261524', 'Divyesh Prakash Kunder', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261121', 'Isha Bhushan Chikate', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261735', 'Kaustubh Bhargava', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262551', 'Mizan Mohd Ansari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261006', 'Mohammad Ali Mazhar Momin', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261294', 'Omkar Pandurang Sawant', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261144', 'Parv Avinash Engla', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261527', 'Priyesh Amarsinh Dhemare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262098', 'Raj Pravin Deore', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261318', 'Rujula Vivek Dange', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262389', 'Saifuddin Ziauddin Ansari', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261977', 'Shaurya Uday Kad', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261020', 'Shubham Ranjit Shingare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262262309', 'Soham Pankaj Thakare', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262260165', 'Soumil Santosh Jagtap', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261457', 'Utkarsh Milind Dhumal', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262260693', 'Vihaan Bijal Shah', 'B.Tech Mechanical Engineering (Robotics and Automation)', '25 - FY MECH ROBO', 3),
  ('1262261091', 'Akanksha Shivalingam Bale', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261079', 'Arjun Anup Arbale', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262260197', 'Aryan Rahul Kondekar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262622', 'Atharva Vilas Sanap', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261363', 'Bhargav Bharat Bhosale', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261499', 'D Pavin', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261155', 'Deshna Pravin Shingi', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261450', 'Ira Ramakant Kokate', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261059', 'Janyadith Iyer', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261465', 'Mohit Kedar Rathod', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262181', 'Neel Jagtap', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262011', 'Nihar Sumant Kulkarni', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261816', 'Nitya Nandan Mishrikotkar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261736', 'Rhythm Dharmendra Rajyaguru', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262487', 'Rishi Yogesh Shinde', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262260727', 'Ritesh Ramesh Shinde', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262260657', 'Ruhaan Sanjay Nagdev', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261702', 'Sanika Chetan Yeole', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261398', 'Shreyas Shriram Somani', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261686', 'Soham Chandrakant Bhairavkar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262308', 'Sohni Gupta', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261223', 'Tejaswini Tejas Kulthe', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262262541', 'Vineet Ritesh Pitale', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262261540', 'Vishal Gilda', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262260656', 'Zainali Sirajhusen Virani', 'B.Tech Chemical Engineering', '26 - FY CHEM', 1),
  ('1262260204', 'Anshul Anand Upadhye', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262304', 'Anusha Yogesh Bhojane', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261722', 'Arnav Taraiya Jain', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262260990', 'Athang Ashish Pathak', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262260645', 'Burhanuddin Zoaeb Pithawala', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262562', 'Chaitanya Dattatraya Jawalkar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262260981', 'Ishaan Vineet Purohit', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262144', 'Juveriya Khalil Chauhan', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262314', 'Kartik Vinit Gadgil', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262059', 'Kushagra Singh Verma', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262260694', 'Manthan Vijay Mandilkar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261339', 'Muktai Bharat Hirave', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262527', 'Nihal Vilas Varade', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262196', 'Pralhad Gururaj Kulkarni', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261474', 'Rajlakshmidimble Nilesh Dimble', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261410', 'Riddhi Nitin Mandlik', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261876', 'Saksham Pramod Paygude', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262260339', 'Shaurya Gupta', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262122', 'Shruti', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261612', 'Siddharaj Basavaraj Patil', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261254', 'Sruja Manoj Sontakke', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262261774', 'Vaishnavi Dinkar Shinde', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262592', 'Yash Sandip Pawar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 2),
  ('1262262275', 'Abhishek Sanjay Patil', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261649', 'Anvi Amol Ammannavar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262260404', 'Aryan Jignesh Gamdha', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261588', 'Aysha Renna', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261097', 'Chinmay Umesh Khadgi', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262171', 'Dipesh Sharad Nikam', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262540', 'Harsh Daharwal', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262260917', 'Ishita Beohar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262312', 'Kanishk Jain', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261544', 'Mayank Giri Goswami', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261890', 'Naman Thakur', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262490', 'Nishtha Mehulkumar Solanki', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261358', 'Rajveer Shivaji Jadhav', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262260734', 'Rishabh Kiran Kadam', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261342', 'Rudra Deepak Tamhankar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262421', 'Shorya Ashok Pawar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261455', 'Shreyas Samir Gore', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261620', 'Siddhi Sudhir Gupta', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262614', 'Srujani Maruti Yadav', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262585', 'Sujal Gajanan Kharate', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262254016', 'Tanishka Anilkumar Janbandhu', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261344', 'Tanishka Rajendra Patil', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262260690', 'Vedant Kedar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262262183', 'Vedant Pareshbhai Gujjar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262261433', 'Yojit Kailas Shivekar', 'B.Tech Chemical Engineering', '26 - FY CHEM', 3),
  ('1262260973', 'Aadhitiya Ashmit Kulai', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262637', 'Atharva Satish Pandit', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262531', 'Ayush Giri', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262262476', 'Chinmay Rohit Nagare', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261401', 'Disha Sudhir Deshmukh', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262260662', 'Jay Rajendra Patil', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262338', 'Kush Agarwal', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261261', 'Malhaar Gunjal', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261464', 'Prajwal Ravindra Adage', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262029', 'Prasad Vivek Dhoble', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261345', 'Sarthak Santosh Pawar', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261206', 'Sayee Mandar Joshi', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261403', 'Shven Edrich Dmello', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262261493', 'Siddhant Santosh Chopda', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262199', 'Vighneshwar Vinod Singh', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262260182', 'Viraj Vijay Galande', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262004', 'Vishwanath Shankar Upadhyay', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 1),
  ('1262262064', 'Aarnavi Manohar Shimpi', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261675', 'Arjun Rambhau Gitte', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261421', 'Gargi Umakant Savdekar', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262469', 'Gulfisha Choudhari', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262260666', 'Jeevan Dilip Salke', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262489', 'Nidhi Dinesh Rathod', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262044', 'Ojas Hanmant Chavan', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261399', 'Piyush Laxman Kale', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262400', 'Rhythm Amish Golechha', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262260688', 'Rugved Prakash Bodade', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261694', 'Shrnay Vikrant Shinde', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261914', 'Shweta Vinod Rode', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262640', 'Shwetank Shekhawat', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261635', 'Soham Sagar Khot', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262514', 'Sumedh Dhanraj Naik', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262261113', 'Trisha Roy', 'B.Tech Materials Science & Engineering', '27 - FY MSE', 2),
  ('1262262642', 'Amasio Toca Tchissapa Chicolassonhi', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261983', 'Anzar Muzammil Shaikh', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261598', 'Arnav Gupta', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261262', 'Atharva Shivaji Mule', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261085', 'Avishakar Vijaykant Haware', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261637', 'Clemilde Moura', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262262268', 'Devyani Rahul Pawar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260157', 'Divyansh Changotra', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260460', 'Idris Mohammed Dohadwala', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261946', 'Ishwari Vijay Mane', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261733', 'Krishanpal Singh', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261576', 'Mahroof Rafiq Gangrekar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261530', 'Manushree Saini', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262262337', 'Mobaraa Zaher Ezaldeen Altayeb', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260717', 'Prathamesh Pravin Shah', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260366', 'Ritesh Chandresh Sharma', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260913', 'Shaik Taha', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261693', 'Shlok Jain', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262262058', 'Shravani Sudesh More', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261139', 'Tanishka Sambhaji Rajebhonsle', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261624', 'Tanmay Rajendra Kale', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262260429', 'Yuvraj Manoj Nigadkar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 1),
  ('1262261616', 'Akul Dev B M', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261909', 'Arpit Amit Thakare', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262529', 'Atharva Pravin Yesade', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260164', 'Basil Tanveer Ahmed Aslami', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261500', 'Darshita Holkar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261256', 'Ebin Binoy', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260714', 'John Halberston Correya', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261114', 'Laukik Vaibhav Dalal', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260631', 'Maanya Kumar Parmar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262426', 'Manthan Dipak Rathod', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262003', 'Mohd Adeeb Khan', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262626', 'Mohit Gurjar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260613', 'Mudit Mohan', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262217', 'Parth Ravindra Phalke', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260244', 'Pritam Kumar Mohanty', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261959', 'Rhugved Sandeep Navale', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260614', 'Rudraneel Sinha Roy', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261257', 'Shaikh Mohammed Amaan', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262260964', 'Soham Shrikrishna Adhav', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262399', 'Swaastik Yogesh Patil', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261925', 'Vedant Pradeep Lokhande', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262261589', 'Vishikha Ketan Prajapati', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 2),
  ('1262262451', 'Aabha Abhay Limaye', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261585', 'Anuradha Rambhau Gitte', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261408', 'Arush Renesh Nambiar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261799', 'Bhavesh Anil Khole', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261668', 'Deepak Dangi', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260674', 'Gunjot Singh Kalra', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261648', 'Kiran Navnath Tawale', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262262034', 'Kshitij Suhas Salunkhe', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261321', 'Manthan Abaji Awari', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260633', 'Parnika Raj Takkekar', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261851', 'Punit C', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262262250', 'Purva Uday Shingote', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260178', 'Safal Yadav', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262262077', 'Sayam Bhattacharjee', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260712', 'Shervin Vinod Varghese', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262262303', 'Shreyas Sureshrao Mundhe', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261090', 'Soham Ravindra Thite', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260939', 'Sujal Sachin Kokate', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261956', 'Vallabareddy Charan Teja Reddy', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262262566', 'Ved Yatinbhai Patel', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262261440', 'Vivaan Gupta', 'B.Tech Petroleum Engineering', '28 - FY PETRO', 3),
  ('1262260387', 'Aadya', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261755', 'Advik Praveen Patil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262092', 'Anandan S Iyer', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261197', 'Aryan Vijay Deore', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262415', 'Daksh Kala', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262262386', 'Darshan Mahavir Surana', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262329', 'Dhawal Rahul Shinde', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262483', 'Dhruv Rajesh Jadhav', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262345', 'Harsh Randhir Sawarkar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262226', 'Ishant Nitin Pawar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262596', 'Kaivalya Amol Amlekar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261283', 'Mayuresh Madhukar Jadhav', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262238', 'Meghraj Yogesh Barate', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262260422', 'Nishid Vasanta Gahane', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261614', 'Parth Pandit Ingole', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261175', 'Pranav Ramkrishna Kumbhar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261297', 'Prem Pradeep Chavan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261485', 'Samruddhi Laxmikant Kulkarni', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261643', 'Sarthak Harish Kale', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262135', 'Shantanu Virendra Lande', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261617', 'Sharveen Pratap Jadhav', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261747', 'Shree Nitin Hendre', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261361', 'Soham Sameer Paygude', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261280', 'Swaraj Ramesh Kirve', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261313', 'Swaraj Santosh Babar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262260980', 'Tanmay Sanjay Sathawne', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261031', 'Viraj Umesh Kirve', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262261491', 'Viraj Krishna Pawar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 1),
  ('1262262641', 'Adarsh Rishikesh Chaubey', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262580', 'Aditya Ganesh Chavhan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262385', 'Akshad Pavan Chhittarka', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261299', 'Ansh Sunil Agarwal', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262235', 'Appasaheb Rahul Thorat', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262376', 'Atharv Madhav Modshe', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261235', 'Avanish Santosh Gawade', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262147', 'Ayush Umesh Chaudhari', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262260269', 'Granth Jain', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261763', 'Krishna Manoj Patil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261759', 'Mohit Anil Mahajan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261681', 'Nityam Jaiswal', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261997', 'Parth Rajkumar Soni', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262410', 'Parth Jagdish Borade', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261820', 'Piyush Rahul Kadam', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262260467', 'Rajveer Yashvant Deshmukh', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261199', 'Roshan Balaji Jadhav', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262298', 'Runayraj Prasad Salunkhe', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261629', 'Sanidhya Nitin Patil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261924', 'Sanskar Vishnu Arjun', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262260963', 'Sarthak Sugriv Nimbalkar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262310', 'Selomon Bagang', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262260676', 'Shivraj Girish Jagtap', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262260951', 'Shreyas Sopan Ghadge', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262133', 'Siddhi Harish Bharde', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261377', 'Sujal Vinod Chavhan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262100', 'Sunehri N Sawant', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261572', 'Swaroop Amol Bhilare', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262261282', 'Ujjwal Ramesh Kadam', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262552', 'Vedant Gopal Rathi', 'B.Tech Civil Engineering', '29 - FY CIVIL', 2),
  ('1262262390', 'Aditya Dilip Nagdev', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261447', 'Adtiya Nitin Jadhav', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262240', 'Anmol Sudhir Mahajan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261404', 'Anushka Tulshiram Shahane', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262154', 'Chaitanya Somnath Shedge', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1272260350', 'Harshwardhan Keshav Wable', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261166', 'Jaysinh Sandeep Chavan', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261632', 'Krishna Amit Rathi', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262470', 'Krushna Shashikant Boraste Boraste', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261761', 'Nidhi Sunil Bhombe', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261916', 'Parth Yogesh Vairagade', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262339', 'Piyush Kishor Chaudhari', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261276', 'Prasad Prakash Garadepatil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262269', 'Prathamesh Mahadeo Dahatonde', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261298', 'Pratik Gangadhar Pitlewad', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262260357', 'Saee Sagar Karale', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261010', 'Sarang Ravindra Pawar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261631', 'Saumya Santosh Maloo', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262075', 'Shantanu Vijay Salunkhe', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261458', 'Shravani Bhausaheb Idhate', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261228', 'Shreyash Balaji Sanap', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261990', 'Shriram Vikrant Mahale', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261891', 'Sohan Rajendra Karande', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262151', 'Srushti Sandeep Kachi', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262260352', 'Suryaraj Yuvraj Mhetre', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262260699', 'Tanishq Tanaji More', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262260638', 'Varun Anil Patil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262381', 'Yashodip Rajendra Patil', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262262578', 'Yathaarth Nilesh Zawwar', 'B.Tech Civil Engineering', '29 - FY CIVIL', 3),
  ('1262261149', 'Aayush Jagdale', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261950', 'Abhilesh Nilesh Gandhi', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261986', 'Aditya Naresh Pathak', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262026', 'Ameya Avadhut Madan', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261877', 'Anuj Rajesh Sanap', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261420', 'Aryan Balaji Kachare', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261717', 'Darsh Amit Kabara', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261278', 'Durvang Mangesh Chinchwade', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261726', 'Ishaan Ajay Bathe', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262619', 'Kaushal Hemraj Bomble', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261277', 'Kaustubh Tushar Sonawane', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261846', 'Krishna Govind Deshmukh', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261591', 'Mohit Dattatray Bhujbal', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261477', 'Parth Chetan Chauhan', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262471', 'Prathamesh Santosh Panchal', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261919', 'Pruthviraj Nitin Shewate', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261551', 'Rohan Srinivasulu Mekala', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262557', 'Sanika Amol Shelar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262260342', 'Saransh Sandeep Gupta', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262233', 'Shivendra Ujwal Patil', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262260586', 'Shobhit Gupta', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262261448', 'Soham Sameer Sadavarte', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262266', 'Somnath Bharat Jadhav', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262392', 'Suparshwa Shital Gat', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262260184', 'Yash Madhav Patil', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262061', 'Yash Somnath Bhise', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262067', 'Yashraj Balasaheb Sarje Patil', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 1),
  ('1262262567', 'Aaryan Munna Singh', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262232', 'Abhishek Abhay Deshpande', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262564', 'Aditya Surendrakumar Soni', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261088', 'Anirudh Krishnat Kanase', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261992', 'Anshul Balaji Billarwar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262583', 'Anushka Pratap Magar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261372', 'Archit Atul Kudtarkar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261470', 'Aryan Manoj Shinde', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261758', 'Dev Dattaray Kamthe', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261818', 'Eknath Khandaker', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262289', 'Harsh Shekhar Mutha', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262260970', 'Jay Manoj Patil', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261646', 'Kaustubh Shrikant Patil', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261981', 'Kshitiz Kumar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262488', 'Mihir Manoj Kaushik', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262612', 'Om Chhagan Kodag', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262397', 'Piyush Sitaram Wanve', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262260310', 'Rahul Shankarrao Shendage', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262261566', 'Rudraksh Prashant Ganmukulwar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262636', 'Sarthak Ravindra Bhawar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262260607', 'Sarvagya Nand', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262467', 'Shree Shivaji Habale', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262023', 'Shreyas Vijaykumar Pharande', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262350', 'Shreyash Sharma', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262227', 'Ved Vijay Sonawane', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262260701', 'Yashraj Ganesh Bhoi', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 2),
  ('1262262261', 'Abhinav Bhauso Yadav', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262432', 'Aleena Ali Mazhar Rassawala', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261395', 'Angad Viresh Barse', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261026', 'Arjun Sagar Kadam', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261581', 'Atharv Jalindar Dawkar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262384', 'Dipesh Prashant Deshmane', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261628', 'Himanshu Raj', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261365', 'Jidnya Satish Kadam', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261764', 'Khushal Abhay Boraste', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261338', 'Mohammad Ali Ashafak Pinjari', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261715', 'Nimish Tijare', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262524', 'Pranan Prabhu Hiremath', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261700', 'Prem Vishal Patel', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261727', 'Sanskar Sunil Pawar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261932', 'Sarthak Vijayrao Kadam', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262234', 'Sarthak Sanjay Rathod', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261987', 'Shantanu Vikas Kakade', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262260616', 'Shlok Amit Gadiya', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262019', 'Shrikant Rajnikant Padole', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261554', 'Soham Vijay Shirke', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262609', 'Swarndeep Sameer Waykule', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261531', 'Vedant Satish Nalinde', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262615', 'Vedant Pankaj Mene', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262262078', 'Vishnu Hirenbhai Bhalala', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261407', 'Vishwajit Madhukar Manoorkar', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262261969', 'Yaman Vinay Agrawal', 'B.Tech Civil Engineering (Smart Infrastructure & Construction)', '30 - FY CIVIL SMART', 3),
  ('1262260660', 'Aahna Shah', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262230', 'Aarushi Nayak', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261095', 'Anika Anil Nair', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262372', 'Anshika Khetan', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262520', 'Atharv Prakash Khadatare', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261483', 'Bhoomi Jairaj Agarwal', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262604', 'Dhiraj Ramesh Pachfule', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262260475', 'Durga Sri Madhurima Govindaraju', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261082', 'Isha Pravin Shikhare', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261331', 'Mohit Umesh Barne', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262024', 'Nandini Rajeshwar Timande', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261012', 'Niyati Rajiv Jaggi', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262087', 'Ojasvee Sanjay Sakharwade', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261362', 'Prisha Dewra', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262176', 'Riya Verma', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261193', 'Ruchi Pralhad Dagadkhair', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262459', 'Rudrani Manohar Kumbhalkar', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262568', 'Rujul Yogesh Mohite', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261154', 'Sanika Sharanbasappa Shedjale', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262260623', 'Shivansh Santosh Gade', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262262014', 'Shreya Brukodar Paikaray', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261958', 'Tanishka Shashank Raut', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261120', 'Tanvi Parag Paranjpe', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262260986', 'Viha Nadoran', 'B.Tech Bioengineering', '31 - FY BIO', 1),
  ('1262261204', 'Aarohi Udaykumar Mathapati', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262558', 'Advita Atul Deshmukh', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261117', 'Adwika Bhalchandra Joshi', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261176', 'Ananya Narahari Raidurg', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261406', 'Ansh Viresh Dalvi', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261272', 'Aryan Rajeev Srivastav', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261528', 'Darsh Deepak Nagpure', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261970', 'Debosmita Payra', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262186', 'Gaurav Rajaram Shendge', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262074', 'Harini V', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261332', 'Mahek Santosh Pillai', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262342', 'Mahek Chandnani', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262420', 'Mandar Umakant Dhenge', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262260987', 'Palak Samir Bafna', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262482', 'Prathamesh Rajendra Chandge', 'B.Tech Bioengineering', '31 - FY BIO', 2)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261535', 'Rahi Niranjan Nisal', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261287', 'Sagnika Adak', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262035', 'Shravani Anil Lodam', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261705', 'Shrujal Tukaram Patil', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262125', 'Siddhehi Bhagwatkar', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262166', 'Smruti Avinash Deokar', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262261224', 'Trupti Vinay Khedekar', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262010', 'Yashowardhan Sachin Lajurkar', 'B.Tech Bioengineering', '31 - FY BIO', 2),
  ('1262262053', 'Aanya Agarwal', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262260612', 'Ali Nurul Amin Harnekar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261024', 'Ananya Amit Bisne', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261546', 'Anvi Manik Gandekar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262194', 'Arnav Vishal Kumbhar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262599', 'Arnavi Ritesh Karande', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261077', 'Ashutosh Avinash Anantwar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261951', 'Bhagyashree Kailash Khodatkar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262351', 'Devansh Aashish Yele', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262260682', 'Devika Prasanna Godbole', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261417', 'Harsh Ravindra Joshi', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262222', 'Kaustubh Sanjaykumar Kotiwale', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262016', 'Kunjal Narendra Zote', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262161', 'Lavanya Milind Patil', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261047', 'Manya Vipin Pawar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262209', 'Neel Ganesh Somwanshi', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261560', 'Nikita Kalyan Singh Karakoti', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261915', 'Sampada Manesh Murumkar', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261178', 'Satyajeet Sachin Dagade', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261794', 'Sneha Santosh Kale', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261979', 'Sujal Sachin Shewale', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262262495', 'Swanand Manish Zanpure', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262261749', 'Vaishnavi Suresh Mahakal', 'B.Tech Bioengineering', '31 - FY BIO', 3),
  ('1262260644', 'Aamena Shabbir Typist', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261687', 'Adwait Narendra Yashwante', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261947', 'Ahana Khandelwal', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262264', 'Ananya Bhat', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262257', 'Arya Santosh Angre', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261821', 'Aryan Prashant Patil', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262123', 'Divyanka Umaji Ramteke', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261309', 'Durva Ghanashyam Gondhali', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261134', 'Joanne Manoj Thomas', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262170', 'Kasturi Yogesh Rane', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262152', 'Kshipra Kishor Mohite', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262324', 'Manomay Amit Joshi', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262624', 'Mohamad Zayd Munaf Bangi', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262260960', 'Muskan Singh', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262187', 'Owais Alipasha Saudagar', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262027', 'Preestha Sachin Tiwadi', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262145', 'Sakshi Sanjay Gupta', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262477', 'Samiksha Vinayak Jadhav', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261023', 'Saniya Prashant Shivarkar', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262528', 'Shatakshi Pachori', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262191', 'Siddhi Sudhanwa Devale', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262007', 'Suraj Vinod Pawar', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261752', 'Tanvi Vishnu Pachangane', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262261027', 'Yash Purushottam Sharma', 'B.Tech Bioengineering', '32 - FY BIO', 1),
  ('1262262292', 'Aanya Thakur', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261462', 'Aayushi Yogesh Brahme', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261397', 'Akshata Koranga', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261046', 'Anuja Shrikant Pohnerkar', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262358', 'Areen Srivastav', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261948', 'Arya Arunkumar Menon', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261246', 'Aryan Pradip Nawale', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262503', 'Aryan Ananda Jadhav', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262218', 'Ayush Tiwari', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261102', 'Devaki Krishnadas Nair', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262448', 'Disha Dharmendra Mishra', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261480', 'Hardi Rahul Rathod', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262571', 'Krish Harchana Sridhar', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262260978', 'Manjiri Rahul Patil', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261335', 'Nayanika Ghosh', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261122', 'Parth Mandar Mirashi', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261918', 'Raj Hareshkumar Lalwani', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262260663', 'Saisha Ganesh Gupta', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261888', 'Sarthak Dhananjay Yerpude', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261967', 'Shreya Nagesh Tathe', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262262043', 'Shreya Rajesh Rathod', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261871', 'Shubhra Milind Patil', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261015', 'Urvi Deepak Gosavi', 'B.Tech Bioengineering', '32 - FY BIO', 2),
  ('1262261230', 'Aditya Sandip Korde', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261007', 'Alina Suhail Khan', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261461', 'Ananya Jairam', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261685', 'Arya Ashish Kanade', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261893', 'Atharva Prashant Patil', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261952', 'Bhargav Sandeep Zope', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262589', 'Dev Raj Karna', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261043', 'Dhriti Manish Umredkar', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261436', 'Insiya Husain Gangardiwala', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262512', 'Kanak Chandrashekhar Telang', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262046', 'Lovika Khanwani Israni', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262052', 'Mishqaat Ahad Sheikh', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261602', 'Mishti Vikram Mehta', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262348', 'Om Pandurang Katore', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261394', 'Pranav Santosh Bangar', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261998', 'Prerna Amarjeet Nimbalkar', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262262220', 'Rakshika Gunasekaran', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261111', 'Rishita Gangaram Mekala', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261779', 'Sanavi Sushil Patil', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261927', 'Shipra Sachin Korekar', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261238', 'Shivani Prasad Dongare', 'B.Tech Bioengineering', '32 - FY BIO', 3),
  ('1262261785', 'Tanaya Ajay Jadhav', 'B.Tech Bioengineering', '32 - FY BIO', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
INSERT INTO public.students (prn, name, branch, division, batch)
VALUES
  ('1262261698', 'Vedant Uday Jadhav', 'B.Tech Bioengineering', '32 - FY BIO', 3)
ON CONFLICT (prn) DO UPDATE SET division = EXCLUDED.division, branch = EXCLUDED.branch, batch = EXCLUDED.batch;
