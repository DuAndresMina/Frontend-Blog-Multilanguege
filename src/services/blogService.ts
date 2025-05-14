import type { BlogResponse } from '../types/blog';

// Función para obtener el idioma actual
const getCurrentLocale = () => {
  if (typeof window !== 'undefined') {
    const localeFromStorage = localStorage.getItem('locale') || 'es-CO';
    console.log('getCurrentLocale() - Valor obtenido desde localStorage:', localeFromStorage);
    return localeFromStorage;
  }
  console.log('getCurrentLocale() - Valor por defecto: es-CO (no window)');
  return 'es-CO';
};

// Escuchar cambios de locale
if (typeof window !== 'undefined') {
  window.addEventListener('localeChange', () => {
    const newLocale = localStorage.getItem('locale');
    console.log('Evento localeChange detectado - Nuevo locale:', newLocale);
  });
  
  // También configurar un temporizador para comprobar periódicamente
  setInterval(() => {
    const currentLocale = localStorage.getItem('locale');
    console.log('Verificación periódica de locale:', currentLocale);
  }, 5000);
}

const STRAPI_URL = 'http://localhost:1337';

export async function getBlogPosts(): Promise<BlogResponse> {
  try {
    const locale = getCurrentLocale();
    const endpoint = `${STRAPI_URL}/api/blog-posts?locale=${locale}&populate=*&sort[0]=FechaPublicacion:desc`;
    console.log('getBlogPosts - Endpoint:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.data) {
      throw new Error('Invalid data structure from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getLatestBlogPosts(): Promise<BlogResponse> {
  const locale = getCurrentLocale();
  const endpoint = `${STRAPI_URL}/api/blog-posts?locale=${locale}&populate=*&sort[0]=FechaPublicacion:desc&pagination[limit]=3`;
  console.log('getLatestBlogPosts - Endpoint:', endpoint);
  
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to fetch latest blog posts');
  }
  return response.json();
}

export async function getBlogPost(slug: string): Promise<BlogResponse> {
  const locale = getCurrentLocale();
  const endpoint = `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`;
  console.log('getBlogPost - Endpoint:', endpoint);
  
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to fetch blog post'); 
  }
  return response.json();
} 