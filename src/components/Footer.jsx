import React from 'react';
import { Award, BookOpen, Shield, School } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-200  font-bold text-sm mb-2">
              <span className="text-blue-400">MIT World Peace University</span> • Pune, India
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Faculty of Engineering & Technology — First Year Engineering Course Feedback & Evaluation System. 
              Supports all 32 divisions across First Year engineering specializations.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-slate-400">
              <span className="flex items-center gap-1 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                <Award className="w-3 h-3 text-blue-400" /> NAAC 'A+' Grade Accredited
              </span>
              <span className="flex items-center gap-1 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                <Shield className="w-3 h-3 text-emerald-400" /> Confidential Feedback
              </span>
            </div>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-2 text-xs uppercase tracking-wider">
              Academic Assessment Policy
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Student feedback is recorded strictly for academic enrichment, curriculum enhancement, and teaching methodology assessment. Individual ratings remain anonymous to subject faculty to ensure unbiased and authentic evaluation.
            </p>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-2 text-xs uppercase tracking-wider">
              Faculty of Engineering
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Office of FY Engineering Dean<br />
              Dr. Vishwanath Karad MIT-WPU Campus<br />
              Paud Road, Kothrud, Pune - 411038<br />
              <span className="text-slate-300">dean.engineering@mitwpu.edu.in</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} MIT-WPU Course Feedback System. Internal Academic Assessment.</div>
          <div className="flex items-center gap-3">
            <span>Supabase Database Engine</span>
            <span>•</span>
            <span>32 Engineering Divisions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
