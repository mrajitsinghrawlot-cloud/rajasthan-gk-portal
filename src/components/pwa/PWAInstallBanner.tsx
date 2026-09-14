import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { PWAUpdateModal } from './PWAUpdateModal';
import { APP_VERSION } from '../../data/versionInfo';
import { Download, X, Smartphone, WifiOff, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallBannerProps {
  isWhatNewOpen?: boolean;
  setIsWhatNewOpen?: (open: boolean) => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isWhatNewOpen: externalWhatNewOpen,
  setIsWhatNewOpen: externalSetIsWhatNewOpen
}) => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallDismissed, setIsInstallDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [internalWhatNewOpen, setInternalWhatNewOpen] = useState(false);
  const [isUpdateDismissed, setIsUpdateDismissed] = useState(false);

  // Vite PWA Service Worker Hook
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`[PWA] Service Worker registered at ${swUrl}`);
      // Check for updates periodically (every 30 mins)
      if (r) {
        setInterval(async () => {
          if (!(!r.installing && navigator)) return;
          if (('connection' in navigator) && !navigator.onLine) return;
          try {
            await r.update();
          } catch (e) {
            console.log('[PWA] Periodic update check failed', e);
          }
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[PWA] SW registration error', error);
    },
  });

  const isModalOpen = externalWhatNewOpen !== undefined ? externalWhatNewOpen : internalWhatNewOpen;
  const setModalOpen = externalSetIsWhatNewOpen || setInternalWhatNewOpen;

  useEffect(() => {
    // Check if running in standalone PWA mode
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

  const handleUpdateReload = () => {
    updateServiceWorker(true);
    localStorage.setItem('rj_last_seen_version', APP_VERSION);
  };

  return (
    <>
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-fade-in z-50">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span className="truncate">
            {language === 'hi' 
              ? 'ऑफ़लाइन मोड: सभी सहेजे गए 38 इतिहास नोट्स बिना इंटरनेट के उपलब्ध हैं।' 
              : 'Offline Mode: All 38 History study notes are available offline.'}
          </span>
        </div>
      )}

      {/* PWA Service Worker Update Available Notification Bar / Toast */}
      {needRefresh && !isUpdateDismissed && (
        <div className="fixed top-16 right-3 left-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white border-2 border-rajasthan-saffron/80 p-3.5 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-xl animate-slide-down">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rajasthan-saffron to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-white">
                    {language === 'hi' ? 'नया अपडेट उपलब्ध!' : 'Update Available!'}
                  </h4>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-emerald-500 text-white rounded">
                    {APP_VERSION}
                  </span>
                </div>
                <button
                  onClick={() => setIsUpdateDismissed(true)}
                  className="text-stone-400 hover:text-white p-1"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-stone-300 mt-1 leading-tight line-clamp-2">
                {language === 'hi'
                  ? 'राजस्थान इतिहास (38 टॉपिक + 386 MCQs) का नया वर्जन लोड करने के लिए रीलोड करें।'
                  : 'New version ready with 38 History topics & 386 authenticated MCQs.'}
              </p>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleUpdateReload}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-rajasthan-saffron to-amber-600 hover:from-amber-600 hover:to-rajasthan-saffron text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-transform active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'अभी अपडेट करें' : 'Update Now'}</span>
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 px-2 py-1.5 font-bold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'क्या नया है?' : 'What\'s New'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA App Install Banner */}
      {deferredPrompt && !isInstallDismissed && !isInstalled && (
        <div className="fixed bottom-20 lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-stone-900/95 text-white border border-rajasthan-saffron/40 p-3.5 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-lg animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rajasthan-saffron to-amber-600 flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-xs sm:text-sm text-stone-100 flex items-center gap-1.5 truncate">
                  <span>{language === 'hi' ? 'राजस्थान GK ऐप इंस्टॉल करें' : 'Install Rajasthan GK App'}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500 text-white rounded">PWA</span>
                </h4>
                <button 
                  onClick={() => setIsInstallDismissed(true)}
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
                  onClick={() => setIsInstallDismissed(true)}
                  className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1.5 font-medium"
                >
                  {language === 'hi' ? 'बाद में' : 'Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive What's New & Release Changelog Modal */}
      <PWAUpdateModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          localStorage.setItem('rj_last_seen_version', APP_VERSION);
        }}
        isUpdateAvailable={needRefresh}
        onUpdate={handleUpdateReload}
      />
    </>
  );
};
