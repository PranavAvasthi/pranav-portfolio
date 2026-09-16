import contributions from "@/data/contributions.json";
import type { Contribution } from "@/types/contribution";

export async function getContributions(): Promise<Contribution[]> {
  return contributions as Contribution[];
}
