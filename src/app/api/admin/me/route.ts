import { jsonOk, jsonError } from "@/lib/api-helpers";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return jsonError(401, "Unauthorized");
  return jsonOk({ admin });
}
