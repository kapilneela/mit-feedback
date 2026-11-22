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
  ChevronRight
} from 'lucide-react';
import { 
  getCoordinatorDashboardData, 
  getAllDivisionsDetailedStats, 
  getAllStudentsFeedbackOverview 
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

  // Further filter for students table
  const filteredCoordinatorStudents = coordinatorStudents.filter(s => {
    const q = studentSearch.toLowerCase();
    const matchesSearch = 
      s.prn.includes(q) || 
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      s.allCourses.some(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));

    const matchesDiv = selectedDivisionFilter === 'ALL' || s.division === selectedDivisionFilter;

    let matchesStatus = true;
    if (studentStatusFilter === 'COMPLETED') matchesStatus = s.submittedCount === s.totalCount && s.totalCount > 0;
    else if (studentStatusFilter === 'IN_PROGRESS') matchesStatus = s.submittedCount > 0 && s.submittedCount < s.totalCount;
    else if (studentStatusFilter === 'PENDING') matchesStatus = s.submittedCount === 0;

    return matchesSearch && matchesDiv && matchesStatus;
  });

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
      ['Division', 'Total Students', 'Expected Submissions', 'Actual Submissions', 'Completion %', 'Student Participation %'],
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

  return (
    <div className="space-y-6">
      {/* Coordinator Info Banner - Pure Navy & Slate */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-blue-400">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold  text-white">{data.coordinator.name}</h2>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-400/30">
                  Course Coordinator & Faculty
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{data.coordinator.department}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 font-medium">Assigned Divisions ({data.assignedDivisions.length}):</span>
                {data.assignedDivisions.map(div => (
                  <span key={div} className="text-[11px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                    {div}
                  </span>
                ))}
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

        {/* 4 Highlighted KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50 border-t border-slate-200">
          <div className="p-4 sm:p-5 text-center bg-blue-50/50">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
              <span>Feedback Filled Rate</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono">
              {data.overallCompletionPercentage}%
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {data.totalActualSubmissions} of {data.totalExpectedSubmissions} forms filled
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
              Actual student submissions
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
              Awaiting submission
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
                Official First Year engineering divisions assigned to you by Dean & Central Administration. Click any division to filter.
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
                  <span className="text-slate-500">Filled Forms:</span>
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
              <span>Student Submissions & Details (Filled vs Remaining)</span>
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

      {/* VIEW 1: STUDENT-BY-STUDENT DETAILED STATUS (NEW USER REQUEST) */}
      {viewScope === 'students' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className=" font-bold text-base sm:text-lg text-slate-900">
                Student-Wise Feedback Evaluation Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed view of which subjects each student has submitted and which are still remaining.
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
                All ({coordinatorStudents.length})
              </button>
              <button
                onClick={() => { setStudentStatusFilter('COMPLETED'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'COMPLETED' ? 'bg-emerald-600 text-white font-bold border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                Completed ({coordinatorStudents.filter(s => s.submittedCount === s.totalCount && s.totalCount > 0).length})
              </button>
              <button
                onClick={() => { setStudentStatusFilter('IN_PROGRESS'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'IN_PROGRESS' ? 'bg-blue-600 text-white font-bold border-blue-600' : 'bg-blue-50 text-blue-800 border-blue-300'
                }`}
              >
                In Progress ({coordinatorStudents.filter(s => s.submittedCount > 0 && s.submittedCount < s.totalCount).length})
              </button>
              <button
                onClick={() => { setStudentStatusFilter('PENDING'); setStudentPage(1); }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  studentStatusFilter === 'PENDING' ? 'bg-slate-700 text-white font-bold border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Pending ({coordinatorStudents.filter(s => s.submittedCount === 0).length})
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
              placeholder="Search student by name, PRN, or course name..."
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
                  <th className="py-3 px-4">Feedback Completion</th>
                  <th className="py-3 px-4">Subjects (Filled vs Remaining)</th>
                  <th className="py-3 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCoordinatorStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
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
                      <td className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className={s.submittedCount === s.totalCount ? 'text-emerald-700' : s.submittedCount > 0 ? 'text-blue-700' : 'text-slate-500'}>
                            {s.submittedCount}/{s.totalCount} Filled
                          </span>
                          <span className="font-mono text-slate-600">{s.completionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              s.submittedCount === s.totalCount ? 'bg-emerald-600' : s.submittedCount > 0 ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                            style={{ width: `${s.completionPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Submitted */}
                          {s.submittedSubjects.map(sub => (
                            <span
                              key={sub.code}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300"
                              title={`Filled: ${sub.name} (Faculty: ${sub.faculty})`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{sub.code}</span>
                            </span>
                          ))}
                          {/* Remaining */}
                          {s.remainingSubjects.map(rem => (
                            <span
                              key={rem.code}
                              className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-300"
                              title={`Remaining: ${rem.name} (Faculty: ${rem.faculty})`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>{rem.code}</span>
                            </span>
                          ))}
                        </div>
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

      {/* VIEW 2: DIVISION TURNOUT MATRIX */}
      {viewScope === 'assigned' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
            <div>
              <h3 className=" font-bold text-base sm:text-lg text-slate-900">
                Division Feedback Turnout Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Shows exact count and percentage of students who submitted evaluations
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Division Name</th>
                  <th className="py-3 px-4 text-center">Enrolled Students</th>
                  <th className="py-3 px-4 text-center">Expected Forms (x4)</th>
                  <th className="py-3 px-4 text-center">Forms Filled</th>
                  <th className="py-3 px-4 text-center">Students Started</th>
                  <th className="py-3 px-4 text-center">All 4 Completed</th>
                  <th className="py-3 px-4 min-w-[200px]">% Students Filled Form</th>
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
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {div.studentsFullyCompleted}
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
            <h3 className=" font-bold text-base sm:text-lg text-slate-900">
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

      {/* Analytics & Feedback Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className=" font-bold text-base text-slate-900">
                Course Evaluation Metric Scores
              </h3>
              <p className="text-xs text-slate-500">Average student ratings on 5-point Likert scale</p>
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
              <h3 className=" font-bold text-base text-slate-900">
                Student Feedback & Remarks
              </h3>
              <p className="text-xs text-slate-500">Submitted qualitative suggestions ({displayedComments.length})</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {displayedComments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                No open text comments submitted yet for this division. 
                When students fill their 4 subjects, feedback remarks will appear here live.
              </div>
            ) : (
              displayedComments.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="font-mono font-bold text-blue-800">{c.courseCode} • {c.division}</span>
                    <span>{new Date(c.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 italic ">
                    "{c.comment}"
                  </p>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Course: {c.courseName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Inspect Student Feedback Modal */}
      {inspectingStudent && (
        <CoordinatorStudentModal
          student={inspectingStudent}
          onClose={() => setInspectingStudent(null)}
        />
      )}
    </div>
  );
}

// Subcomponent: Coordinator Student Modal
function CoordinatorStudentModal({ student, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b-2 border-blue-600">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center border border-blue-400/40 text-blue-400 font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                Student Feedback Submission Audit
              </div>
              <h3 className="text-xl font-bold  text-white">
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

        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Progress Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Completion Status
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Completed <strong className="text-emerald-700">{student.submittedCount}</strong> of <strong>{student.totalCount}</strong> subjects ({student.completionPercent}%)
              </div>
            </div>
            <div className="w-40 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  student.submittedCount === student.totalCount ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${student.completionPercent}%` }}
              />
            </div>
          </div>

          {/* Submitted Subjects */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Filled Course Forms ({student.submittedCount})
              </h4>
            </div>

            {student.submittedSubjects.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                Student has not filled any course feedback forms yet.
              </div>
            ) : (
              <div className="space-y-3">
                {student.submittedSubjects.map((sub) => {
                  const submission = sub.submissionData;
                  const avgRating = submission?.average_score || 
                    (submission?.ratings ? (Object.values(submission.ratings).reduce((a, b) => a + Number(b), 0) / Object.values(submission.ratings).length).toFixed(1) : null);

                  return (
                    <div key={sub.code} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                              {sub.code}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Faculty: <strong className="text-slate-800">{sub.faculty}</strong>
                          </div>
                        </div>

                        {avgRating && (
                          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-mono font-bold text-xs border border-emerald-300">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{avgRating} / 5.0</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-emerald-200/60 font-mono text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Submitted on: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Recently'}</span>
                      </div>

                      {submission?.comment && (
                        <div className="mt-2 p-2.5 bg-white rounded-lg border border-emerald-200 text-slate-700 italic flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>"{submission.comment}"</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Subjects */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Remaining Course Forms ({student.remainingCount})
              </h4>
            </div>

            {student.remainingSubjects.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold">
                ✓ Student has submitted evaluations for all 4 courses.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {student.remainingSubjects.map((rem) => (
                  <div key={rem.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {rem.code}
                      </span>
                      <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                        Pending Submission
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 text-xs mt-1 truncate" title={rem.name}>
                      {rem.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Faculty: <span className="text-slate-700 font-medium">{rem.faculty}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
