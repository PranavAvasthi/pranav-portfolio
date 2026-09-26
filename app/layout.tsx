import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Great_Vibes } from "next/font/google";
import { env } from "@/env";
import { getSiteConfig } from "@/lib/data/get-site-config";
import { SITE_URL, getCanonicalUrl } from "@/lib/seo/site-url";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const greatVibes = Great_Vibes({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${config.name} | ${config.jobTitle}`,
      template: `%s | ${config.name}`,
    },
    description: config.seo.description,
    applicationName: config.name,
    authors: [{ name: config.name, url: getCanonicalUrl() }],
    creator: config.name,
    publisher: config.name,
    verification: env.GOOGLE_SITE_VERIFICATION
      ? { google: env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#111D3D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
