import "server-only";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from "@/lib/settings-shared";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await db.setting.findUnique({ where: { key: "site" } });
    return mergeSettings(DEFAULT_SETTINGS, row?.value);
  } catch (e) {
    console.error("getSettings failed, using defaults", e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(value: SiteSettings): Promise<void> {
  const json = JSON.parse(JSON.stringify(value));
  await db.setting.upsert({ where: { key: "site" }, create: { key: "site", value: json }, update: { value: json } });
}
