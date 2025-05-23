import { useEffect, useState, useCallback, useMemo } from 'react';
import { getLocaleFromUrl } from '../utils/getLocale';

const API_BASE_URL = 'https://strapi-blog-multilanguage.onrender.com/api';

export default function Footer() {
  const [socialMedia, setSocialMedia] = useState(null);
  const [locale, setLocale] = useState(getLocaleFromUrl());
  const currentYear = new Date().getFullYear();

  // Memoized fetch social media function
  const fetchSocialMedia = useCallback(async () => {
      try {
      const response = await fetch(`${API_BASE_URL}/redes-principal?populate=*`);
      if (!response.ok) throw new Error('Failed to fetch social media');
      const data = await response.json();
      if (data?.data?.RedesSocial) {
        setSocialMedia({
          id: data.data.id,
          RedesSocial: data.data.RedesSocial
        });
      }
      } catch (error) {
        console.error('Error fetching social media:', error);
      }
  }, []);

  // Memoized translations
  const translations = useMemo(() => ({
    'es-CO': {
      about: {
        title: 'Sobre Nosotros',
        description: 'Tu fuente confiable de noticias y artículos sobre tecnología, viajes, salud, medio ambiente y más. Mantente informado con contenido de calidad.'
      },
      quickLinks: {
        title: 'Enlaces Rápidos',
        home: 'Inicio',
        contact: 'Contacto',
      },
      social: {
        title: 'Síguenos'
      },
      copyright: 'Todos los derechos reservados.'
    },
    'en': {
      about: {
        title: 'About Us',
        description: 'Your trusted source for news and articles about technology, travel, health, environment, and more. Stay informed with quality content.'
      },
      quickLinks: {
        title: 'Quick Links',
        home: 'Home',
        contact: 'Contact',
        privacy: 'Privacy Policy'
      },
      social: {
        title: 'Follow Us'
      },
      copyright: 'All rights reserved.'
    }
  }), []);

  // Memoized social media icons
  const SocialMediaIcon = useCallback(({ platform }) => {
    const icons = {
      Facebook: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
        </svg>
      ),
      Twitter: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
        </svg>
      ),
      Instagram: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      Linkedin: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    };

    return icons[platform] || null;
  }, []);

  // Effects
  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  useEffect(() => {
    const handleLocaleChange = (event) => {
      setLocale(event.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{translations[locale].about.title}</h3>
            <p className="text-gray-400">
              {translations[locale].about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{translations[locale].quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  {translations[locale].quickLinks.home}
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  {translations[locale].quickLinks.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">{translations[locale].social.title}</h3>
            <div className="flex space-x-4">
              {socialMedia && (
                <a
                  key={socialMedia.id}
                  href={socialMedia.RedesSocial.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title={socialMedia.RedesSocial.Plataforma}
                >
                  <SocialMediaIcon platform={socialMedia.RedesSocial.Plataforma} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Blog. {translations[locale].copyright}</p>
        </div>
      </div>
    </footer>
  );
} 