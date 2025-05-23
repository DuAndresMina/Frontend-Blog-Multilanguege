import React, { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = 'https://strapi-blog-multilanguage.onrender.com/api';
const API_BASE_URL_img = 'https://strapi-blog-multilanguage.onrender.com';

/**
 * SearchPosts Component
 * Displays search results in a grid layout
 * 
 * @param {Object} props
 * @param {string} props.initialQuery - Initial search query
 * @param {string} props.initialLocale - Initial locale
 */
export default function SearchPosts({ initialQuery = '', initialLocale = 'es-CO' }) {
  const [locale, setLocale] = useState(initialLocale);
  const [allPosts, setAllPosts] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized formatDate function
  const formatDate = useCallback((date) => new Date(date).toLocaleDateString(
    locale === 'es-CO' ? 'es-CO' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  ), [locale]);

  // Memoized fetch posts function
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog-posts?populate=*&locale=${locale}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const json = await response.json();
        if (json.data) {
          setAllPosts(json.data);
          setFiltered(json.data);
        }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Memoized filter function
  const filterPosts = useCallback((posts, searchQuery) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;

    const terms = q.split(/\s+/);
    return posts.filter(post => {
      const haystack = [
        post.Titulo,
        post.Contenido,
        post.categoria?.Nombre,
        post.autor?.Nombre
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return terms.every(term => haystack.includes(term));
    });
  }, []);

  // Memoized PostCard component
  const PostCard = useCallback(({ post }) => {
          const imgUrl = post.ImagenDestacada?.[0]?.formats?.large?.url || 
                        post.ImagenDestacada?.[0]?.formats?.medium?.url ||
                        post.ImagenDestacada?.[0]?.url;
          
          console.log('SearchPosts - imgUrl:', imgUrl);
          console.log('SearchPosts - post.ImagenDestacada:', post.ImagenDestacada);
          
          return (
            <article 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <a href={`/posts/${post.slug}?lang=${locale}`} className="block">
                <div className="flex flex-col md:flex-row">
                  {imgUrl && (
                    <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                      <img
                  src={`${API_BASE_URL_img}${imgUrl}`}
                        alt={post.ImagenDestacada?.[0]?.alternativeText || post.Titulo}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        {post.categoria?.Nombre && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {post.categoria.Nombre}
                          </span>
                        )}
                        {post.FechaPublicacion && (
                          <span className="text-gray-500 text-sm">
                            {formatDate(post.FechaPublicacion)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                        {post.Titulo}
                      </h3>
                      {post.autor && (
                        <div className="mt-auto">
                          <div className="text-sm text-gray-600">
                            {locale === 'es-CO' ? 'Por' : 'By'} {post.autor.Nombre}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </article>
            
          );
  }, [locale, formatDate]);

  // Memoized empty state message
  const EmptyState = useMemo(() => {
    if (!query) {
      return (
        <p className="text-gray-600">
          {locale === 'es-CO'
            ? 'Por favor ingresa una palabra clave para buscar artículos.'
            : 'Please enter a keyword to search articles.'}
        </p>
      );
    }
    return (
      <p className="text-gray-600">
        {locale === 'es-CO'
          ? `No se encontraron resultados para "${query}".`
          : `No results found for "${query}".`}
      </p>
    );
  }, [query, locale]);

  // Effects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    const q = params.get('q');
    if (lang) setLocale(lang);
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setFiltered(filterPosts(allPosts, query));
  }, [query, allPosts, filterPosts]);

  // Loading state
  if (loading) {
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

  // Empty state
  if (!filtered || filtered.length === 0) {
    return (
      <div className="text-center py-8">
        {EmptyState}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
