import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  const projectLabel = project.tagline ?? project.category;
  const description = project.description ?? project.summary;

  return (
    <article className="project-row" id={`project-${project.slug}`}>
      <div>
        {projectLabel && <p className="project-category">{projectLabel}</p>}
        <h3>{project.title}</h3>
        {project.image && (
          <figure
            className={
              project.image.kind === "logo"
                ? "mt-8 w-38"
                : "project-image-preview"
            }
          >
            <Image
              src={project.image.src}
              alt={project.image.alt}
              {...(project.image.kind === "logo"
                ? { width: 152, height: 152, sizes: "152px" }
                : {
                    fill: true,
                    sizes: "(max-width: 699px) 100vw, 260px",
                  })}
              className={
                project.image.kind === "logo"
                  ? "h-38 w-38 object-contain"
                  : "object-contain"
              }
            />
          </figure>
        )}
      </div>
      <div className="project-copy">
        {description && <p>{description}</p>}
        {((project.metrics?.length ?? 0) > 0 ||
          (project.platform?.length ?? 0) > 0) && (
          <ul
            className="my-6 flex list-none flex-wrap items-center gap-y-2 p-0 text-xs leading-relaxed text-(--muted)"
            aria-label="Project highlights"
          >
            {project.metrics?.map((metric) => (
              <li
                key={metric.label}
                className="flex items-center after:mx-3 after:content-['·'] last:after:hidden"
              >
                {metric.url ? (
                  <a href={metric.url} target="_blank" rel="noreferrer">
                    {metric.value && (
                      <span className="font-semibold text-(--foreground)">
                        {metric.value}{" "}
                      </span>
                    )}
                    {metric.label}
                  </a>
                ) : (
                  <span>
                    {metric.value && (
                      <span className="font-semibold text-(--foreground)">
                        {metric.value}{" "}
                      </span>
                    )}
                    {metric.label}
                  </span>
                )}
              </li>
            ))}
            {project.url && (
              <li className="flex items-center after:mx-3 after:content-['·'] last:after:hidden">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit ${project.title} on the web`}
                >
                  Visit site
                </a>
              </li>
            )}
            {project.platform?.map((platform) => (
              <li
                key={platform}
                className="flex items-center capitalize after:mx-3 after:content-['·'] last:after:hidden"
              >
                {platform}
              </li>
            ))}
          </ul>
        )}
        {project.roleNote && (
          <p className="mt-6 text-xs leading-relaxed text-(--muted)">
            {project.roleNote}
          </p>
        )}
        {project.technologies && project.technologies.length > 0 && (
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
        {project.caseStudy && (
          <Link className="text-link" href={`/projects/${project.slug}`}>
            Read the case study →
          </Link>
        )}
        {project.links?.map((link) => (
          <a
            className="text-link mr-5"
            href={link.url}
            target="_blank"
            rel="noreferrer"
            key={link.url}
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}
