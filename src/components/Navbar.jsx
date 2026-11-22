import React from 'react';
import { ShieldCheck, Database, LogOut, User, School } from 'lucide-react';
import { isSupabaseConnected } from '../services/supabaseClient';

export default function Navbar({ currentUser, onOpenLogin, onLogout, onOpenSupabaseSettings }) {
  const isConnected = isSupabaseConnected();

  return (
    <header className="bg-slate-900 text-white shadow-md border-b-2 border-blue-600">
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-slate-700">
            <img src="/mitwpu_emblem.png" alt="MIT-WPU" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight leading-none text-white">
                Course Feedback System
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-blue-400/30">
                FY Engineering
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Course Evaluation & Teaching Performance System • 32 Divisions
            </p>
          </div>
        </div>

        {/* User status & Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 pr-3 rounded-lg border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs border border-blue-400/40">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold leading-tight text-white flex items-center gap-1.5">
                  {currentUser.name}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    currentUser.role === 'admin' ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40' :
                    (currentUser.isCoordinator || currentUser.facultyRole === 'Course Coordinator') ? 'bg-blue-900/80 text-blue-200 border border-blue-500/40' :
                    currentUser.role === 'teacher' ? 'bg-slate-800 text-slate-300 border border-slate-600' :
                    'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
                  }`}>
                    {currentUser.role === 'admin' ? 'Administrator' : 
                     (currentUser.isCoordinator || currentUser.facultyRole === 'Course Coordinator') ? 'Course Coordinator' : 
                     currentUser.role === 'teacher' ? 'Teaching Faculty' : 'Student'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {currentUser.role === 'student' ? `PRN: ${currentUser.prn} • Div: ${currentUser.division}` : currentUser.email}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="ml-2 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Official ERP Assessment Portal</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
