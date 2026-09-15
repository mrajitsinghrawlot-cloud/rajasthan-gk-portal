import React, { useState, useRef, useEffect } from 'react';
import { useHighlight, HIGHLIGHT_COLORS, type HighlightColor } from '../../context/HighlightContext';
import { useLanguage } from '../../context/LanguageContext';
import { Highlighter, ChevronDown, Check } from 'lucide-react';

export const HighlightToggle: React.FC = () => {
  const { highlightEnabled, toggleHighlight, highlightColor, setHighlightColor } = useHighlight();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentColorObj = HIGHLIGHT_COLORS.find(c => c.id === highlightColor) || HIGHLIGHT_COLORS[0];

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <div className="flex items-center bg-stone-100 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 rounded-2xl p-1 shadow-2xs">
        
        {/* Toggle Button */}
        <button
          onClick={toggleHighlight}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            highlightEnabled
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs ring-1 ring-stone-200 dark:ring-stone-600'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
          title={highlightEnabled ? 'Highlighter Mode: ON' : 'Highlighter Mode: OFF'}
        >
          <div
            className="w-4 h-4 rounded-md flex items-center justify-center transition-colors"
            style={{ backgroundColor: highlightEnabled ? currentColorObj.dotColor : '#a8a29e' }}
          >
            <Highlighter className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-hi text-[11px] sm:text-xs">
            {language === 'hi' ? 'हाइलाइटर' : 'Highlighter'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              highlightEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300 dark:bg-stone-600'
            }`}
          />
        </button>

        {/* Color Picker Dropdown Trigger */}
        {highlightEnabled && (
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors ml-0.5"
            title="Change Highlight Color"
            aria-label="Change Highlight Color"
          >
            <span
              className="inline-block w-3.5 h-3.5 rounded-full border border-white dark:border-stone-800 shadow-2xs"
              style={{ backgroundColor: currentColorObj.dotColor }}
            />
            <ChevronDown className="w-3 h-3 inline-block ml-0.5 text-stone-400" />
          </button>
        )}
      </div>

      {/* Popover Color Picker */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-2 py-1 font-hi">
            {language === 'hi' ? 'हाइलाइट रंग चुनें' : 'Select Highlight Color'}
          </div>
          <div className="space-y-1 mt-1">
            {HIGHLIGHT_COLORS.map(color => {
              const isSelected = highlightColor === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => {
                    setHighlightColor(color.id as HighlightColor);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs border border-stone-200/50 dark:border-stone-700/50"
                      style={{ backgroundColor: color.dotColor }}
                    />
                    <span className="font-hi text-xs">{color.label[language] || color.label.hi}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
