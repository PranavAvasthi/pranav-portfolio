import experience from "@/data/experience.json";
import type { Experience } from "@/types/experience";

export async function getExperience(): Promise<Experience[]> {
  return experience;
}
