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
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5 transition-colors">
      
      {/* Question Header & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold font-mono">
            {questionNumber}
          </span>
          <span className="text-xs text-stone-400 font-medium">
            / {totalQuestions} {language === 'hi' ? 'प्रश्न' : 'Questions'}
          </span>
        </div>

        {question.pyq_source && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-mono">
            <Award className="w-3.5 h-3.5" />
            {question.pyq_source}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug font-hi">
        {t(question.question)}
      </h3>

      {/* Options List */}
      <div className="grid gap-2.5">
        {question.options.map(opt => {
          const isThisSelected = selectedOption === opt.id;
          const isThisCorrect = opt.id === question.correct_option;

          let btnStyle = 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 font-bold';
            } else if (isThisSelected) {
              btnStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20 font-bold';
            } else {
              btnStyle = 'opacity-50 bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
            >
              {/* Option Letter Circle */}
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono ${
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
              <span className="flex-1 font-hi pt-0.5">{t(opt.text)}</span>

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
        <div className="pt-2">
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isCorrect
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'hi' ? 'सही उत्तर!' : 'Correct Answer!'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <XCircle className="w-4 h-4" />
                    {language === 'hi' ? 'गलत उत्तर! (सही विकल्प: ' + question.correct_option + ')' : 'Incorrect! (Correct is ' + question.correct_option + ')'}
                  </span>
                )}
              </div>

              <button
                onClick={onToggleExplanation}
                className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'विस्तृत व्याख्या' : 'Detailed Explanation'}</span>
                {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Explanation Content */}
            {showExplanation && (
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-hi pt-2 border-t border-stone-200/60 dark:border-stone-800 leading-relaxed">
                {t(question.explanation)}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
