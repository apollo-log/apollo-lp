import { useEffect, useState } from 'react';

export function TheftViz() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const t = phase;
  const points = Array.from({ length: 100 }, (_, i) => {
    if (i < 60) return 100 - i * 0.36;
    if (i < 75) return 78 - (i - 60) * 2.3;
    return 44 - (i - 75) * 0.05;
  });
  const visible = points.slice(0, t + 1);
  const w = 540, h = 360;
  const pathD = visible
    .map((v, i) => {
      const x = (i / 99) * (w - 60) + 30;
      const y = h - 60 - (v / 100) * (h - 100);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const lastIdx = visible.length - 1;
  const lastX = (lastIdx / 99) * (w - 60) + 30;
  const lastY = h - 60 - (visible[lastIdx] / 100) * (h - 100);
  const showAlert = t >= 65;

  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="drop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF4F1F" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF4F1F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text x="20" y="40" fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.4">FUEL %</text>
      <text x={w - 60} y="40" fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.4">LIVE</text>
      <text x="20" y={h - 30} fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.4">22:04</text>
      <text x={w - 80} y={h - 30} fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.4">22:18</text>

      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1="30" x2={w - 30} y1={h - 60 - p * (h - 100)} y2={h - 60 - p * (h - 100)} stroke="var(--line)" strokeDasharray="2 4" />
      ))}

      <line x1="30" y1={h - 60 - 0.78 * (h - 100)} x2={w - 30} y2={h - 60 - 0.55 * (h - 100)} stroke="var(--ink-mute)" strokeDasharray="3 3" strokeWidth="1" opacity="0.5" />
      <text x={w - 70} y={h - 60 - 0.55 * (h - 100) - 6} fill="var(--ink-mute)" fontSize="9" fontFamily="var(--mono)">EXPECTED</text>

      <path d={pathD} fill="none" stroke={showAlert ? '#FF4F1F' : 'var(--gold)'} strokeWidth="2.5" />

      <circle cx={lastX} cy={lastY} r="5" fill={showAlert ? '#FF4F1F' : 'var(--gold)'} />
      <circle cx={lastX} cy={lastY} r="14" fill={showAlert ? '#FF4F1F' : 'var(--gold)'} opacity="0.2">
        <animate attributeName="r" from="6" to="20" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>

      {showAlert && (
        <g transform={`translate(${lastX - 90}, ${lastY - 64})`}>
          <rect x="0" y="0" width="180" height="48" fill="#0B0B0B" stroke="#FF4F1F" strokeWidth="2" />
          <text x="10" y="18" fill="#FF4F1F" fontFamily="var(--mono)" fontSize="10" fontWeight="700" letterSpacing="1.4">⚠ SIPHON DETECTED</text>
          <text x="10" y="34" fill="var(--ink)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1">-34L · 09 SEC · TRK-2204</text>
        </g>
      )}

      <line x1={lastX} y1="60" x2={lastX} y2={h - 60} stroke="var(--gold)" strokeWidth="0.5" opacity="0.4" strokeDasharray="2 3" />
    </svg>
  );
}
