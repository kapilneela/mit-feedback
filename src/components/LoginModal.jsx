import React, { useState } from 'react';
import { X, Lock, UserCheck, GraduationCap, School, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { authenticate, getAuthPasswords } from '../services/dataService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentPasswords = getAuthPasswords();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setPassword('');
    if (tab === 'student') setIdentifier('1272260395'); // Aarna Anand Naware, Div 1
    else if (tab === 'teacher') setIdentifier('anand.kulkarni@mitwpu.edu.in');
    else if (tab === 'admin') setIdentifier('admin@mitwpu.edu.in');
  };

  const handleAutofill = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'student') {
      setIdentifier('1272260395');
      setPassword(currentPasswords.student);
    } else if (tab === 'teacher') {
      setIdentifier('anand.kulkarni@mitwpu.edu.in');
      setPassword(currentPasswords.teacher);
    } else if (tab === 'admin') {
      setIdentifier('admin@mitwpu.edu.in');
      setPassword(currentPasswords.admin);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authenticate(activeTab, identifier, password);
      setLoading(false);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#7A1315] text-white p-5 flex items-start justify-between border-b-2 border-[#C89D3C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-amber-400/40">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className=" font-bold text-lg text-white">MIT-WPU Portal Login</h3>
              <p className="text-xs text-amber-100/80">FY Engineering Feedback System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-amber-200/70 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => handleTabChange('student')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'student'
                ? 'border-[#7A1315] text-[#7A1315] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            onClick={() => handleTabChange('teacher')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'teacher'
                ? 'border-[#7A1315] text-[#7A1315] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Coordinator</span>
          </button>
          <button
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'admin'
                ? 'border-[#7A1315] text-[#7A1315] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student PRN (Permanent Registration Number)
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 1272260395 or 1272261002"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]/30 focus:border-[#7A1315] font-mono"
                required
              />
              <p className="text-[11px] text-slate-600 mt-1">
                10-digit PRN issued at MIT-WPU admission (Divisions 1 to 32)
              </p>
            </div>
          )}

          {activeTab === 'teacher' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coordinator Institutional Email
              </label>
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. anand.kulkarni@mitwpu.edu.in"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]/30 focus:border-[#7A1315]"
                required
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Faculty email ID registered in academic ERP
              </p>
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrator Username / Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@mitwpu.edu.in"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]/30 focus:border-[#7A1315]"
                required
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Academic Administration & ERP Controller
              </p>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Default: <span className="font-mono font-bold">{currentPasswords[activeTab]}</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]/30 focus:border-[#7A1315]"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7A1315] hover:bg-[#580B0D] text-white font-bold py-2.5 rounded-lg shadow-sm transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Verifying credentials...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>

          {/* Quick Autofill Helper */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              One-Click Demo Sign In:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('student')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded font-medium border border-slate-200 text-center transition"
              >
                Auto Student
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('teacher')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded font-medium border border-slate-200 text-center transition"
              >
                Auto Teacher
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded font-medium border border-slate-200 text-center transition"
              >
                Auto Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
