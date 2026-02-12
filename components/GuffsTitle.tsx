"use client";

import { useEffect, useRef, useState } from "react";

export function GuffsTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl) return;

    const updateSize = () => {
      const containerW = container.clientWidth;
      // Section padding + title padding (px-3) so word fits inside with visible margin
      const viewportW = typeof window !== "undefined" ? window.innerWidth - 64 : containerW;
      const maxW = Math.min(containerW, Math.max(0, viewportW));
      const withPadding = Math.max(0, maxW - 24); // 24px = px-3 both sides
      // Use 75% of that so "GUFFS" has clear space on left and right (no cutoff)
      const w = withPadding * 0.75;
      if (w <= 0) return;

      // Hidden measurer: same font, "Guffs" at 1px — width scales linearly with font-size
      measureEl.style.fontSize = "1px";
      const widthAt1px = measureEl.scrollWidth;
      if (widthAt1px <= 0) return;

      const size = w / widthAt1px;
      setFontSize(Math.max(24, Math.min(size, 600)));
    };

    const cleanupRef = { current: undefined as (() => void) | undefined };
    const rafRef = { current: undefined as number | undefined };

    const run = () => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        updateSize();
        const ro = new ResizeObserver(updateSize);
        ro.observe(container);
        cleanupRef.current = () => ro.disconnect();
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(run);
    } else {
      run();
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      cleanupRef.current?.();
    };
  }, []);

  return (
    <>
      {/* Hidden element for measuring "Guffs" width at 1px */}
      <div
        ref={measureRef}
        aria-hidden
        className="guffs-title absolute opacity-0 pointer-events-none whitespace-nowrap font-bold tracking-wide uppercase"
        style={{ fontSize: "1px" }}
      >
        Guffs
      </div>

      <div ref={containerRef} className="w-full min-w-0 overflow-hidden" style={{ minHeight: fontSize ? undefined : "120px" }}>
        <h2
          className="guffs-title w-full min-w-0 font-bold text-[#faa241] tracking-wide pt-[75px] pb-8 px-3 uppercase text-center leading-none"
          style={fontSize != null ? { fontSize: `${fontSize}px` } : undefined}
        >
          Guffs
        </h2>
      </div>
    </>
  );
}
