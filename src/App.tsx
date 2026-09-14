import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import type { MasterTaxonomy, SubTopicSummary } from './types/taxonomy';
import taxonomyDataRaw from './data/taxonomy.json';
import { getSubTopicDetail } from './data/contentLoader';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ContentViewer, type StudyTabType } from './components/study/ContentViewer';
import { StudyDashboard } from './components/dashboard/StudyDashboard';
import { GlobalSearch } from './components/search/GlobalSearch';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { Menu, BarChart3 } from 'lucide-react';

const taxonomy = taxonomyDataRaw as unknown as MasterTaxonomy;

const MainContent: React.FC = () => {
  // Default selected subtopic: B.01.01 (Panchpir)
  const defaultSubtopic = taxonomy.subjects[1]?.units[0]?.subtopics[0] || taxonomy.subjects[0].units[0].subtopics[0];
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopicSummary>(defaultSubtopic);
  const [activeStudyTab, setActiveStudyTab] = useState<StudyTabType>('notes');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('rj_study_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rj_study_dark_mode', String(darkMode));
  }, [darkMode]);

  const activeContent = getSubTopicDetail(selectedSubtopic);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-rajasthan-charcoal text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* PWA / Android Offline and Install Banners */}
      <PWAInstallBanner />

      {/* Header Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          taxonomy={taxonomy}
          selectedSubtopicId={selectedSubtopic.id}
          onSelectSubtopic={(sub) => {
            setSelectedSubtopic(sub);
            setActiveStudyTab('notes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary Study Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          
          {/* Mobile Quick Action Pill */}
          <div className="lg:hidden mb-4 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 active:scale-95 transition-transform"
            >
              <Menu className="w-4 h-4 text-rajasthan-saffron" />
              <span>{selectedSubtopic.id} • Browse Topics</span>
            </button>
            <button
              onClick={() => setIsDashboardOpen(true)}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 active:scale-95 transition-transform"
              title="Progress Dashboard"
            >
              <BarChart3 className="w-5 h-5 text-rajasthan-saffron" />
            </button>
          </div>

          {/* Active Subtopic Content Viewer */}
          <ContentViewer 
            content={activeContent} 
            activeTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
          />
        </main>

      </div>

      {/* Mobile Android-Style Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeStudyTab === 'quiz' ? 'quiz' : 'study'}
        onSelectTab={(tab) => {
          if (tab === 'quiz') setActiveStudyTab('quiz');
          if (tab === 'study') setActiveStudyTab('notes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        isSidebarOpen={isMobileSidebarOpen}
        isDashboardOpen={isDashboardOpen}
      />

      {/* Global Modals */}
      <StudyDashboard
        taxonomy={taxonomy}
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onNavigateToSubtopic={(sub) => {
          setSelectedSubtopic(sub);
          setActiveStudyTab('notes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <GlobalSearch
        taxonomy={taxonomy}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSubtopic={(sub) => {
          setSelectedSubtopic(sub);
          setActiveStudyTab('notes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <MainContent />
      </ProgressProvider>
    </LanguageProvider>
  );
}
