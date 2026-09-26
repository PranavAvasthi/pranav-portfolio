import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudyPage } from "@/components/sections/projects/project-case-study-page";
import { getProjectBySlug, getProjects } from "@/lib/data/get-projects";
import { getSiteConfig } from "@/lib/data/get-site-config";
import { getPageMetadata } from "@/lib/seo/metadata";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects
    .filter((project) => project.caseStudy)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [project, config] = await Promise.all([
    getProjectBySlug(slug),
    getSiteConfig(),
  ]);
  if (!project?.caseStudy) notFound();

  return getPageMetadata(config, {
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.description ?? project.summary,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project?.caseStudy) notFound();

  return <ProjectCaseStudyPage project={project} study={project.caseStudy} />;
}
