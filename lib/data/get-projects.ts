import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import { getCanonicalUrl } from "@/lib/seo/site-url";

export async function getProjects(): Promise<Project[]> {
  return (projects as Project[]).map((project) => ({
    ...project,
    url: project.url?.startsWith("/")
      ? getCanonicalUrl(project.url)
      : project.url,
  }));
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
