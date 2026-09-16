export interface ContributionImage {
  src: string;
  alt: string;
}

export interface ContributionLink {
  label: string;
  url: string;
}

export interface Contribution {
  id: string;
  title: string;
  description: string;
  tag: string;
  image?: ContributionImage;
  link: ContributionLink;
}
