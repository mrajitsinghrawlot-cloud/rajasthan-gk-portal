import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import {
  CheckCircle2,
  RotateCcw,
  Bookmark,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface StatusActionBarProps {
  subtopicId: string;
  onStartQuiz: () => void;
  quizQuestionCount: number;
}

export const StatusActionBar: React.FC<StatusActionBarProps> = ({
  subtopicId,
  onStartQuiz,
  quizQuestionCount,
}) => {
  const { ui, language } = useLanguage();
  const {
    getSubtopicProgress,
    toggleNotesRead,
    logRevision,
    toggleBookmark,
    toggleWeakFlag,
  } = useProgress();

  const progress = getSubtopicProgress(subtopicId);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors">
      
      {/* Left: Status Badge & Revision Counter */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
          <span className="text-stone-500">{language === 'hi' ? 'स्थिति:' : 'Status:'}</span>
          <span
            className={`capitalize font-bold ${
              progress.status === 'mastered'
                ? 'text-emerald-600 dark:text-emerald-400'
                : progress.status === 'quiz_passed'
                ? 'text-sky-600 dark:text-sky-400'
                : progress.isNotesRead
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-stone-500'
            }`}
          >
            {ui(progress.status)}
          </span>
        </div>

        {/* Revision Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-800 dark:text-purple-300 text-xs font-bold">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{progress.revisionCount}x {ui('revisions')}</span>
        </div>

        {progress.bestQuizScore !== undefined && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: {progress.bestQuizScore}%</span>
          </div>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        
        {/* Mark as Read Button */}
        <button
          onClick={() => toggleNotesRead(subtopicId)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            progress.isNotesRead
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${progress.isNotesRead ? 'text-emerald-600' : 'text-stone-400'}`} />
          <span>{progress.isNotesRead ? ui('mark_unread') : ui('mark_read')}</span>
        </button>

        {/* Log Revision (+1) */}
        <button
          onClick={() => logRevision(subtopicId)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
          title="Log that you revised this topic"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{ui('log_revision')}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(subtopicId)}
          className={`p-2 rounded-xl border text-xs transition-all ${
            progress.isBookmarked
              ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-600'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800'
          }`}
          title="Bookmark Subtopic"
        >
          <Bookmark className={`w-4 h-4 ${progress.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>

        {/* Weak Topic Flag */}
        <button
          onClick={() => toggleWeakFlag(subtopicId)}
          className={`p-2 rounded-xl border text-xs transition-all ${
            progress.isWeakFlagged
              ? 'bg-rose-100 dark:bg-rose-950 border-rose-300 text-rose-600'
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:text-rose-600'
          }`}
          title="Flag as Weak Topic (Needs Attention)"
        >
          <AlertTriangle className={`w-4 h-4 ${progress.isWeakFlagged ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Start Quiz Action Button */}
        {quizQuestionCount > 0 && (
          <button
            onClick={onStartQuiz}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rajasthan-saffron to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:brightness-110 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{ui('quiz_tab')} ({quizQuestionCount})</span>
          </button>
        )}

      </div>
    </div>
  );
};
