import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { MCQQuestion } from '../../types/content';
import { CheckCircle2, XCircle, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: MCQQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  showExplanation,
  onToggleExplanation,
}) => {
  const { t, language } = useLanguage();

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correct_option;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-5 transition-colors">
      
      {/* Question Header & Meta */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
            {questionNumber}
          </span>
          <span className="text-xs text-stone-400 font-medium font-mono">
            / {totalQuestions} {language === 'hi' ? 'प्रश्न' : 'Q'}
          </span>
        </div>

        {question.pyq_source && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-mono">
            <Award className="w-3 h-3 text-purple-500" />
            <span>{question.pyq_source}</span>
          </span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug font-hi">
        {t(question.question)}
      </h3>

      {/* Options List (Optimized for Thumb Touches) */}
      <div className="grid gap-2.5">
        {question.options.map(opt => {
          const isThisSelected = selectedOption === opt.id;
          const isThisCorrect = opt.id === question.correct_option;

          let btnStyle = 'bg-stone-50/80 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 active:scale-[0.99]';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 font-bold';
            } else if (isThisSelected) {
              btnStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20 font-bold';
            } else {
              btnStyle = 'opacity-40 bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full min-h-[50px] text-left p-3 sm:p-4 rounded-2xl border text-sm font-medium transition-all flex items-start gap-3 touch-manipulation ${btnStyle}`}
            >
              {/* Option Letter Circle */}
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono mt-0.5 ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && isThisSelected
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {opt.id}
              </span>

              {/* Option Text */}
              <span className="flex-1 font-hi pt-0.5 leading-relaxed">{t(opt.text)}</span>

              {/* Status Icons */}
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer & Explanation Box */}
      {isAnswered && (
        <div className="pt-1">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                {isCorrect ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'hi' ? 'सही उत्तर!' : 'Correct Answer!'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <XCircle className="w-4 h-4" />
                    {language === 'hi' ? 'गलत! सही विकल्प: ' + question.correct_option : 'Incorrect! Correct: ' + question.correct_option}
                  </span>
                )}
              </div>

              <button
                onClick={onToggleExplanation}
                className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 py-1"
              >
                <span>{language === 'hi' ? 'व्याख्या' : 'Explanation'}</span>
                {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Explanation Content */}
            {showExplanation && (
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-hi pt-2 border-t border-stone-200/60 dark:border-stone-800 leading-relaxed animate-fade-in">
                {t(question.explanation)}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
