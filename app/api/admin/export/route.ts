import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Prisma } from "@/lib/generated/prisma/client";
import { RegistrationStatus } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // neutralise spreadsheet formulas and quote everything
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return new Response("Not found", { status: 404 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const st = url.searchParams.get("status") as RegistrationStatus | null;
  const where: Prisma.RegistrationWhereInput = {
    ...(st && Object.values(RegistrationStatus).includes(st) ? { status: st } : {}),
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ] } : {}),
  };
  const rows = await db.registration.findMany({ where, orderBy: { seat: "asc" } });
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Addis_Ababa", dateStyle: "short", timeStyle: "short" });
  const lines = [
    ["Seat", "Name", "Email", "Phone", "Status", "Source", "Notes", "Registered (EAT)", "Via Google"].map(cell).join(","),
    ...rows.map((r) => [r.seat, r.name, r.email, r.phone, r.status, r.source, r.notes, fmt.format(r.createdAt), r.userId ? "yes" : "no"].map(cell).join(",")),
  ];
  const stamp = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens Amharic correctly
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ethio-live-registrations-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
