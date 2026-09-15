import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import { HighlightProvider } from './context/HighlightContext';
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
  // Default selected subtopic: A.01.01 (Inscriptions & Prashastis)
  const defaultSubtopic = taxonomy.subjects[0]?.units[0]?.subtopics[0];
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopicSummary>(defaultSubtopic);
  const [activeStudyTab, setActiveStudyTab] = useState<StudyTabType>('notes');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
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

  // Flatten all subtopics across taxonomy for sequential Previous/Next navigation
  const allSubtopics = React.useMemo<SubTopicSummary[]>(() => {
    return taxonomy.subjects.flatMap(s => s.units.flatMap(u => u.subtopics));
  }, []);

  const currentTopicIndex = allSubtopics.findIndex(s => s.id === selectedSubtopic.id);
  const prevSubtopic = currentTopicIndex > 0 ? allSubtopics[currentTopicIndex - 1] : null;
  const nextSubtopic = currentTopicIndex !== -1 && currentTopicIndex < allSubtopics.length - 1 ? allSubtopics[currentTopicIndex + 1] : null;

  const handleSelectSubtopic = (sub: SubTopicSummary) => {
    setSelectedSubtopic(sub);
    setActiveStudyTab('notes');
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeContent = getSubTopicDetail(selectedSubtopic);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-rajasthan-charcoal text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* PWA / Android Offline and Install Banners & Update Modal */}
      <PWAInstallBanner 
        isWhatNewOpen={isWhatsNewOpen}
        setIsWhatNewOpen={setIsWhatsNewOpen}
      />

      {/* Header Bar */}
      <Header
        onOpenSearch={() => {
          setIsMobileSidebarOpen(false);
          setIsSearchOpen(true);
        }}
        onOpenDashboard={() => {
          setIsMobileSidebarOpen(false);
          setIsDashboardOpen(true);
        }}
        onOpenWhatsNew={() => {
          setIsMobileSidebarOpen(false);
          setIsWhatsNewOpen(true);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          taxonomy={taxonomy}
          selectedSubtopicId={selectedSubtopic.id}
          onSelectSubtopic={handleSelectSubtopic}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary Study Content Area */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          
          {/* Mobile Quick Action Pill */}
          <div className="lg:hidden mb-3.5 flex items-center justify-between gap-2 p-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 active:scale-95 transition-transform truncate"
            >
              <Menu className="w-4 h-4 text-rajasthan-saffron shrink-0" />
              <span className="truncate">{selectedSubtopic.id} • Browse Topics</span>
            </button>
            <button
              onClick={() => {
                setIsMobileSidebarOpen(false);
                setIsDashboardOpen(true);
              }}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 active:scale-95 transition-transform"
              title="Progress Dashboard"
            >
              <BarChart3 className="w-5 h-5 text-rajasthan-saffron" />
            </button>
          </div>

          {/* Active Subtopic Content Viewer */}
          <ContentViewer 
            key={activeContent.id}
            content={activeContent} 
            activeTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
            prevSubtopic={prevSubtopic}
            nextSubtopic={nextSubtopic}
            onSelectSubtopic={handleSelectSubtopic}
          />
        </main>

      </div>

      {/* Mobile Android-Style Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeStudyTab === 'quiz' ? 'quiz' : 'study'}
        onSelectTab={(tab) => {
          setIsMobileSidebarOpen(false);
          if (tab === 'quiz') setActiveStudyTab('quiz');
          if (tab === 'study') setActiveStudyTab('notes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenSearch={() => {
          setIsMobileSidebarOpen(false);
          setIsSearchOpen(true);
        }}
        onOpenDashboard={() => {
          setIsMobileSidebarOpen(false);
          setIsDashboardOpen(true);
        }}
        isSidebarOpen={isMobileSidebarOpen}
        isDashboardOpen={isDashboardOpen}
      />

      {/* Global Modals */}
      <StudyDashboard
        taxonomy={taxonomy}
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onNavigateToSubtopic={handleSelectSubtopic}
      />

      <GlobalSearch
        taxonomy={taxonomy}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSubtopic={handleSelectSubtopic}
      />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <HighlightProvider>
          <MainContent />
        </HighlightProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
}
