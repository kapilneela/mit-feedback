import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  Edit3, 
  Plus, 
  Check, 
  X, 
  GraduationCap, 
  School, 
  AlertCircle,
  Save,
  Trash2,
  Shield,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';
import { 
  getAllFacultyAllocations, 
  updateFacultyAllocation, 
  addNewFacultyAllocation,
  deleteFacultyAllocation,
  toggleFacultyRole,
  getAllCoursesList, 
  getDivisionsList 
} from '../../services/dataService';

export default function FacultySubjectAssignment() {
  const [facultyList, setFacultyList] = useState(getAllFacultyAllocations());
  const allCourses = getAllCoursesList();
  const allDivisions = getDivisionsList();

  const [search, setSearch] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL'); // 'ALL' | 'COORDINATOR' | 'TEACHING'
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Quick stats
  const totalFacultyCount = facultyList.length;
  const coordinatorCount = facultyList.filter(f => f.role === 'Course Coordinator').length;
  const teachingOnlyCount = facultyList.filter(f => f.role !== 'Course Coordinator').length;

  // Filtered faculty list
  const filteredFaculty = facultyList.filter(f => {
    const q = search.toLowerCase();
    const matchesSearch = 
      f.name.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      (f.subjects && f.subjects.some(s => s.toLowerCase().includes(q))) ||
      (f.assignedDivisions && f.assignedDivisions.some(d => d.toLowerCase().includes(q)));

    const matchesDiv = 
      selectedDivisionFilter === 'ALL' ||
      (f.assignedDivisions && (f.assignedDivisions.includes(selectedDivisionFilter) || f.assignedDivisions.includes('All Divisions')));

    let matchesRole = true;
    if (selectedRoleFilter === 'COORDINATOR') {
      matchesRole = f.role === 'Course Coordinator';
    } else if (selectedRoleFilter === 'TEACHING') {
      matchesRole = f.role !== 'Course Coordinator';
    }

    return matchesSearch && matchesDiv && matchesRole;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick one-click toggle of role
  const handleToggleRole = (facultyId) => {
    const { updatedList, targetName, newRole } = toggleFacultyRole(facultyId);
    setFacultyList(updatedList);
    showToast(`Updated ${targetName}'s role to "${newRole}".`);
  };

  // Open Edit Modal for a faculty member
  const handleOpenEdit = (faculty) => {
    setEditingFaculty({
      ...faculty,
      role: faculty.role || 'Teaching Faculty',
      subjects: [...(faculty.subjects || [])],
      assignedDivisions: [...(faculty.assignedDivisions || [])]
    });
  };

  // Save changes to faculty member
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    const updatedList = updateFacultyAllocation(editingFaculty.id, {
      name: editingFaculty.name,
      email: editingFaculty.email,
      designation: editingFaculty.designation,
      role: editingFaculty.role || 'Teaching Faculty',
      subjects: editingFaculty.subjects,
      rawSubjects: editingFaculty.subjects.join(', '),
      assignedDivisions: editingFaculty.assignedDivisions
    });

    setFacultyList(updatedList);
    setEditingFaculty(null);
    showToast(`Successfully updated role, subjects & divisions for ${editingFaculty.name}!`);
  };

  // Delete a faculty member
  const handleDeleteFaculty = (id, name) => {
    if (window.confirm(`Are you sure you want to remove faculty member "${name}"?`)) {
      const updated = deleteFacultyAllocation(id);
      setFacultyList(updated);
      showToast(`Removed faculty allocation for ${name}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-blue-500/40 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xl text-slate-900">
              Faculty Directory & Role Allocation
            </h3>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
              Unified Academic Directory
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Designate faculty members as Course Coordinators or Teaching Faculty, and assign their First Year engineering subjects and divisions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Faculty Member</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div 
          onClick={() => setSelectedRoleFilter('ALL')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            selectedRoleFilter === 'ALL' ? 'bg-blue-50/70 border-blue-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Faculty</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">{totalFacultyCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Teaching Directory</div>
        </div>

        <div 
          onClick={() => setSelectedRoleFilter('COORDINATOR')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            selectedRoleFilter === 'COORDINATOR' ? 'bg-blue-50/70 border-blue-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <School className="w-3.5 h-3.5" />
            <span>Course Coordinators</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono mt-0.5">{coordinatorCount}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">Assigned Academic Oversight</div>
        </div>

        <div 
          onClick={() => setSelectedRoleFilter('TEACHING')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            selectedRoleFilter === 'TEACHING' ? 'bg-slate-100 border-slate-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teaching Faculty</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 font-mono mt-0.5">{teachingOnlyCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Subject Instructors</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Engineering Divisions</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">{allDivisions.length}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">32 FY Divisions</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty name, email, employee ID (EMP...), or subject..."
            className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 bg-slate-50/50 hover:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-semibold"
            >
              <option value="ALL">All Roles ({totalFacultyCount})</option>
              <option value="COORDINATOR">Course Coordinators ({coordinatorCount})</option>
              <option value="TEACHING">Teaching Faculty ({teachingOnlyCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Division:</span>
            <select
              value={selectedDivisionFilter}
              onChange={(e) => setSelectedDivisionFilter(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 font-mono text-xs focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All 32 Divisions ({allDivisions.length})</option>
              {allDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Faculty Member & Email</th>
                <th className="py-3 px-4 text-center">Institutional Role</th>
                <th className="py-3 px-4">Assigned Subjects</th>
                <th className="py-3 px-4">Assigned Divisions</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No faculty records found matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((f) => {
                  const isCoord = f.role === 'Course Coordinator';

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {f.id}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{f.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{f.email}</div>
                        <div className="text-[10px] text-slate-400">{f.designation} • {f.department}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isCoord
                              ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-2xs'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}>
                            {isCoord ? <School className="w-3 h-3 text-blue-700" /> : <GraduationCap className="w-3 h-3 text-slate-500" />}
                            <span>{f.role || 'Teaching Faculty'}</span>
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleToggleRole(f.id)}
                            className="text-[10px] text-slate-500 hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer mt-0.5"
                            title={isCoord ? 'Switch to Teaching Faculty' : 'Promote to Course Coordinator'}
                          >
                            <ArrowRightLeft className="w-2.5 h-2.5" />
                            <span>{isCoord ? 'Set to Faculty' : 'Make Coordinator'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {f.subjects && f.subjects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.subjects.map((s, idx) => (
                              <span 
                                key={idx} 
                                className="bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200"
                                title={s}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No subjects assigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {f.assignedDivisions && f.assignedDivisions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.assignedDivisions.length === allDivisions.length ? (
                              <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                                All 32 Divisions
                              </span>
                            ) : (
                              f.assignedDivisions.slice(0, 4).map((d, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded border border-slate-200"
                                >
                                  {d.split(' - ')[0]}
                                </span>
                              ))
                            )}
                            {f.assignedDivisions.length > 4 && f.assignedDivisions.length !== allDivisions.length && (
                              <span className="text-[10px] text-slate-500 font-semibold self-center">
                                +{f.assignedDivisions.length - 4} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Assign role, subjects and divisions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(f.id, f.name)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Remove faculty"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT ALLOCATION & ROLE MODAL ================= */}
      {editingFaculty && (
        <EditAllocationModal
          faculty={editingFaculty}
          allCourses={allCourses}
          allDivisions={allDivisions}
          onClose={() => setEditingFaculty(null)}
          onSave={handleSaveEdit}
          onChange={(updated) => setEditingFaculty(updated)}
        />
      )}

      {/* ================= ADD NEW FACULTY MODAL ================= */}
      {isAddModalOpen && (
        <AddFacultyModal
          allCourses={allCourses}
          allDivisions={allDivisions}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(newRecord) => {
            const updated = addNewFacultyAllocation(newRecord);
            setFacultyList(updated);
            setIsAddModalOpen(false);
            showToast(`Added ${newRecord.name} (${newRecord.role}) to Faculty Directory.`);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Edit Allocation Modal with Role, Subjects, and Divisions
function EditAllocationModal({ faculty, allCourses, allDivisions, onClose, onSave, onChange }) {
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  const toggleDivision = (divName) => {
    const currentDivs = faculty.assignedDivisions || [];
    let updated;
    if (currentDivs.includes(divName)) {
      updated = currentDivs.filter(d => d !== divName);
    } else {
      updated = [...currentDivs, divName];
    }
    onChange({ ...faculty, assignedDivisions: updated });
  };

  const selectAllDivisions = () => {
    onChange({ ...faculty, assignedDivisions: [...allDivisions] });
  };

  const clearAllDivisions = () => {
    onChange({ ...faculty, assignedDivisions: [] });
  };

  const toggleCourse = (course) => {
    const subjectName = `${course.name} (${course.code})`;
    const currentSubjects = faculty.subjects || [];
    let updated;
    if (currentSubjects.includes(subjectName) || currentSubjects.some(s => s.includes(course.code) || s.includes(course.name))) {
      updated = currentSubjects.filter(s => !s.includes(course.code) && !s.includes(course.name));
    } else {
      updated = [...currentSubjects, subjectName];
    }
    onChange({ ...faculty, subjects: updated });
  };

  const removeSubject = (subj) => {
    const updated = (faculty.subjects || []).filter(s => s !== subj);
    onChange({ ...faculty, subjects: updated });
  };

  const addCustomSubject = (e) => {
    e.preventDefault();
    if (!customSubjectInput.trim()) return;
    const updated = [...(faculty.subjects || []), customSubjectInput.trim()];
    onChange({ ...faculty, subjects: updated });
    setCustomSubjectInput('');
  };

  const filteredCourses = allCourses.filter(c => {
    const q = courseSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b-2 border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-400/40 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                Assign Role, Subjects & Divisions
              </div>
              <h3 className="text-lg font-bold text-white">
                {faculty.name}
              </h3>
              <p className="text-xs text-slate-300">
                {faculty.id} • {faculty.designation} • {faculty.email}
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
        <form onSubmit={onSave} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* SECTION 1: ROLE SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Institutional Role Option
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Designate whether this faculty member serves as a regular Teaching Faculty or an authorized Course Coordinator.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => onChange({ ...faculty, role: 'Teaching Faculty' })}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  faculty.role !== 'Course Coordinator'
                    ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  faculty.role !== 'Course Coordinator' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>Teaching Faculty</span>
                    {faculty.role !== 'Course Coordinator' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Standard instructor delivering subjects and receiving student feedback.
                  </p>
                </div>
              </div>

              <div
                onClick={() => onChange({ ...faculty, role: 'Course Coordinator' })}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  faculty.role === 'Course Coordinator'
                    ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  faculty.role === 'Course Coordinator' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>Course Coordinator</span>
                    {faculty.role === 'Course Coordinator' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Grants Coordinator Dashboard access & feedback tracking for assigned divisions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ASSIGN SUBJECTS */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  2. Option to Assign Course Subjects ({faculty.subjects?.length || 0} selected)
                </label>
                <p className="text-[11px] text-slate-500">
                  Select subjects taught by this faculty member from the 52 FY Engineering courses.
                </p>
              </div>
            </div>

            {/* Currently assigned chips */}
            <div className="min-h-12 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5">
              {faculty.subjects && faculty.subjects.length > 0 ? (
                faculty.subjects.map((subj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-semibold text-xs px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    <span>{subj}</span>
                    <button
                      type="button"
                      onClick={() => removeSubject(subj)}
                      className="hover:text-blue-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No course subjects selected yet. Click any course below to assign.</span>
              )}
            </div>

            {/* Course Search */}
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Quick search courses by name or code..."
                className="w-full py-1 px-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
            </div>

            {/* Course catalog quick selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-100 rounded-xl border border-slate-200">
              {filteredCourses.map((c) => {
                const isAssigned = faculty.subjects?.some(s => s.includes(c.code) || s.includes(c.name));
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleCourse(c)}
                    className={`text-left p-2 rounded-lg text-xs font-medium transition border flex items-start justify-between gap-1 cursor-pointer ${
                      isAssigned 
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                        : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold truncate text-[11px]">{c.name}</div>
                      <div className={`font-mono text-[10px] ${isAssigned ? 'text-blue-100' : 'text-slate-500'}`}>
                        {c.code} • {c.credits} Credits
                      </div>
                    </div>
                    {isAssigned && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Custom subject manual adder */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customSubjectInput}
                onChange={(e) => setCustomSubjectInput(e.target.value)}
                placeholder="Or type custom subject name (e.g. EC - Engineering Chemistry Lab)..."
                className="flex-1 py-1.5 px-3 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <button
                type="button"
                onClick={addCustomSubject}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
              >
                Add Subject
              </button>
            </div>
          </div>

          {/* SECTION 3: ASSIGN DIVISIONS */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  3. Option to Assign Divisions ({faculty.assignedDivisions?.length || 0} of 32 assigned)
                </label>
                <p className="text-[11px] text-slate-500">
                  Select which divisions of First Year B.Tech this faculty member is assigned to.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllDivisions}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 cursor-pointer"
                >
                  Select All 32
                </button>
                <button
                  type="button"
                  onClick={clearAllDivisions}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* 32 Division chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {allDivisions.map((div) => {
                const isSelected = faculty.assignedDivisions?.includes(div) || faculty.assignedDivisions?.includes('All Divisions');
                return (
                  <button
                    key={div}
                    type="button"
                    onClick={() => toggleDivision(div)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold transition border text-center cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {div.split(' - ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Role & allocations are saved in real-time and immediately reflect in login & student evaluation dashboards.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Allocations</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Add New Faculty Modal with Role option, subjects, and divisions
function AddFacultyModal({ allCourses, allDivisions, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [role, setRole] = useState('Teaching Faculty');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [department, setDepartment] = useState('Department of First Year B. Tech.');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please provide faculty name and institutional email.');
      return;
    }

    onAdd({
      id: empId.trim() || `EMP-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
      designation: designation.trim(),
      department: department.trim(),
      subjects: selectedSubjects,
      assignedDivisions: selectedDivisions
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b-2 border-blue-600">
          <div>
            <h3 className="font-bold text-lg text-white">Add New Faculty / Coordinator</h3>
            <p className="text-xs text-slate-300">Enroll faculty member with designated role, subjects, and divisions</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Role selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Teaching Faculty')}
                className={`py-2 px-3 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'Teaching Faculty' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teaching Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('Course Coordinator')}
                className={`py-2 px-3 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'Course Coordinator' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Course Coordinator</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Kulkarni"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh.kulkarni@mitwpu.edu.in"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="e.g. EMP82341"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              Add Faculty Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
