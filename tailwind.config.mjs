/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,vue}'],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.2'
          },
          '50%': {
            opacity: '0.3'
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          },
        },
        'pattern-shift': {
          '0%': {
            backgroundPosition: '0% 0%'
          },
          '50%': {
            backgroundPosition: '100% 100%'
          },
          '100%': {
            backgroundPosition: '0% 0%'
          }
        },
        'pattern-rotate': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        slideDown: 'slideDown 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'pattern-shift': 'pattern-shift 20s linear infinite',
        'pattern-rotate': 'pattern-rotate 30s linear infinite'
      }
    },
  },
  plugins: [],
} 