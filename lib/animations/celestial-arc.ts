import { clamp } from "@/lib/animations/interpolate";

export const CELESTIAL_ARCS = {
  sun: { start: -0.05, end: 0.62 },
  moon: { start: 0.6, end: 1.18 },
} as const;

export function getCelestialArc(
  progress: number,
  range: { start: number; end: number },
) {
  const t = clamp((progress - range.start) / (range.end - range.start));
  return {
    x: 56 + 38 * t,
    y: 106 - 94 * Math.sin(Math.PI * t),
    visible: progress >= range.start && progress <= range.end,
  };
}
