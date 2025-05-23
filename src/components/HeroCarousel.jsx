import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const API_BASE_URL = 'https://strapi-blog-multilanguage.onrender.com/api';
const API_BASE_URL_img = 'https://strapi-blog-multilanguage.onrender.com';

/**
 * HeroCarousel Component
 * A full-width carousel for featuring recent or important posts
 */
export default function HeroCarousel() {
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

  // Fetch de posts recientes
  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/blog-posts?fields=Titulo,slug,Contenido,FechaPublicacion,locale&populate[ImagenDestacada][fields]=url,formats&populate[autor][fields]=Nombre&populate[categoria][fields]=Nombre,slug&populate[localizations][fields]=Titulo,slug,locale&locale=${locale}&sort[0]=FechaPublicacion:desc&pagination[limit]=3`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentPosts();
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
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl bg-red-50 flex items-center justify-center">
        <p className="text-red-500">Error al cargar los posts: {error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No hay posts disponibles</p>
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
                    src={`${API_BASE_URL_img}${imgUrl}`} 
                    alt={attr.Titulo} 
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <a 
                      href={`/posts/${attr.slug}?lang=${locale}`} 
                      className="block"
                    >
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white hover:text-blue-300 transition-colors duration-300 line-clamp-2 mb-2">
                        {attr.Titulo}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-200">
                        <span>{formatDate(attr.FechaPublicacion)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{attr.autor?.Nombre}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{attr.categoria?.Nombre}</span>
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