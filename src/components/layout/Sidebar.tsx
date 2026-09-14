import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import type { MasterTaxonomy, SubTopicSummary, ExamTarget } from '../../types/taxonomy';
import { ProgressPill } from './ProgressPill';
import {
  ChevronDown,
  ChevronRight,
  Flame,
  Star,
  CheckCircle2,
  BookOpen,
  Circle,
  HelpCircle,
  Filter,
  Layers,
  Crown,
  Palette,
  Compass,
  Building2,
  TrendingUp,
  Trophy,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  taxonomy: MasterTaxonomy;
  selectedSubtopicId: string;
  onSelectSubtopic: (subtopic: SubTopicSummary) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const SubjectIcons: Record<string, React.FC<{ className?: string }>> = {
  Crown,
  Palette,
  Compass,
  Building2,
  TrendingUp,
  Trophy,
  ShieldCheck,
};

export const Sidebar: React.FC<SidebarProps> = ({
  taxonomy,
  selectedSubtopicId,
  onSelectSubtopic,
  isOpen,
  onCloseMobile,
}) => {
  const { t, language } = useLanguage();
  const { getSubtopicProgress, getUnitMetrics, getSubjectMetrics } = useProgress();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(taxonomy.subjects[0]?.id || 'history');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'A.01': true,
    'A.04': true,
    'B.01': true,
    'C.02': true,
    'D.01': true,
  });
  const [examFilter, setExamFilter] = useState<ExamTarget>('All');

  const currentSubject = taxonomy.subjects.find(s => s.id === selectedSubjectId) || taxonomy.subjects[0];
  const subjectMetrics = getSubjectMetrics(currentSubject.id);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const getStatusIcon = (status: string, isNotesRead: boolean) => {
    if (status === 'mastered') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
    if (status === 'quiz_passed') {
      return <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />;
    }
    if (isNotesRead || status === 'reading') {
      return <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    return <Circle className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-40 w-84 sm:w-96 h-full lg:h-[calc(100vh-4rem)] bg-stone-50 dark:bg-rajasthan-cardDark border-r border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden p-3.5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rajasthan-saffron text-white flex items-center justify-center text-xs font-bold font-devanagari">
              रा
            </div>
            <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-hi">
              {language === 'hi' ? 'पाठ्यक्रम विषय सूची' : 'Syllabus Navigator'}
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 active:scale-95 transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Selector Header */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 shrink-0">
          <label className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rajasthan-saffron" />
              {language === 'hi' ? 'विषय चयन (SUBJECTS)' : 'SELECT SUBJECT'}
            </span>
            <span className="text-stone-400 font-normal">{taxonomy.subjects.length} Subjects</span>
          </label>

          {/* Horizontal scrollable subjects pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
            {taxonomy.subjects.map(subject => {
              const IconComponent = SubjectIcons[subject.icon] || Crown;
              const isSelected = subject.id === selectedSubjectId;
              const sMetrics = getSubjectMetrics(subject.id);

              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                    isSelected
                      ? 'bg-rajasthan-saffron text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-400/40'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{subject.code}. {t(subject.title)}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/25 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'}`}>
                    {sMetrics.percentage}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Subject Progress Bar */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                {t(currentSubject.title)}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                {subjectMetrics.completedSubtopics} / {subjectMetrics.totalSubtopics} Topics
              </span>
            </div>
            <ProgressPill
              completed={subjectMetrics.completedSubtopics}
              total={subjectMetrics.totalSubtopics}
              percentage={subjectMetrics.percentage}
              size="sm"
              showLabel={false}
            />
          </div>
        </div>

        {/* Exam Target Filter Bar */}
        <div className="px-3 py-2 bg-stone-100/70 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-stone-400" />
            {language === 'hi' ? 'फ़िल्टर:' : 'Filter:'}
          </span>
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {(['All', 'RAS', 'CET', 'Patwari', 'Police'] as ExamTarget[]).map(exam => (
              <button
                key={exam}
                onClick={() => setExamFilter(exam)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 active:scale-95 ${
                  examFilter === exam
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        {/* Units & Subtopics Tree (Scrollable with mobile bottom padding) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-28 lg:pb-6">
          {currentSubject.units.map(unit => {
            const isExpanded = !!expandedUnits[unit.id];
            const unitMetrics = getUnitMetrics(unit.id);
            const filteredSubtopics = unit.subtopics.filter(sub => {
              if (examFilter === 'All') return true;
              return sub.target_exams.includes(examFilter) || sub.target_exams.includes('All');
            });

            if (filteredSubtopics.length === 0) return null;

            return (
              <div
                key={unit.id}
                className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                {/* Unit Header Accordion Trigger */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-2.5 flex items-start justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors gap-2 active:bg-stone-100"
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="mt-0.5 text-stone-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-rajasthan-saffron" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-900">
                          {unit.id}
                        </span>
                        <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {t(unit.title)}
                        </h3>
                      </div>

                      {/* Unit Roll-Up Progress Bar */}
                      <ProgressPill
                        completed={unitMetrics.completedSubtopics}
                        total={unitMetrics.totalSubtopics}
                        percentage={unitMetrics.percentage}
                        size="sm"
                      />
                    </div>
                  </div>
                </button>

                {/* Nested Subtopics List */}
                {isExpanded && (
                  <div className="border-t border-stone-100 dark:border-stone-800/80 divide-y divide-stone-100 dark:divide-stone-800/50 bg-stone-50/50 dark:bg-stone-900/30">
                    {filteredSubtopics.map(subtopic => {
                      const isSelected = subtopic.id === selectedSubtopicId;
                      const subProg = getSubtopicProgress(subtopic.id);

                      return (
                        <button
                          key={subtopic.id}
                          onClick={() => {
                            onSelectSubtopic(subtopic);
                            onCloseMobile();
                          }}
                          className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 text-xs transition-all active:scale-[0.99] ${
                            isSelected
                              ? 'bg-amber-100/90 dark:bg-amber-950/60 border-l-4 border-rajasthan-saffron font-bold text-amber-950 dark:text-amber-100 shadow-xs'
                              : 'hover:bg-stone-100/80 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {/* Left: Status Icon & Title */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getStatusIcon(subProg.status, subProg.isNotesRead)}
                            <span className="truncate">{t(subtopic.title)}</span>
                          </div>

                          {/* Right: Badges & Tags */}
                          <div className="flex items-center gap-1 shrink-0">
                            {subtopic.pyq_frequency === 'ultra-high' && (
                              <span title="Ultra-High PYQ Frequency" className="text-orange-500 font-bold">
                                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                              </span>
                            )}
                            {subtopic.pyq_frequency === 'high' && (
                              <span title="High PYQ Frequency" className="text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                              </span>
                            )}
                            {subProg.revisionCount > 0 && (
                              <span className="px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
                                {subProg.revisionCount}x
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
