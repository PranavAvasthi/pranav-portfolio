import type { About } from "@/types/about";

interface AboutSectionProps {
  about: About;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="story-section page-width"
      data-timeline-section
      aria-labelledby="about-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        {about.eyebrow}
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="about-title">
          {about.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>
        <span className="time-note">In the daylight</span>
      </div>
      <div className="about-copy">
        <div>
          <p className="lead-copy">
            {about.subhead.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </p>
          <dl className="mt-14 space-y-9 max-[699px]:mt-10 max-[699px]:space-y-7">
            {about.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-[650] tracking-[-0.055em]">
                  {stat.value}
                </dt>
                <dd className="mt-2 max-w-64 text-sm leading-5 text-(--muted)">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="body-copy">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div
            className="mt-10 border-t border-current/20 pt-6"
            aria-labelledby="education-title"
          >
            <p id="education-title" className="m-0! text-sm font-semibold">
              {about.education.label}
            </p>
            <div className="mt-4">
              <p className="m-0! text-base font-medium text-foreground">
                {about.education.degree.credential}
              </p>
              <p className="mt-1! mb-0! text-sm text-foreground">
                {about.education.degree.institution} ·{" "}
                {about.education.degree.result}
              </p>
            </div>
            <ul className="mt-5 list-none space-y-1.5 p-0 text-[13px] leading-relaxed text-(--muted)">
              {about.education.schools.map((school) => (
                <li key={school.level}>
                  {school.level} - {school.institution} · {school.result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="section-closing">{about.closing}</p>
    </section>
  );
}
