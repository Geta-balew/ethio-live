import Link from "next/link";
import { SignOutButton } from "@/components/admin/admin-login";

export default function AdminHeader({ tab, email }: { tab: "regs" | "settings"; email: string }) {
  return (
    <div className="adm-top">
      <h1>Ethio Live <small>ADMIN</small></h1>
      <div className="tabs">
        <Link href="/admin" className={tab === "regs" ? "on" : ""}>Registrations</Link>
        <Link href="/admin/settings" className={tab === "settings" ? "on" : ""}>Settings &amp; text</Link>
        <Link href="/" target="_blank">View site ↗</Link>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span className="dimt">{email}</span>
        <SignOutButton />
      </div>
    </div>
  );
}
