export function BrainGrid() {
  return (
    <div className="brain">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="cell" style={{ animationDelay: `${(i * 0.07) % 2.4}s` }} />
      ))}
    </div>
  );
}
