export interface SiteConfig {
  name: string;
  jobTitle: string;
  role: string;
  introduction: string;
  email: string | null;
  seo: {
    description: string;
    knowsAbout: string[];
    image: { src: string; width: number; height: number; alt: string };
  };
  socials: { label: string; url: string }[];
}
