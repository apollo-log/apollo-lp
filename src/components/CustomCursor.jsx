import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onDown = () => ringRef.current?.classList.add('hover');
    const onUp = () => ringRef.current?.classList.remove('hover');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const hovers = document.querySelectorAll('a, button, .btn, .nav-cta, input, select, [data-hover]');
    const hoverHandlers = [];
    hovers.forEach((el) => {
      const enter = () => ringRef.current?.classList.add('hover');
      const leave = () => ringRef.current?.classList.remove('hover');
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      hoverHandlers.push({ el, enter, leave });
    });

    let raf;
    const loop = () => {
      dx += (mx - dx) * 0.5; dy += (my - dy) * 0.5;
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      hoverHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </>
  );
}
