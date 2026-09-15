import type { SiteConfig } from "@/types/site-config";

interface SocialLinksProps {
  socials: SiteConfig["socials"];
}

export function SocialLinks({ socials }: SocialLinksProps) {
  if (!socials.length) return null;
  return (
    <nav
      aria-label="Social profiles"
      className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
    >
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block py-3"
        >
          {social.label}
        </a>
      ))}
    </nav>
  );
}
