import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboardMe, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, underscores, and dashes only"),
  name: z.string().min(1, "Display name is required"),
});

export default function Onboard() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onboardMe = useOnboardMe();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: user?.fullName || "",
    },
  });

  useEffect(() => {
    if (user?.fullName && !form.getValues("name")) {
      form.setValue("name", user.fullName);
    }
  }, [user?.fullName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("[Onboard] Submitting onboarding:", values);
    try {
      const result = await onboardMe.mutateAsync({
        data: {
          username: values.username.toLowerCase(),
          name: values.name,
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
      });
      console.log("[Onboard] API response:", result);

      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });

      toast({ title: "Welcome to CodeFolio!", description: "Your profile has been created." });
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("[Onboard] Error:", error);
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to complete onboarding";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Claim your profile</CardTitle>
          <CardDescription>
            Just a few details to get your portfolio ready.
            {user?.primaryEmailAddress?.emailAddress && (
              <span className="block mt-1 text-xs text-muted-foreground">
                Signed in as {user.primaryEmailAddress.emailAddress}
              </span>
            )}
          </CardDescription>
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
                        <Input
                          className="rounded-l-none"
                          placeholder="johndoe"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                          }
                        />
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
                {onboardMe.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
