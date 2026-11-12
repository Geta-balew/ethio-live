import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import AdminLogin from "@/components/admin/admin-login";
import SettingsForm from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings — Ethio Live admin", robots: { index: false } };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return <AdminLogin />;
  if (!user.isAdmin) notFound();
  const s = await getSettings();
  return (
    <div className="adm">
      <AdminHeader tab="settings" email={user.email} />
      <SettingsForm s={s} />
    </div>
  );
}
