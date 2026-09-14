import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import {
  Search,
  Languages,
  Sun,
  Moon,
  BarChart3
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenDashboard: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenDashboard,
  darkMode,
  onToggleDarkMode
}) => {
  const { language, toggleLanguage, ui } = useLanguage();
  const { globalMetrics } = useProgress();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-rajasthan-cardDark/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rajasthan-saffron to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <span className="font-bold text-xl font-devanagari">रा</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  {ui('app_title')}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                  v3.0
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                {ui('app_subtitle')}
              </p>
            </div>
          </div>

          {/* Search Trigger Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl transition-all shadow-inner"
            >
              <Search className="w-4 h-4 text-rajasthan-saffron" />
              <span className="truncate">{ui('search_placeholder')}</span>
              <kbd className="ml-auto hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Overall Progress Widget Button */}
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all text-xs sm:text-sm font-medium shadow-xs"
            >
              <BarChart3 className="w-4 h-4 text-rajasthan-saffron" />
              <span className="hidden sm:inline">{ui('dashboard')}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-rajasthan-saffron text-white text-xs font-bold">
                {globalMetrics.overallPercentage}%
              </span>
            </button>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-rajasthan-saffron transition-all text-xs sm:text-sm font-semibold shadow-xs"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-4 h-4 text-rajasthan-saffron" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
