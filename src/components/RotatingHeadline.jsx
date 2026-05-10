import { useEffect, useState } from 'react';

export function RotatingHeadline({ phrases, interval = 3500, className = '' }) {
  const list = Array.isArray(phrases) ? phrases : [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length < 2) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % list.length), interval);
    return () => clearInterval(id);
  }, [list.length, interval]);

  if (list.length === 0) return null;

  // Spacer pads the box to the longest phrase so cycling doesn't reflow neighbors.
  const widest = list.reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <span className={'rotating-headline ' + className}>
      <span className="rh-spacer" aria-hidden="true">{widest}</span>
      {list.map((p, i) => (
        <span
          key={i}
          className={'rh-item' + (i === idx ? ' is-active' : '')}
          aria-hidden={i !== idx}
        >
          {p}
        </span>
      ))}
    </span>
  );
}
