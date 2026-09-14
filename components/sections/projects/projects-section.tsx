import { ProjectRow } from "@/components/sections/projects/project-row";
import type { Project } from "@/types/project";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="story-section projects-section page-width"
      data-timeline-section
      aria-labelledby="projects-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        Ideas made real
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="projects-title">
          Less talk.
          <br />
          More making.
        </h2>
        <span className="time-note">As the light settles</span>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
