"use client";

import { useState } from "react";
import { SectionLink } from "@/components/common/section-link";

const links = [
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Projects", "/#projects"],
  ["Skills", "/#skills"],
  ["Contributions", "/#contributions"],
  ["Contact", "/#contact"],
] as const;

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav-menu">
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav-panel"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href]) => (
            <SectionLink
              key={href}
              className="mobile-nav-link"
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </SectionLink>
          ))}
        </nav>
      )}
    </div>
  );
}
