import React, { useState, useEffect } from 'react';

/**
 * CategorySelector Component
 * Displays categories in a grid for desktop and select for mobile
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of categories
 * @param {string} props.selectedSlug - Currently selected category slug
 * @param {Function} props.onSelect - Function to handle category selection
 * @param {string} props.locale - Current locale
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error state
 */
export default function CategorySelector({ 
  categories, 
  selectedSlug, 
  onSelect, 
  locale, 
  loading, 
  error 
}) {
  // Default to desktop view to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center py-4">{error}</p>;
  }

  // Show desktop view during SSR and initial render
  if (!mounted || !isMobile) {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">
          {locale === 'es-CO' ? 'Explora por Categoría' : 'Explore by Category'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onSelect(null)}
            className={`group p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              !selectedSlug 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-lg ${
                !selectedSlug 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </span>
              <span className="font-medium">
                {locale === 'es-CO' ? 'Todas las categorías' : 'All categories'}
              </span>
            </div>
          </button>
          
          {categories.map(cat => {
            const isSelected = (cat.attributes?.slug || cat.slug) === selectedSlug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.attributes?.slug || cat.slug)}
                className={`group p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="font-medium">
                    {cat.attributes?.Nombre || cat.Nombre}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile view with select
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        {locale === 'es-CO' ? 'Filtrar por Categoría' : 'Filter by Category'}
      </h3>
      <select
        value={selectedSlug || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        className="w-full border p-3 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
      >
        <option value="">{locale === 'es-CO' ? 'Todas las categorías' : 'All categories'}</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.attributes?.slug || cat.slug}>
            {cat.attributes?.Nombre || cat.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
} 