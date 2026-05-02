import { useGetMe } from "@workspace/api-client-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Maximize2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function DashboardPreview() {
  const { data: meData, isLoading } = useGetMe();
  const [key, setKey] = useState(0);

  const refresh = useCallback(() => setKey((k) => k + 1), []);

  const username = meData?.user?.username;
  const previewUrl = username ? `/${username}` : null;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const iframeSrc = previewUrl ? `${base}${previewUrl}` : null;

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Preview</h1>
            <p className="text-muted-foreground">This is how your portfolio appears to visitors.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={refresh}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            {previewUrl && (
              <Link href={previewUrl}>
                <Button size="sm" className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> View Full Page
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <Skeleton className="flex-1 rounded-xl" />
        ) : !previewUrl ? (
          <div className="flex-1 rounded-xl border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Complete onboarding to see your portfolio preview.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex-1 rounded-xl border border-border overflow-hidden shadow-lg">
            <div className="h-8 bg-card border-b border-border flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-background rounded px-3 py-0.5 text-xs text-muted-foreground font-mono truncate">
                {window.location.origin}{base}{previewUrl}
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <iframe
              key={key}
              src={iframeSrc!}
              className="w-full"
              style={{ height: "calc(100% - 32px)" }}
              title="Portfolio Preview"
            />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
