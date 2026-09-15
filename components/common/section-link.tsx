"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

interface SectionLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

export function SectionLink({
  href,
  className,
  children,
  ariaLabel,
}: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);
    if (
      destination.pathname !== window.location.pathname ||
      !destination.hash
    ) {
      return;
    }

    const target = document.getElementById(
      decodeURIComponent(destination.hash.slice(1)),
    );
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== destination.hash) {
      window.history.pushState(
        null,
        "",
        `${destination.pathname}${destination.search}${destination.hash}`,
      );
    }
    target.scrollIntoView();
  };

  return (
    <Link
      className={className}
      href={href}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
