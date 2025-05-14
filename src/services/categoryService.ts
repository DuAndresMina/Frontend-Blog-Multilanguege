import type { CategoryResponse } from '../types/category';

const STRAPI_URL = 'http://localhost:1337';

export async function getCategories(locale: string): Promise<CategoryResponse> {
  const response = await fetch(`${STRAPI_URL}/api/categorias?populate=*&locale=${locale}`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}