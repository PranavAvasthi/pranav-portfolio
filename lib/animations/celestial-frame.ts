import {
  CELESTIAL_ARCS,
  getCelestialArc,
} from "@/lib/animations/celestial-arc";
import { getSkyPalette } from "@/lib/animations/sky-palette";
import { interpolateColor, smoothstep } from "@/lib/animations/interpolate";

export function getCelestialFrame(progress: number) {
  const palette = getSkyPalette(progress);
  const sun = getCelestialArc(progress, CELESTIAL_ARCS.sun);
  const moon = getCelestialArc(progress, CELESTIAL_ARCS.moon);
  const sunset = smoothstep(0.22, 0.58, progress);
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
      "--sun-core": interpolateColor("#FFF8DE", "#FFDAA0", sunset),
      "--sun-rim": interpolateColor("#F9DEA1", "#ED945D", sunset),
      "--sun-x": `${sun.x.toFixed(3)}vw`,
      "--sun-y": `${sun.y.toFixed(3)}svh`,
      "--sun-visible": sun.visible ? "1" : "0",
      "--moon-x": `${moon.x.toFixed(3)}vw`,
      "--moon-y": `${moon.y.toFixed(3)}svh`,
      "--moon-visible": moon.visible ? "1" : "0",
    },
  };
}
