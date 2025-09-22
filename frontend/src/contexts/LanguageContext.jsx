import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default English
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('synergyLanguage');
    const hasVisited = localStorage.getItem('synergyHasVisited');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (!hasVisited) {
      setShowLanguageModal(true);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('synergyLanguage', lang);
    localStorage.setItem('synergyHasVisited', 'true');
    setShowLanguageModal(false);
  };

  const t = (translations) => {
    return translations[language] || translations.en;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      t,
      showLanguageModal,
      setShowLanguageModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
};