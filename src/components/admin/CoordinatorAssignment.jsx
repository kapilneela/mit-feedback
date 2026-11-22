import React, { useState } from 'react';
import { UserCheck, Edit2, Save, Check } from 'lucide-react';
import { getAllCoordinators, updateCoordinatorAssignments, getDivisionsList } from '../../services/dataService';

export default function CoordinatorAssignment() {
  const [coordinators, setCoordinators] = useState(getAllCoordinators());
  const [editingId, setEditingId] = useState(null);
  const [editDivisions, setEditDivisions] = useState([]);
  const [msg, setMsg] = useState('');

  const allDivisions = getDivisionsList();

  const handleStartEdit = (coord) => {
    setEditingId(coord.id);
    setEditDivisions([...coord.assignedDivisions]);
  };

  const toggleDivision = (div) => {
    if (editDivisions.includes(div)) {
      setEditDivisions(editDivisions.filter(d => d !== div));
    } else {
      setEditDivisions([...editDivisions, div]);
    }
  };

  const handleSave = (coordId) => {
    const updated = updateCoordinatorAssignments(coordId, editDivisions);
    setCoordinators(updated);
    setEditingId(null);
    setMsg('Coordinator division assignments updated successfully.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className=" font-bold text-lg text-slate-900">
            Course Coordinator Division Assignments
          </h3>
          <p className="text-xs text-slate-500">
            Assign any of the 32 FY engineering divisions to course coordinators.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {coordinators.map((c) => {
          const isEditing = editingId === c.id;

          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {c.name}
                    </h4>
                    <p className="text-xs text-slate-500">{c.email} • {c.department}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] font-semibold text-slate-600">Assigned Subjects:</span>
                      {c.subjects?.map((s, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(c.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Assignments</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(c)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Assigned Divisions</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Division Badges or Picker */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Assigned Divisions ({isEditing ? editDivisions.length : c.assignedDivisions.length} of 32)
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600">Select/deselect divisions to assign to {c.name}:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                      {allDivisions.map(div => {
                        const isSelected = editDivisions.includes(div);
                        return (
                          <button
                            key={div}
                            type="button"
                            onClick={() => toggleDivision(div)}
                            className={`text-xs p-1.5 rounded font-mono text-left transition border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{div}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {c.assignedDivisions.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No divisions currently assigned.</span>
                    ) : (
                      c.assignedDivisions.map(div => (
                        <span key={div} className="text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md font-mono font-medium">
                          {div}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
