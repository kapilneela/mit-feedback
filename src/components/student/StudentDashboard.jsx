import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  GraduationCap, 
  User, 
  Award,
  AlertCircle
} from 'lucide-react';
import { getStudentEnrolledSubjects } from '../../services/dataService';
import SubjectFeedbackModal from './SubjectFeedbackModal';

export default function StudentDashboard({ student }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSubjects = () => {
    if (student?.prn) {
      const list = getStudentEnrolledSubjects(student.prn);
      setSubjects(list);
    }
  };

  useEffect(() => {
    loadSubjects();
    const handleSync = () => loadSubjects();
    window.addEventListener('mitwpu_supabase_synced', handleSync);
    return () => window.removeEventListener('mitwpu_supabase_synced', handleSync);
  }, [student?.prn]);

  const handleOpenSubjectFeedback = (subj) => {
    setSelectedSubject(subj);
    setIsModalOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    loadSubjects();
  };

  const completedCount = subjects.filter(s => s.isSubmitted).length;
  const totalCount = subjects.length || 4;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl  shadow-inner border-2 border-slate-700">
              {student.name ? student.name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold ">{student.name}</h2>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded font-mono border border-blue-400/30">
                  PRN: {student.prn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {student.branch} • <span className="font-semibold text-white">Division: {student.division}</span> (Batch {student.batch})
              </p>
            </div>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-slate-800/90 p-3 sm:px-4 sm:py-2.5 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-300">Feedback Status</div>
              <div className="text-sm font-bold text-white font-mono">
                {completedCount} / {totalCount} Subjects Completed
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
              percentage === 100 ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40' : 'border-blue-400 text-blue-300 bg-blue-950/40'
            }`}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Semester / Trimester Feedback Completion</span>
              <span className={percentage === 100 ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                {percentage === 100 ? 'All 4 Feedback Forms Completed ✓' : `${totalCount - completedCount} Subject(s) Remaining`}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  percentage === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions callout */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 text-xs text-blue-950 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Instructions for Students:</span> As per MIT-WPU Academic Regulations, each first-year engineering student must submit individual course and faculty feedback for all <strong>4 enrolled subjects</strong>. Click on any subject card below to open its feedback evaluation form.
        </div>
      </div>

      {/* 4 Subjects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 ">
              Enrolled First Year Subjects ({totalCount})
            </h3>
            <p className="text-xs text-slate-500">
              Click on a specific subject to fill or review the feedback questionnaire
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subj) => {
            return (
              <div
                key={subj.code}
                onClick={() => handleOpenSubjectFeedback(subj)}
                className={`group relative bg-white rounded-xl p-5 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  subj.isSubmitted 
                    ? 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/20' 
                    : 'border-slate-300 hover:border-blue-600 hover:-translate-y-0.5'
                }`}
              >
                {/* Status chip */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white px-2.5 py-1 rounded transition">
                    {subj.code}
                  </span>
                  
                  {subj.isSubmitted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Feedback Submitted</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Feedback</span>
                    </span>
                  )}
                </div>

                {/* Course Name */}
                <h4 className=" font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition mb-2">
                  {subj.name}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Faculty Instructor: <strong className="text-slate-800">{subj.faculty}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Credits: <strong className="text-slate-800">{subj.credits} Credits</strong></span>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {subj.isSubmitted ? `Submitted on ${new Date(subj.submittedAt).toLocaleDateString()}` : 'Mandatory Evaluation'}
                  </span>
                  <div className={`font-bold flex items-center gap-1 transition ${
                    subj.isSubmitted ? 'text-emerald-700' : 'text-blue-600 group-hover:translate-x-1'
                  }`}>
                    <span>{subj.isSubmitted ? 'Edit / View Response' : 'Fill Feedback Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluation Form Modal */}
      <SubjectFeedbackModal
        subject={selectedSubject}
        student={student}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}
