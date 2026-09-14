import { clamp } from "@/lib/animations/interpolate";

export const SECTION_TIMELINE = [
  { id: "home", progress: 0 },
  { id: "about", progress: 0.2 },
  { id: "experience", progress: 0.38 },
  { id: "projects", progress: 0.58 },
  { id: "skills", progress: 0.78 },
  { id: "contact", progress: 0.94 },
] as const;

export interface ScrollLandmark {
  offset: number;
  progress: number;
}

export function getTimelineProgress(
  scrollY: number,
  landmarks: ScrollLandmark[],
): number {
  if (landmarks.length < 2) return 0;
  const endIndex = landmarks.findIndex((point) => point.offset > scrollY);
  if (endIndex < 0) return 1;
  if (endIndex === 0) return landmarks[0].progress;
  const start = landmarks[endIndex - 1];
  const end = landmarks[endIndex];
  const t = clamp(
    (scrollY - start.offset) / Math.max(1, end.offset - start.offset),
  );
  return start.progress + (end.progress - start.progress) * t;
}
