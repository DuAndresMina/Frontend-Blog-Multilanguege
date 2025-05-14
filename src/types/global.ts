export interface LogoData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Logo: {
    id: number;
    name: string;
    url: string;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
  };
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

export interface MetaDescriptionData {
  id: number;
  documentId: string;
  DescriptionGlobal: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations: {
    id: number;
    DescriptionGlobal: string;
    locale: string;
  }[];
}

export interface MetaTitleData {
  id: number;
  documentId: string;
  TituloPrincipal: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations: {
    id: number;
    TituloPrincipal: string;
    locale: string;
  }[];
}

export interface RedesSocial {
  Plataforma: string;
  URL: string;
}

export interface SocialMediaData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  RedesSocial: RedesSocial;
}

export interface GlobalResponse<T> {
  data: T;
  meta: Record<string, any>;
} 