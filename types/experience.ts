export interface ExperienceRole {
  id: string;
  position: string;
  startMonth: string;
  endMonth: string | null;
  title: string;
  description: string;
}

export interface Experience {
  company: string;
  employmentDetails: string;
  roles: ExperienceRole[];
}
