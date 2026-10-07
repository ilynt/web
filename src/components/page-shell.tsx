import { ViewTransition } from "react";

// Wraps each page's content so route changes crossfade and rise. Lives in
// pages, not the layout: layouts persist, so enter/exit would never fire.
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

/** Shared-element name for a work's title, used by index rows and detail headers. */
export function WorkTitleTransition({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`work-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
