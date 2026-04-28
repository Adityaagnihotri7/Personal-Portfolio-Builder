import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "@clerk/react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMe,
  useOnboardMe,
  useCheckUsername,
  getGetMeQueryKey,
} from "@/lib/api";

export function Onboard() {
  const { user: clerkUser, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: meData, isLoading } = useGetMe();
  const onboardMutation = useOnboardMe();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    if (clerkUser) {
      setName(
        clerkUser.fullName ??
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ??
          "",
      );
      const guessed = (clerkUser.username ?? clerkUser.firstName ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "");
      setUsername(guessed);
    }
  }, [clerkUser]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedUsername(username.toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [username]);

  const usernameValid = /^[a-z0-9_-]{3,30}$/.test(debouncedUsername);
  const { data: availability } = useCheckUsername(debouncedUsername, {
    query: {
      enabled: usernameValid,
      staleTime: 0,
      queryKey: [`/api/usernames/${debouncedUsername}/availability`],
    },
  });

  useEffect(() => {
    if (meData?.user) {
      setLocation("/dashboard");
    }
  }, [meData, setLocation]);

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";

  const submit = async () => {
    if (!usernameValid || !availability?.available) return;
    try {
      await onboardMutation.mutateAsync({
        data: {
          username: debouncedUsername,
          name: name.trim() || debouncedUsername,
          email,
        },
      });
      qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Welcome to CodeFolio!", description: `Your portfolio is at /${debouncedUsername}` });
      setLocation("/dashboard");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to onboard";
      toast({ title: "Could not finish onboarding", description: message, variant: "destructive" });
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/40 via-slate-950 to-slate-950 px-4 py-12 text-slate-100">
      <Helmet>
        <title>Pick your username · CodeFolio</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Claim your URL</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose a username — your portfolio will live at{" "}
          <span className="font-mono text-cyan-300">/your-name</span>
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              data-testid="input-name"
              className="mt-1 bg-slate-950/60"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500">
                /
              </span>
              <Input
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().slice(0, 30))
                }
                placeholder="ada"
                data-testid="input-username"
                className="bg-slate-950/60 pl-6 font-mono lowercase"
              />
              {usernameValid && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {availability?.available ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <X className="h-4 w-4 text-rose-400" />
                  )}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              3–30 chars · lowercase letters, digits, dashes & underscores
            </p>
            {!usernameValid && username.length > 0 && (
              <p className="mt-1 text-xs text-rose-400">Invalid username</p>
            )}
            {usernameValid && availability && !availability.available && (
              <p className="mt-1 text-xs text-rose-400">Username taken</p>
            )}
          </div>

          <Button
            onClick={submit}
            disabled={
              !usernameValid ||
              !availability?.available ||
              onboardMutation.isPending ||
              !name.trim()
            }
            className="w-full bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
            data-testid="button-claim-username"
          >
            {onboardMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
