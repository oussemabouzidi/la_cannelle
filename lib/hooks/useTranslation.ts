'use client';

import { useState, useEffect } from 'react';
import { translations, TranslationModule } from '../translations';
export type Language = 'EN' | 'DE';

export function useTranslation(module: TranslationModule = 'common') {
  const [language, setLanguage] = useState<Language>('DE');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage === 'EN' || savedLanguage === 'DE') {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Toggle between EN and DE
  const toggleLanguage = () => {
    changeLanguage(language === 'EN' ? 'DE' : 'EN');
  };

  // Simple, safe translation resolution with fallback to EN and common
  const mod = translations[module] ?? translations.common;
  const baseEN = translations.common.EN;
  const baseLang = translations.common[language] ?? baseEN;
  const modEN = mod.EN ?? {};
  const modLang = mod[language] ?? modEN;

  // Merge common + module so missing keys still resolve
  const t = { ...baseEN, ...baseLang, ...modEN, ...modLang };

  return {
    t,
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
  };
}

// Helper to get nested translation value
export function getTranslation(
  obj: any,
  path: string,
  defaultValue: string = ''
): string {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return typeof value === 'string' ? value : defaultValue;
}
