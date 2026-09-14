import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BilingualText } from '../types/taxonomy';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (text: BilingualText | undefined) => string;
  ui: (key: string) => string;
}

const uiTranslations: Record<string, { en: string; hi: string }> = {
  app_title: { en: "Rajasthan GK Portal", hi: "राजस्थान सामान्य ज्ञान" },
  app_subtitle: { en: "RPSC & RSSB Master Study Platform", hi: "RPSC एवं RSSB महाअभ्यास पोर्टल" },
  search_placeholder: { en: "Search 215+ topics, dynasties, forts, rivers...", hi: "215+ विषय, दुर्ग, नदियाँ, खनिज, राजवंश खोजें..." },
  notes_tab: { en: "Study Notes", hi: "अध्ययन नोट्स" },
  rapid_facts_tab: { en: "Rapid Revision", hi: "त्वरित स्मरण" },
  timeline_tab: { en: "Timeline", hi: "कालक्रम" },
  traps_tab: { en: "Exam Traps", hi: "परीक्षा जाल" },
  quiz_tab: { en: "Practice Quiz", hi: "अभ्यास प्रश्नोत्तरी" },
  dashboard: { en: "My Progress", hi: "मेरी प्रगति" },
  mark_read: { en: "Mark as Read", hi: "पढ़ा हुआ चिह्नित करें" },
  mark_unread: { en: "Mark Unread", hi: "अपठित करें" },
  log_revision: { en: "Log Revision (+1)", hi: "पुनरावृत्ति दर्ज करें (+1)" },
  bookmark: { en: "Bookmark", hi: "बुकमार्क" },
  weak_topic: { en: "Flag as Weak", hi: "कमज़ोर विषय चिह्नित करें" },
  mastered: { en: "Mastered", hi: "कंठस्थ / दक्ष" },
  in_progress: { en: "In Progress", hi: "अध्ययनरत" },
  not_started: { en: "Not Started", hi: "प्रारंभ नहीं" },
  revisions: { en: "Revisions", hi: "पुनरावृत्ति" },
  overall_progress: { en: "Overall Completion", hi: "कुल पाठ्यक्रम पूर्णता" },
  all_exams: { en: "All Exams", hi: "सभी परीक्षाएँ" },
  weak_topics_title: { en: "Weak Topics Queue", hi: "ध्यान देने योग्य कमज़ोर विषय" },
  revision_due_title: { en: "Spaced Repetition Due", hi: "पुनरावृत्ति अनुस्मारक (Revision Due)" },
  export_progress: { en: "Export Backup", hi: "प्रगति बैकअप निर्यात" },
  import_progress: { en: "Import Backup", hi: "बैकअप आयात करें" },
  reset_progress: { en: "Reset All", hi: "प्रगति रीसेट" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rj_study_lang');
    return saved === 'en' ? 'en' : 'hi';
  });

  useEffect(() => {
    localStorage.setItem('rj_study_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const t = (text: BilingualText | undefined): string => {
    if (!text) return '';
    return text[language] || text['en'] || text['hi'] || '';
  };

  const ui = (key: string): string => {
    if (uiTranslations[key]) {
      return uiTranslations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, ui }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
