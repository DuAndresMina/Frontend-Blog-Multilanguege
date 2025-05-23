export function getLocaleFromUrl() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') === 'en' ? 'en' : 'es-CO';
  }
  return 'es-CO';
} 