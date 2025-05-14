import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/carousel.css';
import type { BlogPost } from '../types/blog';

interface HeroSectionProps {
  posts: BlogPost[];
}

export default function HeroSection({ posts }: HeroSectionProps) {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto rounded-xl overflow-hidden mt-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-[400px] md:h-[500px]"
        >
          {posts.map((post) => {
            const imageUrl = post.ImagenDestacada[0]?.url;
            const fullImageUrl = imageUrl ? `http://localhost:1337${imageUrl}` : '';
            return (
              <SwiperSlide key={post.id}>
                <div className="relative w-full h-[400px] md:h-[500px]">
                  {fullImageUrl && (
                    <img
                      src={fullImageUrl}
                      alt={post.Titulo}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute left-0 bottom-0 p-8 w-full flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="inline-block bg-white/80 text-gray-900 text-xs font-semibold px-3 py-1 rounded mb-4">
                        {post.categoria?.Nombre}
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        {post.Titulo}
                      </h1>
                      <p className="text-white text-lg max-w-xl mb-6 drop-shadow">
                        {post.Contenido.replace(/<[^>]+>/g, '').slice(0, 120)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/60 rounded-full px-4 py-2 mt-4 md:mt-0">
                      {post.autor?.Nombre && (
                        <span className="text-white font-medium text-sm">
                          {post.autor.Nombre}
                        </span>
                      )}
                      <span className="text-gray-300 text-xs">
                        {new Date(post.FechaPublicacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-gray-400 text-xs">• 10 min de lectura</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
} 