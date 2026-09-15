import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudyPage } from "@/components/sections/projects/project-case-study-page";
import { getProjectBySlug, getProjects } from "@/lib/data/get-projects";

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
  const project = await getProjectBySlug(slug);

  return {
    title: project?.title ?? "Project not found",
    description: project?.description ?? project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project?.caseStudy) notFound();

  return <ProjectCaseStudyPage project={project} study={project.caseStudy} />;
}
