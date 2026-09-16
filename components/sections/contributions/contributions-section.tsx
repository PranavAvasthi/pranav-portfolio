import { ContributionCard } from "@/components/sections/contributions/contribution-card";
import type { Contribution } from "@/types/contribution";

interface ContributionsSectionProps {
  contributions: Contribution[];
}

export function ContributionsSection({
  contributions,
}: ContributionsSectionProps) {
  return (
    <section
      id="contributions"
      className="story-section contributions-section page-width"
      data-timeline-section
      aria-labelledby="contributions-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        Beyond the paycheck
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="contributions-title">
          Building beyond
          <br />
          the brief.
        </h2>
        <span className="time-note">Made after dark</span>
      </div>
      <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[699px]:grid-cols-1 max-[699px]:gap-10">
        {contributions.map((contribution) => (
          <ContributionCard key={contribution.id} contribution={contribution} />
        ))}
      </div>
    </section>
  );
}
