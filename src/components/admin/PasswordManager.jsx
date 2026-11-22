import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { getAuthPasswords, updateAuthPassword } from '../../services/dataService';

export default function PasswordManager() {
  const [passwords, setPasswords] = useState(getAuthPasswords());
  const [editingRole, setEditingRole] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const handleStartEdit = (role) => {
    setEditingRole(role);
    setNewPassword(passwords[role]);
    setFeedbackMsg(null);
  };

  const handleSave = (role) => {
    if (!newPassword.trim()) {
      alert('Password cannot be empty.');
      return;
    }
    const updated = updateAuthPassword(role, newPassword.trim());
    setPasswords(updated);
    setEditingRole(null);
    setFeedbackMsg({
      role,
      text: `Password for ${role.toUpperCase()} successfully updated to "${newPassword.trim()}".`
    });

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all roles back to initial default passwords (Student@123, Teacher@123, Admin@123)?')) {
      updateAuthPassword('student', 'Student@123');
      updateAuthPassword('teacher', 'Teacher@123');
      const reset = updateAuthPassword('admin', 'Admin@123');
      setPasswords(reset);
      setFeedbackMsg({
        role: 'all',
        text: 'All system passwords have been restored to initial defaults.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className=" font-bold text-lg text-slate-900">
            System Password Management
          </h3>
          <p className="text-xs text-slate-500">
            Configure default and common authentication credentials for Students, Course Coordinators, and Administrators.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Initial Defaults</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Cards for each role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Student Role */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Student Portal</h4>
              <span className="text-[10px] text-slate-400 font-medium">1,028 Enrolled Students (32 Divisions)</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Common default password used by all first-year students to sign in with their PRN.
          </p>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active Common Password
            </div>
            {editingRole === 'student' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2 py-1.5 border border-blue-600 rounded bg-white"
                  placeholder="Enter new password"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('student')}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-2 text-xs text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-800">
                  {passwords.student}
                </span>
                <button
                  onClick={() => handleStartEdit('student')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Applies to all PRNs on login</span>
          </div>
        </div>

        {/* Teacher / Course Coordinator Role */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Course Coordinator</h4>
              <span className="text-[10px] text-slate-400 font-medium">Faculty Instructors</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Common default password for faculty course coordinators to access division turnouts.
          </p>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active Common Password
            </div>
            {editingRole === 'teacher' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2 py-1.5 border border-blue-600 rounded bg-white"
                  placeholder="Enter new password"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('teacher')}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-2 text-xs text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-800">
                  {passwords.teacher}
                </span>
                <button
                  onClick={() => handleStartEdit('teacher')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Applies to institutional emails</span>
          </div>
        </div>

        {/* Administrator Role */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Administrator</h4>
              <span className="text-[10px] text-slate-400 font-medium">Academic Controller</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Security credential for academic administration, subject changes, and question forms.
          </p>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active Common Password
            </div>
            {editingRole === 'admin' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2 py-1.5 border border-blue-600 rounded bg-white"
                  placeholder="Enter new password"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('admin')}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-2 text-xs text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-800">
                  {passwords.admin}
                </span>
                <button
                  onClick={() => handleStartEdit('admin')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Master administrative access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
