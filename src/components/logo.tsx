// Two nodes and a link: "ideas, connected". Same geometry as app/icon.svg.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="9" cy="22" r="4.5" fill="currentColor" />
      <circle cx="23" cy="10" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12.2 18.8 19.8 13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
