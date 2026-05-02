import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, useAuth, SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { setupAuthInterceptor } from "./lib/api";
import Landing from "@/pages/Landing";
import Onboard from "@/pages/Onboard";
import Dashboard from "@/pages/Dashboard";
import DashboardProfile from "@/pages/DashboardProfile";
import DashboardProjects from "@/pages/DashboardProjects";
import DashboardSkills from "@/pages/DashboardSkills";
import DashboardPreview from "@/pages/DashboardPreview";
import PublicPortfolio from "@/pages/PublicPortfolio";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  React.useEffect(() => {
    setupAuthInterceptor(getToken);
  }, [getToken]);
  return <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return null;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/sign-in">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/onboard" />
        </div>
      </Route>
      <Route path="/sign-up">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboard" />
        </div>
      </Route>
      <Route path="/onboard">
        <RequireAuth>
          <Onboard />
        </RequireAuth>
      </Route>
      <Route path="/dashboard">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/profile">
        <RequireAuth>
          <DashboardProfile />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/projects">
        <RequireAuth>
          <DashboardProjects />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/skills">
        <RequireAuth>
          <DashboardSkills />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/preview">
        <RequireAuth>
          <DashboardPreview />
        </RequireAuth>
      </Route>
      <Route path="/:username" component={PublicPortfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
