import about from "@/data/about.json";
import type { About } from "@/types/about";

export async function getAbout(): Promise<About> {
  return about;
}
