"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { addRegistration, type ActResult } from "@/app/admin/actions";

export default function AddForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActResult, FormData>(addRegistration, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state]);

  if (!open) return <button className="btn btn-line btn-sm" onClick={() => setOpen(true)}>+ Add registration</button>;
  return (
    <div className="panel" style={{ width: "100%" }}>
      <h2>Add registration manually</h2>
      <p>For people who registered by phone or Telegram.</p>
      <form ref={ref} action={action} className="fgrid2" style={{ marginTop: 14 }}>
        <div className="fld"><label>Name</label><input name="name" required /></div>
        <div className="fld"><label>Email</label><input name="email" type="email" required /></div>
        <div className="fld"><label>Phone</label><input name="phone" type="tel" required placeholder="09XX XXX XXX" /></div>
        <div className="fld"><label>Notes</label><input name="notes" /></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn btn-red btn-sm" disabled={pending}>Add</button>
          <button type="button" className="btn btn-line btn-sm" onClick={() => setOpen(false)}>Close</button>
          {state.error && <span className="err" style={{ marginTop: 0 }}>{state.error}</span>}
          {state.ok && <span className="okmsg" style={{ marginTop: 0 }}>Added ✓</span>}
        </div>
      </form>
    </div>
  );
}
