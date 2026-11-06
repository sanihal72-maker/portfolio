import { db } from "@/lib/db";
import { jsonOk, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const inquiries = await db.inquiry.findMany({
    where: status && status !== "all" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return jsonOk({ inquiries });
}
