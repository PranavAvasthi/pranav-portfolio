import Link from "next/link";
import type { SiteConfig } from "@/types/site-config";
import { getSignature } from "@/lib/data/get-signature";
import { Signature } from "@/components/sections/hero/signature";
import { SocialLinks } from "@/components/common/social-links";
import { LivePreviewPhone } from "@/components/sections/hero/live-preview-phone";

interface HeroSectionProps {
  config: SiteConfig;
  showLivePreview: boolean;
}

export async function HeroSection({
  config,
  showLivePreview,
}: HeroSectionProps) {
  const signature = await getSignature(config.name);
  return (
    <section
      id="home"
      className="hero-section page-width"
      data-timeline-section
      aria-labelledby="hero-title"
    >
      <div
        className={
          showLivePreview ? "hero-copy hero-copy-with-preview" : "hero-copy"
        }
      >
        <p className="mb-7.5 flex items-center gap-4.5 text-[15px] leading-[normal] max-[699px]:gap-3 max-[699px]:text-[13px]">
          <span className="shrink-0">Hello, I’m</span>
          <Signature name={config.name} signature={signature} />
        </p>
        <p className="mb-5 text-sm font-semibold text-(--muted)">
          {config.role}
        </p>
        <h1 id="hero-title" className="hero-title">
          Web & mobile
          <br />
          Carefully built<span className="title-period">.</span>
        </h1>
        <p className="hero-description">{config.introduction}</p>
        <div className="flex flex-wrap items-center gap-6.5 text-sm leading-5.25 max-[699px]:gap-5 max-[699px]:text-xs max-[699px]:leading-4.5">
          <Link className="primary-link" href="#projects">
            Explore my work
          </Link>
          <Link className="text-link" href="#project-daylight">
            How I built this
          </Link>
        </div>
        <div className="mt-4">
          <SocialLinks socials={config.socials} />
        </div>
      </div>
      {showLivePreview && <LivePreviewPhone />}
      <div className="flex justify-between gap-5 pt-17.5 pb-9 text-xs text-(--muted) max-[699px]:pt-16.5 max-[699px]:text-[10px]">
        <span>{config.role}</span>
        <span className="text-[11px] tabular-nums max-[699px]:max-w-23.75 max-[699px]:text-right max-[699px]:text-[9px]">
          Scroll slowly. Stay curious.
        </span>
      </div>
    </section>
  );
}
