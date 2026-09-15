"use client";

import { useEffect, useState } from "react";
import { formatExperiencePeriod } from "@/lib/utils/experience-tenure";
import type { ExperienceRole } from "@/types/experience";

interface ExperiencePeriodProps {
  role: ExperienceRole;
  initialDate: string;
}

export function ExperiencePeriod({ role, initialDate }: ExperiencePeriodProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  useEffect(() => {
    const refreshDate = () => setCurrentDate(new Date().toISOString());
    refreshDate();
    const interval = window.setInterval(refreshDate, 60 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="experience-period">
      {formatExperiencePeriod(role, new Date(currentDate))}
    </p>
  );
}
