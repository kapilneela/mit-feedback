import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { getFeedbackQuestions, saveFeedbackQuestions } from '../../services/dataService';

export default function FormBuilder() {
  const [questions, setQuestions] = useState(getFeedbackQuestions());
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editText, setEditText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('Teaching Methodology');
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('rating_5');
  const [msg, setMsg] = useState('');

  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setEditCategory(q.category);
    setEditText(q.text || q.question || '');
  };

  const handleSaveEdit = (qId) => {
    const updated = questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          category: editCategory,
          text: editText
        };
      }
      return q;
    });

    saveFeedbackQuestions(updated);
    setQuestions(updated);
    setEditingId(null);
    setMsg('Question updated.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = (qId) => {
    if (questions.length <= 2) {
      alert('The feedback form must have at least 2 questions.');
      return;
    }
    const updated = questions.filter(q => q.id !== qId);
    saveFeedbackQuestions(updated);
    setQuestions(updated);
    setMsg('Question removed from feedback form.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newQ = {
      id: `q${Date.now()}`,
      category: newCategory.trim(),
      text: newText.trim(),
      type: newType,
      description: newType === 'rating_5' ? '1: Very Poor to 5: Excellent' : 'Open text feedback'
    };

    const updated = [...questions, newQ];
    saveFeedbackQuestions(updated);
    setQuestions(updated);
    setNewText('');
    setShowAddForm(false);
    setMsg('New question added to student feedback evaluation form.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className=" font-bold text-lg text-slate-900">
            Student Feedback Form Builder
          </h3>
          <p className="text-xs text-slate-500">
            Customize evaluation parameters, rating rubrics, and feedback survey questions displayed to students.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Question</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Add question drawer */}
      {showAddForm && (
        <form onSubmit={handleAddQuestion} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Create New Evaluation Parameter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parameter Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Teaching Effectiveness, Lab Practical, Punctuality"
                className="w-full p-2 border border-slate-300 rounded bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Answer Format</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white"
              >
                <option value="rating_5">5-Point Likert Star Scale (1 to 5)</option>
                <option value="text">Open Long-Text Suggestion Box</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Question Prompt for Students</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. How effectively does the faculty explain engineering concepts?"
              rows={2}
              className="w-full p-2 border border-slate-300 rounded bg-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold"
            >
              Save to Form
            </button>
          </div>
        </form>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isEditing = editingId === q.id;

          return (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Question Prompt</label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveEdit(q.id)}
                      className="bg-emerald-600 text-white px-3 py-1 rounded font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                          {q.category}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {q.type === 'rating_5' ? '1-5 Rating Scale' : 'Open Text'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-900">{q.text || q.question}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStartEdit(q)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
