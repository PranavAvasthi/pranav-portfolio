import { contrastRatio, interpolateColor } from "@/lib/animations/interpolate";
import { getSkyPalette } from "@/lib/animations/sky-palette";

export function getSkyContrast(progress: number) {
  const palette = getSkyPalette(progress);
  const surfaces = Array.from({ length: 21 }, (_, index) =>
    interpolateColor(
      interpolateColor(palette.top, palette.bottom, index / 20),
      palette.readingSurface,
      palette.scrimOpacity,
    ),
  );
  surfaces.push(palette.horizon);
  return {
    palette,
    normal: Math.min(
      ...surfaces.map((color) => contrastRatio(palette.foreground, color)),
    ),
    muted: Math.min(
      ...surfaces.map((color) => contrastRatio(palette.muted, color)),
    ),
  };
}
