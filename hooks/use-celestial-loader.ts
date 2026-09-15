"use client";

import { useEffect, useRef, useState } from "react";
import { smoothstep } from "@/lib/animations/interpolate";
import {
  LOADER_COMPLETE_EVENT,
  LOADER_EXIT_MS,
  LOADER_MINIMUM_MS,
} from "@/lib/animations/loader-sequence";

export function useCelestialLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const content = overlay.parentElement?.querySelector<HTMLElement>(
      ":scope > .site-content",
    );
    const wasInert = content?.inert ?? false;
    if (content) content.inert = true;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const { signal } = controller;
    let reduced = media.matches;
    let ready = 0;
    let routeResolved = false;
    let total = 3;
    let elapsed = 0;
    let previousTime: number | undefined;
    let exitStarted: number | undefined;
    let progress = 0;
    let frame = 0;
    let done = false;

    const markReady = () => {
      if (!signal.aborted) ready += 1;
    };
    // Wait for streamed content before discovering the hero's critical images.
    const observeRoute = () => {
      if (
        routeResolved ||
        document.querySelector("[data-celestial-route-loading]")
      )
        return;
      routeResolved = true;
      observer?.disconnect();
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>("#home img"),
      );
      total += images.length;
      for (const image of images) {
        if (image.complete) markReady();
        else {
          let settled = false;
          const settle = () => {
            if (settled) return;
            settled = true;
            markReady();
          };
          image.addEventListener("load", settle, { once: true, signal });
          image.addEventListener("error", settle, { once: true, signal });
        }
      }
      markReady();
    };
    const observer = new MutationObserver(observeRoute);
    observer.observe(document.body, { childList: true, subtree: true });
    observeRoute();
    void document.fonts.ready.then(markReady, markReady);
    queueMicrotask(markReady);

    const finish = () => {
      done = true;
      controller.abort();
      observer?.disconnect();
      delete overlay.dataset.celestialLoading;
      if (content) content.inert = wasInert;
      setVisible(false);
      document.dispatchEvent(new Event(LOADER_COMPLETE_EVENT));
    };
    const tick = (now: number) => {
      frame = 0;
      if (done || document.hidden) return;
      const delta =
        previousTime === undefined ? 0 : Math.min(64, now - previousTime);
      previousTime = now;
      elapsed += delta;
      const target = Math.min(ready / total, elapsed / LOADER_MINIMUM_MS, 1);
      progress = Math.max(progress, Math.min(target, progress + delta / 180));
      if (reduced) {
        if (ready === total) {
          finish();
          return;
        }
      } else {
        overlay.style.setProperty("--loader-progress", String(progress));
        if (ready === total && progress >= 1) exitStarted ??= elapsed;
        if (exitStarted !== undefined) {
          const exit = smoothstep(0, LOADER_EXIT_MS, elapsed - exitStarted);
          overlay.style.opacity = String(1 - exit);
          if (exit >= 1) {
            finish();
            return;
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      previousTime = undefined;
      if (!document.hidden && !done) frame = requestAnimationFrame(tick);
    };
    const onPreference = () => {
      reduced = media.matches;
      overlay.dataset.reducedMotion = String(reduced);
      if (reduced) overlay.style.opacity = "1";
    };
    onPreference();
    media.addEventListener("change", onPreference, { signal });
    document.addEventListener("visibilitychange", onVisibility, { signal });
    if (!document.hidden) frame = requestAnimationFrame(tick);
    return () => {
      controller.abort();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      if (content) content.inert = wasInert;
    };
  }, []);

  return { overlayRef, visible };
}
