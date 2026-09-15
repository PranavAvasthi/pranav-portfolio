export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  technologies: string[];
  url: string | null;
  sample: boolean;
  caseStudy?: {
    problem: string;
    decisions: { title: string; description: string }[];
    tradeoff: string;
    outcome: string;
    experiment?: "sky-contrast";
  };
}
