import { ConstellationSkill } from "@/components/common/celestial-scene/constellation-skill";
import type { Skill } from "@/types/skill";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      className="story-section skills-section page-width"
      data-timeline-section
      aria-labelledby="skills-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        A constellation of skills
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="skills-title">
          Connecting
          <br />
          the dots.
        </h2>
        <span className="time-note">Under the same sky</span>
      </div>
      <p id="constellation-help" className="body-copy">
        Hover, tap, or tab to a star to explore. Each connection is part of how
        I build.
      </p>
      <ConstellationSkill skills={skills} />
    </section>
  );
}
