"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useVisibleCanvas } from "@/hooks/use-visible-canvas";
import { getReducedProgress } from "@/lib/animations/sky-palette";
import { drawStarfield } from "@/components/common/celestial-scene/starfield.utils";
import { useStarParallax } from "@/hooks/use-star-parallax";

export function Starfield() {
  const progress = useRef(0);
  const paintedProgress = useRef(0);
  const { canvasRef, invalidate } = useVisibleCanvas(
    (context, width, height) => {
      drawStarfield(context, width, height, paintedProgress.current);
    },
  );

  const update = (value: number) => {
    progress.current = value;
    const p = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? getReducedProgress(value)
      : value;
    const next = Math.max(0.25, Math.min(0.92, p));
    if (next !== paintedProgress.current) {
      paintedProgress.current = next;
      invalidate();
    }
  };
  useScrollProgress(update);
  useStarParallax(canvasRef);
  const refresh = useEffectEvent(() => update(progress.current));
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => refresh();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return <canvas className="starfield" ref={canvasRef} aria-hidden="true" />;
}
