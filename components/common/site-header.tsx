import Link from "next/link";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  return (
    <header className="site-header page-width flex h-26 items-center justify-between max-[699px]:h-20.5">
      <Link
        className="text-[31px] font-extrabold tracking-[-1.5px] no-underline max-[699px]:text-[27px]"
        href="#home"
        aria-label={`${name}, home`}
      >
        pranav
        <span className="text-(--accent)" aria-hidden="true">
          .
        </span>
      </Link>
      <nav
        className="flex items-center gap-9 text-sm leading-5.25 font-medium max-[699px]:gap-5 max-[699px]:text-xs max-[699px]:leading-4.5"
        aria-label="Main navigation"
      >
        <Link className="py-3.5" href="#about">
          About
        </Link>
        <Link className="py-3.5" href="#projects">
          Work
        </Link>
        <Link
          className="border-b-2 border-(--accent) pt-3.5 pb-1.75 no-underline"
          href="#contact"
        >
          Let’s talk
        </Link>
      </nav>
    </header>
  );
}
