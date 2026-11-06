import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "aryadev-portfolio-secret-change-in-production";
const COOKIE_NAME = "ad_admin_token";
const TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(adminId: string, email: string): string {
  return jwt.sign({ sub: adminId, email }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function getCurrentAdmin() {
  const token = await getAdminToken();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const admin = await db.admin.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true },
  });
  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

// Ensure a default admin exists for first-run
export async function ensureDefaultAdmin() {
  const count = await db.admin.count();
  if (count > 0) return null;
  const password = await hashPassword("admin123");
  const admin = await db.admin.create({
    data: {
      email: "admin@aryadev.com",
      name: "Arya Dev",
      password,
      role: "owner",
    },
  });
  return { email: admin.email, password: "admin123" };
}
