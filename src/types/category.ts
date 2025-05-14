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
  blog_posts: {
    id: number;
    documentId: string;
    Titulo: string;
    slug: string;
    Contenido: string;
    FechaPublicacion: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  }[];
  localizations: {
    id: number;
    documentId: string;
    Nombre: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    Descripcion: string;
  }[];
  attributes: {
    Icono?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 