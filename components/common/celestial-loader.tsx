"use client";

import type { CSSProperties } from "react";
import { HorizonSilhouette } from "@/components/common/celestial-scene/horizon-silhouette";
import { SkyGradient } from "@/components/common/celestial-scene/sky-gradient";
import { useCelestialLoader } from "@/hooks/use-celestial-loader";
import { getCelestialFrame } from "@/lib/animations/celestial-frame";

const dawn = getCelestialFrame(0);

export function CelestialLoader() {
  const { overlayRef, visible } = useCelestialLoader();
  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="celestial-loader"
      style={dawn.properties as CSSProperties}
      data-celestial-loading="true"
      data-lighting={dawn.lighting}
      data-sky-state={dawn.skyState}
      role="status"
      aria-label="Loading the portfolio"
    >
      <div className="celestial-backdrop loader-backdrop" aria-hidden="true">
        <SkyGradient />
        <HorizonSilhouette />
      </div>
      <div
        className="loader-copy relative z-10 w-full px-7 text-center"
        aria-hidden="true"
      >
        <p className="m-0 text-[clamp(32px,4vw,48px)] leading-tight font-semibold tracking-[-0.045em]">
          A new day<span className="text-[#ff6238]">.</span>
        </p>
        <p className="mt-3 text-sm text-(--muted)">Getting things ready.</p>
        <div className="loader-progress-track mx-auto mt-6 h-0.5 w-20 overflow-hidden rounded-full bg-(--muted)/15">
          <div className="loader-progress h-full w-full bg-(--accent)" />
        </div>
      </div>
    </div>
  );
}
