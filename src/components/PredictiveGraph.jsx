export function PredictiveGraph() {
  const w = 560, h = 320;
  const past = Array.from({ length: 40 }, (_, i) => 60 + Math.sin(i * 0.4) * 8 + i * 0.3);
  const future = Array.from({ length: 30 }, (_, i) => {
    const base = past[past.length - 1] + i * 1.2;
    return base + Math.sin(i * 0.5) * 4;
  });
  const all = [...past, ...future];
  const path = all.map((v, i) => {
    const x = (i / (all.length - 1)) * (w - 40) + 20;
    const y = h - 40 - (v / 120) * (h - 80);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const pastPath = path.slice(0, past.length).join(' ');
  const futurePath = 'M' + path[past.length - 1].slice(1) + ' ' + path.slice(past.length).join(' ');
  const splitX = ((past.length - 1) / (all.length - 1)) * (w - 40) + 20;
  const failureX = (60 / (all.length - 1)) * (w - 40) + 20;
  const failureY = h - 40 - (105 / 120) * (h - 80);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <text x="20" y="20" fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.4">INJECTOR WEAR · TRK-2204</text>
      <text x="20" y={h - 12} fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9">NOW</text>
      <text x={w - 60} y={h - 12} fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9">+30D</text>

      <line x1="20" y1={h - 40 - (100 / 120) * (h - 80)} x2={w - 20} y2={h - 40 - (100 / 120) * (h - 80)} stroke="var(--danger)" strokeDasharray="4 4" opacity="0.5" />
      <text x={w - 90} y={h - 40 - (100 / 120) * (h - 80) - 6} fill="var(--danger)" fontFamily="var(--mono)" fontSize="9">FAIL ZONE</text>

      <line x1={splitX} y1="30" x2={splitX} y2={h - 40} stroke="var(--ink-mute)" strokeDasharray="2 4" />
      <text x={splitX + 6} y="42" fill="var(--ink-mute)" fontFamily="var(--mono)" fontSize="9">FORECAST →</text>

      <path d={pastPath} fill="none" stroke="var(--gold)" strokeWidth="2.5" />
      <path d={futurePath} fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />

      <path d={`${futurePath} L${w - 20} ${h - 40} L${splitX} ${h - 40} Z`} fill="var(--gold)" opacity="0.08" />

      <circle cx={failureX} cy={failureY} r="6" fill="var(--danger)" />
      <circle cx={failureX} cy={failureY} r="14" fill="var(--danger)" opacity="0.25">
        <animate attributeName="r" from="6" to="22" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <line x1={failureX} y1={failureY - 14} x2={failureX} y2={failureY - 50} stroke="var(--danger)" />
      <text x={failureX - 60} y={failureY - 56} fill="var(--danger)" fontFamily="var(--mono)" fontSize="10" fontWeight="700">PREDICTED · DAY 14</text>
    </svg>
  );
}
