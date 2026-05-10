import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { pt } from './pt.js';
import { en } from './en.js';

const DICTS = { pt, en };
const STORAGE_KEY = 'apollo.lang';

const I18nContext = createContext(null);

function detectInitial() {
  if (typeof window === 'undefined') return 'pt';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt' || stored === 'en') return stored;
  } catch {
    /* localStorage blocked */
  }
  const nav = (navigator.language || 'pt').toLowerCase();
  return nav.startsWith('pt') ? 'pt' : 'en';
}

// Resolve "a.b.c" path against a nested dict. Returns the key itself if not found
// (so missing translations show up loudly instead of silently rendering "").
function resolve(dict, path) {
  const parts = path.split('.');
  let cur = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return path;
  }
  return cur;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);

  const value = useMemo(() => {
    const dict = DICTS[lang] ?? pt;
    const t = (key) => resolve(dict, key);
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export function useT() {
  return useI18n().t;
}
