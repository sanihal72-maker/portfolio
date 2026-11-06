import { jsonOk, jsonError, adminGuard } from "@/lib/api-helpers";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const MAX = 6 * 1024 * 1024; // 6MB

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "No file provided");
  }
  if (!ALLOWED.includes(file.type)) {
    return jsonError(400, "Unsupported file type. Use PNG, JPEG, WebP, SVG or GIF.");
  }
  if (file.size > MAX) {
    return jsonError(400, "File too large (max 6MB).");
  }

  const ext = file.type.split("/")[1].replace("svg+xml", "svg");
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, name), buffer);

  return jsonOk({ url: `/uploads/${name}`, name, size: file.size });
}
