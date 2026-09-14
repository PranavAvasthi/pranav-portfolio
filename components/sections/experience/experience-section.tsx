import type { Experience } from "@/types/experience";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
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
      {experience.some((item) => item.sample) && (
        <p className="sample-note">
          An illustrative journey. Career details to come.
        </p>
      )}
      <ol className="experience-timeline">
        {experience.map((item) => (
          <li key={item.id}>
            <p className="experience-period">{item.period}</p>
            <div className="experience-copy">
              <p className="organization">{item.organization}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
