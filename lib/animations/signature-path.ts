import { Path, type Font, type PathCommand } from "opentype.js";
import type { SignatureData } from "@/types/signature";
import { getSignatureStrokes } from "@/lib/animations/signature-strokes";

function estimateLength(commands: PathCommand[]): number {
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let length = 0;
  for (const command of commands) {
    if (command.type === "M") {
      x = startX = command.x;
      y = startY = command.y;
      continue;
    }
    if (command.type === "Z") {
      length += Math.hypot(startX - x, startY - y);
      x = startX;
      y = startY;
      continue;
    }
    if (command.type === "L") {
      length += Math.hypot(command.x - x, command.y - y);
    } else {
      let previousX = x;
      let previousY = y;
      for (let step = 1; step <= 32; step++) {
        const t = step / 32;
        const u = 1 - t;
        const nextX =
          command.type === "Q"
            ? u * u * x + 2 * u * t * command.x1 + t * t * command.x
            : u ** 3 * x +
              3 * u * u * t * command.x1 +
              3 * u * t * t * command.x2 +
              t ** 3 * command.x;
        const nextY =
          command.type === "Q"
            ? u * u * y + 2 * u * t * command.y1 + t * t * command.y
            : u ** 3 * y +
              3 * u * u * t * command.y1 +
              3 * u * t * t * command.y2 +
              t ** 3 * command.y;
        length += Math.hypot(nextX - previousX, nextY - previousY);
        previousX = nextX;
        previousY = nextY;
      }
    }
    x = command.x;
    y = command.y;
  }
  return length;
}

function serializePath(commands: PathCommand[]): string {
  const format = (value: number): string => {
    const rounded = Number(value.toFixed(3));
    return Number.isFinite(rounded) ? String(rounded) : "0";
  };
  return commands
    .map((command) => {
      if (command.type === "Z") return "Z";
      if (command.type === "M" || command.type === "L") {
        return `${command.type}${format(command.x)} ${format(command.y)}`;
      }
      if (command.type === "Q") {
        return `Q${format(command.x1)} ${format(command.y1)} ${format(command.x)} ${format(command.y)}`;
      }
      return `C${format(command.x1)} ${format(command.y1)} ${format(command.x2)} ${format(command.y2)} ${format(command.x)} ${format(command.y)}`;
    })
    .join("");
}

export function getSignaturePaths(text: string, font: Font): SignatureData {
  const paths: SignatureData["paths"] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let cursorX = 0;
  let wordStart = true;
  let previousGlyph: ReturnType<Font["charToGlyph"]> | undefined;
  for (const character of Array.from(text)) {
    const glyph = font.charToGlyph(character);
    const size = 100;
    if (previousGlyph) {
      cursorX +=
        (font.getKerningValue(previousGlyph, glyph) * size) / font.unitsPerEm;
    }
    const x = cursorX;
    const y = 0;
    if (!glyph.path.commands.length) {
      cursorX += ((glyph.advanceWidth ?? 0) * size) / font.unitsPerEm;
      previousGlyph = glyph;
      wordStart = true;
      continue;
    }
    const scale = size / font.unitsPerEm;
    const path = new Path();
    // Preserve contour closures and the shared baseline instead of flipping each glyph independently.
    path.commands = glyph.path.commands.map((command): PathCommand => {
      if (command.type === "Z") return { type: "Z" };
      const point = { x: x + command.x * scale, y: y - command.y * scale };
      if (command.type === "M" || command.type === "L")
        return { type: command.type, ...point };
      const control = {
        x1: x + command.x1 * scale,
        y1: y - command.y1 * scale,
      };
      if (command.type === "Q") return { type: "Q", ...point, ...control };
      return {
        type: "C",
        ...point,
        ...control,
        x2: x + command.x2 * scale,
        y2: y - command.y2 * scale,
      };
    });
    const d = serializePath(path.commands);
    for (const command of path.commands) {
      if (command.type === "Z") continue;
      const points =
        command.type === "C"
          ? [
              [command.x, command.y],
              [command.x1, command.y1],
              [command.x2, command.y2],
            ]
          : command.type === "Q"
            ? [
                [command.x, command.y],
                [command.x1, command.y1],
              ]
            : [[command.x, command.y]];
      for (const [pointX, pointY] of points) {
        minX = Math.min(minX, pointX);
        minY = Math.min(minY, pointY);
        maxX = Math.max(maxX, pointX);
        maxY = Math.max(maxY, pointY);
      }
    }
    paths.push({
      d,
      length: estimateLength(path.commands),
      character,
      offsetX: x,
      wordStart,
      strokes: getSignatureStrokes(character),
    });
    wordStart = false;
    cursorX += ((glyph.advanceWidth ?? 0) * size) / font.unitsPerEm;
    previousGlyph = glyph;
  }
  if (!paths.length) return { paths, viewBox: "0 0 1 1", width: 1, height: 1 };
  const padding = 5;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  return {
    paths,
    width,
    height,
    viewBox: `${minX - padding} ${minY - padding} ${width} ${height}`,
  };
}
