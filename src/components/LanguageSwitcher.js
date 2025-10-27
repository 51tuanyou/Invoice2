import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'zh', name: t('languages.zh'), flag: '🇨🇳' },
    { code: 'ja', name: t('languages.ja'), flag: '🇯🇵' }
  ];

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        <button className="language-button">
          <span className="current-flag">
            {languages.find(lang => lang.code === i18n.language)?.flag || '🇺🇸'}
          </span>
          <span className="current-language">
            {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>
        <div className="language-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => changeLanguage(language.code)}
            >
              <span className="flag">{language.flag}</span>
              <span className="name">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

