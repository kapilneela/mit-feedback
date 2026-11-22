import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Sliders, 
  KeyRound, 
  Users, 
  Database,
  Building2,
  TrendingUp,
  Download,
  School,
  GraduationCap,
  Trash2
} from 'lucide-react';
import { getOverallAdminStats, getAllDivisionsDetailedStats } from '../../services/dataService';
import FacultySubjectAssignment from './FacultySubjectAssignment';
import SubjectManager from './SubjectManager';
import FormBuilder from './FormBuilder';
import PasswordManager from './PasswordManager';
import StudentRoster from './StudentRoster';
import FeedbackManager from './FeedbackManager';

export default function AdminDashboard({ onOpenSupabaseSettings }) {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = getOverallAdminStats();
  const divisionStats = getAllDivisionsDetailedStats();

  const tabs = [
    { id: 'overview', label: 'Overview & 32 Divisions', icon: BarChart3 },
    { id: 'faculty', label: 'Faculty & Course Coordinators', icon: GraduationCap },
    { id: 'feedback', label: 'Remove & Manage Feedback', icon: Trash2 },
    { id: 'roster', label: 'Student Directory', icon: Users },
    { id: 'subjects', label: 'Subject Manager', icon: BookOpen },
    { id: 'form', label: 'Form Builder', icon: Sliders },
    { id: 'passwords', label: 'Password Management', icon: KeyRound },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header - Deep Slate Navy */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl border border-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold  text-white">Academic Admin Control Center</h2>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-400/30">
                  Full Administrative Access
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Faculty of Engineering & Technology • FY Feedback Management (32 Divisions)
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSupabaseSettings}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition flex items-center gap-2 self-start md:self-auto"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Sync & DB</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Overall Feedback Turnout
              </div>
              <div className="text-3xl font-extrabold text-blue-600 font-mono">
                {stats.overallPercentage}%
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {stats.totalSubmitted} of {stats.totalExpectedFeedbacks} total evaluations
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                First Year Students
              </div>
              <div className="text-3xl font-extrabold text-slate-800 font-mono">
                {stats.totalStudents}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Enrolled across all 32 divisions
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Active Student Turnout
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 font-mono">
                {stats.studentParticipationPercent}%
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {stats.uniqueParticipatingStudents} students participated
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mean Teaching Rating
              </div>
              <div className="text-3xl font-extrabold text-slate-800 font-mono">
                {stats.overallAvgRating} / 5.0
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                University first-year average
              </p>
            </div>
          </div>

          {/* 32 Divisions Comprehensive Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className=" font-bold text-base sm:text-lg text-slate-900">
                  All 32 FY Engineering Divisions Status
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time division-wise feedback completion rate for all 1,028 students
                </p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 z-10">
                  <tr>
                    <th className="py-3 px-4">Division Name</th>
                    <th className="py-3 px-4 text-center">Enrolled Students</th>
                    <th className="py-3 px-4 text-center">Expected Forms (x4)</th>
                    <th className="py-3 px-4 text-center">Forms Filled</th>
                    <th className="py-3 px-4 text-center">Students Participated</th>
                    <th className="py-3 px-4 min-w-[180px]">Submission %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {divisionStats.map((d) => (
                    <tr key={d.division} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {d.division}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {d.studentCount}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {d.expected}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700 font-mono">
                        {d.actual}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {d.studentsSubmitted}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${d.percent}%` }} />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800 min-w-[36px]">{d.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'faculty' && <FacultySubjectAssignment />}
      {activeTab === 'feedback' && <FeedbackManager />}
      {activeTab === 'roster' && <StudentRoster />}
      {activeTab === 'subjects' && <SubjectManager />}
      {activeTab === 'form' && <FormBuilder />}
      {activeTab === 'passwords' && <PasswordManager />}
    </div>
  );
}
