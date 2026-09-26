import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/get-projects";
import { getCanonicalUrl } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: getCanonicalUrl() },
    ...projects
      .filter((project) => project.caseStudy)
      .map((project) => ({
        url: getCanonicalUrl(`/projects/${project.slug}`),
      })),
  ];
}
