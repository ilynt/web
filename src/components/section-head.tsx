import { Decode } from "./decode";

export function SectionHead({
  no,
  label,
  title,
  id,
  children,
}: {
  no: string;
  label: string;
  title: React.ReactNode;
  id?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <p className="meta text-faint md:col-span-3">
        <span className="text-accent">{no}</span> — <Decode text={label} />
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="display max-w-4xl text-[clamp(2rem,4.6vw,3.75rem)]">
          {title}
        </h2>
        {children && <div className="prose-lab mt-6 max-w-2xl">{children}</div>}
      </div>
    </div>
  );
}
