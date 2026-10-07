import { InView } from "./in-view";

// A product's processing steps drawn as a rail. When visible, a pulse travels
// along it and lights each node in turn; the steps are plain ordered text.
export function Pipeline({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <InView className="relative">
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-[7px] hidden h-px overflow-hidden bg-line md:block"
      >
        <div className="rail-pulse h-px w-1/5 opacity-0 bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
      <ol className="grid gap-8 md:grid-cols-5 md:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="relative border-l border-line pl-5 md:border-l-0 md:pl-0">
            <span
              aria-hidden="true"
              className="rail-node absolute -left-[4px] top-[3px] size-[7px] rounded-full bg-fg md:relative md:left-0 md:top-0 md:block md:size-[15px] md:border-4 md:border-bg"
              style={{ "--n": i } as React.CSSProperties}
            />
            <p className="meta mt-0 text-faint md:mt-5">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-medium">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </InView>
  );
}
