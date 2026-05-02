import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/clerk-react";
import { useOnboardMe, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, underscores, and dashes only"),
  name: z.string().min(1, "Name is required"),
});

export default function Onboard() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  
  const { data: meData, isLoading: isLoadingMe } = useGetMe();
  const onboardMe = useOnboardMe();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: user?.fullName || "",
    },
  });

  useEffect(() => {
    if (meData?.user) {
      setLocation("/dashboard/profile");
    }
  }, [meData, setLocation]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onboardMe.mutateAsync({
        data: {
          username: values.username,
          name: values.name,
          email: user?.primaryEmailAddress?.emailAddress || "",
        }
      });
      toast({ title: "Welcome to CodeFolio!" });
      setLocation("/dashboard/profile");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.error || "Failed to complete onboarding", 
        variant: "destructive" 
      });
    }
  }

  if (isLoadingMe) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Claim your profile</CardTitle>
          <CardDescription>Just a few details to get your portfolio ready.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="bg-muted px-3 py-2 border border-r-0 border-input rounded-l-md text-muted-foreground text-sm">
                          codefolio.dev/
                        </span>
                        <Input className="rounded-l-none" placeholder="johndoe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={onboardMe.isPending}>
                {onboardMe.isPending ? "Saving..." : "Continue to Dashboard"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}