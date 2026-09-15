import type { Metadata } from "next";
import { Bricolage_Grotesque, Great_Vibes } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Pranav Avasthi — SWE 3 · Next.js & React Native",
    template: "%s — Pranav Avasthi",
  },
  description:
    "Pranav Avasthi is a SWE 3 developer working with Next.js and React Native. Explore web and mobile work, engineering decisions, and an interactive day-to-night portfolio.",
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
