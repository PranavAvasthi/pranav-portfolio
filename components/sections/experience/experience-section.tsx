import type { Experience } from "@/types/experience";
import { ExperiencePeriod } from "@/components/sections/experience/experience-period";

interface ExperienceSectionProps {
  experience: Experience;
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const initialDate = new Date().toISOString();

  return (
    <section
      id="experience"
      className="story-section experience-section page-width"
      data-timeline-section
      aria-labelledby="experience-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        The journey so far
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="experience-title">
          Always a work
          <br />
          in progress.
        </h2>
        <span className="time-note">Into the golden hours</span>
      </div>
      <div className="border-t border-current/25 pt-7">
        <p className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-[650] tracking-[-0.045em]">
          {experience.company}
        </p>
        <p className="mt-3 text-sm text-(--muted)">
          {experience.employmentDetails}
        </p>
      </div>
      <ol className="experience-timeline">
        {experience.roles.map((role) => (
          <li key={role.id}>
            <ExperiencePeriod role={role} initialDate={initialDate} />
            <div className="experience-copy">
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
