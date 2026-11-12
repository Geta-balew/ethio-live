import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import AdminLogin from "@/components/admin/admin-login";
import AddForm from "@/components/admin/add-form";
import RegTable, { type Row } from "@/components/admin/reg-table";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Prisma } from "@/lib/generated/prisma/client";
import { RegistrationStatus } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Ethio Live", robots: { index: false } };

const PER_PAGE = 50;
const DAY = 864e5, EAT = 3 * 3600e3;
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Addis_Ababa", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) return <AdminLogin />;
  if (!user.isAdmin) notFound();

  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const status = Object.values(RegistrationStatus).includes(sp.status as RegistrationStatus) ? (sp.status as RegistrationStatus) : undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const where: Prisma.RegistrationWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q.replace(/\s/g, "") } },
      ...(/^\d+$/.test(q) ? [{ seat: parseInt(q) }] : []),
    ] } : {}),
  };

  const now = Date.now();
  const todayStart = new Date(Math.floor((now + EAT) / DAY) * DAY - EAT);
  const weekStart = new Date(todayStart.getTime() - 6 * DAY);

  const [total, today, week, byStatus, filtered, list, recent] = await Promise.all([
    db.registration.count(),
    db.registration.count({ where: { createdAt: { gte: todayStart } } }),
    db.registration.count({ where: { createdAt: { gte: weekStart } } }),
    db.registration.groupBy({ by: ["status"], _count: true }),
    db.registration.count({ where }),
    db.registration.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.registration.findMany({ where: { createdAt: { gte: weekStart } }, select: { createdAt: true } }),
  ]);
  const count = (s: RegistrationStatus) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const perDay = Array.from({ length: 7 }, (_, i) => recent.filter((r) => {
    const d0 = weekStart.getTime() + i * DAY;
    return +r.createdAt >= d0 && +r.createdAt < d0 + DAY;
  }).length);
  const maxDay = Math.max(1, ...perDay);
  const pages = Math.max(1, Math.ceil(filtered / PER_PAGE));

  const rows: Row[] = list.map((r) => ({
    id: r.id, seat: r.seat, name: r.name, email: r.email, phone: r.phone, status: r.status,
    source: r.source, notes: r.notes, created: fmt.format(r.createdAt), viaGoogle: !!r.userId,
  }));
  const qs = (p: number) => `/admin?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page: String(p) })}`;
  const exportHref = `/api/admin/export?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) })}`;

  return (
    <div className="adm">
      <AdminHeader tab="regs" email={user.email} />

      <div className="kpis">
        <div className="kpi"><small>Total</small><b>{total}</b><span>all registrations</span></div>
        <div className="kpi"><small>Today</small><b>{today}</b><span>since midnight EAT</span></div>
        <div className="kpi"><small>Last 7 days</small><b>{week}</b><div className="bars7">{perDay.map((n, i) => <i key={i} style={{ height: `${(n / maxDay) * 100}%` }} title={`${n}`} />)}</div></div>
        <div className="kpi"><small>Confirmed</small><b>{count("CONFIRMED")}</b><span>{count("REGISTERED")} pending</span></div>
        <div className="kpi"><small>Attended</small><b>{count("ATTENDED")}</b><span>{count("CANCELLED")} cancelled</span></div>
      </div>

      <div className="tools">
        <form>
          <input name="q" defaultValue={q} placeholder="Search name, email, phone or seat #" />
          <select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {Object.values(RegistrationStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-line btn-sm">Filter</button>
          {(q || status) && <Link className="btn btn-line btn-sm" href="/admin">Reset</Link>}
        </form>
        <a className="btn btn-line btn-sm" href={exportHref}>⬇ Export CSV</a>
        <AddForm />
      </div>

      <RegTable rows={rows} />

      <div className="pager">
        <span>{filtered} result{filtered === 1 ? "" : "s"} · page {page} / {pages}</span>
        <div className="btns">
          {page > 1 && <Link className="btn btn-line btn-sm" href={qs(page - 1)}>← Prev</Link>}
          {page < pages && <Link className="btn btn-line btn-sm" href={qs(page + 1)}>Next →</Link>}
        </div>
      </div>
    </div>
  );
}
