import type { ComponentType } from "react";
import type { PortfolioData } from "@/lib/types";
import { NeonTemplate } from "./NeonTemplate";
import { MinimalTemplate } from "./MinimalTemplate";

export type TemplateProps = { data: PortfolioData };

export const templateMap: Record<string, ComponentType<TemplateProps>> = {
  neon: NeonTemplate,
  minimal: MinimalTemplate,
};

export function pickTemplate(id: string | undefined | null): ComponentType<TemplateProps> {
  return templateMap[id ?? "neon"] ?? NeonTemplate;
}

export const templateOptions = [
  { id: "neon", label: "Neon Dark", description: "Glassmorphism, gradients, animated reveals." },
  { id: "minimal", label: "Minimal Light", description: "Clean, typographic, distraction-free." },
];
