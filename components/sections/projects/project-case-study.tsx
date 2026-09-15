import type { Project } from "@/types/project";
import { SkyContrastExplorer } from "@/components/sections/projects/sky-contrast-explorer";

interface ProjectCaseStudyProps {
  study: NonNullable<Project["caseStudy"]>;
}

export function ProjectCaseStudy({ study }: ProjectCaseStudyProps) {
  return (
    <div className="mt-5">
      <dl className="space-y-6">
        <div>
          <dt className="font-semibold text-foreground">The problem</dt>
          <dd className="mt-2">{study.problem}</dd>
        </div>
        {study.decisions.map((decision) => (
          <div key={decision.title}>
            <dt className="font-semibold text-foreground">{decision.title}</dt>
            <dd className="mt-2">{decision.description}</dd>
          </div>
        ))}
        <div>
          <dt className="font-semibold text-foreground">The trade-off</dt>
          <dd className="mt-2">{study.tradeoff}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">The outcome</dt>
          <dd className="mt-2">{study.outcome}</dd>
        </div>
      </dl>
      {study.experiment === "sky-contrast" && <SkyContrastExplorer />}
    </div>
  );
}
