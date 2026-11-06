"use client";

import * as React from "react";
import {
  Briefcase,
  Cpu,
  FolderKanban,
  Inbox,
  MailOpen,
  Plus,
  Star,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchJson, formatDate, type DashboardData, type Inquiry, INQUIRY_STATUSES } from "../lib";
import { PageHeader } from "../shared";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  read: "bg-muted text-muted-foreground border-border",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  archived: "bg-muted text-muted-foreground border-border",
};

export function DashboardModule({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJson<DashboardData>("/api/admin/dashboard")
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const stats = data?.stats;

  const cards: { label: string; value?: number; icon: React.ComponentType<{ className?: string }>; nav: string; accent?: boolean }[] = [
    { label: "Total Inquiries", value: stats?.inquiries, icon: Inbox, nav: "inquiries" },
    { label: "Unread Inquiries", value: stats?.unreadInquiries, icon: MailOpen, nav: "inquiries", accent: true },
    { label: "Projects", value: stats?.projects, icon: FolderKanban, nav: "projects" },
    { label: "Services", value: stats?.services, icon: Briefcase, nav: "services" },
    { label: "Solutions", value: stats?.solutions, icon: Boxes, nav: "solutions" },
    { label: "Testimonials", value: stats?.testimonials, icon: Star, nav: "testimonials" },
  ];

  const quickActions = [
    { label: "Add Service", nav: "services" },
    { label: "Add Project", nav: "projects" },
    { label: "Add Skill", nav: "skills" },
    { label: "Add Testimonial", nav: "testimonials" },
    { label: "Add Solution", nav: "solutions" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio activity and quick access to modules."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="rounded-xl">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {c.label}
                  </span>
                  <span
                    className={
                      "flex size-8 items-center justify-center rounded-md " +
                      (c.accent
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    <Icon className="size-4" />
                  </span>
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-semibold">{c.value ?? 0}</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onNavigate(c.nav)}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Recent Inquiries</CardTitle>
          <CardDescription>Latest contact submissions and their status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data && data.recentInquiries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentInquiries.map((inq) => (
                  <RecentInquiryRow key={inq.id} inquiry={inq} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No inquiries yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Quick actions</CardTitle>
          <CardDescription>Jump straight to creating new content.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 p-4">
          {quickActions.map((q) => (
            <Button
              key={q.label}
              variant="outline"
              size="sm"
              onClick={() => onNavigate(q.nav)}
            >
              <Plus className="size-4" />
              {q.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("skills")}
          >
            <Cpu className="size-4" />
            Manage Skills
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function RecentInquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = React.useState(inquiry.status);

  async function updateStatus(next: string) {
    const prev = status;
    setStatus(next);
    try {
      await fetchJson(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      toast.success("Status updated");
    } catch (err) {
      setStatus(prev);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <TableRow className="border-border">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{inquiry.name}</span>
          <span className="text-xs text-muted-foreground">{inquiry.email}</span>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {inquiry.service || "—"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={STATUS_STYLES[status] ?? STATUS_STYLES.new}
          >
            {status}
          </Badge>
          <Select value={status} onValueChange={updateStatus}>
            <SelectTrigger size="sm" className="h-7 w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {formatDate(inquiry.createdAt)}
      </TableCell>
    </TableRow>
  );
}
