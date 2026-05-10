export function Sparkbars({ count = 14 }) {
  return (
    <div className="sparkbars">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bar"
          style={{
            height: `${20 + Math.sin(i * 0.6) * 25 + 25}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
