export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio: string;
  role: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  templateId: "neon" | "minimal" | string;
  socialLinks: SocialLinks;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  image: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Skill = {
  id: string;
  userId: string;
  category: string;
  items: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioData = {
  user: PublicUser;
  projects: Project[];
  skills: Skill[];
};
