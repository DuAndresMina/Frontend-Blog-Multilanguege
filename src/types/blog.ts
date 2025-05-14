export interface BlogImage {
  id: number;
  url: string;
  formats: {
    thumbnail: {
      url: string;
    };
  };
}

export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalURL?: string;
}

export interface Author {
  id: number;
  Nombre: string;
  Biografia: string;
}

export interface Category {
  id: number;
  documentId: string;
  Nombre: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  Descripcion: string;
}

export interface BlogPost {
  id: number;
  Titulo: string;
  slug: string;
  Contenido: string;
  FechaPublicacion: string;
  ImagenDestacada: BlogImage[];
  seo: BlogSEO;
  autor: Author;
  categoria: Category;
  Favicon?: {
    id: number;
    url: string;
    name: string;
    mime: string;
  };
}

export interface BlogResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 