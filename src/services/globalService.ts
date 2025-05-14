import type { 
  GlobalResponse, 
  LogoData, 
  MetaDescriptionData, 
  MetaTitleData, 
  SocialMediaData 
} from '../types/global';

const API_URL = 'http://localhost:1337/api';

export async function getLogo(): Promise<GlobalResponse<LogoData>> {
  const response = await fetch(`${API_URL}/logo?populate=*`);
  if (!response.ok) {
    throw new Error('Failed to fetch logo');
  }
  return response.json();
}

export async function getMetaDescription(locale: string = 'es-CO'): Promise<GlobalResponse<MetaDescriptionData>> {
  const response = await fetch(`${API_URL}/meta-descripcion-global?locale=${locale}&populate=*`);
  if (!response.ok) {
    throw new Error('Failed to fetch meta description');
  }
  return response.json();
}

export async function getMetaTitle(locale: string = 'es-CO'): Promise<GlobalResponse<MetaTitleData>> {
  const response = await fetch(`${API_URL}/meta-titulo-global?locale=${locale}&populate=*`);
  if (!response.ok) {
    throw new Error('Failed to fetch meta title');
  }
  return response.json();
}

export async function getSocialMedia() {
  const response = await fetch(`${API_URL}/redes-principal?populate=*`);
  if (!response.ok) {
    throw new Error('Error fetching social media');
  }
  return response.json() as Promise<{ data: SocialMediaData[] }>;
} 