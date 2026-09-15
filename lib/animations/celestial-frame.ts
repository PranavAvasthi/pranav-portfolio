import {
  CELESTIAL_ARCS,
  getCelestialArc,
} from "@/lib/animations/celestial-arc";
import { getSkyPalette } from "@/lib/animations/sky-palette";

export function getCelestialFrame(progress: number) {
  const palette = getSkyPalette(progress);
  const sun = getCelestialArc(progress, CELESTIAL_ARCS.sun);
  const moon = getCelestialArc(progress, CELESTIAL_ARCS.moon);
  return {
    lighting: palette.dark ? "night" : "day",
    skyState: progress < 0.38 ? "day" : progress < 0.62 ? "dusk" : "night",
    properties: {
      "--sky-top": palette.top,
      "--sky-bottom": palette.bottom,
      "--horizon": palette.horizon,
      "--reading-surface": palette.readingSurface,
      "--scrim-opacity": String(palette.scrimOpacity),
      "--foreground": palette.foreground,
      "--muted": palette.muted,
      "--sun-x": `${sun.x.toFixed(3)}vw`,
      "--sun-y": `${sun.y.toFixed(3)}svh`,
      "--sun-visible": sun.visible ? "1" : "0",
      "--moon-x": `${moon.x.toFixed(3)}vw`,
      "--moon-y": `${moon.y.toFixed(3)}svh`,
      "--moon-visible": moon.visible ? "1" : "0",
    },
  };
}
