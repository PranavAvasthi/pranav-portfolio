import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return projects as Project[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
