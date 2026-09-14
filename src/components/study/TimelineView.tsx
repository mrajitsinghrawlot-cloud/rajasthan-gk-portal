import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TimelineEvent } from '../../types/content';
import { Calendar, Clock } from 'lucide-react';

interface TimelineViewProps {
  timeline?: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const { t, language } = useLanguage();

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <Clock className="w-8 h-8 mx-auto mb-2 text-stone-400 opacity-60" />
        <p>{language === 'hi' ? 'इस विषय के लिए कालक्रम घटनाएँ उपलब्ध नहीं हैं।' : 'No timeline events recorded for this topic.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      <div className="relative border-l-2 border-amber-300 dark:border-amber-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-stone-900 shadow-md">
              <Calendar className="w-4 h-4" />
            </div>

            {/* Event Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-700 shadow-2xs transition-all">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-mono text-xs font-bold mb-2">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{item.year_or_era}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-hi leading-snug">
                {t(item.event)}
              </h4>
              {item.significance && (
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 font-hi">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    {language === 'hi' ? 'महत्व: ' : 'Significance: '}
                  </span>
                  {t(item.significance)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
