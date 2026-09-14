import type { Project } from "@/types/project";

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <article className="project-row">
      <div>
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        {project.sample && <span className="sample-note">Coming next</span>}
      </div>
      <div className="project-copy">
        <p>{project.summary}</p>
        {project.technologies.length > 0 && (
          <ul
            className="my-6 flex list-none flex-wrap gap-2 p-0 text-xs leading-[1.85] font-[650] text-(--accent-ink)"
            aria-label="Built with"
          >
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-[3px] bg-(--accent) px-2.25 py-0.75"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
        <details className="project-details">
          <summary>
            {project.sample ? "About this space" : "Behind the build"}
          </summary>
          <p>{project.details}</p>
        </details>
        {project.url && (
          <a
            className="text-link"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            Visit project
          </a>
        )}
      </div>
    </article>
  );
}
