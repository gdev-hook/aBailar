import * as Localization from 'expo-localization';
import React, { createContext, useContext, useState } from 'react';

import enTranslations from '../i18n/en.json';
import esTranslations from '../i18n/es.json';

type TranslationKey = string;
type Translations = typeof esTranslations;

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<string, Translations> = {
  es: esTranslations,
  en: enTranslations,
};

function getDeviceLocale(): string {
  const deviceLocales = Localization.getLocales();
  if (deviceLocales.length > 0) {
    const deviceLocale = deviceLocales[0].languageCode;
    // Si el idioma es español, retornar 'es', de lo contrario 'en'
    return deviceLocale === 'es' ? 'es' : 'en';
  }
  return 'es'; // Default a español
}

function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Retornar la clave si no se encuentra la traducción
    }
  }
  
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(getDeviceLocale());

  const t = (key: TranslationKey): string => {
    const translation = translations[locale] || translations.en;
    return getNestedTranslation(translation, key);
  };

  const setLocale = (newLocale: string) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
