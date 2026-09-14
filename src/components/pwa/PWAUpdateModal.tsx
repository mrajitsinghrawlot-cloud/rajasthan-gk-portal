import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { APP_VERSION, RELEASE_DATE, RELEASES_HISTORY } from '../../data/versionInfo';
import { 
  Sparkles, 
  X, 
  RefreshCw, 
  Crown, 
  CheckCircle2, 
  Navigation, 
  Zap, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';

interface PWAUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUpdateAvailable?: boolean;
  onUpdate?: () => void;
}

export const PWAUpdateModal: React.FC<PWAUpdateModalProps> = ({
  isOpen,
  onClose,
  isUpdateAvailable = false,
  onUpdate
}) => {
  const { language } = useLanguage();
  const latestRelease = RELEASES_HISTORY[0];

  if (!isOpen || !latestRelease) return null;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Navigation':
        return <Navigation className="w-5 h-5 text-blue-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-rajasthan-saffron" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header Banner */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-rajasthan-saffron text-white p-5 sm:p-6 pb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-yellow-300" />
                <span>{isUpdateAvailable ? (language === 'hi' ? 'नया अपडेट उपलब्ध!' : 'Update Available!') : (language === 'hi' ? 'नवीनतम संस्करण' : 'What\'s New')}</span>
                <span className="bg-white text-stone-900 px-1.5 py-0.2 rounded font-mono text-[10px]">{APP_VERSION}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {language === 'hi' ? latestRelease.codeName.hi : latestRelease.codeName.en}
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 mt-1 flex items-center gap-2">
                <span>{language === 'hi' ? `जारी होने की तिथि: ${RELEASE_DATE}` : `Released: ${latestRelease.releaseDate}`}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Key Feature Highlights Grid */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rajasthan-saffron" />
              <span>{language === 'hi' ? 'प्रमुख नई सुविधाएँ एवं विस्तार' : 'Major Highlights in this Version'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latestRelease.highlights.map((h, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex flex-col gap-2 hover:border-rajasthan-saffron/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white dark:bg-stone-700 shadow-2xs">
                        {getIcon(h.iconName)}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-snug">
                        {language === 'hi' ? h.title.hi : h.title.en}
                      </h4>
                    </div>
                    {h.tag && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
                        {h.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-1">
                    {language === 'hi' ? h.description.hi : h.description.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Changelog List */}
          {latestRelease.detailedLog && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-rajasthan-saffron" />
                <span>{language === 'hi' ? 'विस्तृत अपडेट सूची' : 'Detailed Changelog'}</span>
              </h3>

              <div className="space-y-3">
                {latestRelease.detailedLog.map((cat, idx) => (
                  <div key={idx} className="rounded-2xl bg-stone-100/70 dark:bg-stone-800/40 p-3.5 border border-stone-200/60 dark:border-stone-700/40">
                    <h5 className="font-bold text-xs text-stone-800 dark:text-stone-200 mb-2">
                      {language === 'hi' ? cat.category.hi : cat.category.en}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-rajasthan-saffron shrink-0 mt-0.5" />
                          <span>{language === 'hi' ? item.hi : item.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/90 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 text-center sm:text-left">
            <span>{language === 'hi' ? 'सभी 38 इतिहास टॉपिक 100% ऑफलाइन कैश में उपलब्ध' : 'All 38 History topics cached for offline access'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isUpdateAvailable && onUpdate ? (
              <button
                onClick={onUpdate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rajasthan-saffron to-amber-600 hover:from-amber-600 hover:to-rajasthan-saffron text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>{language === 'hi' ? 'अभी अपडेट और रीलोड करें' : 'Update & Reload Now'}</span>
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm transition-all text-center"
            >
              {language === 'hi' ? 'समझ गए / बंद करें' : 'Got it / Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
