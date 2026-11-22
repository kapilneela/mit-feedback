import React, { useState } from 'react';
import { BookOpen, Plus, Search, Trash2, Check } from 'lucide-react';
import { getAllCoursesList, addNewCourse, deleteCourse } from '../../services/dataService';

export default function SubjectManager() {
  const [courses, setCourses] = useState(getAllCoursesList());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState('3');
  const [msg, setMsg] = useState('');

  const filtered = courses.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      alert('Course Code and Course Name are required.');
      return;
    }

    const updated = addNewCourse({
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      credits: parseInt(newCredits) || 3
    });

    setCourses(updated);
    setNewCode('');
    setNewName('');
    setShowAddModal(false);
    setMsg(`Subject ${newCode.toUpperCase()} added successfully.`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = (code) => {
    if (window.confirm(`Are you sure you want to remove subject ${code}?`)) {
      const updated = deleteCourse(code);
      setCourses(updated);
      setMsg(`Subject ${code} removed.`);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className=" font-bold text-lg text-slate-900">
            Subject & Curriculum Management
          </h3>
          <p className="text-xs text-slate-500">
            Manage First Year Engineering course codes, titles, and credit weightages ({courses.length} subjects in catalog).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Course Code (e.g. CSE10010, EMT11011) or Subject Name..."
          className="w-full text-xs sm:text-sm py-1 px-2 border-0 focus:outline-hidden"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600 mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c, i) => (
                <tr key={c.code || i} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">
                      {c.credits} Cr
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4  font-bold text-base">
              Add New Course to FY Catalog
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CSE10050"
                  className="w-full p-2 border border-slate-300 rounded uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Object Oriented Programming with C++"
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Credits</label>
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="1">1 Credit</option>
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
