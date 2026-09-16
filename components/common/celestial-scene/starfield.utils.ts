import {
  getAmbientStarOpacity,
  getStarOpacity,
} from "@/lib/animations/sky-palette";
import { getSkyStars, type SkyStar } from "@/lib/animations/starfield-geometry";

interface StarfieldLayers {
  width: number;
  height: number;
  density: number;
  ambient: HTMLCanvasElement;
  distant: HTMLCanvasElement;
}

const layersByContext = new WeakMap<
  CanvasRenderingContext2D,
  StarfieldLayers
>();

function paintStar(context: CanvasRenderingContext2D, star: SkyStar) {
  const { x, y, radius, opacity, color } = star;
  context.globalAlpha = opacity;
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function createLayer(width: number, height: number, density: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * density);
  canvas.height = Math.ceil(height * density);
  const context = canvas.getContext("2d");
  context?.setTransform(density, 0, 0, density, 0, 0);
  return { canvas, context };
}

function createLayers(
  width: number,
  height: number,
  density: number,
): StarfieldLayers {
  // Bound the detached raster buffers to roughly 11 MB, including on large displays.
  const cacheDensity = Math.min(
    density,
    Math.sqrt(2_700_000 / (2 * width * height)),
  );
  const ambient = createLayer(width, height, cacheDensity);
  const distant = createLayer(width, height, cacheDensity);
  const ambientCount = width < 700 ? 9 : 24;

  getSkyStars(width, height).forEach((star, index) => {
    const context = index < ambientCount ? ambient.context : distant.context;
    if (context) paintStar(context, star);
  });

  return {
    width,
    height,
    density,
    ambient: ambient.canvas,
    distant: distant.canvas,
  };
}

export function drawStarfield(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  if (width <= 0 || height <= 0) return;
  const density = context.getTransform().a;
  let layers = layersByContext.get(context);
  if (
    !layers ||
    layers.width !== width ||
    layers.height !== height ||
    layers.density !== density
  ) {
    layers = createLayers(width, height, density);
    layersByContext.set(context, layers);
  }
  context.clearRect(0, 0, width, height);
  context.save();
  const passes = [
    [layers.ambient, getAmbientStarOpacity(progress)],
    [layers.distant, getStarOpacity(progress, 0.3)],
  ] as const;
  for (const [layer, opacity] of passes) {
    if (opacity <= 0) continue;
    context.globalAlpha = opacity;
    context.drawImage(layer, 0, 0, width, height);
  }
  context.restore();
}
