export interface LocalTimeReading {
  time: string;
  period: "morning" | "afternoon" | "evening" | "night";
  timeZone: string;
  dateTime: string;
}

export function getLocalTime(date: Date, timeZone: string): LocalTimeReading {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hourCycle: "h23",
      numberingSystem: "latn",
    }).format(date),
  );
  return {
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date),
    period:
      hour >= 5 && hour < 12
        ? "morning"
        : hour < 17 && hour >= 12
          ? "afternoon"
          : hour >= 17 && hour < 21
            ? "evening"
            : "night",
    timeZone,
    dateTime: date.toISOString(),
  };
}
