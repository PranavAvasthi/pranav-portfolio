import { HeroSection } from "@/components/sections/hero/hero-section";
import { AboutSection } from "@/components/sections/about/about-section";
import { ExperienceSection } from "@/components/sections/experience/experience-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { SkillsSection } from "@/components/sections/skills/skills-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { getSiteConfig } from "@/lib/data/get-site-config";
import { getExperience } from "@/lib/data/get-experience";
import { getProjects } from "@/lib/data/get-projects";
import { getSkills } from "@/lib/data/get-skills";

export default async function Home() {
  const [config, experience, projects, skills] = await Promise.all([
    getSiteConfig(),
    getExperience(),
    getProjects(),
    getSkills(),
  ]);
  return (
    <>
      <HeroSection config={config} />
      <AboutSection />
      <ExperienceSection experience={experience} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <ContactSection config={config} />
    </>
  );
}
