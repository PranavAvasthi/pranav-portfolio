"use client";

import { useLocalTime } from "@/hooks/use-local-time";

export function LocalTimeReadout() {
  const reading = useLocalTime();
  if (!reading) return null;
  return (
    <aside
      className="local-time-readout"
      aria-label={`Your local time in ${reading.timeZone}`}
    >
      <time dateTime={reading.dateTime}>{reading.time}</time>
      <span>{reading.period} where you are</span>
    </aside>
  );
}
