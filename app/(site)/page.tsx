import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { SiteStructuredData } from "@/components/common/site-structured-data";
import { getPageMetadata } from "@/lib/seo/metadata";
import { isEmbeddedPreview } from "@/lib/utils/is-embedded-preview";
import { AboutSection } from "@/components/sections/about/about-section";
import { ExperienceSection } from "@/components/sections/experience/experience-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { SkillsSection } from "@/components/sections/skills/skills-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { ContributionsSection } from "@/components/sections/contributions/contributions-section";
import { getSiteConfig } from "@/lib/data/get-site-config";
import { getExperience } from "@/lib/data/get-experience";
import { getProjects } from "@/lib/data/get-projects";
import { getSkills } from "@/lib/data/get-skills";
import { getAbout } from "@/lib/data/get-about";
import { getContributions } from "@/lib/data/get-contributions";

interface HomeProps {
  searchParams: Promise<{ embed?: string | string[] }>;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const [config, query] = await Promise.all([getSiteConfig(), searchParams]);
  return getPageMetadata(config, {
    path: "/",
    index: !isEmbeddedPreview(query.embed),
  });
}

export default async function Home({ searchParams }: HomeProps) {
  const embed = (await searchParams).embed;
  const embedded = isEmbeddedPreview(embed);
  const [config, about, experience, projects, skills, contributions] =
    await Promise.all([
      getSiteConfig(),
      getAbout(),
      getExperience(),
      getProjects(),
      getSkills(),
      getContributions(),
    ]);
  return (
    <>
      {!embedded && <SiteStructuredData config={config} />}
      <HeroSection config={config} showLivePreview={!embedded} />
      <AboutSection about={about} />
      <ExperienceSection experience={experience} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <ContributionsSection contributions={contributions} />
      <ContactSection config={config} />
    </>
  );
}
