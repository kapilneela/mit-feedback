import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  CheckCircle2,
  Clock, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  Filter, 
  FileSpreadsheet, 
  Printer, 
  School,
  AlertCircle,
  Eye,
  Search,
  X,
  Star,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { 
  getCoordinatorDashboardData, 
  getAllDivisionsDetailedStats, 
  getAllStudentsFeedbackOverview,
  isCoordinatorSubject
} from '../../services/dataService';

export default function CoordinatorDashboard({ coordinator }) {
  const [data, setData] = useState(null);
  const [viewScope, setViewScope] = useState('students'); // 'students' is default to immediately see student details!
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('ALL');
  
  // Student view states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');
  const [studentPage, setStudentPage] = useState(1);
  const [inspectingStudent, setInspectingStudent] = useState(null);
  const studentPageSize = 15;

  const loadData = () => {
    if (coordinator?.email) {
      const dashboardData = getCoordinatorDashboardData(coordinator.email);
      setData(dashboardData);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('mitwpu_supabase_synced', handleSync);
    return () => window.removeEventListener('mitwpu_supabase_synced', handleSync);
  }, [coordinator?.email]);

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading coordinator data...</div>;
  }

  const all32Stats = getAllDivisionsDetailedStats();
  const allStudentsOverview = getAllStudentsFeedbackOverview();

  // Filter students belonging to this coordinator's assigned divisions
  const assignedDivisionsSet = new Set(data.assignedDivisions || []);
  const coordinatorStudents = allStudentsOverview.filter(s => 
    assignedDivisionsSet.has(s.division) || assignedDivisionsSet.has('All Divisions')
  );

  // Augment each student with coordinator's assigned subject submission status
  const coordStudentsWithSubjectStatus = coordinatorStudents.map(s => {
    const coordCourses = s.allCourses.filter(c => isCoordinatorSubject(c.code, c.name, c.faculty, data.coordinator));
    const effectiveCoordCourse = coordCourses[0] || (data.assignedSubjects?.length > 0 ? { code: data.assignedSubjects[0], name: data.assignedSubjects[0], faculty: data.coordinator.name } : null);
    
    const coordSubmitted = s.submittedSubjects.find(sub => isCoordinatorSubject(sub.code, sub.name, sub.faculty, data.coordinator));
    const coordRemaining = s.remainingSubjects.find(rem => isCoordinatorSubject(rem.code, rem.name, rem.faculty, data.coordinator));
    const isCoordSubmitted = !!coordSubmitted;
    
    return {
      ...s,
      coordCourse: effectiveCoordCourse,
      coordSubmitted,
      coordRemaining,
      isCoordSubmitted
    };
  });

  // Further filter for students table
  const filteredCoordinatorStudents = coordStudentsWithSubjectStatus.filter(s => {
    const q = studentSearch.toLowerCase();
    const matchesSearch = 
      s.prn.includes(q) || 
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      (s.coordCourse && (s.coordCourse.name.toLowerCase().includes(q) || s.coordCourse.code.toLowerCase().includes(q)));

    const matchesDiv = selectedDivisionFilter === 'ALL' || s.division === selectedDivisionFilter;

    let matchesStatus = true;
    if (studentStatusFilter === 'COMPLETED') matchesStatus = s.isCoordSubmitted;
    else if (studentStatusFilter === 'PENDING') matchesStatus = !s.isCoordSubmitted;

    return matchesSearch && matchesDiv && matchesStatus;
  });

  const totalSubmittedCount = coordStudentsWithSubjectStatus.filter(s => s.isCoordSubmitted).length;
  const totalPendingCount = coordStudentsWithSubjectStatus.filter(s => !s.isCoordSubmitted).length;

  const totalStudentPages = Math.ceil(filteredCoordinatorStudents.length / studentPageSize) || 1;
  const currentCoordinatorStudents = filteredCoordinatorStudents.slice(
    (studentPage - 1) * studentPageSize, 
    studentPage * studentPageSize
  );

  const displayedDivisions = selectedDivisionFilter === 'ALL' 
    ? data.divisionStats 
    : data.divisionStats.filter(d => d.division === selectedDivisionFilter);

  const displayedComments = selectedDivisionFilter === 'ALL'
    ? data.comments
    : data.comments.filter(c => c.division === selectedDivisionFilter);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Division', 'Total Students', 'Expected Subject Submissions', 'Actual Subject Submissions', 'Completion %', 'Student Participation %'],
      ...data.divisionStats.map(d => [
        `"${d.division}"`,
        d.totalStudents,
        d.expectedSubmissions,
        d.actualSubmissions,
        `${d.completionPercent}%`,
        `${d.studentParticipationPercent}%`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MITWPU_Coordinator_Report_${coordinator.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const assignedSubjectLabel = (data.assignedSubjects && data.assignedSubjects.length > 0)
    ? data.assignedSubjects.join(', ')
    : 'Assigned Course';

  return (
    <div className="space-y-6">
      {/* Coordinator Info Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-blue-400">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{data.coordinator.name}</h2>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-400/30 font-semibold">
                  Course Coordinator
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confidential Subject-Restricted View</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{data.coordinator.department}</p>
              
              {/* Assigned Subjects & Divisions */}
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1.5 bg-blue-900/60 border border-blue-700/60 px-2.5 py-1 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-xs text-blue-200 font-medium">Assigned Subject:</span>
                  <span className="text-xs font-bold text-white">{assignedSubjectLabel}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Divisions ({data.assignedDivisions.length}):</span>
                  {data.assignedDivisions.map(div => (
                    <span key={div} className="text-[11px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                      {div}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* 4 Highlighted KPI Cards - Scoped Strictly to Assigned Subject */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50 border-t border-slate-200">
          <div className="p-4 sm:p-5 text-center bg-blue-50/50">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
              <span>Subject Feedback Rate</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono">
              {data.overallCompletionPercentage}%
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {data.totalActualSubmissions} of {data.totalExpectedSubmissions} forms filled for {assignedSubjectLabel}
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Total Students Enrolled</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono">
              {data.totalEnrolledStudents}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              In your {data.assignedDivisions.length} assigned divisions
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submitted Feedbacks</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
              {data.totalActualSubmissions}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              For {assignedSubjectLabel}
            </p>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Pending Feedbacks</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 font-mono">
              {Math.max(0, data.totalExpectedSubmissions - data.totalActualSubmissions)}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Awaiting student submission
            </p>
          </div>
        </div>
      </div>

      {/* Official Admin Division Allocations Showcase */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <School className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>Assigned Divisions (from Academic Admin)</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full font-bold">
                  {data.assignedDivisions.length} Assigned
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Official First Year engineering divisions assigned to you. Evaluations below are filtered strictly to your subject ({assignedSubjectLabel}).
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Assigned Students: <strong className="text-slate-900">{coordinatorStudents.length}</strong>
          </div>
        </div>

        {/* Division Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.divisionStats.map((div) => {
            const isSelected = selectedDivisionFilter === div.division;
            return (
              <div
                key={div.division}
                onClick={() => {
                  setSelectedDivisionFilter(isSelected ? 'ALL' : div.division);
                  setStudentPage(1);
                  setViewScope('students');
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50/60 hover:bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                    {div.division}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    {div.totalStudents} Students
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 truncate" title={div.branch}>
                  {div.branch || 'First Year Engineering'}
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{assignedSubjectLabel}:</span>
                  <span className="font-mono font-bold text-emerald-700">{div.actualSubmissions} / {div.expectedSubmissions}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${div.completionPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Scope Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewScope('students')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                viewScope === 'students' ? 'bg-white shadow-xs text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Feedback Status ({assignedSubjectLabel})</span>
            </button>
            <button
              onClick={() => setViewScope('assigned')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewScope === 'assigned' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Division Turnout Matrix
            </button>
            <button
              onClick={() => setViewScope('all32')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewScope === 'all32' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 32 FY Engineering Divisions
            </button>
          </div>

          {viewScope !== 'all32' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedDivisionFilter}
                onChange={(e) => {
                  setSelectedDivisionFilter(e.target.value);
                  setStudentPage(1);
                }}
                className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-600 font-mono"
              >
                <option value="ALL">All Assigned Divisions ({data.assignedDivisions.length})</option>
                {data.assignedDivisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500">
          Showing {filteredCoordinatorStudents.length} Students in Selected View
        </div>
      </div>

      {/* VIEW 1: STUDENT-BY-STUDENT DETAILED STATUS (SCOPED TO ASSIGNED SUBJECT) */}
      {viewScope === 'students' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900">
                  Student Feedback Status for {assignedSubjectLabel}
                </h3>
                <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  Confidential View
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing student submissions strictly for your assigned subject. Other professors' evaluations are restricted for confidentiality.
              </p>
            </div>

            {/* Quick status filter pills */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <button
                onClick={() => { setStudentStatusFilter('ALL'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'ALL' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-300'
                }`}
              >
                All ({coordStudentsWithSubjectStatus.length})
              </button>
              <button
                onClick={() => { setStudentStatusFilter('COMPLETED'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'COMPLETED' ? 'bg-emerald-600 text-white font-bold border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                Submitted ({totalSubmittedCount})
              </button>
              <button
                onClick={() => { setStudentStatusFilter('PENDING'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'PENDING' ? 'bg-amber-600 text-white font-bold border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                Pending ({totalPendingCount})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
              placeholder="Search student by name, PRN, or course..."
              className="w-full py-1.5 px-3 border border-slate-300 rounded-lg text-xs bg-slate-50/50 hover:bg-white focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">PRN</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Division</th>
                  <th className="py-3 px-4">Assigned Subject</th>
                  <th className="py-3 px-4">Feedback Status</th>
                  <th className="py-3 px-4">Rating / Submission</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCoordinatorStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  currentCoordinatorStudents.map((s, idx) => (
                    <tr key={s.prn} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {(studentPage - 1) * studentPageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {s.prn}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.branch}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {s.division.split(' - ')[0]}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Batch {s.batch}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {s.coordCourse?.name || assignedSubjectLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {s.coordCourse?.code || 'Assigned Course'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {s.isCoordSubmitted ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Submitted</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {s.isCoordSubmitted ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-mono font-bold text-xs px-2 py-0.5 rounded border border-emerald-300">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{s.coordSubmitted.submissionData?.average_score || '5.0'} ★</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {s.coordSubmitted.submittedAt ? new Date(s.coordSubmitted.submittedAt).toLocaleDateString() : 'Recorded'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Awaiting Student</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setInspectingStudent(s)}
                          className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-300 hover:border-blue-400 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 mx-auto transition cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 pt-2">
            <div>
              Showing <strong>{(studentPage - 1) * studentPageSize + 1}</strong> to <strong>{Math.min(studentPage * studentPageSize, filteredCoordinatorStudents.length)}</strong> of <strong>{filteredCoordinatorStudents.length}</strong> students in your divisions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                disabled={studentPage === 1}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-800">
                Page {studentPage} of {totalStudentPages}
              </span>
              <button
                onClick={() => setStudentPage(p => Math.min(totalStudentPages, p + 1))}
                disabled={studentPage === totalStudentPages}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DIVISION TURNOUT MATRIX (SCOPED TO ASSIGNED SUBJECT) */}
      {viewScope === 'assigned' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Division Feedback Turnout Tracking ({assignedSubjectLabel})
              </h3>
              <p className="text-xs text-slate-500">
                Shows exact count and percentage of students who submitted evaluations for your assigned subject
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Division Name</th>
                  <th className="py-3 px-4 text-center">Enrolled Students</th>
                  <th className="py-3 px-4 text-center">Expected Forms ({assignedSubjectLabel})</th>
                  <th className="py-3 px-4 text-center">Forms Filled</th>
                  <th className="py-3 px-4 text-center">Students Participated</th>
                  <th className="py-3 px-4 min-w-[200px]">% Turnout ({assignedSubjectLabel})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayedDivisions.map((div) => {
                  return (
                    <tr key={div.division} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {div.division}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {div.totalStudents}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">
                        {div.expectedSubmissions}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700 font-mono">
                        {div.actualSubmissions}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-700">
                        {div.studentsStarted} <span className="text-[10px] text-slate-400">({div.studentParticipationPercent}%)</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className={div.completionPercent > 0 ? 'text-blue-700' : 'text-slate-500'}>
                              {div.completionPercent}% Filled
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {div.actualSubmissions}/{div.expectedSubmissions}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${Math.min(100, div.completionPercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: ALL 32 DIVISIONS MATRIX */}
      {viewScope === 'all32' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70">
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              All 32 FY Engineering Divisions Overview
            </h3>
            <p className="text-xs text-slate-500">
              Live feedback completion rates across all 32 divisions
            </p>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 z-10">
                <tr>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4 text-center">Total Students</th>
                  <th className="py-3 px-4 text-center">Expected Forms</th>
                  <th className="py-3 px-4 text-center">Forms Filled</th>
                  <th className="py-3 px-4 text-center">Students Participated</th>
                  <th className="py-3 px-4">% Turnout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {all32Stats.map((d) => (
                  <tr key={d.division} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.division}</td>
                    <td className="py-3 px-4 text-center">{d.studentCount}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{d.expected}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700 font-mono">{d.actual}</td>
                    <td className="py-3 px-4 text-center">{d.studentsSubmitted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${d.percent}%` }} />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700">{d.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics & Feedback Feed - STRICTLY FOR ASSIGNED SUBJECT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {assignedSubjectLabel} - Evaluation Metrics
              </h3>
              <p className="text-xs text-slate-500">Average student ratings on 5-point Likert scale for your subject</p>
            </div>
          </div>

          <div className="space-y-4">
            {data.parameterAverages.map((param, index) => {
              const score = param.average;
              const percent = (score / 5) * 100;

              return (
                <div key={param.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      {index + 1}. {param.category}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      {score.toFixed(2)} / 5.0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2">{param.question}</p>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Student Feedback Remarks ({assignedSubjectLabel})
              </h3>
              <p className="text-xs text-slate-500">Submitted comments for your course ({displayedComments.length})</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {displayedComments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                No open text remarks submitted yet for {assignedSubjectLabel}. 
                When students submit evaluations for your course, remarks will appear here.
              </div>
            ) : (
              displayedComments.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="font-mono font-bold text-blue-800">{c.courseCode} • {c.division}</span>
                    <span>{new Date(c.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 italic">
                    "{c.comment}"
                  </p>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Faculty: {c.faculty || data.coordinator.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Inspect Student Feedback Modal - Strictly Assigned Subject */}
      {inspectingStudent && (
        <CoordinatorStudentModal
          student={inspectingStudent}
          coordinator={data.coordinator}
          assignedSubjectLabel={assignedSubjectLabel}
          onClose={() => setInspectingStudent(null)}
        />
      )}
    </div>
  );
}

// Subcomponent: Coordinator Student Modal - Strictly Confidential Assigned Subject View
function CoordinatorStudentModal({ student, coordinator, assignedSubjectLabel, onClose }) {
  const isSubmitted = student.isCoordSubmitted;
  const submission = student.coordSubmitted?.submissionData;
  const course = student.coordCourse || { name: assignedSubjectLabel, code: 'Assigned Course', faculty: coordinator.name };

  const avgRating = submission?.average_score || 
    (submission?.ratings ? (Object.values(submission.ratings).reduce((a, b) => a + Number(b), 0) / Object.values(submission.ratings).length).toFixed(1) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b-2 border-blue-600">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center border border-blue-400/40 text-blue-400 font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Subject Evaluation Audit</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {student.name}
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                PRN: {student.prn} • {student.division} • Batch {student.batch}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Confidentiality Notice */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-900 leading-relaxed">
              <strong className="font-bold">Academic Confidentiality Notice:</strong> In compliance with MIT-WPU evaluation guidelines, course coordinators have access strictly to student feedback for their assigned subject (<strong>{assignedSubjectLabel}</strong>). Evaluations for courses taught by other faculty members remain confidential.
            </div>
          </div>

          {/* Subject Feedback Status Card */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-3.5 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <span className="font-bold text-slate-900 text-sm">{course.name}</span>
              </div>
              <div>
                {isSubmitted ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Evaluation Submitted</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evaluation Pending</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-500 text-[11px]">Faculty: </span>
                  <strong className="text-slate-800 text-xs">{course.faculty || coordinator.name}</strong>
                </div>
                {isSubmitted && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Submission Time: </span>
                    <span className="font-mono text-slate-700 font-semibold text-[11px]">
                      {student.coordSubmitted?.submittedAt ? new Date(student.coordSubmitted.submittedAt).toLocaleString() : 'Recorded'}
                    </span>
                  </div>
                )}
              </div>

              {isSubmitted ? (
                <div className="space-y-4">
                  {/* Rating Score Card */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                        Overall Evaluation Rating
                      </div>
                      <div className="text-xs text-emerald-700 mt-0.5">
                        Weighted average across all teaching parameters
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span className="font-mono font-extrabold text-base text-emerald-950">
                        {avgRating || '5.0'} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Individual ratings breakdown if available */}
                  {submission?.ratings && Object.keys(submission.ratings).length > 0 && (
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 text-xs">Parameter Ratings:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(submission.ratings).map(([paramKey, val]) => (
                          <div key={paramKey} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] text-slate-700 capitalize font-medium">{paramKey.replace(/_/g, ' ')}</span>
                            <span className="font-mono font-bold text-xs text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                              {val} / 5.0
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments / Remarks */}
                  {submission?.comment ? (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Student's Written Feedback Remarks:</span>
                      </div>
                      <p className="text-slate-800 italic pl-5">
                        "{submission.comment}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      No qualitative text comment provided by the student for this submission.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                  <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                  <div className="font-bold text-slate-800 text-sm">
                    Feedback Not Yet Submitted
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    This student has not yet completed the course feedback evaluation for <strong>{course.name}</strong>. Once submitted, their ratings and remarks will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-lg text-xs cursor-pointer transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
