"use client";

import { useEffect, useRef, useState } from "react";

// Sets data-inview="true" once the element enters the viewport. CSS decides
// what that means; without JS or with reduced motion the content is static.
export function InView({
  as: Tag = "div",
  className,
  children,
  threshold = 0.25,
}: {
  as?: "div" | "section" | "figure" | "dl" | "ol";
  className?: string;
  children: React.ReactNode;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Comp = Tag as React.ElementType;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Comp ref={ref} className={className} data-inview={inView ? "true" : "false"}>
      {children}
    </Comp>
  );
}
