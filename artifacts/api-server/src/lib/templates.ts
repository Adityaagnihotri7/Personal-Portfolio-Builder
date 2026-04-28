export type TemplateInfo = {
  id: string;
  name: string;
  description: string;
  previewBackground: string;
  accentColor: string;
  isPro: boolean;
};

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "neon",
    name: "Neon Dark",
    description: "Glassmorphic dark theme with cyan-violet neon glows.",
    previewBackground: "linear-gradient(135deg, #020617, #1e1b4b 60%, #0c4a6e)",
    accentColor: "#22d3ee",
    isPro: false,
  },
  {
    id: "minimal",
    name: "Minimal Light",
    description: "Clean editorial light theme with serif accents.",
    previewBackground: "linear-gradient(135deg, #fafafa, #f5f5f4 60%, #fef2f2)",
    accentColor: "#0f172a",
    isPro: false,
  },
];
