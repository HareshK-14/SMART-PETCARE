import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  en: {
    label: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    translations: {
      nav: {
        home: 'Home',
        services: 'Services',
        shop: 'Shop',
        community: 'Community',
        emergency: 'Emergency ER',
        telehealth: 'Telehealth',
        aiScanner: 'AI Vision Scan',
        lostFound: 'Lost & Found',
        login: 'Login',
        register: 'Sign Up'
      }
    }
  },
  ta: {
    label: 'தமிழ் (Tamil)',
    flag: '🇮🇳',
    dir: 'ltr',
    translations: {
      nav: {
        home: 'முகப்பு',
        services: 'சேவைகள்',
        shop: 'கடை',
        community: 'சமூகம்',
        emergency: 'அவசரம் ER',
        telehealth: 'தொலை மருத்துவ',
        aiScanner: 'AI ஸ்கேனர்',
        lostFound: 'காணாமல் போனவர்கள்',
        login: 'உள்நுழை',
        register: 'பதிவு செய்' // (Signup)
      }
    }
  },
  hi: {
    label: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    dir: 'ltr',
    translations: {
      nav: {
        home: 'मुख्य पृष्ठ',
        services: 'सेवाएं',
        shop: 'दुकान',
        community: 'समुदाय',
        emergency: 'आपातकाल ER',
        telehealth: 'टेलीहेल्थ',
        aiScanner: 'AI दृष्टि स्कैन',
        lostFound: 'खोया और पाया',
        login: 'लॉग इन',
        register: 'साइन अप'
      }
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.dir = LANGUAGES[language].dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = LANGUAGES[language].translations;
    for (const k of keys) {
      if (value[k] === undefined) return key; // Fallback to key
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
