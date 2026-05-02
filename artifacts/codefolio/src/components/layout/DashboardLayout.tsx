import React from "react";
import { Link, useLocation } from "wouter";
import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, UserCircle, Briefcase, Wrench, Eye, Code2 } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();

  const navItems = [
    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
    { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
    { href: "/dashboard/skills", label: "Skills", icon: Wrench },
    { href: "/dashboard/preview", label: "Preview", icon: Eye },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Code2 className="h-6 w-6" />
            <span>CodeFolio</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="text-sm truncate">
            <p className="font-medium truncate">{user?.fullName || "Developer"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Code2 className="h-6 w-6" />
            <span>CodeFolio</span>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}