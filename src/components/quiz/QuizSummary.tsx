import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, RotateCcw, Star } from 'lucide-react';

interface QuizSummaryProps {
  score: number;
  total: number;
  timeSpentSeconds: number;
  onRetake: () => void;
  subtopicTitle: string;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  score,
  total,
  timeSpentSeconds,
  onRetake,
  subtopicTitle,
}) => {
  const { language } = useLanguage();
  const percentage = Math.round((score / total) * 100);
  const isMastered = percentage >= 80;

  useEffect(() => {
    if (isMastered) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7722', '#E5A93C', '#800020', '#10B981'],
      });
    }
  }, [isMastered]);

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-md text-center max-w-lg mx-auto space-y-6">
      
      {/* Trophy Badge */}
      <div className="relative inline-block">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg ${
          isMastered
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
        }`}>
          <Trophy className="w-10 h-10" />
        </div>
        {isMastered && (
          <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-stone-900">
            <Star className="w-4 h-4 fill-white" />
          </div>
        )}
      </div>

      {/* Result Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-hi">
          {isMastered
            ? (language === 'hi' ? 'शानदार प्रदर्शन! विषय कंठस्थ हुआ' : 'Outstanding! Topic Mastered')
            : (language === 'hi' ? 'अभ्यास पूर्ण हुआ' : 'Quiz Completed')}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-hi truncate">
          {subtopicTitle}
        </p>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-stone-100 dark:border-stone-800">
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
            {language === 'hi' ? 'प्राप्तांक' : 'Score'}
          </span>
          <span className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-mono">
            {score} / {total}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
            {language === 'hi' ? 'सटीकता' : 'Accuracy'}
          </span>
          <span className={`text-lg sm:text-xl font-black font-mono ${percentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {percentage}%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
            {language === 'hi' ? 'समय' : 'Time'}
          </span>
          <span className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-mono">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      </div>

      {/* Mastery Status Banner */}
      {isMastered ? (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'hi'
              ? 'आपकी प्रगति में यह विषय "Mastered (दक्ष)" के रूप में अपडेट हो गया है!'
              : 'This topic has been upgraded to "Mastered" in your study dashboard!'}
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {language === 'hi'
            ? '80% से अधिक अंक प्राप्त करने पर विषय "Mastered" में गिना जाता है।'
            : 'Score 80%+ to achieve "Mastered" status for this sub-topic.'}
        </div>
      )}

      {/* Retake Button */}
      <div className="pt-2">
        <button
          onClick={onRetake}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rajasthan-saffron hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'hi' ? 'पुनः अभ्यास करें (Retake Quiz)' : 'Retake Quiz'}</span>
        </button>
      </div>

    </div>
  );
};
