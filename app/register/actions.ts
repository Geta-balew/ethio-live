"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { getSettings } from "@/lib/settings";

export type RegState = { ok?: boolean; error?: "auth" | "closed" | "phone" | "name" | "server" };

export async function registerAction(_prev: RegState, form: FormData): Promise<RegState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "auth" };

  const settings = await getSettings();
  const existing = await db.registration.findUnique({ where: { userId: session.user.id } });
  if (!settings.registrationOpen && !existing) return { error: "closed" };

  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  if (name.length < 2) return { error: "name" };
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  if (!phone) return { error: "phone" };
  const source = String(form.get("source") ?? "").trim().slice(0, 120) || null;

  try {
    await db.$transaction([
      db.registration.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, name, email: session.user.email, phone, source },
        update: { name, phone },
      }),
      db.user.update({ where: { id: session.user.id }, data: { name, phone } }),
    ]);
  } catch (e) {
    console.error("registerAction", e);
    return { error: "server" };
  }
  revalidatePath("/register");
  revalidatePath("/");
  return { ok: true };
}
