import Link from "next/link";
import { ProjectCaseStudy } from "@/components/sections/projects/project-case-study";
import type { Project } from "@/types/project";

interface ProjectCaseStudyPageProps {
  project: Project;
  study: NonNullable<Project["caseStudy"]>;
}

export function ProjectCaseStudyPage({
  project,
  study,
}: ProjectCaseStudyPageProps) {
  return (
    <article
      id="home"
      className="page-width min-h-[160svh] pt-16 pb-32 max-[699px]:pt-10 max-[699px]:pb-24"
      data-timeline-section
    >
      <Link className="text-link text-sm" href="/#projects">
        Back to projects
      </Link>
      <header className="mt-20 max-w-225 max-[699px]:mt-14">
        <p className="mb-5 text-sm text-(--muted)">{project.category}</p>
        <h1 className="text-[clamp(3.75rem,9vw,8rem)] leading-[0.88] font-bold tracking-[-0.065em]">
          {project.title}
        </h1>
        <p className="mt-8 max-w-180 text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed text-(--muted)">
          {project.summary}
        </p>
        {project.technologies && project.technologies.length > 0 && (
          <ul
            className="mt-8 flex list-none flex-wrap gap-2 p-0 text-xs leading-[1.85] font-[650] text-(--accent-ink)"
            aria-label="Built with"
          >
            {project.technologies.map((technology) => (
              <li
                className="rounded-[3px] bg-(--accent) px-2.25 py-0.75"
                key={technology}
              >
                {technology}
              </li>
            ))}
          </ul>
        )}
      </header>
      <section
        className="mt-24 grid grid-cols-[minmax(120px,0.35fr)_minmax(0,1fr)] gap-16 border-t border-current/25 pt-10 max-[699px]:mt-16 max-[699px]:grid-cols-1 max-[699px]:gap-5"
        aria-labelledby="case-study-title"
      >
        <h2
          id="case-study-title"
          className="text-base leading-tight font-semibold tracking-normal"
        >
          Behind the build
        </h2>
        <div className="body-copy max-w-180">
          <ProjectCaseStudy study={study} />
        </div>
      </section>
    </article>
  );
}
