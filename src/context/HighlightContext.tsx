import React, { createContext, useContext, useState, useEffect } from 'react';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange';

export interface ColorOption {
  id: HighlightColor;
  label: { hi: string; en: string };
  bgClass: string;
  dotColor: string;
}

export const HIGHLIGHT_COLORS: ColorOption[] = [
  { id: 'yellow', label: { hi: 'पीला (Yellow)', en: 'Yellow' }, bgClass: 'bg-yellow-300 dark:bg-yellow-500/40', dotColor: '#eab308' },
  { id: 'green', label: { hi: 'हरा (Green)', en: 'Green' }, bgClass: 'bg-emerald-300 dark:bg-emerald-500/40', dotColor: '#22c55e' },
  { id: 'blue', label: { hi: 'नीला (Blue)', en: 'Blue' }, bgClass: 'bg-sky-300 dark:bg-sky-500/40', dotColor: '#0ea5e9' },
  { id: 'pink', label: { hi: 'गुलाबी (Pink)', en: 'Pink' }, bgClass: 'bg-pink-300 dark:bg-pink-500/40', dotColor: '#ec4899' },
  { id: 'orange', label: { hi: 'नारंगी (Orange)', en: 'Orange' }, bgClass: 'bg-orange-300 dark:bg-orange-500/40', dotColor: '#f97316' },
];

interface HighlightContextType {
  highlightEnabled: boolean;
  setHighlightEnabled: (enabled: boolean) => void;
  toggleHighlight: () => void;
  highlightColor: HighlightColor;
  setHighlightColor: (color: HighlightColor) => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export const HighlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highlightEnabled, setHighlightEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('rj_highlight_enabled');
    return saved !== null ? saved === 'true' : true; // Default ON so exam points stand out
  });

  const [highlightColor, setHighlightColor] = useState<HighlightColor>(() => {
    const saved = localStorage.getItem('rj_highlight_color') as HighlightColor;
    return saved && HIGHLIGHT_COLORS.some(c => c.id === saved) ? saved : 'yellow';
  });

  useEffect(() => {
    localStorage.setItem('rj_highlight_enabled', String(highlightEnabled));
  }, [highlightEnabled]);

  useEffect(() => {
    localStorage.setItem('rj_highlight_color', highlightColor);
    document.documentElement.setAttribute('data-highlight-color', highlightColor);
  }, [highlightColor]);

  const toggleHighlight = () => {
    setHighlightEnabled(prev => !prev);
  };

  return (
    <HighlightContext.Provider
      value={{
        highlightEnabled,
        setHighlightEnabled,
        toggleHighlight,
        highlightColor,
        setHighlightColor,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};
