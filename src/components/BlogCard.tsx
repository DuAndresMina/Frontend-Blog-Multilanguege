import type { BlogPost } from '../types/blog';
import { useLocale } from '../context/LocaleContext';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.ImagenDestacada?.[0]?.formats?.thumbnail?.url || post.ImagenDestacada?.[0]?.url;
  const fullImageUrl = imageUrl ? `http://localhost:1337${imageUrl}` : '';
  const { locale } = useLocale();

  // Formatear fecha según locale
  const formattedDate = post.FechaPublicacion 
    ? new Date(post.FechaPublicacion).toLocaleDateString(locale === 'es-CO' ? 'es-CO' : 'en-US')
    : '';

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {imageUrl && (
        <img
          src={fullImageUrl}
          alt={post.Titulo}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{post.Titulo}</h2>
        {formattedDate && (
          <p className="text-gray-600 mb-4">{formattedDate}</p>
        )}
        <a
          href={`/blog/${post.slug}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {locale === 'es-CO' ? 'Leer más' : 'Read more'}
        </a>
      </div>
    </article>
  );
} 