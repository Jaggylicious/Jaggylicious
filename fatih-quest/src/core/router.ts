import { useEffect, useState } from 'react';

/** Minimale hash-router: werkt offline en vanaf elke map (PWA). */
export function useRoute(): string[] {
  const get = () => (window.location.hash.replace(/^#\/?/, '') || 'home').split('/');
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => {
      setRoute(get());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(path: string) {
  window.location.hash = '/' + path.replace(/^\//, '');
}
