interface Props {
  label?: string;
  children: React.ReactNode;
}

/** A collapsible "what does this mean?" explainer used throughout the app to teach jargon inline. */
export function TutorialTip({ label = 'What does this mean?', children }: Props) {
  return (
    <details className="tip">
      <summary>{label}</summary>
      <div>{children}</div>
    </details>
  );
}
