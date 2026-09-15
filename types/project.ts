export interface ProjectMetric {
  label: string;
  value?: string;
  url?: string;
}

export interface ProjectImage {
  kind: "logo" | "screenshot";
  src: string;
  alt: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  description?: string;
  summary?: string;
  technologies?: string[];
  platform?: ("web" | "mobile")[];
  roleNote?: string;
  metrics?: ProjectMetric[];
  image?: ProjectImage;
  links?: ProjectLink[];
  url?: string | null;
  caseStudy?: {
    problem: string;
    decisions: { title: string; description: string }[];
    tradeoff: string;
    outcome: string;
    experiment?: "sky-contrast";
  };
}
