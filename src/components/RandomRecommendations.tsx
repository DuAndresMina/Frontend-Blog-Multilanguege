import type { BlogPost } from '../types/blog';
import BlogCard from './BlogCard';

interface RandomRecommendationsProps {
  posts: BlogPost[];
  excludeIds?: number[];
}

// Función para generar un número pseudoaleatorio determinista
function deterministicRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRandomPosts(posts: BlogPost[], count: number, excludeIds: number[] = []) {
  const filtered = posts.filter(post => !excludeIds.includes(post.id));
  
  // Usar el ID del primer post como semilla para mantener consistencia
  const seed = filtered[0]?.id || 0;
  
  // Ordenar usando el valor determinista
  const shuffled = [...filtered].sort((a, b) => {
    const randomA = deterministicRandom(seed + a.id);
    const randomB = deterministicRandom(seed + b.id);
    return randomA - randomB;
  });
  
  return shuffled.slice(0, count);
}

export default function RandomRecommendations({ posts, excludeIds = [] }: RandomRecommendationsProps) {
  const recommendations = getRandomPosts(posts, 3, excludeIds);

  return (
    <section className="max-w-7xl mx-auto mt-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          Te puede interesar
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre más contenido seleccionado especialmente para ti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recommendations.map((post, index) => (
          <div
            key={post.id}
            className="transform transition-all duration-500 hover:-translate-y-1 animate-fadeInUp"
            style={{ 
              animationDelay: `${index * 150}ms`,
            }}
          >
            <div className="h-full hover:-translate-y-1 h-full transform transition-all duration-500">
              <BlogCard post={post} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 