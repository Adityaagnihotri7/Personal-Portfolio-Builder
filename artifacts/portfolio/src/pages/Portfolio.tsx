import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { useGetPublicProfile } from "@/lib/api";
import { getTemplate } from "@/templates";
import NotFound from "@/pages/not-found";

export function Portfolio({ username }: { username: string }) {
  const { data, isLoading, error } = useGetPublicProfile(username);

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (error || !data?.user) {
    return <NotFound />;
  }

  const template = getTemplate(data.user.templateId);
  const TemplateComponent = template.Component;
  const url = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/${data.user.username}`;

  return (
    <>
      <Helmet>
        <title>{`${data.user.name} — ${data.user.headline || "Developer Portfolio"}`}</title>
        <meta name="description" content={data.user.bio || `${data.user.name}'s developer portfolio`} />
        <meta property="og:title" content={`${data.user.name} — Portfolio`} />
        <meta property="og:description" content={data.user.bio || `${data.user.name}'s developer portfolio`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={url} />
        {data.user.avatarUrl && (
          <meta property="og:image" content={data.user.avatarUrl} />
        )}
        <link rel="canonical" href={url} />
      </Helmet>
      <TemplateComponent data={data} />
    </>
  );
}
