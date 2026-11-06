import { jsonOk } from "@/lib/api-helpers";
import { clearAdminCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearAdminCookie();
  return jsonOk({ ok: true });
}
