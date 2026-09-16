"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { getCelestialFrame } from "@/lib/animations/celestial-frame";
import { getReducedProgress } from "@/lib/animations/sky-palette";
import { SkyGradient } from "@/components/common/celestial-scene/sky-gradient";
import { CelestialBody } from "@/components/common/celestial-scene/celestial-body";
import { HorizonSilhouette } from "@/components/common/celestial-scene/horizon-silhouette";
import { Starfield } from "@/components/common/celestial-scene/starfield";
import { CelestialLoader } from "@/components/common/celestial-loader";

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
    const frame = getCelestialFrame(p);
    element.dataset.lighting = frame.lighting;
    element.dataset.skyState = frame.skyState;
    for (const [property, value] of Object.entries(frame.properties)) {
      const bodyProperty =
        property.startsWith("--sun-") || property.startsWith("--moon-");
      if (!reduced || !bodyProperty) element.style.setProperty(property, value);
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
        <Starfield />
        <CelestialBody body="sun" />
        <CelestialBody body="moon" />
        <HorizonSilhouette />
      </div>
      <CelestialLoader />
      <div className="site-content">{children}</div>
    </div>
  );
}
