import { useEffect, useState } from 'react';
import LanguageToggle from './LanguageToggle';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
const API_BASE_URL_img = import.meta.env.PUBLIC_API_IMG_URL;

export default function MinimalNavbar() {
  const [logoUrl, setLogoUrl] = useState('');
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [locale, setLocale] = useState('es-CO');
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Preload logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/logo?populate[Logo][fields]=url,formats`;
        const response = await fetch(apiUrl, { priority: 'high' });
        const data = await response.json();
        
        if (data?.data?.Logo?.url) {
          const logoUrl = data.data.Logo.formats?.small?.url || data.data.Logo.url;
          
          // Preload logo image
          const img = new Image();
          img.src = logoUrl;
          img.onload = () => {
            setLogoUrl(logoUrl);
            setLogoLoaded(true);
          };
        } else {
          console.warn('No logo URL found in the response:', data);
          setLogoLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoLoaded(true);
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

  // Init locale from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramLocale = params.get('lang');
    if (paramLocale) setLocale(paramLocale);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(search.trim())}&lang=${locale}`;
    }
  };

  const toggleLocale = () => {
    const newLocale = locale === 'es-CO' ? 'en' : 'es-CO';
    setLocale(newLocale);
    
    // Update URL with new locale
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLocale);
    window.history.pushState({}, '', url);

    // Dispatch custom event for other components to react to locale change
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale: newLocale } }));
  };

  if (!logoLoaded) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        {logoUrl && (
          <a href={`/?lang=${locale}`} className="group">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 filter drop-shadow-lg" 
              loading="eager"
              fetchpriority="high"
            />
          </a>
        )}
        <form className="flex-1 max-w-md ml-auto" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={locale === 'es-CO' ? "Buscar artículos..." : "Search articles..."}
              className={`w-full px-4 py-2 rounded-full border transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white/90 border-gray-200 shadow-md' 
                  : 'bg-white/80 border-white/50 shadow-lg'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500`}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none" />
          </div>
        </form>

        <LanguageToggle locale={locale} onToggle={toggleLocale} />
      </div>
    </nav>
  );
} 