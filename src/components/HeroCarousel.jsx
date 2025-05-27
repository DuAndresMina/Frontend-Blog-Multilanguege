import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
const API_BASE_URL_img = import.meta.env.PUBLIC_API_IMG_URL;

// Preload Swiper styles
const preloadStyles = () => {
  const links = [
    { rel: 'preload', href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', as: 'style' },
    { rel: 'preload', href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', as: 'script' }
  ];
  
  links.forEach(link => {
    const linkElement = document.createElement('link');
    Object.assign(linkElement, link);
    document.head.appendChild(linkElement);
  });
};

/**
 * HeroCarousel Component
 * A full-width carousel for featuring recent or important posts
 */
export default function HeroCarousel() {
  const [locale, setLocale] = useState('es-CO');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload styles on mount
  useEffect(() => {
    preloadStyles();
  }, []);

  // Formateo de fecha
  const formatDate = useCallback(
    (d) => new Date(d).toLocaleDateString(
      locale === 'es-CO' ? 'es-CO' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    ),
    [locale]
  );

  // Preload images
  const preloadImages = useCallback((posts) => {
    const imagePromises = posts.map(post => {
      const attr = post.attributes || post;
      const imgUrl = attr.ImagenDestacada?.[0]?.url;
      if (imgUrl) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = imgUrl;
          img.onload = resolve;
          img.onerror = reject;
        });
      }
      return Promise.resolve();
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(err => console.error('Error preloading images:', err));
  }, []);

  // Fetch de posts recientes
  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/blog-posts?fields=Titulo,slug,Contenido,FechaPublicacion,locale&populate[ImagenDestacada][fields]=url,formats&populate[autor][fields]=Nombre&populate[categoria][fields]=Nombre,slug&populate[localizations][fields]=Titulo,slug,locale&locale=${locale}&sort[0]=FechaPublicacion:desc&pagination[limit]=3`,
          { priority: 'high' }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data.data || []);
        if (data.data) {
          preloadImages(data.data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentPosts();
  }, [locale, preloadImages]);

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

  if (loading || !imagesLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-500 font-medium">Error al cargar los posts: {error}</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No hay posts disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      <Swiper 
        modules={[Autoplay, Pagination, Navigation]} 
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
        autoplay={{ 
          delay: 3000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }} 
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' w-2 h-2 bg-white/50 hover:bg-white transition-all duration-300"></span>';
          }
        }} 
        navigation={{
          enabled: true,
          hideOnClick: true,
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }}
        className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden"
      >
        {posts.map(post => {
          const attr = post.attributes || post;
          const imgUrl = attr.ImagenDestacada?.[0]?.url;
          
          return (
            <SwiperSlide key={post.id} className="w-full h-full">
              <div className="relative w-full h-full">
                {imgUrl && (
                  <img 
                    src={imgUrl} 
                    alt={attr.Titulo} 
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                    fetchpriority="high"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <a 
                      href={`/posts/${attr.slug}?lang=${locale}`} 
                      className="block text-left"
                    >
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white hover:text-blue-300 transition-colors duration-300 line-clamp-2 mb-3">
                        {attr.Titulo}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-200">
                        <span className="whitespace-nowrap">{formatDate(attr.FechaPublicacion)}</span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="whitespace-nowrap">{attr.autor?.Nombre}</span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="whitespace-nowrap">{attr.categoria?.Nombre}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
} 