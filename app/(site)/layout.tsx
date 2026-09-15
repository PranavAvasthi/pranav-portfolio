import Link from "next/link";
import { CelestialScene } from "@/components/common/celestial-scene/celestial-scene";
import { SiteHeader } from "@/components/common/site-header";
import { SiteFooter } from "@/components/common/site-footer";
import { getSiteConfig } from "@/lib/data/get-site-config";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const config = await getSiteConfig();
  return (
    <CelestialScene>
      <Link className="skip-link" href="#main-content">
        Skip to content
      </Link>
      <SiteHeader name={config.name} />
      <main id="main-content">{children}</main>
      <SiteFooter config={config} />
    </CelestialScene>
  );
}
