import type { SiteConfig } from "@/types/site-config";

interface SocialLinksProps {
  socials: SiteConfig["socials"];
  email?: SiteConfig["email"];
}

export function SocialLinks({ socials, email }: SocialLinksProps) {
  const links = [
    ...(email
      ? [{ label: "Email", url: `mailto:${email}`, external: false }]
      : []),
    ...socials.map((social) => ({ ...social, external: true })),
  ];

  if (!links.length) return null;
  return (
    <nav
      aria-label={email ? "Contact and social profiles" : "Social profiles"}
      className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          className="inline-block py-3"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
