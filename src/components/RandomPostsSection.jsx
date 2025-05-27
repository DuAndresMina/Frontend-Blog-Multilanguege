import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
const API_BASE_URL_img = import.meta.env.PUBLIC_API_IMG_URL;

/**
 * RandomPostsSection Component
 * Displays a grid of random posts that might interest the user
 */
export default function RandomPostsSection() {
  const [locale, setLocale] = useState('es-CO');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formateo de fecha
  const formatDate = useCallback(
    (d) => new Date(d).toLocaleDateString(
      locale === 'es-CO' ? 'es-CO' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    ),
    [locale]
  );

  // Fetch de posts aleatorios
  useEffect(() => {
    async function fetchRandomPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/blog-posts?fields=Titulo,slug,Contenido,FechaPublicacion,locale&populate[ImagenDestacada][fields]=url,formats&populate[autor][fields]=Nombre&populate[categoria][fields]=Nombre,slug&populate[localizations][fields]=Titulo,slug,locale&locale=${locale}&sort[0]=FechaPublicacion:desc`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const all = data.data;
        const shuffled = all.sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 3));
      } catch (err) {
        console.error('Error fetching random posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRandomPosts();
  }, [locale]);

  // Cambio de idioma
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramLocale = params.get('lang');
    if (paramLocale) setLocale(paramLocale);

    const handleLocaleChange = (event) => {
      setLocale(event.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">Error al cargar los posts: {error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        {locale === 'es-CO' ? 'Te puede interesar' : 'You May Be Interested'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => {
          const attr = post.attributes || post;
          const imgUrl = attr.ImagenDestacada?.[0]?.formats?.small?.url || attr.ImagenDestacada?.[0]?.url;
          
          return (
            <a 
              key={post.id} 
              href={`/posts/${attr.slug}?lang=${locale}`} 
              className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {imgUrl && (
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={imgUrl} 
                    alt={attr.Titulo} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {attr.Titulo}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(attr.FechaPublicacion)}
                </p>
                {attr.categoria && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {attr.categoria.Nombre}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
} 