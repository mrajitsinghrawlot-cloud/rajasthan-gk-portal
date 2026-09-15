import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SubTopicDetail } from '../../types/content';
import type { SubTopicSummary } from '../../types/taxonomy';
import { StatusActionBar } from './StatusActionBar';
import { QuickFacts } from './QuickFacts';
import { RapidFacts } from './RapidFacts';
import { TimelineView } from './TimelineView';
import { ExamTraps } from './ExamTraps';
import { MarkdownViewer } from './MarkdownViewer';
import { HighlightToggle } from './HighlightToggle';
import { TopicNavigation } from './TopicNavigation';
import { QuizEngine } from '../quiz/QuizEngine';
import {
  BookOpen,
  TableProperties,
  Zap,
  Clock,
  ShieldAlert,
  HelpCircle,
  Flame,
} from 'lucide-react';

export type StudyTabType = 'notes' | 'quick' | 'rapid' | 'timeline' | 'traps' | 'quiz';

interface ContentViewerProps {
  content: SubTopicDetail;
  activeTab?: StudyTabType;
  onTabChange?: (tab: StudyTabType) => void;
  prevSubtopic?: SubTopicSummary | null;
  nextSubtopic?: SubTopicSummary | null;
  onSelectSubtopic?: (sub: SubTopicSummary) => void;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({ 
  content, 
  activeTab: externalTab, 
  onTabChange,
  prevSubtopic,
  nextSubtopic,
  onSelectSubtopic,
}) => {
  const { t, ui, language } = useLanguage();
  const [internalTab, setInternalTab] = useState<StudyTabType>('notes');

  const currentTab = externalTab ?? internalTab;

  const handleTabSelect = (tab: StudyTabType) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Reset to notes when subtopic changes
  useEffect(() => {
    if (onTabChange) {
      onTabChange('notes');
    } else {
      setInternalTab('notes');
    }
  }, [content.id]);

  const tabs: { id: StudyTabType; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'notes', label: ui('notes_tab'), icon: BookOpen },
    { id: 'quick', label: ui('quick_facts_tab'), icon: TableProperties, count: content.quick_facts?.length },
    { id: 'rapid', label: ui('rapid_facts_tab'), icon: Zap, count: content.key_facts_rapid_revision?.length },
    { id: 'timeline', label: ui('timeline_tab'), icon: Clock, count: content.timeline?.length },
    { id: 'traps', label: ui('traps_tab'), icon: ShieldAlert, count: content.exam_traps_and_tricks?.length },
    { id: 'quiz', label: ui('quiz_tab'), icon: HelpCircle, count: content.mcqs?.length },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-28 lg:pb-16">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-7 shadow-xs relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-lg">
              {content.id}
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Unit {content.unit_id}
            </span>

            {content.metadata.pyq_frequency === 'ultra-high' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>{language === 'hi' ? 'PYQ Hotspot' : 'Ultra-High PYQ'}</span>
              </span>
            )}

            {content.metadata.target_exams && (
              <div className="flex gap-1 ml-auto flex-wrap">
                {content.metadata.target_exams.map(exam => (
                  <span
                    key={exam}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Subtopic Title */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-hi leading-tight">
            {t(content.title)}
          </h1>

          {/* Short Summary */}
          {content.short_summary && (
            <p className="text-xs sm:text-base text-stone-600 dark:text-stone-300 font-hi leading-relaxed">
              {t(content.short_summary)}
            </p>
          )}

        </div>
      </div>

      {/* Floating Status Action Bar */}
      <StatusActionBar
        subtopicId={content.id}
        onStartQuiz={() => handleTabSelect('quiz')}
        quizQuestionCount={content.mcqs?.length || 0}
      />

      {/* Navigation Tabs Bar (Horizontal Touch Scrolling) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-x-auto scrollbar-none shadow-inner touch-pan-x">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-white dark:bg-stone-800 text-rajasthan-saffron shadow-xs ring-1 ring-stone-200 dark:ring-stone-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rajasthan-saffron' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="transition-all">
        
        {/* Full Study Notes Panel */}
        {currentTab === 'notes' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Notes Controls Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 font-hi">
                {language === 'hi' ? 'विस्तृत अध्ययन नोट्स' : 'Comprehensive Study Notes'}
              </div>
              <HighlightToggle />
            </div>

            {content.notes_sections.map((section, idx) => (
              <section
                key={`${content.id}-section-${idx}`}
                className="p-4 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3 sm:space-y-4"
              >
                <h3 className="text-base sm:text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-2.5 flex items-center gap-2 font-hi">
                  <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-rajasthan-saffron rounded-full shrink-0" />
                  <span>{t(section.section_title)}</span>
                </h3>

                <MarkdownViewer content={t(section.content_markdown)} />
              </section>
            ))}
          </div>
        )}

        {/* Quick Facts Tab Panel (Key-Value Table) */}
        {currentTab === 'quick' && (
          <QuickFacts facts={content.quick_facts} />
        )}

        {/* Rapid Revision Panel */}
        {currentTab === 'rapid' && (
          <RapidFacts facts={content.key_facts_rapid_revision} />
        )}

        {/* Timeline Panel */}
        {currentTab === 'timeline' && (
          <TimelineView timeline={content.timeline} />
        )}

        {/* Exam Traps Panel */}
        {currentTab === 'traps' && (
          <ExamTraps traps={content.exam_traps_and_tricks} />
        )}

        {/* Interactive MCQ Quiz Panel */}
        {currentTab === 'quiz' && (
          <QuizEngine
            subtopicId={content.id}
            subtopicTitle={t(content.title)}
            questions={content.mcqs}
            nextSubtopic={nextSubtopic}
            onSelectNextTopic={onSelectSubtopic}
          />
        )}

      </div>

      {/* Previous / Next Topic Bottom Navigation */}
      {onSelectSubtopic && (
        <TopicNavigation
          prevSubtopic={prevSubtopic}
          nextSubtopic={nextSubtopic}
          onSelectSubtopic={onSelectSubtopic}
        />
      )}

    </div>
  );
};
