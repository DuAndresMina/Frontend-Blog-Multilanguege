import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import CategorySelector from './CategorySelector';

/**
 * CategoryPostBrowser Component
 * - Lista categorías con toggle de idioma.
 * - Filtra posts por categoría seleccionada.
 * - Paginación de posts (6 por página).
 * 
 * Uso en Astro:
 * ```astro
 * ---
 * import CategoryPostBrowser from '../components/CategoryPostBrowser.jsx';
 * ---
 * <CategoryPostBrowser client:load />
 * ```
 */
const API_BASE_URL = 'https://strapi-blog-multilanguage.onrender.com/api';
const API_BASE_URL_img = 'https://strapi-blog-multilanguage.onrender.com';
const PAGE_SIZE = 6;

export default function CategoryPostBrowser() {
  const [locale, setLocale] = useState('es-CO');
  const [categories, setCategories] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  // Memoized formatDate function
  const formatDate = useCallback((d) => new Date(d).toLocaleDateString(
    locale === 'es-CO' ? 'es-CO' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  ), [locale]);

  // Memoized fetch function for categories
  const fetchCategories = useCallback(async () => {
    setLoadingCats(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categorias?locale=${locale}&populate=*`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingCats(false);
    }
  }, [locale]);

  // Memoized fetch function for recent posts
  const fetchRecentPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog-posts?fields=Titulo,slug,Contenido,FechaPublicacion,locale&populate[ImagenDestacada][fields]=url,formats&populate[autor][fields]=Nombre&populate[categoria][fields]=Nombre,slug&populate[localizations][fields]=Titulo,slug,locale&locale=${locale}&sort[0]=FechaPublicacion:desc&pagination[limit]=3`
      );
      if (!response.ok) throw new Error('Failed to fetch recent posts');
      const data = await response.json();
      setRecentPosts(data.data);
    } catch (err) {
      console.error('Error fetching recent posts:', err);
    }
  }, [locale]);

  // Memoized fetch function for posts
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const params = new URLSearchParams({
        fields: 'Titulo,slug,Contenido,FechaPublicacion,locale',
        'populate[ImagenDestacada][fields]': 'url,formats',
        'populate[autor][fields]': 'Nombre',
        'populate[categoria][fields]': 'Nombre,slug',
        'populate[localizations][fields]': 'Titulo,slug,locale',
        locale,
        'pagination[page]': page,
        'pagination[pageSize]': PAGE_SIZE
      });

      if (selectedSlug) {
        params.append('filters[categoria][slug][$eq]', selectedSlug);
      }

      const response = await fetch(`${API_BASE_URL}/blog-posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.data);
      setPageCount(data.meta.pagination.pageCount);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingPosts(false);
    }
  }, [locale, selectedSlug, page]);

  // Memoized toggle locale function
  const toggleLocale = useCallback(() => {
    setLocale(prev => prev === 'es-CO' ? 'en' : 'es-CO');
    setSelectedSlug(null);
    setPage(1);
  }, []);

  // Memoized category selection handler
  const handleCategorySelect = useCallback((slug) => {
    setSelectedSlug(slug);
    setPage(1);
  }, []);

  // Memoized pagination handlers
  const handlePrevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, pageCount));
  }, [pageCount]);

  // Memoized post card component
  const PostCard = useCallback(({ post }) => {
    const attr = post.attributes || post;
    const imgUrl = attr.ImagenDestacada?.[0]?.formats?.small?.url || attr.ImagenDestacada?.[0]?.url;
    
    return (
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <a href={`/posts/${attr.slug}?lang=${locale}`} className="block">
          {imgUrl && (
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={`${API_BASE_URL_img}${imgUrl}`}
                alt={attr.ImagenDestacada?.[0]?.alternativeText || attr.Titulo}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {attr.categoria?.Nombre}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {formatDate(attr.FechaPublicacion)}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {attr.Titulo}
            </h3>
            {attr.autor && (
              <div className="mt-2 sm:mt-4 flex items-center">
                <div className="text-xs sm:text-sm text-gray-600">
                  {locale === 'es-CO' ? 'Por' : 'By'} {attr.autor.Nombre}
                </div>
              </div>
            )}
          </div>
        </a>
      </article>
    );
  }, [locale, formatDate]);

  // Memoized pagination component
  const Pagination = useMemo(() => {
    if (pageCount <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-blue-500 hover:text-blue-500"
          aria-label={locale === 'es-CO' ? 'Página anterior' : 'Previous page'}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${
              page === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={page === pageCount}
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-blue-500 hover:text-blue-500"
          aria-label={locale === 'es-CO' ? 'Página siguiente' : 'Next page'}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }, [page, pageCount, locale, handlePrevPage, handleNextPage]);

  // Effects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramLocale = params.get('lang');
    if (paramLocale) setLocale(paramLocale);

    const handleLocaleChange = (event) => {
      setLocale(event.detail.locale);
      setSelectedSlug(null);
      setPage(1);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchRecentPosts();
  }, [fetchRecentPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Loading state
  if (loadingCats || loadingPosts) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-8 sm:space-y-12">
      <CategorySelector
        categories={categories}
        selectedSlug={selectedSlug}
        onSelect={handleCategorySelect}
        locale={locale}
        loading={loadingCats}
        error={error}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {Pagination}
    </div>
  );
}
