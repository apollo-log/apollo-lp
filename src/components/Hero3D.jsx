import { useEffect, useRef } from 'react';
import { initHero3D } from '../lib/hero3d.js';

export function Hero3D() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    return initHero3D(canvasRef.current);
  }, []);
  return <canvas ref={canvasRef} id="hero-canvas" />;
}
