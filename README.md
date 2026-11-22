# MIT-WPU Course Feedback System (mit-feedback)
### Department of First Year Engineering • Faculty of Engineering & Technology
**Dr. Vishwanath Karad MIT World Peace University, Pune**

Official First Year Engineering Course Feedback, Faculty Evaluation, and Teaching Quality Assessment System with pure frontend React 19 architecture and Supabase database management.

---

## 🌟 Key Architecture & Capabilities

### 1. Unified Authentication & Portals
- **Unified ERP-Style Login**: Single, clean login screen styled after the official MIT-WPU Kothrud campus portal with aerial campus backdrop.
- **Three Core User Personas**:
  - **Students**: Login with 10-digit university PRN (e.g. `1272260395`) and default password `Student@123`.
  - **Teaching Faculty & Course Coordinators**: Login with official MIT-WPU institutional email (e.g. `kiran.kokate@mitwpu.edu.in`) and password `Teacher@123`.
  - **Academic Administration**: Login via `admin@mitwpu.edu.in` with `Admin@123`.

### 2. Student Evaluation Dashboard
- **Division-Mapped Course Enrollments**: Dynamic mapping of each student's 4 enrolled subjects based on their branch and division across all 32 divisions.
- **5-Point Likert Evaluation Questionnaire**: Interactive rating metrics covering pedagogical clarity, syllabus coverage, practical laboratory guidance, doubt resolution, and learning resources.
- **Real-Time Progress & Badges**: Distinct badges for *Pending* vs. *Submitted* evaluations with timestamps.

### 3. Course Coordinator Dashboard
- **Admin-Assigned Divisions Display**: Prominent banner showcasing all engineering divisions officially allocated by Academic Admin.
- **Student Submissions Audit Roster**: Per-student feedback tracking showing exactly which subjects are filled and which are remaining.
- **Detailed Inspection Modal**: Audit individual student evaluations, parameter scores, and qualitative remarks.
- **Accreditation Export**: Instant CSV report generation and print-ready summary for academic quality audits.

### 4. Academic Admin Control Center
- **Faculty Directory & Role Allocation**: Unified management of all 80 teaching faculty members. Directly designate roles (*Teaching Faculty* vs. *Course Coordinator*) and assign First Year subjects and divisions.
- **Feedback Submissions & Removal Management**: Full administrative audit of all submitted evaluations across all 32 divisions with the option to remove any feedback to allow student re-submission.
- **Student Directory**: Comprehensive roster of 2,201 First Year B.Tech students across 32 divisions with live completion percentages.
- **Course & Subject Manager**: Manage the 52 First Year engineering courses.
- **Form Builder & Password Manager**: Update questionnaires and manage default institutional access credentials.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Lucide Icons
- **Database & Sync**: Supabase (PostgreSQL with Row Level Security)
- **Typography**: Plus Jakarta Sans (institutional non-serif)
- **Palette**: Slate Navy (`#0F172A`), Institutional Blue (`#1D68E3`), Emerald Green (`#059669`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Run

```bash
git clone https://github.com/kapilneela/mit-feedback.git
cd mit-feedback
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🔐 Default Access Credentials

| Role | Username / Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mitwpu.edu.in` | `Admin@123` | Full Academic Control Center, Subject Allocations, Feedback Removal |
| **Coordinator** | `kiran.kokate@mitwpu.edu.in` | `Teacher@123` | Coordinator Dashboard, Assigned Divisions Roster |
| **Student** | `1272260395` (Aarna Naware, Div 1) | `Student@123` | Student Evaluation Portal (Div 1 - FY CSE) |

---

## 📄 License
Internal Academic System — Dr. Vishwanath Karad MIT World Peace University, Pune.
