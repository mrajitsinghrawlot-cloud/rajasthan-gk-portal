import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Download, X, Smartphone, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-fade-in z-50">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span className="truncate">
            {language === 'hi' 
              ? 'ऑफ़लाइन मोड: सभी सहेजे गए नोट्स बिना इंटरनेट के उपलब्ध हैं।' 
              : 'Offline Mode: All saved study notes are available offline.'}
          </span>
        </div>
      )}

      {/* PWA Android App Install Floating Banner */}
      {deferredPrompt && !isDismissed && !isInstalled && (
        <div className="fixed bottom-20 lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-stone-900/95 text-white border border-rajasthan-saffron/40 p-3.5 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-lg animate-slide-up">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rajasthan-saffron to-amber-600 flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            {/* Banner Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-xs sm:text-sm text-stone-100 flex items-center gap-1.5 truncate">
                  <span>{language === 'hi' ? 'राजस्थान GK ऐप इंस्टॉल करें' : 'Install Rajasthan GK App'}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500 text-white rounded">PWA</span>
                </h4>
                <button 
                  onClick={() => setIsDismissed(true)}
                  className="text-stone-400 hover:text-white p-1"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-2 leading-tight">
                {language === 'hi'
                  ? 'होम स्क्रीन पर जोड़ें। तेज़ स्पीड, बिना इंटरनेट ऑफलाइन अध्ययन।'
                  : 'Add to home screen for 1-tap launch, native app feel & offline access.'}
              </p>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-rajasthan-saffron to-amber-600 hover:from-amber-600 hover:to-rajasthan-saffron text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-transform active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'इंस्टॉल करें' : 'Install'}</span>
                </button>

                <button
                  onClick={() => setIsDismissed(true)}
                  className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1.5 font-medium"
                >
                  {language === 'hi' ? 'बाद में' : 'Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
