import type { ComponentType } from "react";
import { NeonTemplate } from "./NeonTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import type { PortfolioData } from "@/lib/portfolioTypes";

export type TemplateId = "neon" | "minimal";

export type TemplateComponent = ComponentType<{ data: PortfolioData }>;

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  previewBackground: string;
  accentColor: string;
  isPro: boolean;
  Component: TemplateComponent;
};

export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  neon: {
    id: "neon",
    name: "Neon Dark",
    description: "Glassmorphic dark theme with cyan-violet neon glows.",
    previewBackground: "linear-gradient(135deg, #020617, #1e1b4b 60%, #0c4a6e)",
    accentColor: "#22d3ee",
    isPro: false,
    Component: NeonTemplate,
  },
  minimal: {
    id: "minimal",
    name: "Minimal Light",
    description: "Clean editorial light theme with serif accents.",
    previewBackground: "linear-gradient(135deg, #fafafa, #f5f5f4 60%, #fef2f2)",
    accentColor: "#0f172a",
    isPro: false,
    Component: MinimalTemplate,
  },
};

export function getTemplate(id: string | undefined | null): TemplateMeta {
  if (id && id in TEMPLATES) return TEMPLATES[id as TemplateId];
  return TEMPLATES.neon;
}
