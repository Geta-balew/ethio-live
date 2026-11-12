"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { dateRange, dayLabel, fill, timeLabel, type SiteSettings } from "@/lib/settings-shared";
import { gridIcons, IgIcon, Logo, TgIcon, TtIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/components/use-lang";

const H = ({ html, as: Tag = "span", className }: { html: string; as?: "span" | "h1" | "h2" | "p" | "div" | "b"; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);
const pad = (n: number) => String(n).padStart(2, "0");

export default function Landing({ s, registered }: { s: SiteSettings; registered: boolean }) {
  const [lang, setLang] = useLang(s.defaultLang);
  const t = s.text[lang];
  const [now, setNow] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [sticky, setSticky] = useState(false);
  const heroBtns = useRef<HTMLDivElement>(null);

  const days = s.days.map((d) => ({ s: +new Date(d.start), e: +new Date(d.end), label: dayLabel(d.start) }));
  const vars = { dates: dateRange(s.days), subs: s.ytSubs };
  const time = s.days[0] ? timeLabel(s.days[0].start, lang) : "";
  const regHref = "/register";
  const regLabel = registered ? t.registered : t.btnReg;

  // clock
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // sticky bar
  useEffect(() => {
    const on = () => setSticky(!!heroBtns.current && heroBtns.current.getBoundingClientRect().bottom < 0);
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  const state = (i: number) => (now === null ? "up" : now < days[i].s ? "up" : now <= days[i].e ? "live" : "done");
  const autoDay = () => { if (now === null) return 0; const i = days.findIndex((d) => now <= d.e); return i < 0 ? days.length - 1 : i; };
  const cur = sel ?? autoDay();
  const st = days.length ? state(cur) : "up";

  // countdown to day 1
  const first = days[0]?.s ?? 0, last = days[days.length - 1]?.e ?? 0;
  const diff = now === null ? 0 : Math.max(0, first - now);
  const D = Math.floor(diff / 864e5), Hh = Math.floor(diff / 36e5) % 24, M = Math.floor(diff / 6e4) % 60, S = Math.floor(diff / 1e3) % 60;
  const phase = now === null ? "pre" : now > last ? "ended" : now >= first ? "live" : "pre";

  let center: React.ReactNode = null;
  if (days.length && st === "up" && now !== null) {
    const d2 = days[cur].s - now, dd = Math.floor(d2 / 864e5), hh = Math.floor(d2 / 36e5) % 24, mm = Math.floor(d2 / 6e4) % 60;
    center = <span>{fill(dd > 0 ? t.liveInDays : t.liveInHours, { d: dd, h: hh, m: mm })}<small>{fill(t.sched, { date: days[cur].label, time })}</small></span>;
  } else if (st === "done") center = <span>{t.cDone}</span>;
  const badge = st === "live" ? "LIVE" : st === "up" ? "UPCOMING" : "STREAMED";

  return (
    <div className="site">
      <nav className="nav">
        <div className="row">
          <Link href="/" aria-label="Ethio Computer School"><Logo eager /></Link>
          <div className="nav-r">
            <LangToggle lang={lang} setLang={setLang} />
            <Link className="btn btn-red btn-sm" href={regHref}>{registered ? t.registered : t.navBtn}</Link>
          </div>
        </div>
      </nav>

      <div className="frame">
        {/* HERO + LIVE */}
        <header className="sec hero">
          <div className="in">
            <span className="status rv"><i />{fill(t.status, vars)}</span>
            <H as="h1" className="rv" html={t.h1} />
            <p className="lead rv">{t.sub}</p>
            <div className="btns rv" ref={heroBtns}>
              <Link className="btn btn-red" href={regHref}>{regLabel} →</Link>
              <a className="btn btn-line" href="#join">{t.btnSub}</a>
            </div>
            <div className="trust rv"><H html={fill(t.trust, vars)} /></div>
          </div>

          <div className="in wide">
            <div className="live rv">
              <div className="days" role="tablist">
                {days.map((d, k) => {
                  const ss = state(k);
                  return (
                    <button key={k} role="tab" aria-selected={k === cur} onClick={() => setSel(k)}>
                      <b>{t.dayL} {k + 1}</b><span>{d.label}</span>
                      <span className={`st${ss === "live" ? " on" : ""}`}>{ss === "live" ? t.stLive : ss === "up" ? t.stUp : t.stDone}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`player${st === "live" ? "" : " idle"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/live-thumb.jpg" alt="Ethio Computer School — Monetization live" width={1280} height={720} fetchPriority="high" />
                <div className="p-top"><span className={`p-badge${st === "live" ? " live" : ""}`}>{badge}</span><span className="p-day">{t.dayL} {cur + 1} / {days.length}</span></div>
                <div className="p-center">{center}</div>
                <div className="p-bar">
                  <div className="p-prog"><i /></div>
                  <div className="p-ctrl">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z" /></svg>
                    <span className="lv">{badge}</span>
                    <span className="r">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.9a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.9a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)" /></svg>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="yt-info">
                <h3>{t.titles[cur] ?? ""}</h3>
                <div className="yt-row">
                  <span className="yt-av">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logo.png" alt="" width={1500} height={1000} /></span>
                  <span className="yt-ch"><b>Ethio Computer School</b><span>{t.subsWord}</span></span>
                  <span className="yt-acts">
                    <Link className="yt-sub" href={regHref}>{registered ? t.registered : t.navBtn}</Link>
                  </span>
                </div>
                <div className="yt-desc">
                  <div className="when">{fill(t.when, { n: cur + 1, date: days[cur]?.label ?? "", time })}</div>
                  <ul>{(t.topics[cur] ?? []).map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              </div>
              <div className="meta">
                <div><small>{t.mDate}</small><b>{vars.dates}</b></div>
                <div><small>{t.mTime}</small><b>{time}</b></div>
                <div><small>Format</small><b>Live · Online</b></div>
                <div><small>{t.mStarts}</small><b>{phase === "ended" ? t.ended : phase === "live" ? <span style={{ color: "var(--red)" }}>● {t.liveNow}</span> : now === null ? "—" : fill(t.startsFmt, { d: D, h: Hh, m: M })}</b></div>
              </div>
            </div>
          </div>
        </header>

        {/* WHY NOW */}
        <section className="sec">
          <div className="in wide">
            <span className="label rv"><b>01</b> Why now</span>
            <H as="h2" className="rv" html={t.whyH} />
            <p className="lead rv" style={{ maxWidth: 600, marginInline: "auto" }}>{t.whyP}</p>
            <div className="stats rv">
              <div className="stat"><b>1,000</b><span>{t.st1}</span></div>
              <i className="sep" aria-hidden="true" />
              <div className="stat"><b>4,000</b><span>{t.st2}</span></div>
              <span className="or">{t.or}</span>
              <div className="stat"><b>10M</b><span>{t.st3}</span></div>
            </div>
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className="sec" id="join">
          <div className="in wide">
            <span className="label rv"><b>02</b> How to join</span>
            <H as="h2" className="rv" html={t.joinH} />
            <div className="steps">
              {t.steps.map((x, i) => (
                <div className="step rv" key={i}>
                  <i>{i + 1}</i>
                  <div><b>{x[0]}</b><span>{x[1]}</span></div>
                  {x[2] && <Link className="btn btn-red btn-sm" href={regHref}>{registered ? t.registered : x[2]}</Link>}
                </div>
              ))}
            </div>
            <div className="in">
              <div className="reg rv"><div className="box">
                <div className="free">{t.freeL}</div>
                <div className="price">{t.price}</div>
                {phase === "pre" && (
                  <div className="cd">
                    <div><b>{pad(D)}</b><span>{t.cdD}</span></div><div><b>{pad(Hh)}</b><span>{t.cdH}</span></div>
                    <div><b>{pad(M)}</b><span>{t.cdM}</span></div><div><b>{pad(S)}</b><span>{t.cdS}</span></div>
                  </div>
                )}
                <Link className="btn btn-red" href={regHref}>{regLabel} →</Link>
                <p className="note">{t.regNote}</p>
              </div></div>
            </div>
          </div>
        </section>

        {/* WHO */}
        <section className="sec">
          <div className="in">
            <span className="label rv"><b>03</b> Who it&apos;s for</span>
            <H as="h2" className="rv" html={t.whoH} />
            <ul className="who">{t.who.map((w, i) => <li className="rv" key={i}><span>{pad(i + 1)}</span>{w}</li>)}</ul>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="sec">
          <div className="in wide">
            <span className="label rv"><b>04</b> What you get</span>
            <H as="h2" className="rv" html={t.getH} />
            <div className="grid">{t.grid.map((g, i) => <div className="cell rv" key={i}>{gridIcons[i % 4]}<b>{g[0]}</b><span>{g[1]}</span></div>)}</div>
          </div>
        </section>

        {/* HOST */}
        <section className="sec host">
          <div className="in">
            <span className="label rv"><b>05</b> Your host</span>
            <div className="host-photo rv">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/live-thumb.jpg" alt={s.hostName} width={1280} height={720} loading="lazy" /></div>
            <div className="host-name rv">{s.hostName}</div>
            <div className="host-role rv">{s.hostRole}</div>
            <p className="rv">{fill(t.bio, vars)}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec">
          <div className="in">
            <span className="label rv"><b>06</b> FAQ</span>
            <H as="h2" className="rv" html={t.faqH} />
            <div className="faq rv">{t.faq.map((f, i) => <details key={i}><summary>{f[0]}<i /></summary><p>{f[1]}</p></details>)}</div>
          </div>
        </section>

        {/* FINAL */}
        <section className="sec">
          <div className="in wide">
            <div className="final rv">
              <H as="h2" html={t.finH} />
              <p>{t.finP}</p>
              <div className="btns">
                <Link className="btn btn-white" href={regHref}>{regLabel} →</Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="sec">
          <Logo />
          <div className="soc">
            <a href="https://t.me/ethiocss" target="_blank" rel="noopener" aria-label="Telegram"><TgIcon /></a>
            <a href="https://tiktok.com/@ethio_computer_school" target="_blank" rel="noopener" aria-label="TikTok"><TtIcon /></a>
            <a href="https://instagram.com/ethio_computer" target="_blank" rel="noopener" aria-label="Instagram"><IgIcon /></a>
          </div>
          <p>© {new Date().getFullYear()} Ethio Computer School · <a href="https://www.ethiocomputer.school/" target="_blank" rel="noopener">ethiocomputer.school</a></p>
          <p>{t.disc}</p>
        </footer>
      </div>

      <div className={`sticky${sticky ? " show" : ""}`}>
        <Link className="btn btn-red" href={regHref}>{registered ? t.registered : t.navBtn}</Link>
      </div>
    </div>
  );
}
