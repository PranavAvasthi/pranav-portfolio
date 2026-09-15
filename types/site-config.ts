export interface SiteConfig {
  name: string;
  role: string;
  introduction: string;
  email: string | null;
  socials: { label: string; url: string }[];
}
