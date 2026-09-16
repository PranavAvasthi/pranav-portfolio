import {
  clamp,
  contrastRatio,
  getReadableSurface,
  interpolateColor,
  relativeLuminance,
  smoothstep,
} from "@/lib/animations/interpolate";

export const SKY_STOPS = [
  {
    progress: 0,
    name: "Apricot dawn",
    top: "#8CBAD9",
    bottom: "#F6CFAD",
    horizon: "#9DAAAA",
  },
  {
    progress: 0.18,
    name: "Clear midday",
    top: "#78BCE5",
    bottom: "#D8EAF0",
    horizon: "#91B3BD",
  },
  {
    progress: 0.37,
    name: "Bronze afternoon",
    top: "#8D796F",
    bottom: "#B19577",
    horizon: "#89756C",
  },
  {
    progress: 0.54,
    name: "Velvet dusk",
    top: "#261637",
    bottom: "#462A40",
    horizon: "#39263E",
  },
  {
    progress: 0.72,
    name: "Blue hour",
    top: "#1E2D50",
    bottom: "#394562",
    horizon: "#2D3A56",
  },
  {
    progress: 1,
    name: "Deep indigo",
    top: "#111D3D",
    bottom: "#263557",
    horizon: "#202F4D",
  },
] as const;

export function getReducedProgress(progress: number): number {
  return progress < 0.38 ? 0.18 : progress < 0.62 ? 0.54 : 1;
}

export function getStarOpacity(progress: number, stagger = 0): number {
  return smoothstep(0.34 + stagger * 0.12, 0.82 + stagger * 0.1, progress);
}

export function getAmbientStarOpacity(progress: number): number {
  return 0.1 + 0.9 * smoothstep(0.25, 0.82, progress);
}

export function getSkyPalette(progress: number) {
  const p = clamp(progress);
  const index = SKY_STOPS.findIndex((stop) => stop.progress >= p);
  const end = SKY_STOPS[Math.max(0, index)];
  const start = SKY_STOPS[Math.max(0, index - 1)];
  const t =
    end.progress === start.progress
      ? 0
      : (p - start.progress) / (end.progress - start.progress);
  const top = interpolateColor(start.top, end.top, t);
  const bottom = interpolateColor(start.bottom, end.bottom, t);
  const readingSurface = interpolateColor(top, bottom, 0.36);
  const dark = relativeLuminance(readingSurface) < 0.185;
  const candidates = dark
    ? ["#F6F4EE", "#FFFFFF", "#000000"]
    : ["#15283B", "#060A10", "#000000", "#FFFFFF"];
  let scrimOpacity = 0;
  let surfaces = [top, bottom];
  let foreground = candidates.find((color) =>
    surfaces.every((surface) => contrastRatio(color, surface) >= 4.5),
  );
  // Add only the scrim actually needed between light and dark; dusk keeps its full depth.
  if (!foreground) {
    const ink =
      contrastRatio("#000000", readingSurface) >= 4.5 ? "#000000" : "#FFFFFF";
    foreground = ink;
    let low = 0;
    let high = 1;
    for (let iteration = 0; iteration < 12; iteration++) {
      const middle = (low + high) / 2;
      const readable = [top, bottom].every(
        (color) =>
          contrastRatio(ink, interpolateColor(color, readingSurface, middle)) >=
          4.5,
      );
      if (readable) high = middle;
      else low = middle;
    }
    scrimOpacity = high;
    surfaces = [top, bottom].map((color) =>
      interpolateColor(color, readingSurface, scrimOpacity),
    );
  }
  const mutedCandidate = dark ? "#E0E5EF" : "#263E50";
  const muted = surfaces.every(
    (surface) => contrastRatio(mutedCandidate, surface) >= 4.5,
  )
    ? mutedCandidate
    : foreground;
  return {
    top,
    bottom,
    // The fixed horizon also passes behind body copy as sections scroll.
    horizon: getReadableSurface(
      interpolateColor(start.horizon, end.horizon, t),
      readingSurface,
      [foreground, muted],
    ),
    readingSurface,
    scrimOpacity,
    foreground,
    muted,
    dark,
  };
}
