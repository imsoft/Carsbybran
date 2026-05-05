import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    const passwordHash = await bcrypt.hash("Admin1234!", 12);
    await db
      .insert(users)
      .values({
        id: "usr_admin_1",
        name: "Brandon",
        email: "weareimsoft@gmail.com",
        passwordHash,
        role: "admin",
      })
      .onConflictDoNothing();

    return NextResponse.json({ ok: true, seeded: { users: 1 } });
  } catch (err) {
    console.error("[seed] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
