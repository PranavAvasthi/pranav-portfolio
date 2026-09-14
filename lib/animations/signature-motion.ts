export interface PenPoint {
  x: number;
  y: number;
}

export interface PenPose extends PenPoint {
  angle: number;
}

export interface SignatureStrokeTiming {
  letterIndex: number;
  length: number;
  start: number;
  end: number;
}

export const SIGNATURE_SETTLE_MS = 140;

export function signatureProgress(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function getSignatureTimeline(
  letters: { lengths: number[]; wordStart: boolean }[],
): SignatureStrokeTiming[] {
  let cursor = 140;
  return letters.flatMap((letter, letterIndex) =>
    letter.lengths.map((length, strokeIndex) => {
      if (strokeIndex > 0) cursor += 70;
      else if (letterIndex > 0) cursor += letter.wordStart ? 280 : 170;
      const start = cursor;
      cursor += Math.max(100, Math.min(760, length * 4.5));
      return { letterIndex, length, start, end: cursor };
    }),
  );
}

export function getWrittenLength(length: number, progress: number): number {
  const t = signatureProgress(progress);
  return length * (t - 0.045 * Math.sin(2 * Math.PI * t));
}

export function getPenPose(
  sample: (length: number) => PenPoint,
  length: number,
  distance: number,
  offsetX = 0,
): PenPose {
  const position = Math.max(0, Math.min(length, distance));
  const point = sample(position);
  const before = sample(Math.max(0, position - 0.5));
  const after = sample(Math.min(length, position + 0.5));
  return {
    x: point.x + offsetX,
    y: point.y,
    angle: (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI,
  };
}

export function getPenLift(
  from: PenPose,
  to: PenPose,
  progress: number,
): PenPose {
  const t = signatureProgress(progress);
  const eased = t * t * (3 - 2 * t);
  const height = Math.min(
    22,
    10 + Math.hypot(to.x - from.x, to.y - from.y) * 0.06,
  );
  const angleDelta = ((to.angle - from.angle + 540) % 360) - 180;
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased - Math.sin(Math.PI * t) * height,
    angle: from.angle + angleDelta * eased,
  };
}
