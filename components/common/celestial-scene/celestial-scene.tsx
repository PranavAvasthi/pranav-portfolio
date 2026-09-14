"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import {
  CELESTIAL_ARCS,
  getCelestialArc,
} from "@/lib/animations/celestial-arc";
import {
  getReducedProgress,
  getSkyPalette,
} from "@/lib/animations/sky-palette";
import { SkyGradient } from "@/components/common/celestial-scene/sky-gradient";
import { CelestialBody } from "@/components/common/celestial-scene/celestial-body";
import { HorizonSilhouette } from "@/components/common/celestial-scene/horizon-silhouette";
import { Starfield } from "@/components/common/celestial-scene/starfield";

interface CelestialSceneProps {
  children: ReactNode;
}

export function CelestialScene({ children }: CelestialSceneProps) {
  const scene = useRef<HTMLDivElement>(null);
  const currentProgress = useRef(0);
  const previousProgress = useRef(-1);

  const paint = (progress: number) => {
    const element = scene.current;
    if (!element) return;
    currentProgress.current = progress;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const p = reduced ? getReducedProgress(progress) : progress;
    if (p === previousProgress.current) return;
    previousProgress.current = p;
    const palette = getSkyPalette(p);
    element.dataset.lighting = palette.dark ? "night" : "day";
    element.dataset.skyState = p < 0.38 ? "day" : p < 0.62 ? "dusk" : "night";
    element.style.setProperty("--sky-top", palette.top);
    element.style.setProperty("--sky-bottom", palette.bottom);
    element.style.setProperty("--horizon", palette.horizon);
    element.style.setProperty("--reading-surface", palette.readingSurface);
    element.style.setProperty("--scrim-opacity", `${palette.scrimOpacity}`);
    element.style.setProperty("--foreground", palette.foreground);
    element.style.setProperty("--muted", palette.muted);
    if (!reduced) {
      for (const body of ["sun", "moon"] as const) {
        const arc = getCelestialArc(p, CELESTIAL_ARCS[body]);
        element.style.setProperty(`--${body}-x`, `${arc.x.toFixed(3)}vw`);
        element.style.setProperty(`--${body}-y`, `${arc.y.toFixed(3)}svh`);
        element.style.setProperty(`--${body}-visible`, arc.visible ? "1" : "0");
      }
    }
  };

  useScrollProgress(paint);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      previousProgress.current = -1;
      paint(currentProgress.current);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="portfolio-scene" ref={scene}>
      <div className="celestial-backdrop" aria-hidden="true">
        <SkyGradient />
        <div className="reading-scrim" />
        <CelestialBody body="sun" />
        <CelestialBody body="moon" />
        <Starfield />
        <HorizonSilhouette />
      </div>
      <div className="site-content">{children}</div>
    </div>
  );
}
