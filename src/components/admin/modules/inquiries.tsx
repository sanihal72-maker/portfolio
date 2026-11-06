"use client";

import * as React from "react";
import { Eye, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  fetchJson,
  formatDateTime,
  INQUIRY_STATUSES,
  type Inquiry,
  type InquiryStatus,
} from "../lib";
import {
  ConfirmDeleteDialog,
  EmptyState,
  LoadingState,
  PageHeader,
  ScrollArea,
} from "../shared";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  read: "bg-muted text-muted-foreground border-border",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  archived: "bg-muted text-muted-foreground border-border",
};

const FILTER_OPTIONS: { value: InquiryStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...INQUIRY_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })),
];

export function InquiriesModule() {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<InquiryStatus | "all">("all");
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(
    (status: InquiryStatus | "all") => {
      setLoading(true);
      const qs = status === "all" ? "" : `?status=${status}`;
      fetchJson<{ inquiries: Inquiry[] }>(`/api/admin/inquiries${qs}`)
        .then(({ inquiries }) => setInquiries(inquiries))
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Failed to load inquiries")
        )
        .finally(() => setLoading(false));
    },
    []
  );

  React.useEffect(() => {
    load(filter);
  }, [load, filter]);

  async function changeStatus(id: string, status: string) {
    setInquiries((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status } : x))
    );
    try {
      await fetchJson(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      load(filter);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/inquiries/${deleteId}`, { method: "DELETE" });
      toast.success("Inquiry deleted");
      setInquiries((prev) => prev.filter((i) => i.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  const detail = inquiries.find((i) => i.id === detailId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contact Inquiries"
        description="Review and manage inquiries submitted through your contact form."
        action={
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as InquiryStatus | "all")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={6} />
          ) : inquiries.length === 0 ? (
            <EmptyState
              title="No inquiries"
              description="There are no inquiries matching this filter."
              icon={<Inbox className="size-5" />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead className="hidden md:table-cell">Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((i) => (
                  <TableRow key={i.id} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{i.name}</span>
                        <span className="text-xs text-muted-foreground">{i.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {i.service ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {i.budget ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[i.status] ?? STATUS_STYLES.new}
                      >
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDateTime(i.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={i.status}
                          onValueChange={(v) => changeStatus(i.id, v)}
                        >
                          <SelectTrigger size="sm" className="h-8 w-[130px]">
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
                        <Button variant="ghost" size="icon" onClick={() => setDetailId(i.id)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(i.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetailId(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry from {detail?.name}</DialogTitle>
            <DialogDescription>
              Received {detail ? formatDateTime(detail.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>
          {detail ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Name" value={detail.name} />
                <DetailField label="Email" value={detail.email} />
                <DetailField label="Phone" value={detail.phone ?? "—"} />
                <DetailField label="Service" value={detail.service ?? "—"} />
                <DetailField label="Budget" value={detail.budget ?? "—"} />
                <DetailField
                  label="Status"
                  value={
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[detail.status] ?? STATUS_STYLES.new}
                    >
                      {detail.status}
                    </Badge>
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Message</span>
                <div className="rounded-md border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                  {detail.details}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {INQUIRY_STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={detail.status === s ? "default" : "outline"}
                    onClick={() => {
                      changeStatus(detail.id, s);
                    }}
                  >
                    Mark as {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteId(detail?.id ?? null);
                setDetailId(null);
              }}
            >
              <Trash2 className="size-4" />
              Delete inquiry
            </Button>
            <Button variant="outline" onClick={() => setDetailId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete inquiry?"
        description="This inquiry will be permanently deleted."
        confirmLabel="Delete"
      />
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
