export interface Skill {
  id: string;
  name: string;
  group: string;
  description: string;
  position: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  connectsTo: string[];
  evidence?: { label: string; href: string };
}
