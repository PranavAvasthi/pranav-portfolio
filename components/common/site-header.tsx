import Link from "next/link";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  const [firstName = "", lastName = ""] = name.split(" ");

  return (
    <header className="site-header page-width flex h-26 items-center justify-between max-[699px]:h-20.5">
      <span className="header-mark no-underline" aria-label={name}>
        <span className="header-mark-text" aria-hidden="true">
          <span>{firstName.slice(0, 1)}</span>
          <span className="header-mark-first-rest">{firstName.slice(1)}</span>
          <span>{lastName.slice(0, 1)}</span>
          <span className="header-mark-last-rest">{lastName.slice(1)}</span>
        </span>
        <svg
          className="header-mark-underline"
          viewBox="0 0 200 18"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path pathLength="1" d="M3 11 C48 2 78 16 119 8 C151 2 176 5 197 3" />
        </svg>
      </span>
      <nav
        className="flex items-center gap-7 text-sm leading-5.25 font-medium max-[1000px]:gap-5 max-[699px]:gap-2.5 max-[699px]:text-[10px] max-[699px]:leading-4"
        aria-label="Main navigation"
      >
        <Link className="site-nav-link" href="/#about">
          About
        </Link>
        <Link className="site-nav-link" href="/#experience">
          Experience
        </Link>
        <Link className="site-nav-link" href="/#projects">
          Projects
        </Link>
        <Link className="site-nav-link" href="/#skills">
          Skills
        </Link>
        <Link className="site-nav-link" href="/#contact">
          Contact
        </Link>
      </nav>
    </header>
  );
}
