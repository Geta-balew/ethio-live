"use client";
import { useActionState, useState, useTransition } from "react";
import { resetTextAction, saveSettingsAction, type ActResult } from "@/app/admin/actions";
import { isoToLocalInput, type SiteSettings } from "@/lib/settings-shared";

export default function SettingsForm({ s }: { s: SiteSettings }) {
  const [state, action, pending] = useActionState<ActResult, FormData>(saveSettingsAction, {});
  const [text, setText] = useState(() => JSON.stringify(s.text, null, 2));
  const [jsonErr, setJsonErr] = useState("");
  const [resetting, startReset] = useTransition();
  const days = [0, 1, 2].map((i) => s.days[i]);

  const checkJson = (v: string) => {
    setText(v);
    try { JSON.parse(v); setJsonErr(""); } catch (e) { setJsonErr((e as Error).message); }
  };

  return (
    <form action={action}>
      <div className="panel">
        <h2>Event</h2>
        <p>Times are Ethiopia time (EAT). Each day shows as LIVE on the site between its start and end.</p>
        <div style={{ marginTop: 16 }}>
          <label className="chk"><input type="checkbox" name="registrationOpen" defaultChecked={s.registrationOpen} /> Registration open</label>
        </div>
        <div className="fgrid2" style={{ marginTop: 16 }}>
          {days.map((d, i) => (
            <div key={i} className="fgrid2" style={{ gridColumn: "1 / -1" }}>
              <div className="fld"><label>Day {i + 1} — start</label><input type="datetime-local" name={`day${i}start`} defaultValue={d ? isoToLocalInput(d.start) : ""} /></div>
              <div className="fld"><label>Day {i + 1} — end</label><input type="datetime-local" name={`day${i}end`} defaultValue={d ? isoToLocalInput(d.end) : ""} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Links &amp; details</h2>
        <div className="fgrid2" style={{ marginTop: 14 }}>
          <div className="fld"><label>Telegram link (shown after registration)</label><input name="telegramLink" defaultValue={s.telegramLink} /></div>
          <div className="fld"><label>YouTube subscribe link</label><input name="subLink" defaultValue={s.subLink} /></div>
          <div className="fld"><label>Subscriber count shown (e.g. 300K)</label><input name="ytSubs" defaultValue={s.ytSubs} /></div>
          <div className="fld">
            <label>Default language</label>
            <select name="defaultLang" defaultValue={s.defaultLang}><option value="en">English</option><option value="am">አማርኛ</option></select>
          </div>
          <div className="fld"><label>Host name</label><input name="hostName" defaultValue={s.hostName} /></div>
          <div className="fld"><label>Host role</label><input name="hostRole" defaultValue={s.hostRole} /></div>
        </div>
      </div>

      <div className="panel">
        <h2>All page text (English &amp; Amharic)</h2>
        <p>
          Every word on the landing and registration pages. Edit the values between quotes. <code>&lt;em&gt;…&lt;/em&gt;</code> makes a word red,
          and <code>{"{dates}"}</code>, <code>{"{subs}"}</code>, <code>{"{d}"}</code>, <code>{"{h}"}</code>, <code>{"{m}"}</code>, <code>{"{date}"}</code>, <code>{"{time}"}</code>, <code>{"{n}"}</code> are filled in automatically.
        </p>
        <div className="fld">
          <textarea className="json" name="text" value={text} onChange={(e) => checkJson(e.target.value)} spellCheck={false} />
          {jsonErr && <p className="err">JSON error: {jsonErr}</p>}
        </div>
        <button
          type="button"
          className="btn btn-line btn-sm"
          style={{ marginTop: 10 }}
          disabled={resetting}
          onClick={() => { if (confirm("Reset all text to the original defaults?")) startReset(async () => { await resetTextAction(); location.reload(); }); }}
        >
          Reset text to defaults
        </button>
      </div>

      <div className="savebar">
        {state.error && <span className="err" style={{ marginTop: 0 }}>{state.error}</span>}
        {state.ok && !pending && <span className="okmsg" style={{ marginTop: 0 }}>Saved ✓ — live on the site</span>}
        <button className="btn btn-red btn-sm" disabled={pending || !!jsonErr}>{pending ? "Saving…" : "Save changes"}</button>
      </div>
    </form>
  );
}
