import {
  getTimelineProgress,
  SECTION_TIMELINE,
  type ScrollLandmark,
} from "@/lib/animations/scroll-timeline";

type ScrollSubscriber = (progress: number) => void;
const subscribers = new Set<ScrollSubscriber>();
let progress = 0;
let stop: (() => void) | undefined;

function startTracking() {
  let frame = 0;
  let needsMeasure = true;
  let landmarks: ScrollLandmark[] = [];

  const update = () => {
    frame = 0;
    if (document.hidden) return;
    if (needsMeasure) {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      landmarks = SECTION_TIMELINE.flatMap(({ id, progress: value }) => {
        const section = document.getElementById(id);
        return section
          ? [
              {
                offset: Math.min(
                  maxScroll - 1,
                  Math.max(
                    0,
                    section.getBoundingClientRect().top +
                      window.scrollY -
                      window.innerHeight * 0.15,
                  ),
                ),
                progress: value,
              },
            ]
          : [];
      });
      landmarks.push({ offset: maxScroll, progress: 1 });
      needsMeasure = false;
    }
    progress = getTimelineProgress(window.scrollY, landmarks);
    subscribers.forEach((subscriber) => subscriber(progress));
  };
  const schedule = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(update);
  };
  const measure = () => {
    needsMeasure = true;
    schedule();
  };
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!document.hidden) measure();
  };
  const observer = new ResizeObserver(measure);
  observer.observe(document.body);
  document
    .querySelectorAll("[data-timeline-section]")
    .forEach((section) => observer.observe(section));
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pageshow", measure);
  document.addEventListener("visibilitychange", visibility);
  measure();
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pageshow", measure);
    document.removeEventListener("visibilitychange", visibility);
  };
}

export function subscribeToScroll(subscriber: ScrollSubscriber): () => void {
  subscribers.add(subscriber);
  if (subscribers.size === 1) stop = startTracking();
  subscriber(progress);
  return () => {
    subscribers.delete(subscriber);
    if (!subscribers.size) {
      stop?.();
      stop = undefined;
    }
  };
}
