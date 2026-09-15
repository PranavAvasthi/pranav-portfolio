import type { SiteConfig } from "@/types/site-config";
import { SectionLink } from "@/components/common/section-link";

interface SiteFooterProps {
  config: SiteConfig;
}

export function SiteFooter({ config }: SiteFooterProps) {
  return (
    <footer className="site-footer page-width flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
      <div>
        <p className="m-0">Made with care by {config.name}.</p>
        <p className="mt-1 mb-0 text-[10px]">{config.role}</p>
      </div>
      <SectionLink
        className="whitespace-nowrap underline decoration-(--accent) underline-offset-1"
        href="/#home"
      >
        Back to daylight
      </SectionLink>
    </footer>
  );
}
