import { useEffect, useState } from 'react';

export function TelemetryChart({ color = 'var(--gold)', spike = false }) {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 60 }, (_, i) => 50 + Math.sin(i * 0.3) * 14 + (Math.random() - 0.5) * 8)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((p) => {
        const next = [...p.slice(1)];
        const last = p[p.length - 1];
        let v = last + (Math.random() - 0.5) * 6;
        if (spike && Math.random() < 0.04) v += 25;
        v = Math.max(15, Math.min(90, v));
        next.push(v);
        return next;
      });
    }, 220);
    return () => clearInterval(id);
  }, [spike]);

  const w = 600, h = 240;
  const path = points
    .map((y, i) => {
      const x = (i / (points.length - 1)) * w;
      const yy = h - (y / 100) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${yy.toFixed(1)}`;
    })
    .join(' ');
  const area = path + ` L${w} ${h} L0 ${h} Z`;
  const last = points[points.length - 1];
  const lastX = w, lastY = h - (last / 100) * h;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <g className="chart-grid">
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1="0" y1={p * h} x2={w} y2={p * h} strokeDasharray="2 4" />
        ))}
      </g>
      <path d={area} className="chart-area" />
      <path d={path} className="chart-line" stroke={color} />
      <circle cx={lastX} cy={lastY} r="5" className="chart-dot" fill={color} />
      <circle cx={lastX} cy={lastY} r="10" fill={color} opacity="0.25">
        <animate attributeName="r" from="5" to="14" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
