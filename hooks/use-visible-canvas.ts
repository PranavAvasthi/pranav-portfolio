"use client";

import { useCallback, useEffect, useEffectEvent, useRef } from "react";

type CanvasPainter = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => void;

export function useVisibleCanvas(paint: CanvasPainter) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const invalidateRef = useRef<() => void>(() => {});
  const draw = useEffectEvent(paint);
  const invalidate = useCallback(() => invalidateRef.current(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let visible = false;
    let dirty = true;
    let frame = 0;
    let width = 0;
    let height = 0;

    const render = () => {
      frame = 0;
      if (!visible || document.hidden || !dirty || !width || !height) return;
      dirty = false;
      draw(context, width, height);
    };
    const schedule = () => {
      if (visible && !document.hidden && dirty && !frame)
        frame = requestAnimationFrame(render);
    };
    const invalidateCanvas = () => {
      dirty = true;
      schedule();
    };
    invalidateRef.current = invalidateCanvas;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      invalidateCanvas();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    });
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    resize.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      invalidateRef.current = () => {};
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return { canvasRef, invalidate };
}
