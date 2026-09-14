import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SubTopicSummary } from '../../types/taxonomy';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';

interface TopicNavigationProps {
  prevSubtopic?: SubTopicSummary | null;
  nextSubtopic?: SubTopicSummary | null;
  onSelectSubtopic: (sub: SubTopicSummary) => void;
}

export const TopicNavigation: React.FC<TopicNavigationProps> = ({
  prevSubtopic,
  nextSubtopic,
  onSelectSubtopic,
}) => {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelect = (sub: SubTopicSummary) => {
    onSelectSubtopic(sub);
    scrollToTop();
  };

  if (!prevSubtopic && !nextSubtopic) {
    return null;
  }

  return (
    <div className="pt-8 pb-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
      {/* Quick Scroll to Top Action */}
      <div className="flex justify-center">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold transition-all active:scale-95 shadow-2xs cursor-pointer"
          title={language === 'hi' ? 'पृष्ठ के शीर्ष पर जाएं' : 'Scroll to top'}
        >
          <ArrowUp className="w-3.5 h-3.5 text-rajasthan-saffron" />
          <span>{language === 'hi' ? 'शीर्ष पर जाएं (Top)' : 'Back to Top'}</span>
        </button>
      </div>

      {/* Navigation Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Previous Topic Button */}
        {prevSubtopic ? (
          <button
            onClick={() => handleSelect(prevSubtopic)}
            className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 shadow-2xs hover:shadow-md transition-all text-left active:scale-[0.99] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/70 text-stone-600 dark:text-stone-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors">
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  {language === 'hi' ? 'पिछला विषय' : 'Previous Topic'}
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                  {prevSubtopic.id}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-rajasthan-saffron font-hi truncate mt-0.5 transition-colors">
                {t(prevSubtopic.title)}
              </p>
            </div>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Topic Button */}
        {nextSubtopic && (
          <button
            onClick={() => handleSelect(nextSubtopic)}
            className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-white to-amber-50/40 dark:from-stone-900 dark:to-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-2xs hover:shadow-md transition-all text-right active:scale-[0.99] sm:col-start-2 cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-1.5 py-0.2 rounded">
                  {nextSubtopic.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {language === 'hi' ? 'अगला विषय' : 'Next Topic'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-rajasthan-saffron font-hi truncate mt-0.5 transition-colors">
                {t(nextSubtopic.title)}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rajasthan-saffron to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
