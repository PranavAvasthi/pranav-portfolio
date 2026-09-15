import type { ExperienceRole } from "@/types/experience";

interface CalendarMonth {
  year: number;
  month: number;
}

function parseCalendarMonth(value: string): CalendarMonth {
  const match = /^(\d{4})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error(`Invalid calendar month: ${value}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
  };
}

function getCurrentCalendarMonth(date: Date): CalendarMonth {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function formatCalendarMonth(value: string): string {
  const { year, month } = parseCalendarMonth(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }

  return parts.join(" ");
}

export function formatExperiencePeriod(
  role: ExperienceRole,
  currentDate: Date,
): string {
  const start = parseCalendarMonth(role.startMonth);
  const end = role.endMonth
    ? parseCalendarMonth(role.endMonth)
    : getCurrentCalendarMonth(currentDate);
  const totalMonths = Math.max(
    1,
    (end.year - start.year) * 12 + end.month - start.month + 1,
  );
  const endLabel = role.endMonth
    ? formatCalendarMonth(role.endMonth)
    : "Present";

  return `${role.position} · ${formatCalendarMonth(role.startMonth)} – ${endLabel} · ${formatDuration(totalMonths)}`;
}
