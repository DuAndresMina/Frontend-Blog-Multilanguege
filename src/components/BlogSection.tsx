import { useState, useEffect } from 'react';
import type { BlogPost } from '../types/blog';
import type { Category } from '../types/category';
import BlogCard from './BlogCard';
import { getBlogPosts } from '../services/blogService';

interface BlogSectionProps {
  posts: BlogPost[];
  categories: Category[];
}

const POSTS_PER_PAGE = 6;

export default function BlogSection({ posts: initialPosts, categories }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    console.log('BlogSection - Componente montado en el cliente');
  }, []);

  // Efecto para recargar los posts cuando cambia el idioma
  useEffect(() => {
    if (!isClient) return;
    
    // Función para recargar los posts desde la API
    const reloadPosts = async () => {
      try {
        console.log('BlogSection - Recargando posts del cliente');
        setIsLoading(true);
        const response = await getBlogPosts();
        if (response && response.data) {
          console.log('BlogSection - Posts recargados con éxito');
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error al recargar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Recargar al montar el componente en el cliente
    console.log('BlogSection - Cargando posts iniciales en el cliente');
    reloadPosts();
    
    // Escuchar cambios de idioma
    const handleLocaleChange = () => {
      console.log('BlogSection - Evento localeChange detectado');
      reloadPosts();
    };
    
    window.addEventListener('localeChange', handleLocaleChange);
    
    // Limpiar evento al desmontar
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
    };
  }, [isClient]);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.categoria?.slug === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    setShowDropdown(false);
  };

  return (
    <section className="max-w-7xl mx-auto mt-24 px-4">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          Explora Nuestro Blog
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre historias inspiradoras, consejos prácticos y las últimas tendencias en viajes, tecnología y estilo de vida.
        </p>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        {/* Mobile Dropdown */}
        <div className="md:hidden relative">
          <button
            className="w-full px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 font-medium flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {selectedCategory === 'all' ? 'Todas las categorías' : categories.find(c => c.slug === selectedCategory)?.Nombre}
            </span>
            <svg className={`w-5 h-5 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg z-10 overflow-hidden transform transition-all duration-300">
              <button
                className={`w-full text-left px-6 py-3 flex items-center gap-2 transition-colors duration-200 ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-blue-50'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Todas
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  className={`w-full text-left px-6 py-3 flex items-center gap-2 transition-colors duration-200 ${
                    selectedCategory === cat.slug 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.attributes?.Icono?.data && (
                    <img src={`http://localhost:1337${cat.attributes.Icono.data.attributes.url}`} alt="" className="w-5 h-5" />
                  )}
                  {cat.Nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          <button
            className={`group px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-50 border border-gray-200/50'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`group px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-50 border border-gray-200/50'
              }`}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              {cat.attributes?.Icono?.data && (
                <img 
                  src={`http://localhost:1337${cat.attributes.Icono.data.attributes.url}`} 
                  alt="" 
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                />
              )}
              {cat.Nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {paginatedPosts.map((post, index) => (
          <div 
            key={post.id}
            className="transform transition-all duration-500 hover:-translate-y-1 h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="h-full">
              <BlogCard post={post} />
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center my-12 py-8">
          <p className="text-gray-500 text-lg">No se encontraron artículos para esta categoría.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-50 border border-gray-200/50'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </section>
  );
} 