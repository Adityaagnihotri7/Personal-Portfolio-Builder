import { Link } from "wouter";
import { useGetMe, useGetMyStats, useListMyProjects, useListMySkills } from "@workspace/api-client-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ExternalLink, Folder, Code, UserCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: meData, isLoading: loadingMe } = useGetMe();
  const { data: stats, isLoading: loadingStats } = useGetMyStats();
  const { data: projects, isLoading: loadingProjects } = useListMyProjects();
  const { data: skills } = useListMySkills();

  const user = meData?.user;

  const quickActions = [
    { label: "Edit Profile", href: "/dashboard/profile", icon: UserCircle, desc: "Name, bio, links" },
    { label: "Add Projects", href: "/dashboard/projects", icon: Folder, desc: "Showcase your work" },
    { label: "Add Skills", href: "/dashboard/skills", icon: Code, desc: "Tech stack & tools" },
    { label: "Live Preview", href: "/dashboard/preview", icon: Zap, desc: "See your portfolio" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold tracking-tight">
            {loadingMe ? <Skeleton className="h-9 w-48" /> : `Welcome back, ${user?.name?.split(" ")[0] || "Developer"}`}
          </h1>
          <p className="text-muted-foreground mt-1">Here's how your portfolio is looking.</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loadingStats ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats?.completion ?? 0}%</div>
                    <Progress value={stats?.completion ?? 0} className="mt-2 h-1.5" />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.projectsCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">in your portfolio</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Skill Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.skillsCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">categories defined</p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Public URL */}
        {user?.username && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="border-dashed">
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your public portfolio</p>
                  <p className="font-mono text-sm font-semibold text-primary">/{user.username}</p>
                </div>
                <Link href={`/${user.username}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Live
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <Link href={action.href}>
                    <Card className="hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <Icon className="h-8 w-8 text-primary mb-3" />
                        <p className="font-semibold">{action.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                        <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent projects preview */}
        {!loadingProjects && (projects?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm" className="gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
            <div className="space-y-3">
              {projects?.slice(0, 3).map((project) => (
                <Card key={project.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="py-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{project.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack?.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs font-mono">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
