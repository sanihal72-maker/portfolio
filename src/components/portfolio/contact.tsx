"use client";

import * as React from "react";
import { Send, MessageCircle, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import { getIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BUDGETS = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
];

export function Contact() {
  const { profile, socials, services, settings } = usePortfolio();
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const honeypotRef = React.useRef<HTMLInputElement>(null);

  const whatsapp = socials.find((s) => s.platform === "whatsapp");
  const emailSocial = socials.find((s) => s.platform === "email");
  const email = emailSocial?.url?.replace("mailto:", "") || profile?.email || settings?.contactEmail || "";
  const whatsappUrl =
    whatsapp?.url ||
    (settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}` : "#");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (honeypotRef.current?.value) return; // bot
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || ""),
      budget: String(fd.get("budget") || ""),
      details: String(fd.get("details") || ""),
    };
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setDone(true);
      form.reset();
      toast.success("Inquiry sent", {
        description: "I'll get back to you shortly.",
      });
    } catch (err) {
      toast.error("Could not send", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="contact" className="bg-surface-2/40">
      <SectionHeading index="09" title="Let's Work Together" />

      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {done ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="size-7" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">Inquiry received</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thank you. I&apos;ll review your message and reply soon.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDone(false)}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                {/* honeypot */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required maxLength={120} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required maxLength={200} placeholder="you@email.com" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" name="phone" maxLength={40} placeholder="+8801xxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select name="service">
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.title}>
                            {s.title}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Project budget (optional)</Label>
                  <Select name="budget">
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGETS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Project details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    required
                    minLength={10}
                    maxLength={5000}
                    placeholder="Tell me about your project, goals, and timeline..."
                    className="min-h-[120px] resize-y"
                  />
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* contact channels */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MessageCircle className="size-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">WhatsApp</div>
                <div className="text-xs text-muted-foreground">
                  {settings?.whatsappNumber || "Chat directly"}
                </div>
              </div>
              <Send className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>

            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Mail className="size-5" />
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-semibold">Email</div>
                <div className="truncate text-xs text-muted-foreground">{email}</div>
              </div>
              <Send className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Follow
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials
                  .filter((s) => s.platform !== "whatsapp" && s.platform !== "email")
                  .map((s) => {
                    const Icon = getIcon(s.icon);
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
              </div>
            </div>

            {profile?.available && (
              <div className="mt-auto flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">Currently available</div>
                  <div className="text-xs text-muted-foreground">
                    Open for new project inquiries
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
