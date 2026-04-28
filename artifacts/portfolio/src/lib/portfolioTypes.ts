import type {
  User,
  Project,
  Skill,
  PublicProfile,
  ShowcaseUser,
  Template,
  MeResponse,
  UserStats,
  SocialLinks,
} from "@workspace/api-client-react";

export type PortfolioUser = User;
export type PortfolioData = PublicProfile;
export type { Project, Skill, ShowcaseUser as Showcase, Template, MeResponse, UserStats, SocialLinks };
