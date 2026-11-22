import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  CheckCircle, 
  HelpCircle, 
  Send, 
  MessageSquare,
  GraduationCap,
  AlertCircle,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getAllQuestionsForSubject, 
  getSubjectConfig, 
  submitStudentFeedback 
} from '../../services/dataService';

export default function SubjectFeedbackModal({ subject, student, isOpen, onClose, onFeedbackSubmitted }) {
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState(subject?.submissionData?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasReadCO, setHasReadCO] = useState(false);
  const [coError, setCoError] = useState('');

  // Fetch subject-specific outcomes & questions
  const subjectConfig = subject?.code ? getSubjectConfig(subject.code) : null;
  const questions = subject?.code ? getAllQuestionsForSubject(subject.code) : [];

  useEffect(() => {
    if (subject?.code) {
      const qs = getAllQuestionsForSubject(subject.code);
      const initialRatings = {};
      qs.forEach(q => {
        initialRatings[q.id] = 5;
      });
      setRatings(initialRatings);
      setHasReadCO(false);
      setCoError('');
      setComment(subject?.submissionData?.comment || '');
    }
  }, [subject?.code, isOpen]);

  if (!isOpen || !subject) return null;

  const handleRatingChange = (qId, value) => {
    setRatings(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasReadCO) {
      setCoError('Please read and confirm the Course Outcomes (CO) by ticking the checkbox below.');
      return;
    }

    setSubmitting(true);

    try {
      await submitStudentFeedback({
        studentPrn: student.prn,
        studentName: student.name,
        division: student.division,
        batch: student.batch,
        courseCode: subject.code,
        courseName: subject.name,
        faculty: subject.faculty,
        ratings,
        comment
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onFeedbackSubmitted();
        onClose();
        setSuccess(false);
      }, 1400);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert('Error submitting feedback: ' + err.message);
    }
  };

  const ratingScaleLabels = [
    { val: 1, label: '1 - Unsatisfactory' },
    { val: 2, label: '2 - Needs Improvement' },
    { val: 3, label: '3 - Satisfactory' },
    { val: 4, label: '4 - Very Good' },
    { val: 5, label: '5 - Excellent' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
        {/* Header - Slate Navy & Blue */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-blue-600 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                {subject.code}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {subject.credits} Credits • Division {student.division}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-tight text-white">
              {subject.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Course Instructor: <span className="font-semibold text-white">{subject.faculty}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Feedback Submitted Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you for evaluating <strong>{subject.code}: {subject.name}</strong>. 
              Your submission has been recorded securely for academic continuous improvement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Program Outcomes / Course Outcomes (CO) Container with Mandatory Confirmation */}
            <div className={`rounded-xl border-2 transition-all shadow-xs p-4 sm:p-5 ${
              hasReadCO 
                ? 'bg-blue-50/70 border-blue-400' 
                : coError 
                  ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20' 
                  : 'bg-gradient-to-br from-blue-50/90 to-slate-50 border-blue-200'
            }`}>
              <div className="flex items-start justify-between gap-3 border-b border-blue-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>Program & Course Outcomes (CO)</span>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        {subject.code}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Standard academic objectives and expected learning outcomes defined by the Course Coordinator.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded shrink-0">
                  Mandatory Review
                </span>
              </div>

              {/* CO Text Display */}
              <div className="mt-3 bg-white/95 border border-blue-100 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-line shadow-2xs">
                {subjectConfig?.courseOutcomes}
              </div>

              {/* Mandatory Checkbox */}
              <div className="mt-3.5 pt-2 border-t border-blue-200/70">
                <label 
                  className={`flex items-start sm:items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                    hasReadCO 
                      ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-xs' 
                      : 'bg-white hover:bg-blue-50/60 border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasReadCO}
                    onChange={(e) => {
                      setHasReadCO(e.target.checked);
                      if (e.target.checked) setCoError('');
                    }}
                    className="mt-0.5 sm:mt-0 w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-600 cursor-pointer"
                  />
                  <span className={`text-xs ${hasReadCO ? 'text-blue-900 font-bold' : 'text-slate-800 font-semibold'}`}>
                    I have read all the CO and now proceeding for feedback
                  </span>
                </label>

                {coError && (
                  <p className="text-[11px] text-rose-600 font-bold mt-2 flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{coError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Questions list (Institutional + Subject-Specific) */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Course Evaluation Parameters ({questions.length})</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Rating scale: 1 (Unsatisfactory) to 5 (Excellent)
                </span>
              </div>

              {questions.map((q, idx) => {
                if (q.type === 'text') {
                  return (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Question {idx + 1}: {q.category}
                        </label>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{q.text}</p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write constructive remarks or suggestions for faculty/lab enhancement..."
                        rows={3}
                        className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-white"
                      />
                    </div>
                  );
                }

                const currentVal = ratings[q.id] || 5;

                return (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-lg border transition ${
                      q.isSubjectSpecific 
                        ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300' 
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                          Parameter {idx + 1} • {q.category}
                        </span>
                        {q.isSubjectSpecific && (
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Course-Specific</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Score: {currentVal}/5
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 mb-3">
                      {q.text}
                    </p>

                    {/* 5-point rating buttons */}
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {ratingScaleLabels.map(({ val }) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange(q.id, val)}
                          className={`py-2 px-1 text-center rounded-lg border transition text-xs flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            currentVal === val
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${currentVal === val ? 'fill-amber-300 text-amber-300' : 'text-slate-300'}`} />
                          <span className="text-[11px] font-bold">{val}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                      <span>1 - Unsatisfactory</span>
                      <span>3 - Satisfactory</span>
                      <span>5 - Excellent</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {hasReadCO ? '✓ CO Verified' : '⚠ Read & check CO to proceed'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer ${
                    hasReadCO 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {submitting ? (
                    <span>Recording submission...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Course Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
