import { dark } from "@clerk/themes";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const clerkAppearance = {
  theme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl:
      typeof window !== "undefined"
        ? `${window.location.origin}${basePath}/logo.svg`
        : `${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#22d3ee",
    colorForeground: "#e2e8f0",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#f87171",
    colorBackground: "#0b1120",
    colorInput: "#0f172a",
    colorInputForeground: "#e2e8f0",
    colorNeutral: "#1e293b",
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    borderRadius: "0.875rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-slate-950/80 backdrop-blur-xl border border-cyan-400/10 rounded-2xl w-[440px] max-w-full overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer:
      "!shadow-none !border-0 !bg-slate-950/40 !rounded-none border-t border-slate-800/60",
    headerTitle: "text-slate-100 text-2xl font-semibold tracking-tight",
    headerSubtitle: "text-slate-400 text-sm",
    socialButtonsBlockButtonText: "text-slate-100 font-medium",
    formFieldLabel: "text-slate-300 text-sm font-medium",
    formFieldInput:
      "bg-slate-900/80 border border-slate-700 text-slate-100 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40",
    formButtonPrimary:
      "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold hover:opacity-90 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all",
    socialButtonsBlockButton:
      "bg-slate-900/70 border border-slate-700 text-slate-100 hover:border-cyan-400/60 hover:bg-slate-800/80 transition-colors",
    footerActionLink:
      "text-cyan-300 font-semibold hover:text-cyan-200 transition-colors",
    footerActionText: "text-slate-400 text-sm",
    footerAction: "px-6 py-4",
    dividerText: "text-slate-500 text-xs uppercase tracking-wider",
    dividerLine: "bg-slate-700/60",
    identityPreviewEditButton:
      "text-cyan-300 hover:text-cyan-200 transition-colors",
    formFieldSuccessText: "text-emerald-400 text-sm",
    alertText: "text-slate-200 text-sm",
    alert:
      "bg-slate-900/70 border border-amber-500/30 rounded-lg text-amber-200",
    logoBox: "flex justify-center py-4",
    logoImage: "h-9 w-auto",
    otpCodeFieldInput:
      "bg-slate-900/80 border border-slate-700 text-slate-100 rounded-lg",
    formFieldRow: "gap-1.5",
    main: "px-6 py-6",
  },
};
