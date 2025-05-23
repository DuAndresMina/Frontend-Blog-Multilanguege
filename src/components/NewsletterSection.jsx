import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NewsletterSection() {
  const [locale, setLocale] = useState('es-CO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Traducciones
  const translations = {
    'es-CO': {
      title: 'Mantente Informado',
      description: 'Suscríbete a nuestro newsletter para recibir las últimas noticias y artículos directamente en tu correo.',
      placeholder: 'Tu correo electrónico',
      button: 'Suscribirse',
      disclaimer: 'Al suscribirte, aceptas recibir correos electrónicos de marketing. Puedes darte de baja en cualquier momento.'
    },
    'en': {
      title: 'Stay Informed',
      description: 'Subscribe to our newsletter to receive the latest news and articles directly in your inbox.',
      placeholder: 'Your email address',
      button: 'Subscribe',
      disclaimer: 'By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.'
    }
  };

  // Inicializar AOS y manejar el locale
  useEffect(() => {
    // Inicializar AOS
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
      offset: 100
    });

    // Obtener locale inicial
    const params = new URLSearchParams(window.location.search);
    const paramLocale = params.get('lang');
    if (paramLocale) setLocale(paramLocale);

    // Escuchar cambios de locale
    const handleLocaleChange = (event) => {
      setLocale(event.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');

    try {
      setLoading(true);
      setError(null);
      
      // Aquí iría la lógica para enviar el email a tu backend
      console.log('Email a suscribir:', email);
      
      // Limpiar el formulario
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-24 px-4 mb-24">
        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-24 px-4 mb-24">
      <div 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12"
        data-aos="fade-up"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] bg-repeat"
            data-aos="zoom-in"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            data-aos="fade-down"
          >
            {translations[locale].title}
          </h2>
          <p 
            className="text-blue-100 mb-8 text-lg"
            data-aos="fade-up"
          >
            {translations[locale].description}
          </p>
          
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 justify-center"
            data-aos="flip-up"
          >
            <div className="relative flex-1 max-w-md mx-auto md:mx-0 group">
              <input
                type="email"
                name="email"
                placeholder={translations[locale].placeholder}
                className="w-full px-6 py-3 rounded-xl text-gray-900 bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 group-hover:scale-[1.02]"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-white text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              data-aos="zoom-in"
            >
              {loading ? '...' : translations[locale].button}
            </button>
          </form>

          <p 
            className="mt-4 text-sm text-blue-200"
            data-aos="fade-up"
          >
            {translations[locale].disclaimer}
          </p>
        </div>

        {/* Decorative Elements */}
        <div 
          className="absolute -top-12 -right-12 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"
          data-aos="fade-left"
        />
        <div 
          className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"
          data-aos="fade-right"
        />
      </div>
    </section>
  );
} 