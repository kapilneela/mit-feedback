import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Star, 
  Eye, 
  Sparkles,
  Layers,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { 
  getSubjectConfig, 
  saveCourseOutcomes, 
  addSubjectQuestion, 
  deleteSubjectQuestion, 
  getDefaultCourseOutcomes,
  getAllQuestionsForSubject,
  normalizeSubjectKey,
  getAllCoursesList
} from '../../services/dataService';

export default function SubjectFormManager({ coordinator, assignedSubjects = [] }) {
  const allCourses = getAllCoursesList();

  // Resolve assigned subjects into canonical course objects
  const assignedList = (assignedSubjects.length > 0 ? assignedSubjects : ['EMT11011']).map(raw => {
    const normCode = normalizeSubjectKey(raw);
    const catalogMatch = allCourses.find(c => c.code === normCode);
    return {
      raw,
      code: normCode || raw,
      name: catalogMatch?.name || raw,
      label: catalogMatch ? `${catalogMatch.code} — ${catalogMatch.name}` : raw
    };
  });

  const [selectedSubject, setSelectedSubject] = useState(() => 
    assignedList.length > 0 ? assignedList[0].code : 'EMT11011'
  );

  // CO state
  const [courseOutcomes, setCourseOutcomes] = useState('');
  const [coSavedMsg, setCoSavedMsg] = useState('');

  // Questions state
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [newCategory, setNewCategory] = useState('Laboratory & Practical Work');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [questionMsg, setQuestionMsg] = useState('');

  // Live preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);

  // Find active course metadata
  const currentCourse = allCourses.find(c => c.code === selectedSubject) || 
    assignedList.find(c => c.code === selectedSubject) || 
    { code: selectedSubject, name: selectedSubject };

  // Load subject config whenever selectedSubject changes
  const loadConfig = () => {
    if (!selectedSubject) return;
    const cfg = getSubjectConfig(selectedSubject, currentCourse.name);
    setCourseOutcomes(cfg.courseOutcomes || getDefaultCourseOutcomes(selectedSubject, currentCourse.name));
    setSubjectQuestions(cfg.subjectQuestions || []);
  };

  useEffect(() => {
    loadConfig();
  }, [selectedSubject]);

  // Handle Save CO
  const handleSaveOutcomes = (e) => {
    e.preventDefault();
    if (!courseOutcomes.trim()) {
      alert('Course Outcomes text cannot be empty.');
      return;
    }
    saveCourseOutcomes(selectedSubject, courseOutcomes.trim(), currentCourse.name);
    setCoSavedMsg('Course Outcomes saved successfully and synced with student evaluation form.');
    setTimeout(() => setCoSavedMsg(''), 4000);
  };

  // Handle Reset CO to defaults
  const handleResetOutcomes = () => {
    if (window.confirm(`Reset Course Outcomes for ${selectedSubject} to institutional default benchmarks?`)) {
      const def = getDefaultCourseOutcomes(selectedSubject, currentCourse.name);
      setCourseOutcomes(def);
      saveCourseOutcomes(selectedSubject, def, currentCourse.name);
      setCoSavedMsg('Reset to default Course Outcomes.');
      setTimeout(() => setCoSavedMsg(''), 3000);
    }
  };

  // Handle Add Subject-Specific Question
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    addSubjectQuestion(selectedSubject, {
      category: newCategory,
      text: newQuestionText.trim()
    }, currentCourse.name);

    setNewQuestionText('');
    loadConfig();
    setQuestionMsg('New subject-specific question added to student form.');
    setTimeout(() => setQuestionMsg(''), 3500);
  };

  // Handle Delete Subject-Specific Question
  const handleDeleteQuestion = (qId, text) => {
    if (window.confirm(`Are you sure you want to remove this question?\n"${text}"`)) {
      deleteSubjectQuestion(selectedSubject, qId, currentCourse.name);
      loadConfig();
      setQuestionMsg('Question removed from student evaluation form.');
      setTimeout(() => setQuestionMsg(''), 3000);
    }
  };

  const allQuestionsForPreview = getAllQuestionsForSubject(selectedSubject, currentCourse.name);

  return (
    <div className="space-y-6">
      {/* Top Banner / Subject Selector */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Course Outcomes & Subject Questions Configuration</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full font-bold">
                  Course Coordinator Form Builder
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Define the mandatory Program/Course Outcomes students must review, and configure customized subject-specific evaluation questions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer border border-slate-300"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>{showPreview ? 'Hide Student Preview' : 'Preview Student Form'}</span>
            </button>
          </div>
        </div>

        {/* Course Selection Pills / Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Assigned Subject:</span>
            </span>
            {assignedList.map(item => (
              <button
                key={item.code}
                onClick={() => setSelectedSubject(item.code)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSubject === item.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Or select course:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-600"
            >
              {allCourses.slice(0, 15).map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Left = Course Outcomes Editor; Right = Subject Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: PROGRAM / COURSE OUTCOMES (CO) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Program & Course Outcomes (CO)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Rendered in the student evaluation modal with mandatory acknowledgment
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
              Student Checkbox
            </span>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-blue-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Student Form Behavior</span>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Students will read these Course Outcomes and must check:
              <strong className="block text-slate-900 mt-0.5 bg-white p-1.5 rounded border border-blue-200 font-mono text-[11px]">
                "I have read all the CO and now proceeding for feedback"
              </strong>
              before the form allows submission.
            </p>
          </div>

          <form onSubmit={handleSaveOutcomes} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Course Outcomes Text (CO1 to CO5)
              </label>
              <textarea
                value={courseOutcomes}
                onChange={(e) => setCourseOutcomes(e.target.value)}
                rows={10}
                placeholder="Enter Course Outcomes (e.g. CO1: ..., CO2: ...)"
                className="w-full text-xs sm:text-sm font-sans p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50/60 leading-relaxed"
                required
              />
            </div>

            {coSavedMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{coSavedMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetOutcomes}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Course Outcomes</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: SUBJECT-SPECIFIC FEEDBACK QUESTIONS */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Subject-Specific Questions
                </h4>
                <p className="text-[11px] text-slate-500">
                  Custom evaluation questions added by Course Coordinator for {selectedSubject}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
              {subjectQuestions.length} Custom Added
            </span>
          </div>

          {/* Add Question Form */}
          <form onSubmit={handleAddQuestion} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Subject-Specific Question</span>
            </h5>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Evaluation Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
              >
                <option value="Laboratory & Practical Work">Laboratory & Practical Work</option>
                <option value="Coding & Computational Exercises">Coding & Computational Exercises</option>
                <option value="Tutorials & Problem-Solving">Tutorials & Problem-Solving</option>
                <option value="Subject Depth & Core Concepts">Subject Depth & Core Concepts</option>
                <option value="Course Assignments & Projects">Course Assignments & Projects</option>
                <option value="Contemporary Industry Relevance">Contemporary Industry Relevance</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Question / Evaluation Parameter Prompt
              </label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="e.g. Practical laboratory demonstrations and coding sessions effectively reinforced the theoretical lectures."
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
                <span>Add Question to Form</span>
              </button>
            </div>
          </form>

          {questionMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{questionMsg}</span>
            </div>
          )}

          {/* List of Subject Questions */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Configured Subject Questions ({subjectQuestions.length})
            </label>

            {subjectQuestions.length === 0 ? (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-1">
                <HelpCircle className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No subject-specific questions added yet</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Only standard institutional questions will be displayed. Add tailored questions above to evaluate course-specific topics.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {subjectQuestions.map((sq, idx) => (
                  <div
                    key={sq.id}
                    className="p-3 bg-blue-50/40 rounded-lg border border-blue-200 flex items-start justify-between gap-3 hover:border-blue-300 transition"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                          {sq.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Custom Question #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {sq.text}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 pt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-slate-500">Rating Scale: 1 to 5 Points</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(sq.id, sq.text)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: LIVE STUDENT FORM PREVIEW (WHEN TOGGLED) */}
      {showPreview && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border-2 border-blue-500/30 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Live Student Form Preview</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  {selectedSubject}
                </span>
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              This is the exact view students see when opening the feedback evaluation
            </span>
          </div>

          {/* Rendered Mock Modal Content */}
          <div className="bg-white text-slate-900 rounded-xl p-5 space-y-5 border border-slate-200 max-h-96 overflow-y-auto">
            {/* The Course Outcomes Block */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Program & Course Outcomes (CO) — {selectedSubject}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  Mandatory Review
                </span>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-3 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans max-h-36 overflow-y-auto">
                {courseOutcomes}
              </div>

              <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-blue-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={previewConfirmed}
                  onChange={(e) => setPreviewConfirmed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                />
                <span className={`text-xs ${previewConfirmed ? 'text-blue-900 font-bold' : 'text-slate-800 font-semibold'}`}>
                  I have read all the CO and now proceeding for feedback
                </span>
              </label>
            </div>

            {/* Questions preview */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Evaluation Parameters ({allQuestionsForPreview.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">Rating Scale: 1 to 5</span>
              </h5>

              {allQuestionsForPreview.map((q, i) => (
                <div 
                  key={q.id}
                  className={`p-3 rounded-lg border text-xs ${
                    q.isSubjectSpecific ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-700 text-[11px]">
                      Parameter {i + 1} • {q.category}
                    </span>
                    {q.isSubjectSpecific && (
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                        Course-Specific
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800">{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
