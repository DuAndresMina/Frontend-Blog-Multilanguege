import type { BlogResponse } from '../types/blog';

const STRAPI_URL = 'http://localhost:1337';

export async function searchBlogPosts(locale: string): Promise<BlogResponse> {
  const response = await fetch(`${STRAPI_URL}/api/blog-posts?fields[0]=Titulo&fields[1]=Contenido&populate=ImagenDestacada&locale=${locale}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts for search');
  }
  return response.json();
} 