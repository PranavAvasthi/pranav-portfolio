export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(start: number, end: number, value: number): number {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function interpolateColor(from: string, to: string, t: number): string {
  const channels = [1, 3, 5].map((offset) => {
    const a = parseInt(from.slice(offset, offset + 2), 16);
    const b = parseInt(to.slice(offset, offset + 2), 16);
    return Math.round(a + (b - a) * clamp(t));
  });
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(first: string, second: string): number {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function getReadableSurface(
  surface: string,
  fallback: string,
  foregrounds: string[],
): string {
  const isReadable = (color: string) =>
    foregrounds.every((foreground) => contrastRatio(foreground, color) >= 4.5);
  if (isReadable(surface)) return surface;
  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 10; iteration++) {
    const middle = (low + high) / 2;
    if (isReadable(interpolateColor(surface, fallback, middle))) high = middle;
    else low = middle;
  }
  return interpolateColor(surface, fallback, high);
}
