interface Props {
  title?: string;
  children: React.ReactNode;
}

/** Shared page wrapper for consistent spacing/animation across screens. */
export function Screen({ title, children }: Props) {
  return (
    <div className="screen">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}
