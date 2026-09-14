import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import type { MCQQuestion } from '../../types/content';
import type { SubTopicSummary } from '../../types/taxonomy';
import { QuestionCard } from './QuestionCard';
import { QuizSummary } from './QuizSummary';
import { ArrowLeft, ArrowRight, Clock, HelpCircle } from 'lucide-react';

interface QuizEngineProps {
  subtopicId: string;
  subtopicTitle: string;
  questions: MCQQuestion[];
  nextSubtopic?: SubTopicSummary | null;
  onSelectNextTopic?: (sub: SubTopicSummary) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  subtopicId,
  subtopicTitle,
  questions,
  nextSubtopic,
  onSelectNextTopic,
}) => {
  const { language } = useLanguage();
  const { saveQuizResult } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number;
    if (!isCompleted && questions.length > 0) {
      interval = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted, questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500">
        <HelpCircle className="w-10 h-10 mx-auto mb-2 text-stone-400 opacity-60" />
        <p>{language === 'hi' ? 'इस विषय के लिए प्रश्नोत्तर तैयार किए जा रहे हैं।' : 'MCQ Questions for this subtopic are currently being prepared.'}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex] || null;

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct_option) {
          correctCount++;
        }
      });
      saveQuizResult(subtopicId, correctCount, questions.length, seconds);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
    setSeconds(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCompleted) {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option) score++;
    });

    return (
      <QuizSummary
        score={score}
        total={questions.length}
        timeSpentSeconds={seconds}
        onRetake={handleRetake}
        subtopicTitle={subtopicTitle}
        nextSubtopic={nextSubtopic}
        onSelectNextTopic={onSelectNextTopic}
      />
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const isCurrentAnswered = selectedOption !== null;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Progress & Timer Bar */}
      <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0 font-mono">
            {answeredCount}/{questions.length}
          </span>
          <div className="w-20 sm:w-36 h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rajasthan-saffron transition-all duration-300 rounded-full"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-600 dark:text-stone-400 shrink-0">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
          </span>
        </div>
      </div>

      {/* Active Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        showExplanation={showExplanation}
        onToggleExplanation={() => setShowExplanation(prev => !prev)}
      />

      {/* Navigation Buttons (Thumb Reachable) */}
      <div className="flex items-center justify-between gap-3 pt-1 pb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'पिछला' : 'Prev'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentAnswered}
          className="flex-1 max-w-xs flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-rajasthan-saffron to-orange-600 hover:from-orange-600 hover:to-rajasthan-saffron text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all"
        >
          <span>
            {currentIndex === questions.length - 1
              ? (language === 'hi' ? 'परिणाम देखें' : 'View Result')
              : (language === 'hi' ? 'अगला प्रश्न' : 'Next Question')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
