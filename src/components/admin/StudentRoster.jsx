import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  X, 
  Star, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Trash2
} from 'lucide-react';
import { 
  getAllStudentsFeedbackOverview, 
  getDivisionsList,
  removeFeedbackResponse,
  removeStudentAllFeedbacks,
  getAllQuestionsForSubject,
  getFeedbackQuestions
} from '../../services/dataService';

export default function StudentRoster() {
  const [version, setVersion] = useState(0);
  const studentsWithStatus = getAllStudentsFeedbackOverview();
  const allDivisions = getDivisionsList();

  const getQuestionInfo = (qId, courseCode, courseName) => {
    const allQs = getAllQuestionsForSubject(courseCode, courseName);
    const found = allQs.find(q => q.id === qId || q.id?.toLowerCase() === qId?.toLowerCase());
    if (found) {
      return {
        category: found.category || '',
        text: (found.text || found.question || '').trim(),
        name: (found.text || found.question || found.category || qId).trim()
      };
    }
    const instQs = getFeedbackQuestions();
    const instFound = instQs.find(q => q.id === qId || q.id?.toLowerCase() === qId?.toLowerCase());
    if (instFound) {
      return {
        category: instFound.category || '',
        text: (instFound.text || instFound.question || '').trim(),
        name: (instFound.text || instFound.question || instFound.category || qId).trim()
      };
    }
    return {
      category: '',
      text: '',
      name: qId.replace(/^(q|sq)_?/i, 'Question ').replace(/_/g, ' ')
    };
  };

  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
  const [page, setPage] = useState(1);
  const [inspectingStudent, setInspectingStudent] = useState(null);
  const pageSize = 20;

  // Filter students
  const filtered = studentsWithStatus.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = 
      s.prn.includes(q) || 
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      s.allCourses.some(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    
    const matchesDiv = selectedDivision === 'ALL' || s.division === selectedDivision;

    let matchesStatus = true;
    if (selectedStatusFilter === 'COMPLETED') matchesStatus = s.submittedCount === s.totalCount && s.totalCount > 0;
    else if (selectedStatusFilter === 'IN_PROGRESS') matchesStatus = s.submittedCount > 0 && s.submittedCount < s.totalCount;
    else if (selectedStatusFilter === 'PENDING') matchesStatus = s.submittedCount === 0;

    return matchesSearch && matchesDiv && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentStudents = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleRemoveFeedback = async (studentPrn, courseCode) => {
    if (window.confirm(`Are you sure you want to remove feedback for course ${courseCode}? This will allow the student to re-submit.`)) {
      await removeFeedbackResponse({ studentPrn, courseCode });
      setVersion(v => v + 1);
      const updatedOverview = getAllStudentsFeedbackOverview();
      const updatedStudent = updatedOverview.find(s => s.prn === studentPrn);
      setInspectingStudent(updatedStudent || null);
    }
  };

  const handleResetStudent = async (studentPrn) => {
    if (window.confirm(`Are you sure you want to remove ALL submitted feedback for student PRN ${studentPrn}? All 4 courses will be reset to pending.`)) {
      await removeStudentAllFeedbacks(studentPrn);
      setVersion(v => v + 1);
      const updatedOverview = getAllStudentsFeedbackOverview();
      const updatedStudent = updatedOverview.find(s => s.prn === studentPrn);
      setInspectingStudent(updatedStudent || null);
    }
  };

  // Quick counts
  const totalCount = studentsWithStatus.length;
  const completedCount = studentsWithStatus.filter(s => s.submittedCount === s.totalCount && s.totalCount > 0).length;
  const inProgressCount = studentsWithStatus.filter(s => s.submittedCount > 0 && s.submittedCount < s.totalCount).length;
  const pendingCount = studentsWithStatus.filter(s => s.submittedCount === 0).length;

  const handleDivChange = (div) => {
    setSelectedDivision(div);
    setPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatusFilter(status);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className=" font-bold text-xl text-slate-900">
            Student Feedback & Evaluation Tracking
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status for all {totalCount} students across 32 divisions: see which subjects are submitted and which are remaining.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div 
          onClick={() => handleStatusChange('ALL')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            selectedStatusFilter === 'ALL' ? 'bg-blue-50/70 border-blue-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">{totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">All 32 FY Divisions</div>
        </div>

        <div 
          onClick={() => handleStatusChange('COMPLETED')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            selectedStatusFilter === 'COMPLETED' ? 'bg-emerald-50/70 border-emerald-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fully Completed</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-0.5">{completedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">All 4 Subjects Filled</div>
        </div>

        <div 
          onClick={() => handleStatusChange('IN_PROGRESS')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            selectedStatusFilter === 'IN_PROGRESS' ? 'bg-blue-50/70 border-blue-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Partially Filled</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono mt-0.5">{inProgressCount}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">1 to 3 Subjects Filled</div>
        </div>

        <div 
          onClick={() => handleStatusChange('PENDING')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            selectedStatusFilter === 'PENDING' ? 'bg-slate-100 border-slate-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not Started</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-700 font-mono mt-0.5">{pendingCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">0 of 4 Subjects Filled</div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by student name, PRN (e.g. 1272260395), course code, or branch..."
            className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 bg-slate-50/50 hover:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-medium"
            >
              <option value="ALL">All Submission States</option>
              <option value="COMPLETED">Fully Completed (4/4)</option>
              <option value="IN_PROGRESS">Partially Filled (1–3)</option>
              <option value="PENDING">Not Started (0/4)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Division:</span>
            <select
              value={selectedDivision}
              onChange={(e) => handleDivChange(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 font-mono text-xs"
            >
              <option value="ALL">All 32 Divisions ({allDivisions.length})</option>
              {allDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">PRN</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Division</th>
                <th className="py-3 px-4">Feedback Completion</th>
                <th className="py-3 px-4">Subject Status (Filled vs Remaining)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the selected criteria.
                  </td>
                </tr>
              ) : (
                currentStudents.map((s, idx) => (
                  <tr key={s.prn} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {(page - 1) * pageSize + idx + 1}
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
                    <td className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className={s.submittedCount === s.totalCount ? 'text-emerald-700' : s.submittedCount > 0 ? 'text-blue-700' : 'text-slate-500'}>
                          {s.submittedCount} of {s.totalCount} Filled
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
                      {/* Detailed Subject Chips: Filled vs Remaining */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Submitted Subjects */}
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

                        {/* Remaining Subjects */}
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
                        title="View student's subject-by-subject feedback details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Student Feedback Modal */}
      {inspectingStudent && (
        <StudentDetailsModal
          student={inspectingStudent}
          onClose={() => setInspectingStudent(null)}
          onRemoveFeedback={(sub) => handleRemoveFeedback(inspectingStudent.prn, sub.code)}
          onResetAllFeedbacks={() => handleResetStudent(inspectingStudent.prn)}
        />
      )}
    </div>
  );
}

// Inspect Modal: Shows exactly which forms student filled and which are remaining
function StudentDetailsModal({ student, onClose, onRemoveFeedback, onResetAllFeedbacks }) {
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
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                Student Evaluation Audit Details
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Progress Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Evaluation Progress Summary
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Completed <strong className="text-emerald-700">{student.submittedCount}</strong> of <strong>{student.totalCount}</strong> subjects ({student.completionPercent}%)
              </div>
            </div>
            <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  student.submittedCount === student.totalCount ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${student.completionPercent}%` }}
              />
            </div>
          </div>

          {/* Section 1: Filled Forms */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                1. Submitted Course Feedbacks ({student.submittedCount})
              </h4>
            </div>

            {student.submittedSubjects.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                This student has not submitted feedback for any subjects yet.
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
                            Assigned Faculty: <strong className="text-slate-800">{sub.faculty}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {avgRating && (
                            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-mono font-bold text-xs border border-emerald-300">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{avgRating} / 5.0</span>
                            </div>
                          )}
                          {onRemoveFeedback && (
                            <button
                              onClick={() => onRemoveFeedback(sub)}
                              className="bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="Remove this feedback evaluation"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submission timestamp & comment */}
                      <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Recently'}</span>
                        </div>
                      </div>

                      {submission?.comment && (
                        <div className="mt-2 p-2.5 bg-white rounded-lg border border-emerald-200 text-slate-700 italic flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="whitespace-pre-line">"{submission.comment}"</span>
                        </div>
                      )}

                      {/* Parameter Ratings Breakdown with full Question Name */}
                      {submission?.ratings && Object.keys(submission.ratings).length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>Evaluation Parameters ({Object.keys(submission.ratings).length}):</span>
                          </div>
                          <div className="space-y-1.5">
                            {Object.entries(submission.ratings).map(([paramKey, val]) => {
                              const qInfo = getQuestionInfo(paramKey, sub.code, sub.name);
                              return (
                                <div key={paramKey} className="p-2 bg-white rounded-lg border border-emerald-200/70 flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    {qInfo.category && (
                                      <div className="text-[9px] font-bold text-blue-700 uppercase">
                                        {qInfo.category}
                                      </div>
                                    )}
                                    <p className="text-xs text-slate-800 font-medium leading-snug">
                                      {qInfo.text || qInfo.name}
                                    </p>
                                  </div>
                                  <span className="shrink-0 font-mono font-bold text-[11px] text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                    {val} / 5
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Remaining Forms */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                2. Remaining Course Feedbacks ({student.remainingCount})
              </h4>
            </div>

            {student.remainingSubjects.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold">
                ✓ Student has fully completed feedback for all 4 enrolled subjects!
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
                        Pending
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

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {student.submittedCount > 0 && onResetAllFeedbacks ? (
            <button
              onClick={onResetAllFeedbacks}
              className="bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset All Feedbacks for this Student</span>
            </button>
          ) : <div />}
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
