export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  technologies: string[];
  url: string | null;
  sample: boolean;
}
