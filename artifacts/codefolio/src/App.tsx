import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, useAuth, SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { setupAuthInterceptor } from "./lib/api";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
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

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded) return <Spinner />;
  if (!isSignedIn) return null;
  return <>{children}</>;
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: meData, isLoading, isError } = useGetMe();

  React.useEffect(() => {
    if (!isLoading && !isError && meData?.needsOnboarding) {
      console.log("[OnboardingGuard] User needs onboarding → redirecting to /onboard");
      setLocation("/onboard");
    }
  }, [isLoading, isError, meData, setLocation]);

  if (isLoading) return <Spinner />;

  if (meData?.needsOnboarding) return null;

  return <>{children}</>;
}

function OnboardRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: meData, isLoading } = useGetMe();

  React.useEffect(() => {
    if (!isLoading && meData?.user && !meData?.needsOnboarding) {
      console.log("[OnboardRoute] User already onboarded → redirecting to /dashboard");
      setLocation("/dashboard");
    }
  }, [isLoading, meData, setLocation]);

  if (isLoading) return <Spinner />;

  if (meData?.user && !meData?.needsOnboarding) return null;

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
          <OnboardRoute>
            <Onboard />
          </OnboardRoute>
        </RequireAuth>
      </Route>
      <Route path="/dashboard">
        <RequireAuth>
          <OnboardingGuard>
            <Dashboard />
          </OnboardingGuard>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/profile">
        <RequireAuth>
          <OnboardingGuard>
            <DashboardProfile />
          </OnboardingGuard>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/projects">
        <RequireAuth>
          <OnboardingGuard>
            <DashboardProjects />
          </OnboardingGuard>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/skills">
        <RequireAuth>
          <OnboardingGuard>
            <DashboardSkills />
          </OnboardingGuard>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/preview">
        <RequireAuth>
          <OnboardingGuard>
            <DashboardPreview />
          </OnboardingGuard>
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
