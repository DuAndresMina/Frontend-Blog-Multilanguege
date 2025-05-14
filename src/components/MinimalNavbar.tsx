import { useEffect, useState } from 'react';
import { getLogo } from '../services/globalService';
import LanguageSwitcher from './LanguageSwitcher';

export default function MinimalNavbar() {
  const [logoUrl, setLogoUrl] = useState('');
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await getLogo();
        if (response.data?.Logo?.url) {
          setLogoUrl(`http://localhost:1337${response.data.Logo.url}`);
        }
      } catch (error) {
        // fallback: no logo
      }
    };
    fetchLogo();

    // Añadir efecto de scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
			

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        {logoUrl && (
          <a href="/" className="group">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 filter drop-shadow-lg" 
            />
          </a>
        )}
        <form className="flex-1 max-w-md ml-auto" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar artículos..."
              className={`w-full px-4 py-2 rounded-full border transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white/90 border-gray-200 shadow-md' 
                  : 'bg-white/80 border-white/50 shadow-lg'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500`}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none" />
          </div>
        </form>
        <div className="ml-4">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
} 