"use server";

import { redirect } from "next/navigation";
import { LoginSchema, RegisterSchema } from "@/lib/definitions";
import type { LoginFormState, RegisterFormState, UserRole } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = LoginSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { errors: fieldErrors };
  }

  const { email, password } = result.data;
  const rows = await db.select().from(users).where(eq(users.email, email));
  const user = rows[0];

  if (!user || !user.passwordHash) {
    return { message: "Email o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { message: "Email o contraseña incorrectos." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
  });

  redirect(user.role === "admin" ? "/dashboard" : "/");
}

export async function register(
  _state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = RegisterSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { errors: fieldErrors };
  }

  const { name, email, password } = result.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  if (existing.length > 0) {
    return { errors: { email: ["Este email ya está registrado."] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = `usr_${Date.now()}`;

  await db.insert(users).values({ id, name, email, passwordHash, role: "user" });

  await createSession({ userId: id, email, name, role: "user" });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function findOrCreateGoogleUser(googleUser: {
  id: string;
  email: string;
  name: string;
}) {
  const rows = await db.select().from(users).where(eq(users.email, googleUser.email));
  if (rows.length > 0) return rows[0];

  const id = `usr_google_${googleUser.id}`;
  await db.insert(users).values({
    id,
    name: googleUser.name,
    email: googleUser.email,
    passwordHash: null,
    role: "user",
  });

  return {
    id,
    name: googleUser.name,
    email: googleUser.email,
    passwordHash: null,
    role: "user",
    createdAt: new Date(),
  };
}
