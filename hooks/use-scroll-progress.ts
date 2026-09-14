"use client";

import { useEffect, useEffectEvent } from "react";
import { subscribeToScroll } from "@/hooks/scroll-progress-store";

export function useScrollProgress(onProgress: (progress: number) => void) {
  const update = useEffectEvent(onProgress);
  useEffect(() => subscribeToScroll((progress) => update(progress)), []);
}
