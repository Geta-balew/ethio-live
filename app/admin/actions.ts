"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { assertAdmin } from "@/lib/session";
import { getSettings, saveSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS, localInputToIso, mergeSettings, type SiteSettings } from "@/lib/settings-shared";
import { RegistrationStatus } from "@/lib/generated/prisma/client";

export type ActResult = { ok?: boolean; error?: string };

const statusSchema = z.enum(Object.values(RegistrationStatus) as [RegistrationStatus, ...RegistrationStatus[]]);

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateRegistration(id: string, data: { name: string; phone: string; email: string; status: string; notes: string }): Promise<ActResult> {
  await assertAdmin();
  const phone = normalizePhone(data.phone);
  if (!phone) return { error: "Invalid phone number" };
  const status = statusSchema.safeParse(data.status);
  if (!status.success) return { error: "Invalid status" };
  const email = z.string().email().safeParse(data.email.trim());
  if (!email.success) return { error: "Invalid email" };
  if (data.name.trim().length < 2) return { error: "Name is too short" };
  await db.registration.update({
    where: { id },
    data: { name: data.name.trim().slice(0, 100), phone, email: email.data, status: status.data, notes: data.notes.trim().slice(0, 1000) || null },
  });
  refresh();
  return { ok: true };
}

export async function deleteRegistration(id: string): Promise<ActResult> {
  await assertAdmin();
  await db.registration.delete({ where: { id } });
  refresh();
  return { ok: true };
}

export async function bulkStatus(ids: string[], status: string): Promise<ActResult> {
  await assertAdmin();
  const st = statusSchema.safeParse(status);
  if (!st.success || !ids.length) return { error: "Invalid request" };
  await db.registration.updateMany({ where: { id: { in: ids } }, data: { status: st.data } });
  refresh();
  return { ok: true };
}

export async function addRegistration(_: ActResult, form: FormData): Promise<ActResult> {
  await assertAdmin();
  const name = String(form.get("name") ?? "").trim();
  const email = z.string().email().safeParse(String(form.get("email") ?? "").trim());
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  if (name.length < 2) return { error: "Name is too short" };
  if (!email.success) return { error: "Invalid email" };
  if (!phone) return { error: "Invalid phone number" };
  await db.registration.create({ data: { name, email: email.data, phone, source: "admin", notes: String(form.get("notes") ?? "").trim() || null } });
  refresh();
  return { ok: true };
}

/** Saves the main settings form + the JSON text editor. */
export async function saveSettingsAction(_: ActResult, form: FormData): Promise<ActResult> {
  await assertAdmin();
  const cur = await getSettings();
  try {
    const days = [0, 1, 2]
      .map((i) => ({ start: String(form.get(`day${i}start`) ?? ""), end: String(form.get(`day${i}end`) ?? "") }))
      .filter((d) => d.start && d.end)
      .map((d) => ({ start: localInputToIso(d.start), end: localInputToIso(d.end) }));
    if (!days.length) return { error: "At least one day is required" };
    for (const d of days) {
      if (isNaN(+new Date(d.start)) || isNaN(+new Date(d.end))) return { error: "Invalid date" };
      if (+new Date(d.end) <= +new Date(d.start)) return { error: "Each day must end after it starts" };
    }
    const url = z.string().url();
    const telegramLink = url.safeParse(String(form.get("telegramLink") ?? ""));
    const subLink = url.safeParse(String(form.get("subLink") ?? ""));
    if (!telegramLink.success || !subLink.success) return { error: "Links must be full URLs (https://…)" };

    let text = cur.text;
    const rawText = String(form.get("text") ?? "").trim();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (!parsed || typeof parsed !== "object" || !parsed.en || !parsed.am) return { error: "Text JSON must contain \"en\" and \"am\"" };
      text = mergeSettings(DEFAULT_SETTINGS.text, parsed);
    }

    const next: SiteSettings = {
      ...cur,
      defaultLang: form.get("defaultLang") === "am" ? "am" : "en",
      registrationOpen: form.get("registrationOpen") === "on",
      days,
      telegramLink: telegramLink.data,
      subLink: subLink.data,
      ytSubs: String(form.get("ytSubs") ?? cur.ytSubs).trim().slice(0, 20),
      hostName: String(form.get("hostName") ?? cur.hostName).trim().slice(0, 80),
      hostRole: String(form.get("hostRole") ?? cur.hostRole).trim().slice(0, 120),
      text,
    };
    await saveSettings(next);
  } catch (e) {
    if (e instanceof SyntaxError) return { error: `Text JSON error: ${e.message}` };
    console.error(e);
    return { error: "Could not save settings" };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetTextAction(): Promise<ActResult> {
  await assertAdmin();
  const cur = await getSettings();
  await saveSettings({ ...cur, text: DEFAULT_SETTINGS.text });
  revalidatePath("/", "layout");
  return { ok: true };
}
