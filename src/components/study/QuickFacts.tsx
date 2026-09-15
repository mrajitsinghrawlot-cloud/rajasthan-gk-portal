import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { QuickFact } from '../../types/content';
import { TableProperties, Copy, Check, Sparkles, Search } from 'lucide-react';

interface QuickFactsProps {
  facts?: QuickFact[];
}

export const QuickFacts: React.FC<QuickFactsProps> = ({ facts }) => {
  const { t, language } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!facts) return [];
    const set = new Set<string>();
    facts.forEach(f => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [facts]);

  const filteredFacts = useMemo(() => {
    if (!facts) return [];
    return facts.filter(fact => {
      const matchesCategory = selectedCategory === 'all' || fact.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const labelText = (fact.label.hi + ' ' + fact.label.en).toLowerCase();
      const valueText = (fact.value.hi + ' ' + fact.value.en).toLowerCase();
      return labelText.includes(q) || valueText.includes(q);
    });
  }, [facts, searchQuery, selectedCategory]);

  const handleCopy = (fact: QuickFact, index: number) => {
    const text = `${t(fact.label)}: ${t(fact.value)}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!facts || facts.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-60" />
        <p className="font-hi text-sm font-medium">
          {language === 'hi'
            ? 'इस विषय के त्वरित तथ्य (Key-Value Pairs) संकलित किए जा रहे हैं।'
            : 'Quick facts table for this topic is being prepared.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-transparent border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs shrink-0 mt-0.5">
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 font-hi">
                {language === 'hi' ? 'त्वरित तथ्य सारणी (Quick Facts Table)' : 'High-Yield Quick Facts Table'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {facts.length} {language === 'hi' ? 'तथ्य' : 'facts'}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 font-hi leading-relaxed">
              {language === 'hi'
                ? 'सीधे परीक्षा-उपयोगी तथ्य (Key-Value Format) — बिना किसी अतिरिक्त विवरण के तीव्र पुनरावृत्ति हेतु।'
                : 'Direct key-value pairs formatted for rapid exam revision with zero filler text.'}
            </p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[180px] sm:w-60 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'तथ्य खोजें...' : 'Filter facts...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-stone-900 dark:text-stone-100 placeholder-stone-400 font-hi"
          />
        </div>
      </div>

      {/* Category Pills (if present) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            {language === 'hi' ? 'सभी' : 'All'} ({facts.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Key-Value Pair Cards Grid */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {filteredFacts.map((fact, idx) => {
          const isCopied = copiedIndex === idx;
          const label = t(fact.label);
          const value = t(fact.value);

          return (
            <div
              key={idx}
              className="group relative p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-400/80 dark:hover:border-amber-700/80 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-2.5"
            >
              <div className="min-w-0 flex-1 space-y-1">
                {/* Key / Label */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold font-hi bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900/60">
                    {label}
                  </span>
                  {fact.category && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      #{fact.category}
                    </span>
                  )}
                </div>

                {/* Value */}
                <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 font-hi leading-snug pt-0.5">
                  {value}
                </p>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(fact, idx)}
                className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-500 hover:text-amber-800 dark:hover:text-amber-300 transition-all shrink-0 active:scale-90"
                title="Copy fact"
                aria-label="Copy fact"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {filteredFacts.length === 0 && searchQuery && (
        <div className="text-center py-8 text-stone-500 text-xs font-hi">
          {language === 'hi'
            ? `"${searchQuery}" से संबंधित कोई तथ्य नहीं मिला।`
            : `No facts found matching "${searchQuery}".`}
        </div>
      )}
    </div>
  );
};
