import skills from "@/data/skills.json";
import type { Skill } from "@/types/skill";

export async function getSkills(): Promise<Skill[]> {
  return skills;
}
