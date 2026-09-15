interface EducationEntry {
  credential: string;
  institution: string;
  result: string;
}

interface SchoolEntry {
  level: string;
  institution: string;
  result: string;
}

interface AboutStat {
  value: string;
  label: string;
}

export interface About {
  eyebrow: string;
  headline: string[];
  subhead: string[];
  stats: AboutStat[];
  paragraphs: string[];
  education: {
    label: string;
    degree: EducationEntry;
    schools: SchoolEntry[];
  };
  closing: string;
}
