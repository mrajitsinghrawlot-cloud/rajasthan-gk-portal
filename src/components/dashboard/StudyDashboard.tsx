import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import type { MasterTaxonomy, SubTopicSummary } from '../../types/taxonomy';
import { ProgressPill } from '../layout/ProgressPill';
import {
  X,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface StudyDashboardProps {
  taxonomy: MasterTaxonomy;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSubtopic: (subtopic: SubTopicSummary) => void;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  taxonomy,
  isOpen,
  onClose,
  onNavigateToSubtopic,
}) => {
  const { t, language } = useLanguage();
  const {
    globalMetrics,
    progressState,
    getSubjectMetrics,
    exportProgressData,
    importProgressData,
    resetAllProgress,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'weak' | 'backup'>('overview');
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Aggregate Weak Topics
  const weakSubtopics: { subtopic: SubTopicSummary; bestScore?: number; unitTitle: string }[] = [];
  taxonomy.subjects.forEach(subj => {
    subj.units.forEach(unit => {
      unit.subtopics.forEach(sub => {
        const prog = progressState.subtopicProgress[sub.id];
        if (prog && (prog.isWeakFlagged || (prog.bestQuizScore !== undefined && prog.bestQuizScore < 60))) {
          weakSubtopics.push({
            subtopic: sub,
            bestScore: prog.bestQuizScore,
            unitTitle: t(unit.title),
          });
        }
      });
    });
  });

  const handleExport = () => {
    const data = exportProgressData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rajasthan-gk-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) return;
    const success = importProgressData(importJson);
    if (success) {
      setImportStatus(language === 'hi' ? 'प्रगति सफलतापूर्वक आयात हो गई!' : 'Progress restored successfully!');
      setImportJson('');
    } else {
      setImportStatus(language === 'hi' ? 'अमान्य डेटा प्रारूप!' : 'Invalid data format!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-rajasthan-cardDark border-0 sm:border border-stone-200 dark:border-stone-800 rounded-none sm:rounded-3xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-3.5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-900/70 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-rajasthan-saffron text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-stone-900 dark:text-stone-100 font-hi truncate">
                {language === 'hi' ? 'प्रगति एवं विश्लेषण' : 'Study Analytics Dashboard'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-mono">
                {globalMetrics.completedSubtopics} / {globalMetrics.totalSubtopics} Topics Covered ({globalMetrics.overallPercentage}%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hidden sm:inline-flex p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-6 pt-2.5 flex gap-1 sm:gap-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto scrollbar-none shrink-0 bg-stone-50/50 dark:bg-stone-900/40 touch-pan-x">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'overview'
                ? 'border-rajasthan-saffron text-rajasthan-saffron'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {language === 'hi' ? 'समग्र' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'subjects'
                ? 'border-rajasthan-saffron text-rajasthan-saffron'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {language === 'hi' ? 'विषयवार' : 'Subjects'}
          </button>
          <button
            onClick={() => setActiveTab('weak')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
              activeTab === 'weak'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <span>{language === 'hi' ? 'कमज़ोर विषय' : 'Weak Topics'}</span>
            {weakSubtopics.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 text-[10px] font-bold">
                {weakSubtopics.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'backup'
                ? 'border-rajasthan-saffron text-rajasthan-saffron'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {language === 'hi' ? 'बैकअप' : 'Backup'}
          </button>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-6 pb-28 sm:pb-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'पूर्ण विषय' : 'Topics Covered'}
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1 font-mono">
                    {globalMetrics.completedSubtopics} <span className="text-xs text-stone-400 font-normal">/ {globalMetrics.totalSubtopics}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressPill
                      completed={globalMetrics.completedSubtopics}
                      total={globalMetrics.totalSubtopics}
                      percentage={globalMetrics.overallPercentage}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'कंठस्थ' : 'Mastered'}
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1 font-mono">
                    {globalMetrics.masteredSubtopics}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                    80%+ Quizzes
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                  <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'पुनरावृत्ति' : 'Revisions'}
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-purple-900 dark:text-purple-100 mt-1 font-mono">
                    {globalMetrics.totalRevisionsLogged}x
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-purple-600 dark:text-purple-400 mt-1 block">
                    Reviews
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
                  <span className="text-[10px] sm:text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'सटीकता' : 'Accuracy'}
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-sky-900 dark:text-sky-100 mt-1 font-mono">
                    {globalMetrics.overallAccuracyPercentage}%
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-sky-600 dark:text-sky-400 mt-1 block">
                    {globalMetrics.totalQuizAttempts} Attempts
                  </span>
                </div>
              </div>

              {/* Subject Matrix Heatmap */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-hi">
                  {language === 'hi' ? 'विषयवार पूर्णता स्थिति (Subject Heatmap)' : 'Subject Completion Heatmap'}
                </h4>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {taxonomy.subjects.map(subject => {
                    const metrics = getSubjectMetrics(subject.id);
                    return (
                      <div
                        key={subject.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate font-hi">
                            {subject.code}. {t(subject.title)}
                          </span>
                          <span className="text-xs font-mono font-bold text-rajasthan-saffron">
                            {metrics.percentage}%
                          </span>
                        </div>
                        <ProgressPill
                          completed={metrics.completedSubtopics}
                          total={metrics.totalSubtopics}
                          percentage={metrics.percentage}
                          size="md"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SUBJECTS & UNITS DRILLDOWN */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              {taxonomy.subjects.map(subject => {
                const sMetrics = getSubjectMetrics(subject.id);
                return (
                  <div
                    key={subject.id}
                    className="p-4 sm:p-5 rounded-3xl bg-stone-50/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800 pb-2.5">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-hi">
                          {subject.code}. {t(subject.title)}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-hi">{t(subject.tagline)}</p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                        {sMetrics.completedSubtopics}/{sMetrics.totalSubtopics} ({sMetrics.percentage}%)
                      </span>
                    </div>

                    {/* Units breakdown */}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {subject.units.map(unit => {
                        const uMetrics = sMetrics.unitMetrics[unit.id] || { completedSubtopics: 0, totalSubtopics: 0, percentage: 0 };
                        return (
                          <div
                            key={unit.id}
                            className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
                              <span className="truncate">{unit.id} {t(unit.title)}</span>
                              <span className="font-mono text-[11px] text-stone-500">{uMetrics.percentage}%</span>
                            </div>
                            <ProgressPill
                              completed={uMetrics.completedSubtopics}
                              total={uMetrics.totalSubtopics}
                              percentage={uMetrics.percentage}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: WEAK TOPICS QUEUE */}
          {activeTab === 'weak' && (
            <div className="space-y-3">
              {weakSubtopics.length === 0 ? (
                <div className="text-center py-16 text-stone-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-80" />
                  <h4 className="text-base font-bold text-stone-800 dark:text-stone-200 font-hi">
                    {language === 'hi' ? 'कोई कमज़ोर विषय चिह्नित नहीं है!' : 'No Weak Topics Flagged!'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'जब आप किसी क्विज़ में 60% से कम अंक लाएंगे या किसी विषय को फ्लैग करेंगे, वे यहाँ दिखाई देंगे।'
                      : 'Topics where you score below 60% or manually flag will appear here for targeted revision.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {weakSubtopics.map(({ subtopic, bestScore, unitTitle }) => (
                    <div
                      key={subtopic.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-bold text-rose-600 block">
                            {subtopic.id} • {unitTitle}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate font-hi">
                            {t(subtopic.title)}
                          </h4>
                          {bestScore !== undefined && (
                            <span className="text-[11px] text-rose-600 font-mono font-semibold">
                              Best Score: {bestScore}%
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onNavigateToSubtopic(subtopic);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 active:scale-95 transition-all"
                      >
                        <span>{language === 'hi' ? 'पढ़ें' : 'Study'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              
              {/* Export Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-hi">
                  <Download className="w-4 h-4 text-rajasthan-saffron" />
                  {language === 'hi' ? 'प्रगति बैकअप निर्यात (Export)' : 'Export Study Progress'}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'hi'
                    ? 'अपनी सम्पूर्ण अध्ययन प्रगति को JSON फ़ाइल के रूप में सुरक्षित डाउनलोड करें।'
                    : 'Download your entire study history and quiz scores as a portable JSON file.'}
                </p>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rajasthan-saffron hover:bg-orange-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'JSON बैकअप डाउनलोड करें' : 'Download Backup'}</span>
                </button>
              </div>

              {/* Import Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-hi">
                  <Upload className="w-4 h-4 text-sky-500" />
                  {language === 'hi' ? 'बैकअप पुनर्स्थापित (Import)' : 'Restore from Backup'}
                </h4>
                <textarea
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                  placeholder="Paste JSON backup data here..."
                  rows={2}
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-mono"
                />
                {importStatus && (
                  <p className="text-xs font-bold text-emerald-600">{importStatus}</p>
                )}
                <button
                  onClick={handleImportSubmit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold active:scale-95 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'डेटा आयात करें' : 'Restore'}</span>
                </button>
              </div>

              {/* Reset Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200 font-hi">
                  {language === 'hi' ? 'प्रगति रीसेट (Reset)' : 'Danger Zone: Reset'}
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  {language === 'hi'
                    ? 'यह आपके सभी पढ़े हुए विषय और क्विज़ स्कोर साफ़ कर देगा।'
                    : 'This will reset all study records from local storage.'}
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all progress?')) {
                      resetAllProgress();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold active:scale-95 transition-all"
                >
                  {language === 'hi' ? 'सभी डेटा रीसेट करें' : 'Reset Everything'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
