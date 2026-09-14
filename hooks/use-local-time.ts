"use client";

import { useEffect, useState } from "react";
import { getLocalTime, type LocalTimeReading } from "@/lib/utils/local-time";

export function useLocalTime(): LocalTimeReading | null {
  const [reading, setReading] = useState<LocalTimeReading | null>(null);
  useEffect(() => {
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      if (document.hidden) return;
      const date = new Date();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setReading(getLocalTime(date, timeZone));
      timer = window.setTimeout(update, 60000 - (date.getTime() % 60000));
    };
    timer = window.setTimeout(update, 0);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return reading;
}
