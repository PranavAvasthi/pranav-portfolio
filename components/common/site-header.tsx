import { SectionLink } from "@/components/common/section-link";
import { MobileNavMenu } from "@/components/common/mobile-nav-menu";
import Image from "next/image";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  return (
    <header className="site-header page-width relative flex h-26 items-center justify-between max-[699px]:h-20.5">
      <div className="flex items-center gap-2.5 max-[699px]:gap-1.5">
        <Image
          className="size-9 shrink-0 rounded-[9px] max-[699px]:size-7 max-[699px]:rounded-[7px]"
          src="/icon.png"
          alt=""
          width={36}
          height={36}
          priority
        />
        <SectionLink
          className="header-mark no-underline"
          href="/#home"
          ariaLabel={`${name}, home`}
        >
          <span className="header-mark-text" aria-hidden="true">
            {name}
          </span>
          <svg
            className="header-mark-underline"
            viewBox="0 0 200 18"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              pathLength="1"
              d="M3 11 C48 2 78 16 119 8 C151 2 176 5 197 3"
            />
          </svg>
        </SectionLink>
      </div>
      <nav
        className="flex items-center gap-7 text-sm leading-5.25 font-medium max-[1000px]:gap-5 max-[699px]:hidden"
        aria-label="Main navigation"
      >
        <SectionLink className="site-nav-link" href="/#about">
          About
        </SectionLink>
        <SectionLink className="site-nav-link" href="/#experience">
          Experience
        </SectionLink>
        <SectionLink className="site-nav-link" href="/#projects">
          Projects
        </SectionLink>
        <SectionLink className="site-nav-link" href="/#skills">
          Skills
        </SectionLink>
        <SectionLink className="site-nav-link" href="/#contact">
          Contact
        </SectionLink>
      </nav>
      <MobileNavMenu />
    </header>
  );
}
