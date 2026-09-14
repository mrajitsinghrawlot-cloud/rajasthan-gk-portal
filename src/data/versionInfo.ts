export interface ReleaseNote {
  version: string;
  codeName: {
    hi: string;
    en: string;
  };
  releaseDate: string;
  isLatest?: boolean;
  highlights: {
    title: {
      hi: string;
      en: string;
    };
    description: {
      hi: string;
      en: string;
    };
    iconName?: string;
    tag?: string;
  }[];
  detailedLog?: {
    category: {
      hi: string;
      en: string;
    };
    items: {
      hi: string;
      en: string;
    }[];
  }[];
}

export const APP_VERSION = 'v3.0.0';
export const RELEASE_DATE = '15 सितम्बर 2026';

export const RELEASES_HISTORY: ReleaseNote[] = [
  {
    version: 'v3.0.0',
    codeName: {
      hi: 'सम्पूर्ण राजस्थान इतिहास महा-रिलीज़',
      en: 'Complete Rajasthan History Master Release'
    },
    releaseDate: '15 Sep 2026',
    isLatest: true,
    highlights: [
      {
        title: {
          hi: 'राजस्थान का इतिहास (Subject A) 100% पूर्ण',
          en: 'Rajasthan History (Subject A) 100% Completed'
        },
        description: {
          hi: 'इकाई A.01 (शिलालेख व सिक्के) से लेकर इकाई A.09 (एकीकरण के 7 चरण व पंचायती राज) तक समस्त 38 टॉपिक अब विस्तृत नोट्स व 4 मोड्स के साथ उपलब्ध हैं।',
          en: 'All 38 history topics from Unit A.01 (Inscriptions & Coins) through Unit A.09 (7 Stages of Integration & Panchayati Raj) are live.'
        },
        iconName: 'Crown',
        tag: 'Major Feature'
      },
      {
        title: {
          hi: '386+ प्रामाणिक बहुविकल्पीय प्रश्न (MCQs)',
          en: '386+ Authenticated Bilingual MCQs'
        },
        description: {
          hi: 'प्रत्येक टॉपिक में 10 प्रामाणिक प्रश्न हिंदी ग्रंथ अकादमी, RPSC (RAS, 1st/2nd Grade) एवं RSSB (CET, पटवारी, पुलिस) PYQ संदर्भों के साथ (0 डुप्लीकेट)।',
          en: '10 unique authenticated MCQs per topic with Hindi Granth Academy and RPSC/RSSB PYQ citations with zero duplication.'
        },
        iconName: 'CheckCircle2',
        tag: 'Authentic'
      },
      {
        title: {
          hi: 'स्मार्ट टॉपिक नेविगेशन (Next / Prev Buttons)',
          en: 'Seamless Smart Topic Navigation'
        },
        description: {
          hi: 'नोट्स के अंत में सीधे अगले/पिछले टॉपिक पर जाने के लिए क्विक कार्ड्स और क्विज समाप्त होने पर डायरेक्ट "अगला टॉपिक" बटन।',
          en: 'Previous/Next topic cards at the bottom of notes with auto-scroll and direct Next Topic button in Quiz summary.'
        },
        iconName: 'Navigation',
        tag: 'UI/UX'
      },
      {
        title: {
          hi: 'रियल-टाइम PWA अपडेट व ऑफलाइन मोड',
          en: 'Real-time PWA Updates & Offline Engine'
        },
        description: {
          hi: 'नया कंटेंट आते ही तुरंत अपडेट सूचना और बिना इंटरनेट के भी सभी अध्ययन नोट्स व क्विज का सुरक्षित ऑफलाइन एक्सेस।',
          en: 'Instant update prompt on new releases and complete offline access for on-the-go revision.'
        },
        iconName: 'Zap',
        tag: 'PWA'
      }
    ],
    detailedLog: [
      {
        category: {
          hi: 'जोड़े गए नए विषय (New Topics Added)',
          en: 'New Topics Added'
        },
        items: [
          {
            hi: 'मध्यकालीन प्रशासनिक व राजस्व व्यवस्था (A.05.01, A.05.02, A.05.03 — सामंतशाही, लाटा-कूंता, 84 लाग-बाग व सैन्य व्यूहरचना)',
            en: 'Medieval Administration & Revenue System (Feudal hierarchy, Lata-Kunta, 84 Cesses, Military Defense)'
          },
          {
            hi: '1857 की क्रांति (A.06.01, A.06.02, A.06.03 — 6 छावनियाँ, आऊवा व कुशलसिंह, कोटा का जनविद्रोह)',
            en: '1857 Revolt in Rajasthan (6 Cantonments, Auwa Resistance & Kushal Singh, Kota Mass Rebellion)'
          },
          {
            hi: 'किसान एवं जनजातीय आंदोलन (A.07.01, A.07.02, A.07.03 — बिजोलिया, बेंगू, बूंदी, नीमूचाणा, मानगढ़ धाम व एकी आंदोलन)',
            en: 'Peasant & Tribal Movements (Bijolia, Bengu, Bundi, Neemuchana, Mangarh & Eki Movement)'
          },
          {
            hi: 'प्रजामण्डल आंदोलन एवं स्वतंत्रता सेनानी (A.08.01, A.08.02, A.08.03, A.08.04 — 19 प्रजामण्डल, बारहठ परिवार, वीरांगनाएँ व प्रेस)',
            en: 'Praja Mandals & Freedom Fighters (19 Praja Mandals, Barhath Family, Women Martyrs & Freedom Press)'
          },
          {
            hi: 'राजस्थान का एकीकरण एवं पंचायती राज (A.09.01, A.09.02, A.09.03 — 7 चरण, विभाग सारणी, 2 अक्टूबर 1959 नागौर)',
            en: 'Rajasthan Integration & Panchayati Raj (7 Stages, Master Matrix, Oct 2 1959 Nagaur Launch)'
          }
        ]
      },
      {
        category: {
          hi: 'सिस्टम व परफॉरमेंस सुधार (System & Performance)',
          en: 'System & Performance'
        },
        items: [
          {
            hi: 'सभी 41 टॉपिक फाइलों का कड़ा स्कीमा प्रमाणीकरण एवं 0 डुप्लीकेट MCQ सत्यापन',
            en: 'Strict schema verification and 0 duplicate MCQ validation across all 41 topic files'
          },
          {
            hi: 'PWA सर्विस वर्कर कैशिंग एवं ऑटोमैटिक अपडेट सिंक प्रणाली',
            en: 'Optimized PWA service worker caching and background update synchronization'
          }
        ]
      }
    ]
  }
];
