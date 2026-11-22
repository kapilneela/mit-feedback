import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  Calendar, 
  GraduationCap, 
  RefreshCw,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { 
  getAllFeedbackResponses, 
  removeFeedbackResponse, 
  clearAllFeedbacks,
  getDivisionsList,
  getAllCoursesList
} from '../../services/dataService';

export default function FeedbackManager() {
  const [responses, setResponses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null); // response to delete
  const [confirmClearAllModal, setConfirmClearAllModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const allDivisions = getDivisionsList();
  const allCourses = getAllCoursesList();

  const loadData = () => {
    const data = getAllFeedbackResponses();
    setResponses(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleDeleteResponse = async (resp) => {
    await removeFeedbackResponse({ responseId: resp.id, studentPrn: resp.studentPrn, courseCode: resp.courseCode });
    loadData();
    setConfirmDeleteModal(null);
    showNotification(`Feedback for ${resp.courseCode} (${resp.studentName || resp.studentPrn}) removed successfully.`);
  };

  const handleClearAll = async () => {
    await clearAllFeedbacks();
    loadData();
    setConfirmClearAllModal(false);
    showNotification('All feedback submissions have been cleared from the database.');
  };

  // Filter responses
  const filteredResponses = responses.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch = 
      (r.studentPrn && r.studentPrn.toLowerCase().includes(q)) ||
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.courseCode && r.courseCode.toLowerCase().includes(q)) ||
      (r.courseName && r.courseName.toLowerCase().includes(q)) ||
      (r.faculty && r.faculty.toLowerCase().includes(q)) ||
      (r.comment && r.comment.toLowerCase().includes(q));

    const matchesDiv = selectedDivision === 'ALL' || r.division === selectedDivision;
    const matchesCourse = selectedCourse === 'ALL' || r.courseCode === selectedCourse;

    return matchesSearch && matchesDiv && matchesCourse;
  });

  const totalPages = Math.ceil(filteredResponses.length / pageSize) || 1;
  const paginatedResponses = filteredResponses.slice((page - 1) * pageSize, page * pageSize);

  // Stats
  const totalSubmissions = responses.length;
  const uniqueStudents = new Set(responses.map(r => r.studentPrn)).size;
  const totalComments = responses.filter(r => r.comment && r.comment.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
            <span>Feedback Submissions & Removal Management</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full font-bold">
              {totalSubmissions} Records
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, inspect individual responses, and remove submitted feedbacks so students can re-fill their evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
          {totalSubmissions > 0 && (
            <button
              onClick={() => setConfirmClearAllModal(true)}
              className="bg-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs border border-slate-700"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Clear All Test Feedbacks</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono mt-1">{totalSubmissions}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all 32 FY engineering divisions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Participated</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{uniqueStudents}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Distinct student PRNs recorded</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Comments</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{totalComments}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Open-text suggestions & remarks</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by student PRN, name, course code, faculty, or comment..."
            className="w-full py-1.5 px-3 border border-slate-300 rounded-lg text-xs bg-slate-50/50 hover:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDivision}
              onChange={(e) => { setSelectedDivision(e.target.value); setPage(1); }}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-mono"
            >
              <option value="ALL">All Divisions ({allDivisions.length})</option>
              {allDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <select
              value={selectedCourse}
              onChange={(e) => { setSelectedCourse(e.target.value); setPage(1); }}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-mono"
            >
              <option value="ALL">All Courses</option>
              {allCourses.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name.substring(0, 20)}...</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4 text-center">Division</th>
                <th className="py-3 px-4">Course & Faculty</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4">Student Remarks</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedResponses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-6 h-6 text-slate-300" />
                      <span>No feedback submissions found matching your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedResponses.map((resp, idx) => {
                  const avgRating = resp.average_score || 
                    (resp.ratings ? (Object.values(resp.ratings).reduce((a, b) => a + Number(b), 0) / Object.values(resp.ratings).length).toFixed(1) : null);

                  return (
                    <tr key={resp.id || `${resp.studentPrn}-${resp.courseCode}-${idx}`} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{resp.studentName || 'Student'}</div>
                        <div className="font-mono text-[11px] text-blue-700 font-semibold">PRN: {resp.studentPrn}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {resp.division?.split(' - ')[0] || resp.division}
                        </span>
                        {resp.batch && (
                          <div className="text-[10px] text-slate-400 mt-0.5">Batch {resp.batch}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded text-[10px] border border-slate-200">
                            {resp.courseCode}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs truncate max-w-[180px]" title={resp.courseName}>
                            {resp.courseName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Faculty: <strong className="text-slate-700">{resp.faculty}</strong>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {avgRating ? (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] border border-emerald-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{avgRating}/5</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {resp.comment ? (
                          <div className="text-[11px] text-slate-700 italic truncate" title={resp.comment}>
                            "{resp.comment}"
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No comment provided</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {resp.submittedAt ? new Date(resp.submittedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setConfirmDeleteModal(resp)}
                          className="bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 mx-auto transition cursor-pointer shadow-2xs"
                          title="Remove this feedback submission"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, filteredResponses.length)}</strong> of <strong>{filteredResponses.length}</strong> submissions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
              >
                Previous
              </button>
              <span className="font-semibold text-slate-800">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-rose-600">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Confirm Feedback Removal</h4>
              </div>
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                Are you sure you want to remove this feedback evaluation?
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-slate-800">
                <div>
                  <span className="text-slate-500 font-semibold">Student:</span>{' '}
                  <strong>{confirmDeleteModal.studentName || 'Student'}</strong> (PRN: <span className="font-mono">{confirmDeleteModal.studentPrn}</span>)
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Course:</span>{' '}
                  <strong>{confirmDeleteModal.courseCode}</strong> - {confirmDeleteModal.courseName}
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Faculty:</span>{' '}
                  <strong>{confirmDeleteModal.faculty}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Division:</span>{' '}
                  <span className="font-mono">{confirmDeleteModal.division}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Outcome:</strong> This feedback record will be permanently deleted from local and Supabase records. 
                  The student will see this subject as <em>Pending</em> and can fill the evaluation again.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmDeleteModal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteResponse(confirmDeleteModal)}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Remove Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {confirmClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm text-white">Clear All Feedback Submissions</h4>
              </div>
              <button
                onClick={() => setConfirmClearAllModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                This will delete <strong>ALL {totalSubmissions}</strong> feedback responses currently stored in the system. 
                All 2,201 students will reset to 0% submissions pending.
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                Are you sure you want to perform this system-wide reset?
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmClearAllModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Yes, Clear All Responses</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
