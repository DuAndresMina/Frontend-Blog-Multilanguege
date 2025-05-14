import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const [locale, setLocale] = useState('es-CO');
  
  // Cargar el valor inicial de locale desde localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'es-CO';
    setLocale(savedLocale);
    console.log('LanguageSwitcher - Cargando locale inicial:', savedLocale);
  }, []);
  
  const handleLanguageChange = () => {
    console.log('Antes de cambiar idioma:', locale);
    
    // Cambiar el idioma directamente (sin usar contexto)
    const newLocale = locale === 'es-CO' ? 'en' : 'es-CO';
    
    // Actualizar localStorage
    localStorage.setItem('locale', newLocale);
    console.log('Nuevo locale guardado en localStorage:', newLocale);
    
    // Actualizar el estado local
    setLocale(newLocale);
    
    // Forzar la actualización del atributo lang directamente en el elemento HTML
    document.documentElement.lang = newLocale.split('-')[0];
    console.log('Atributo lang actualizado manualmente a:', document.documentElement.lang);
    
    // Disparar evento personalizado para que otros componentes se enteren
    window.dispatchEvent(new Event('localeChange'));
    
    console.log('Recargando página...');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <button 
      onClick={handleLanguageChange}
      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition-all duration-300 flex items-center justify-center"
      aria-label={locale === 'es-CO' ? 'Cambiar a inglés' : 'Switch to Spanish'}
    >
      {locale === 'es-CO' ? 'EN' : 'ES'}
    </button>
  );
};

export default LanguageSwitcher;