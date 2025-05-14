import type { FaviconResponse } from '../types/favicon';

export async function getFavicon(): Promise<FaviconResponse> {
  const response = await fetch('http://localhost:1337/api/favicon?populate=*');
  if (!response.ok) {
    throw new Error('Failed to fetch favicon');
  }
  return response.json();
} 