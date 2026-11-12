"use client";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { registerAction, type RegState } from "@/app/register/actions";
import { calendarLink, dateRange, dayLabel, timeLabel, type SiteSettings } from "@/lib/settings-shared";
import { CalIcon, GoogleIcon, Logo, TgIcon, YtIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/components/use-lang";

type U = { name: string; email: string; image: string | null } | null;
type R = { seat: number; name: string; phone: string } | null;

export default function RegisterFlow({ s, user, reg }: { s: SiteSettings; user: U; reg: R }) {
  const [lang, setLang] = useLang(s.defaultLang);
  const t = s.text[lang];
  const router = useRouter();
  const [state, action, pending] = useActionState<RegState, FormData>(registerAction, {});
  const [gLoading, setGLoading] = useState(false);
  const [source, setSource] = useState("");

  // keep UTM / referral source across the Google redirect
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search);
      const fromUrl = q.get("utm_source") || q.get("ref") || q.get("src");
      if (fromUrl) localStorage.setItem("ecs-src", fromUrl);
      setSource(fromUrl || localStorage.getItem("ecs-src") || (document.referrer ? new URL(document.referrer).hostname : ""));
    } catch {}
  }, []);

  useEffect(() => { if (state.ok) router.refresh(); }, [state.ok, router]);

  const google = async () => {
    setGLoading(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/register" });
    if (error) setGLoading(false);
  };
  const signOut = async () => { await authClient.signOut(); router.refresh(); };

  const time = s.days[0] ? timeLabel(s.days[0].start, lang) : "";
  const errMsg = state.error === "phone" ? t.rBadPhone : state.error === "name" ? t.rBadName : state.error === "closed" ? t.rClosed : state.error ? t.rError : "";

  let body: React.ReactNode;
  if (reg && user) {
    body = (
      <>
        <h1>{t.rDone}</h1>
        <div className="seat">{t.rSeat} #{reg.seat}</div>
        <p className="lead">{t.rDoneSub}</p>
        <div className="todo">
          <a className="btn btn-red" href={s.telegramLink} target="_blank" rel="noopener"><span className="n">1</span><TgIcon />{t.rTg}</a>
          <a className="btn btn-line" href={s.subLink} target="_blank" rel="noopener"><span className="n">2</span><YtIcon />{t.rSubYt}</a>
          <div>
            <div className="btn btn-line" style={{ width: "100%", justifyContent: "flex-start", cursor: "default" }}><span className="n">3</span><CalIcon />{t.rCal}</div>
            <div className="cal">
              {s.days.map((d, i) => (
                <a key={i} target="_blank" rel="noopener" href={calendarLink(`${t.dayL} ${i + 1} — YouTube Monetization Live`, `${t.titles[i] ?? ""}\n${s.subLink}`, d)}>
                  {t.dayL} {i + 1} · {dayLabel(d.start)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="who-me">
          {user.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.image} alt="" /> : <span className="ph">{user.name.charAt(0)}</span>}
          <div><b>{reg.name}</b><span>{user.email} · {reg.phone}</span></div>
        </div>
      </>
    );
  } else if (user) {
    body = (
      <>
        <h1 dangerouslySetInnerHTML={{ __html: t.rTitle }} />
        <p className="lead">{t.rSub}</p>
        <form action={action}>
          <input type="hidden" name="source" value={source} />
          <div className="fld"><label htmlFor="name">{t.rName}</label><input id="name" name="name" defaultValue={user.name} required minLength={2} autoComplete="name" /></div>
          <div className="fld"><label htmlFor="email">{t.rEmail}</label><input id="email" value={user.email} readOnly /></div>
          <div className="fld">
            <label htmlFor="phone">{t.rPhone}</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="09XX XXX XXX" required autoComplete="tel" autoFocus />
            <small>{t.rPhoneHint}</small>
          </div>
          {errMsg && <p className="err" role="alert">{errMsg}</p>}
          <button className="btn btn-red" disabled={pending}>{pending ? "…" : `${t.rSubmit} →`}</button>
        </form>
      </>
    );
  } else {
    body = (
      <>
        <h1 dangerouslySetInnerHTML={{ __html: t.rTitle }} />
        <p className="lead">{t.rSub}</p>
        <div className="rg-meta"><span>{dateRange(s.days)}</span><span>{time}</span><span>Live · Online</span><span>{t.price}</span></div>
        {s.registrationOpen
          ? <button className="gbtn" onClick={google} disabled={gLoading}><GoogleIcon />{gLoading ? "…" : t.rGoogle}</button>
          : <p className="err">{t.rClosed}</p>}
      </>
    );
  }

  return (
    <div className="site">
      <nav className="nav">
        <div className="row">
          <Link href="/" aria-label="Ethio Computer School"><Logo eager /></Link>
          <div className="nav-r"><LangToggle lang={lang} setLang={setLang} /></div>
        </div>
      </nav>
      <main className="rg">
        <div className="rg-card">
          {body}
          <div className="rg-foot">
            <Link href="/">{t.rBack}</Link>
            {user && <button type="button" onClick={signOut}>{t.rSignOut}</button>}
          </div>
        </div>
      </main>
    </div>
  );
}
