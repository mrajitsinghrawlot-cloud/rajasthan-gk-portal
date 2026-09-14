import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { BilingualText } from '../../types/taxonomy';
import { AlertOctagon, ShieldAlert, Sparkles } from 'lucide-react';

interface ExamTrapsProps {
  traps?: BilingualText[];
}

export const ExamTraps: React.FC<ExamTrapsProps> = ({ traps }) => {
  const { t, language } = useLanguage();

  if (!traps || traps.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-stone-400 opacity-60" />
        <p>{language === 'hi' ? 'इस विषय के लिए कोई विशेष परीक्षा भ्रम (Traps) दर्ज नहीं हैं।' : 'No specific exam traps documented for this topic yet.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">
            {language === 'hi' ? 'सावधानी: RPSC/RSSB के परीक्षा जाल (Exam Traps)' : 'Examiner Traps & Common Confusion Points'}
          </h4>
          <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
            {language === 'hi'
              ? 'वे भ्रामक विकल्प व तथ्य जहाँ विद्यार्थी सर्वाधिक नकारात्मक अंक (Negative Marking) खाते हैं।'
              : 'Subtle tricks and confusing options repeatedly used in Rajasthan competitive exams to mislead aspirants.'}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {traps.map((trap, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border-l-4 border-l-rose-500 border border-stone-200 dark:border-stone-800 shadow-2xs flex items-start gap-3"
          >
            <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed font-hi">
              {t(trap)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
