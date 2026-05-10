import { useEffect } from 'react';
import { track } from '../lib/analytics.js';

const MILESTONES = [25, 50, 75, 100];

export function useScrollDepth() {
  useEffect(() => {
    const fired = new Set();
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / docHeight) * 100));
      for (const m of MILESTONES) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track('scroll_depth', { percent: m });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // capture initial position (e.g. anchor reload)
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
