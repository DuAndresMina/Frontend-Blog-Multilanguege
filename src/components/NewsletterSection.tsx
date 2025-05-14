import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NewsletterSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-24 px-4 mb-24">
      <div 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] bg-repeat"
            data-aos="zoom-in"
            data-aos-duration="2000"
          >
            <div 
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] bg-repeat opacity-50"
              data-aos="zoom-out"
              data-aos-duration="2500"
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Mantente Informado
          </h2>
          <p 
            className="text-blue-100 mb-8 text-lg"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Suscríbete a nuestro newsletter para recibir las últimas noticias y artículos directamente en tu correo.
          </p>
          
          <form 
            className="flex flex-col md:flex-row gap-4 justify-center"
            data-aos="flip-up"
            data-aos-delay="600"
          >
            <div className="relative flex-1 max-w-md mx-auto md:mx-0 group">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-6 py-3 rounded-xl text-gray-900 bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 group-hover:scale-[1.02]"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
            </div>
            
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-white text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105"
              data-aos="zoom-in"
              data-aos-delay="800"
            >
              Suscribirse
            </button>
          </form>

          <p 
            className="mt-4 text-sm text-blue-200"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            Al suscribirte, aceptas recibir correos electrónicos de marketing. Puedes darte de baja en cualquier momento.
          </p>
        </div>

        {/* Decorative Elements */}
        <div 
          className="absolute -top-12 -right-12 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"
          data-aos="fade-left"
          data-aos-duration="2000"
        ></div>
        <div 
          className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"
          data-aos="fade-right"
          data-aos-duration="2000"
        ></div>
      </div>
    </section>
  );
} 