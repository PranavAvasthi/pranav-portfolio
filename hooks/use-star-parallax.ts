"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function useStarParallax(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const night = useRef(false);
  const sync = useRef<() => void>(() => {});
  useScrollProgress((progress) => {
    const next = progress >= 0.62;
    if (next !== night.current) {
      night.current = next;
      sync.current();
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let listening = false;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      canvas.style.setProperty("--star-offset-x", `${x.toFixed(2)}px`);
      canvas.style.setProperty("--star-offset-y", `${y.toFixed(2)}px`);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      x = 0;
      y = 0;
      paint();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = (event.clientX / window.innerWidth - 0.5) * 8;
      y = (event.clientY / window.innerHeight - 0.5) * 8;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const detach = () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      listening = false;
      reset();
    };
    const update = () => {
      const enabled =
        media.matches &&
        navigator.maxTouchPoints === 0 &&
        night.current &&
        !document.hidden;
      if (enabled && !listening) {
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", reset);
        listening = true;
      } else if (!enabled && listening) detach();
    };
    sync.current = update;
    update();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      detach();
      sync.current = () => {};
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [canvasRef]);
}
