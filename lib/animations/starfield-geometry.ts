export interface SkyStar {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
}

const STAR_COLORS = ["#E5EDFF", "#FFF2D7", "#BDCFF5", "#E8E8F2"];

export function getSkyStars(width: number, height: number): SkyStar[] {
  const count =
    width < 700
      ? 160
      : Math.min(760, Math.max(340, Math.round((width * height) / 2200)));
  let seed = 7413;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => {
    const x = random();
    const y = random();
    const magnitude = random();
    const readingWeight = 0.76 + 0.24 * Math.pow(Math.abs(x - 0.5) * 2, 2);
    return {
      x: x * width,
      y: y * height * 0.94,
      radius: magnitude > 0.96 ? 1.35 : 0.55 + magnitude * 0.5,
      opacity: (0.44 + random() * 0.5) * readingWeight,
      color: STAR_COLORS[Math.floor(random() * STAR_COLORS.length)],
    };
  });
}
