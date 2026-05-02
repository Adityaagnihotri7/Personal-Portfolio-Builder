import { useParams } from "wouter";
import { useGetPublicProfile } from "@workspace/api-client-react";
import { NeonTemplate } from "@/components/templates/NeonTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";

const templateMap: Record<string, React.ComponentType<any>> = {
  neon: NeonTemplate,
  minimal: MinimalTemplate,
};

export default function PublicPortfolio() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const { data: profile, isLoading, error } = useGetPublicProfile(username, {
    query: { enabled: !!username }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!profile || (error as any)?.status === 404) {
    return <NotFound />;
  }

  const Template = templateMap[profile.user.templateId] || NeonTemplate;
  return <Template data={profile} />;
}
