"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/settings-shared";

/** Shared language state (persisted per browser), applied to <html lang>. */
export function useLang(defaultLang: Lang) {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecs-live-lang");
      if (saved === "en" || saved === "am") setLangState(saved);
    } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ecs-live-lang", l); } catch {}
  };
  return [lang, setLang] as const;
}

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="seg" role="group" aria-label="Language">
      <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
      <button type="button" className={lang === "am" ? "on" : ""} onClick={() => setLang("am")}>አማ</button>
    </div>
  );
}
