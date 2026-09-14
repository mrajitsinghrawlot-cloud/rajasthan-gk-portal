import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import type { MasterTaxonomy, SubTopicSummary } from '../../types/taxonomy';
import { Search, X, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GlobalSearchProps {
  taxonomy: MasterTaxonomy;
  isOpen: boolean;
  onClose: () => void;
  onSelectSubtopic: (subtopic: SubTopicSummary) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  taxonomy,
  isOpen,
  onClose,
  onSelectSubtopic,
}) => {
  const { t, language } = useLanguage();
  const { getSubtopicProgress } = useProgress();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all subtopics with parent context
  const allSubtopics: { subtopic: SubTopicSummary; unitTitle: string; subjectTitle: string }[] = [];
  taxonomy.subjects.forEach(subj => {
    subj.units.forEach(unit => {
      unit.subtopics.forEach(sub => {
        allSubtopics.push({
          subtopic: sub,
          unitTitle: t(unit.title),
          subjectTitle: t(subj.title),
        });
      });
    });
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = allSubtopics.filter(({ subtopic, unitTitle, subjectTitle }) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    return (
      subtopic.id.toLowerCase().includes(q) ||
      subtopic.title.en.toLowerCase().includes(q) ||
      subtopic.title.hi.toLowerCase().includes(q) ||
      unitTitle.toLowerCase().includes(q) ||
      subjectTitle.toLowerCase().includes(q) ||
      subtopic.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-rajasthan-cardDark border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Search Input Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-rajasthan-saffron shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={language === 'hi' ? 'खोजें: महाराणा प्रताप, अरावली, राज्यपाल, पंचपीर...' : 'Search: Maharana Pratap, Aravalli, Governor, Panchpir...'}
            className="flex-1 bg-transparent border-none outline-none text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 font-hi"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {!query.trim() ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
              <p>{language === 'hi' ? '215+ विषयों में से किसी भी विषय या कीवर्ड को खोजें' : 'Type to search across 215+ topics and units'}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              <p>{language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No matching topics found'}</p>
            </div>
          ) : (
            results.map(({ subtopic, unitTitle, subjectTitle }) => {
              const prog = getSubtopicProgress(subtopic.id);
              return (
                <button
                  key={subtopic.id}
                  onClick={() => {
                    onSelectSubtopic(subtopic);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50/80 dark:hover:bg-amber-950/40 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      {subtopic.id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate font-hi group-hover:text-rajasthan-saffron">
                        {t(subtopic.title)}
                      </h4>
                      <p className="text-xs text-stone-400 truncate">
                        {subjectTitle} • {unitTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {subtopic.pyq_frequency === 'ultra-high' && (
                      <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    )}
                    {prog.status === 'mastered' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
