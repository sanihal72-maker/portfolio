"use client";

import * as React from "react";
import { ArrowLeft, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson, type Admin } from "./lib";

export function LoginScreen({
  onLoggedIn,
  onBackToSite,
}: {
  onLoggedIn: (admin: Admin) => void;
  onBackToSite: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setSubmitting(true);
    try {
      await fetchJson<{ ok: boolean; admin: Admin }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      // re-fetch /me to populate auth state
      const me = await fetchJson<{ admin: Admin }>("/api/admin/me");
      toast.success("Signed in");
      onLoggedIn(me.admin);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <LockKeyhole className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Arya Dev</span>
            <span className="text-xs text-muted-foreground">Admin Control Center</span>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>
              Use your admin credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aryadev.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={submitting} className="mt-2 w-full">
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-5 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Demo credentials</p>
              <p className="mt-1 font-mono">admin@aryadev.com</p>
              <p className="font-mono">admin123</p>
            </div>

            <button
              type="button"
              onClick={onBackToSite}
              className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to site
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
