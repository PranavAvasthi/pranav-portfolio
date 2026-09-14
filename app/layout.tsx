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
    default: "Pranav Avasthi — Developer & curious builder",
    template: "%s — Pranav Avasthi",
  },
  description:
    "Thoughtful digital experiences, ideas made real, and a little curiosity. Explore Pranav Avasthi’s work from first light to nightfall.",
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
