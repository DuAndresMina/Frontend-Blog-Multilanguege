import React, { useState, useCallback } from 'react';

const API_BASE_URL = 'https://strapi-blog-multilanguage.onrender.com/api';

/**
 * LanguageToggle Component
 * A button that toggles between languages (es-CO and en)
 * 
 * @param {Object} props
 * @param {string} props.locale - Current locale ('es-CO' or 'en')
 * @param {Function} props.onToggle - Function to handle locale change
 */
export default function LanguageToggle({ locale, onToggle }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    // Si estamos en una página de post
    if (window.location.pathname.startsWith('/posts/')) {
      setIsLoading(true);
      try {
        const currentSlug = window.location.pathname.split('/posts/')[1].split('?')[0];
        const targetLocale = locale === 'es-CO' ? 'en' : 'es-CO';
        
        // Hacer la petición a la API para obtener el post correspondiente
        const response = await fetch(
          `${API_BASE_URL}/blog-posts?filters[slug][$eq]=${currentSlug}&locale=${targetLocale}&populate=localizations`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch post localization');
        }
        
        const data = await response.json();
        const localizedSlug = data.data?.[0]?.attributes?.localizations?.data?.[0]?.attributes?.slug;
        
        if (localizedSlug) {
          // Redirigir al post en el otro idioma
          window.location.href = `/posts/${localizedSlug}?lang=${targetLocale}`;
        } else {
          // Si no se encuentra el post en el otro idioma, solo cambiar el idioma
          onToggle();
        }
      } catch (error) {
        console.error('Error switching post language:', error);
        // En caso de error, intentar cambiar el idioma de todos modos
        onToggle();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Para otras páginas, usar el comportamiento normal
      onToggle();
    }
  }, [locale, onToggle]);

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isLoading ? 'Changing language...' : `Switch to ${locale === 'es-CO' ? 'English' : 'Spanish'}`}
    >
      <span className="text-sm font-medium">
        {isLoading ? '...' : (locale === 'es-CO' ? 'EN' : 'ES')}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5h12M9 3v18m1-8l4 4-4 4" 
        />
      </svg>
    </button>
  );
} 