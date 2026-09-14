import {
  getAmbientStarOpacity,
  getStarOpacity,
} from "@/lib/animations/sky-palette";

export function drawStarfield(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  context.clearRect(0, 0, width, height);
  const count = width < 700 ? 48 : 130;
  const ambientCount = width < 700 ? 7 : 18;
  let seed = 7413;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  context.fillStyle = "#F3F1DF";
  for (let index = 0; index < count; index++) {
    const x = random() * width;
    const y = random() * height * 0.89;
    const radius = 0.45 + random() * 1.1;
    const stagger = random();
    const brightness = 0.3 + random() * 0.65;
    // The same sparse points remain in place from daylight through the fully populated sky.
    context.globalAlpha =
      (index < ambientCount
        ? getAmbientStarOpacity(progress)
        : getStarOpacity(progress, stagger)) * brightness;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}
