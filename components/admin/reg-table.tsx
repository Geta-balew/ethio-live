"use client";
import { useState, useTransition } from "react";
import { bulkStatus, deleteRegistration, updateRegistration } from "@/app/admin/actions";

export type Row = { id: string; seat: number; name: string; email: string; phone: string; status: string; source: string | null; notes: string | null; created: string; viaGoogle: boolean };
const STATUSES = ["REGISTERED", "CONFIRMED", "ATTENDED", "CANCELLED"];

function RowView({ r, checked, onCheck }: { r: Row; checked: boolean; onCheck: (v: boolean) => void }) {
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ name: r.name, email: r.email, phone: r.phone, status: r.status, notes: r.notes ?? "" });
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  const save = () => start(async () => {
    const res = await updateRegistration(r.id, f);
    if (res.error) setErr(res.error); else { setErr(""); setEdit(false); }
  });
  const del = () => {
    if (!confirm(`Delete registration #${r.seat} (${r.name})? This cannot be undone.`)) return;
    start(async () => { await deleteRegistration(r.id); });
  };
  const quick = (status: string) => start(async () => { const res = await updateRegistration(r.id, { ...f, status }); if (!res.error) setF({ ...f, status }); else setErr(res.error); });

  if (edit) {
    return (
      <tr>
        <td><input type="checkbox" checked={checked} onChange={(e) => onCheck(e.target.checked)} /></td>
        <td>#{r.seat}</td>
        <td><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></td>
        <td><input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></td>
        <td><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></td>
        <td><select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
        <td className="dimt">{r.source ?? "—"}</td>
        <td><textarea rows={1} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></td>
        <td className="dimt">{r.created}</td>
        <td>
          <div className="acts">
            <button className="btn btn-red btn-sm" onClick={save} disabled={pending}>Save</button>
            <button className="btn btn-line btn-sm" onClick={() => { setEdit(false); setErr(""); setF({ name: r.name, email: r.email, phone: r.phone, status: r.status, notes: r.notes ?? "" }); }}>Cancel</button>
          </div>
          {err && <div className="err" style={{ marginTop: 6 }}>{err}</div>}
        </td>
      </tr>
    );
  }
  return (
    <tr style={pending ? { opacity: 0.5 } : undefined}>
      <td><input type="checkbox" checked={checked} onChange={(e) => onCheck(e.target.checked)} /></td>
      <td className="muted">#{r.seat}</td>
      <td><b>{r.name}</b>{r.viaGoogle && <div className="dimt">Google</div>}</td>
      <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
      <td><a href={`tel:${r.phone}`}>{r.phone}</a></td>
      <td>
        <select value={f.status} onChange={(e) => quick(e.target.value)} className={`pill ${f.status}`} style={{ background: "transparent", minWidth: 0, width: "auto" }}>
          {STATUSES.map((s) => <option key={s} value={s} style={{ background: "#111", color: "#fff" }}>{s}</option>)}
        </select>
      </td>
      <td className="dimt">{r.source ?? "—"}</td>
      <td className="dimt" style={{ maxWidth: 220 }}>{r.notes ?? ""}</td>
      <td className="dimt" style={{ whiteSpace: "nowrap" }}>{r.created}</td>
      <td>
        <div className="acts">
          <button className="btn btn-line btn-sm" onClick={() => setEdit(true)}>Edit</button>
          <button className="btn btn-line btn-sm" onClick={del} aria-label="Delete">✕</button>
        </div>
        {err && <div className="err" style={{ marginTop: 6 }}>{err}</div>}
      </td>
    </tr>
  );
}

export default function RegTable({ rows }: { rows: Row[] }) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [bulk, setBulk] = useState("CONFIRMED");
  const [pending, start] = useTransition();
  const all = rows.length > 0 && sel.size === rows.length;
  const toggle = (id: string, v: boolean) => { const n = new Set(sel); if (v) n.add(id); else n.delete(id); setSel(n); };

  return (
    <>
      {sel.size > 0 && (
        <div className="tools" style={{ marginTop: 12 }}>
          <span className="muted">{sel.size} selected →</span>
          <select value={bulk} onChange={(e) => setBulk(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <button className="btn btn-red btn-sm" disabled={pending} onClick={() => start(async () => { await bulkStatus([...sel], bulk); setSel(new Set()); })}>Set status</button>
          <button className="btn btn-line btn-sm" onClick={() => setSel(new Set())}>Clear</button>
        </div>
      )}
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={all} onChange={(e) => setSel(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} /></th>
              <th>Seat</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Source</th><th>Notes</th><th>Registered (EAT)</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={10} className="muted" style={{ textAlign: "center", padding: 40 }}>No registrations yet.</td></tr>}
            {rows.map((r) => <RowView key={r.id} r={r} checked={sel.has(r.id)} onCheck={(v) => toggle(r.id, v)} />)}
          </tbody>
        </table>
      </div>
    </>
  );
}
