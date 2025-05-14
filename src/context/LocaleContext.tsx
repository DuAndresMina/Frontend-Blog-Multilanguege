import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocaleContextType {
  locale: string;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'es-CO',
  toggleLocale: () => {}
});

interface LocaleProviderProps {
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') || 'es-CO';
      console.log('LocaleProvider - Inicializando con locale:', savedLocale);
      return savedLocale;
    }
    console.log('LocaleProvider - Inicializando con locale por defecto: es-CO');
    return 'es-CO';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('LocaleProvider - useEffect - Guardando locale:', locale);
      localStorage.setItem('locale', locale);
      document.documentElement.lang = locale.split('-')[0];
      console.log('LocaleProvider - useEffect - Emitiendo evento localeChange');
      window.dispatchEvent(new Event('localeChange'));
    }
  }, [locale]);

  const toggleLocale = () => {
    console.log('LocaleProvider - toggleLocale - Valor actual:', locale);
    setLocale(prev => {
      const newLocale = prev === 'es-CO' ? 'en' : 'es-CO';
      console.log('LocaleProvider - toggleLocale - Nuevo valor:', newLocale);
      return newLocale;
    });
  };

  return React.createElement(
    LocaleContext.Provider,
    { value: { locale, toggleLocale } },
    children
  );
};

export const useLocale = () => useContext(LocaleContext);