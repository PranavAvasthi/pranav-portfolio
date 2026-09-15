import type { Metadata } from "next";
import { Bricolage_Grotesque, Great_Vibes } from "next/font/google";
import { getSiteConfig } from "@/lib/data/get-site-config";
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
    title: {
      default: `${config.name} - ${config.role}`,
      template: `%s - ${config.name}`,
    },
    description: `${config.name} is a ${config.role}. ${config.introduction}`,
  };
}

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
