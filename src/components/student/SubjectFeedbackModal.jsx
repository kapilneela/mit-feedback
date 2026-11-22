import React, { useState } from 'react';
import { X, Star, CheckCircle, HelpCircle, Send, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFeedbackQuestions, submitStudentFeedback } from '../../services/dataService';

export default function SubjectFeedbackModal({ subject, student, isOpen, onClose, onFeedbackSubmitted }) {
  const [ratings, setRatings] = useState({
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5
  });
  const [comment, setComment] = useState(subject?.submissionData?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !subject) return null;

  const questions = getFeedbackQuestions();

  const handleRatingChange = (qId, value) => {
    setRatings(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <h2 className="text-lg sm:text-xl font-bold  leading-tight text-white">
              {subject.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Course Instructor: <span className="font-semibold text-white">{subject.faculty}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Please evaluate your course learning experience objectively. Rating scale: 1 (Unsatisfactory) to 5 (Excellent).
              </span>
            </div>

            {/* Questions list */}
            <div className="space-y-5">
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
                  <div key={q.id} className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                        Parameter {idx + 1} • {q.category}
                      </span>
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
                          className={`py-2 px-1 text-center rounded-lg border transition text-xs flex flex-col items-center justify-center gap-1 ${
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
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2"
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
          </form>
        )}
      </div>
    </div>
  );
}
