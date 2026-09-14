import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { BilingualText } from '../../types/taxonomy';
import { Zap, Copy, Check, Sparkles } from 'lucide-react';

interface RapidFactsProps {
  facts: BilingualText[];
}

export const RapidFacts: React.FC<RapidFactsProps> = ({ facts }) => {
  const { t, language } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!facts || facts.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-60" />
        <p>{language === 'hi' ? 'इस विषय के लिए त्वरित तथ्य संकलित किए जा रहे हैं।' : 'Rapid facts for this topic are being compiled.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rajasthan-saffron text-white shadow-xs shrink-0 mt-0.5">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
            {language === 'hi' ? 'स्मार्ट रीविजन वन-लाइनर्स (Smart One-Liners)' : 'High-Yield Quick Revision Bullet Points'}
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
            {language === 'hi'
              ? 'परीक्षा से पूर्व त्वरित दोहराव हेतु अति-महत्वपूर्ण तथ्यों का सार संग्रह।'
              : 'Direct fact-recall points most frequently tested by RPSC/RSSB examiners.'}
          </p>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
        {facts.map((fact, idx) => {
          const factText = t(fact);
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="group relative p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-700 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed font-hi">
                  {factText}
                </p>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(factText, idx)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-500 hover:text-amber-700 transition-all shrink-0"
                title="Copy fact"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
