import Link from "next/link";

interface SiteFooterProps {
  name: string;
}

export function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="site-footer page-width flex justify-between gap-6 max-[699px]:items-start">
      <p className="m-0 max-[699px]:max-w-42.5">Made with care by {name}.</p>
      <span className="footer-note">Same sky. New possibilities.</span>
      <Link
        className="whitespace-nowrap underline decoration-(--accent) underline-offset-1"
        href="#home"
      >
        Back to daylight
      </Link>
    </footer>
  );
}
