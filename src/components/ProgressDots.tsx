interface Props {
  total: number;
  current: number; // 0-indexed
}

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i === current ? 'active' : i < current ? 'done' : ''} />
      ))}
    </div>
  );
}
