// Splits text into words that rise into place on load. The sentence stays
// one continuous text node sequence for crawlers and screen readers.
export function RiseText({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="rise-word">
            <span style={{ "--w": i + offset } as React.CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
