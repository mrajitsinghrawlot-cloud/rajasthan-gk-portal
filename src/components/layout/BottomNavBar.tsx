import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Search, 
  BarChart3
} from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'study' | 'quiz';
  onSelectTab: (tab: 'study' | 'quiz') => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenDashboard: () => void;
  isSidebarOpen: boolean;
  isDashboardOpen: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSidebar,
  onOpenSearch,
  onOpenDashboard,
  isSidebarOpen,
  isDashboardOpen,
}) => {
  const { language } = useLanguage();

  const navItems = [
    {
      id: 'topics',
      label: language === 'hi' ? 'विषय' : 'Topics',
      icon: BookOpen,
      action: onOpenSidebar,
      isActive: isSidebarOpen,
      badge: null
    },
    {
      id: 'study',
      label: language === 'hi' ? 'नोट्स' : 'Notes',
      icon: FileText,
      action: () => onSelectTab('study'),
      isActive: !isSidebarOpen && !isDashboardOpen && activeTab === 'study',
      badge: null
    },
    {
      id: 'quiz',
      label: language === 'hi' ? 'क्विज़' : 'Quiz',
      icon: CheckSquare,
      action: () => onSelectTab('quiz'),
      isActive: !isSidebarOpen && !isDashboardOpen && activeTab === 'quiz',
      badge: 'MCQ'
    },
    {
      id: 'search',
      label: language === 'hi' ? 'खोजें' : 'Search',
      icon: Search,
      action: onOpenSearch,
      isActive: false,
      badge: null
    },
    {
      id: 'progress',
      label: language === 'hi' ? 'प्रगति' : 'Stats',
      icon: BarChart3,
      action: onOpenDashboard,
      isActive: isDashboardOpen,
      badge: null
    }
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                active 
                  ? 'text-rajasthan-saffron font-bold' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {/* Active Indicator Background Pill */}
              {active && (
                <span className="absolute inset-0 bg-rajasthan-saffron/10 dark:bg-rajasthan-saffron/20 rounded-2xl -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-extrabold bg-rajasthan-saffron text-white rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
