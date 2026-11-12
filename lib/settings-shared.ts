/* Client-safe: types, defaults and helpers for site settings. */

export type Lang = "en" | "am";
export type DayWindow = { start: string; end: string }; // ISO strings with +03:00

export type SiteText = {
  navBtn: string; status: string; h1: string; sub: string;
  btnReg: string; btnSub: string; btnChannel: string; registered: string; trust: string;
  dayL: string; stUp: string; stLive: string; stDone: string;
  liveInDays: string; liveInHours: string; sched: string; cDone: string; subsWord: string; when: string;
  titles: string[]; topics: string[][];
  mDate: string; mTime: string; mStarts: string; startsFmt: string; liveNow: string; ended: string;
  whyH: string; whyP: string; st1: string; st2: string; or: string; st3: string;
  joinH: string; steps: string[][]; freeL: string; price: string;
  cdD: string; cdH: string; cdM: string; cdS: string; regNote: string;
  whoH: string; who: string[]; getH: string; grid: string[][];
  bio: string; faqH: string; faq: string[][]; finH: string; finP: string; disc: string;
  // register page
  rTitle: string; rSub: string; rGoogle: string; rName: string; rEmail: string; rPhone: string; rPhoneHint: string;
  rSubmit: string; rBadPhone: string; rBadName: string; rClosed: string; rError: string;
  rDone: string; rDoneSub: string; rSeat: string; rTg: string; rSubYt: string; rCal: string; rSignOut: string; rBack: string;
};

export type SiteSettings = {
  defaultLang: Lang;
  registrationOpen: boolean;
  days: DayWindow[];
  telegramLink: string;   // shown after registration
  subLink: string;        // YouTube subscribe link
  ytSubs: string;
  hostName: string;
  hostRole: string;
  text: Record<Lang, SiteText>;
};

const en: SiteText = {
  navBtn: "Register free",
  status: "Free 3-day live · {dates} · on YouTube",
  h1: "After Feb 1, <em>nothing</em> will be the same.",
  sub: "Three nights, live on our YouTube channel. Get a clear plan to get monetized and double your channel — before the rules change. The time to start is now.",
  btnReg: "Register free", btnSub: "Subscribe on YouTube", btnChannel: "Visit the channel", registered: "✓ You're registered",
  trust: "Join <b>{subs}+</b> subscribers on @EthioComputerSchool",
  dayL: "Day", stUp: "Upcoming", stLive: "● Live", stDone: "Recording",
  liveInDays: "Live in {d}d {h}h", liveInHours: "Live in {h}h {m}m", sched: "Scheduled for {date} · {time}",
  cDone: "Recording sent to registered participants", subsWord: "subscribers", when: "Day {n} · {date} · {time}",
  titles: [
    "Day 1 — YouTube Monetization explained + choosing your niche | LIVE",
    "Day 2 — Videos, thumbnails & the algorithm | LIVE",
    "Day 3 — Copyright, AdSense & getting paid + Q&A | LIVE",
  ],
  topics: [
    ["What YouTube Monetization really is", "Choosing a profitable niche", "Channel setup & branding"],
    ["Videos that get watched (Hook → Body → CTA)", "Thumbnails & titles in Canva", "How the algorithm works"],
    ["Avoiding copyright claims & strikes", "AdSense setup & getting paid in Ethiopia", "Live Q&A"],
  ],
  mDate: "Dates", mTime: "Time", mStarts: "Starts in", startsFmt: "{d}d {h}h {m}m", liveNow: "Live now", ended: "Ended",
  whyH: "The bar every channel <em>must cross.</em>",
  whyP: "These are YouTube's Partner Program requirements. Most creators never reach them — not for lack of effort, but for lack of a plan.",
  st1: "Subscribers", st2: "Public watch hours · last 12 months", or: "or", st3: "Shorts views · last 90 days",
  joinH: "Three steps. <em>Two minutes.</em>",
  steps: [
    ["Subscribe to our channel", "The live happens on @EthioComputerSchool.", "Subscribe"],
    ["Turn on the 🔔 bell", "Get notified the moment we go live.", ""],
    ["Register with Google", "Sign in with Gmail and add your phone — get reminders and the recording.", "Register"],
  ],
  freeL: "Your seat", price: "Free", cdD: "Days", cdH: "Hrs", cdM: "Min", cdS: "Sec",
  regNote: "Sign in with Google · Takes 30 seconds · No payment",
  whoH: "This is for you <em>if you…</em>",
  who: [
    "Started a channel but can't get views or subscribers",
    "Want to build an income-generating channel from scratch",
    "Want to reach 1,000 subscribers and 4,000 hours faster",
    "Want to publish without copyright claims or strikes",
    "Want to set up AdSense and get paid from Ethiopia",
  ],
  getH: "Three nights that <em>change your channel.</em>",
  grid: [
    ["Live on YouTube", "Watch and ask questions in real time."],
    ["Step by step", "We do it on screen, together."],
    ["Telegram community", "Share progress with other creators."],
    ["Recording & checklist", "Missed a night? Catch up anytime."],
  ],
  bio: "Ethio Computer School was founded to teach Ethiopians how to earn from social media — in Amharic, with just a phone. Over three nights you'll see, live, the same methods behind a {subs}+ YouTube audience.",
  faqH: "Questions, <em>answered.</em>",
  faq: [
    ["Is it really free?", "Yes. The 3-day live is completely free — just subscribe and register."],
    ["Where does the live happen?", "On our YouTube channel, @EthioComputerSchool. Subscribe and turn on notifications so you don't miss it."],
    ["Why do I sign in with Google?", "So we can send you reminders and the recording. We only use your name, email and phone for this event."],
    ["Can I watch on my phone?", "Yes — everything is designed for phones."],
    ["What if I miss a night?", "Registered participants receive the recording."],
    ["Can I earn from YouTube in Ethiopia?", "Yes. We cover AdSense setup and how to receive payments. Results depend on your effort — income is not guaranteed."],
  ],
  finH: "Day 1 starts soon. <em>Be there live.</em>",
  finP: "Register free, subscribe, and turn on the bell. See you on YouTube.",
  disc: "YouTube is a trademark of Google LLC. This event is not affiliated with or endorsed by YouTube. Results depend on individual effort; income is not guaranteed.",
  rTitle: "Reserve your <em>free seat</em>", rSub: "Sign in with your Gmail account, add your phone number, and you're in.",
  rGoogle: "Continue with Google", rName: "Full name", rEmail: "Gmail", rPhone: "Phone number", rPhoneHint: "e.g. 0911 234 567 or +1 202 555 0100",
  rSubmit: "Complete registration", rBadPhone: "Please enter a valid phone number.", rBadName: "Please enter your name.",
  rClosed: "Registration is closed.", rError: "Something went wrong. Please try again.",
  rDone: "You're in! 🎉", rDoneSub: "Your seat is reserved. Do these now so you don't miss Day 1:",
  rSeat: "Seat", rTg: "Join the Telegram group", rSubYt: "Subscribe & turn on 🔔", rCal: "Add to Google Calendar",
  rSignOut: "Sign out", rBack: "← Back to the event",
};

const am: SiteText = {
  navBtn: "በነፃ ይመዝገቡ",
  status: "ነፃ የ3 ቀን Live · {dates} · በ YouTube",
  h1: "ከፌብሩዋሪ 1 በኋላ ነገሮች <em>እንደቀድሞው</em> አይሆኑም",
  sub: "3 ምሽቶች በ YouTube ቻናላችን Live። ህጉ ከመቀየሩ በፊት Monetize የሚሆኑበትን እና ቻናልዎን ደብል የሚያደርጉበትን ግልጽ ዕቅድ ያግኙ — ለመስራት ጊዜው አሁን ነው።",
  btnReg: "በነፃ ይመዝገቡ", btnSub: "YouTube ላይ Subscribe ያድርጉ", btnChannel: "ቻናሉን ይጎብኙ", registered: "✓ ተመዝግበዋል",
  trust: "<b>{subs}+</b> Subscribers ያሉበትን ቻናል ይቀላቀሉ",
  dayL: "Day", stUp: "Upcoming", stLive: "● Live", stDone: "Recording",
  liveInDays: "Live በ{d} ቀን {h} ሰዓት", liveInHours: "Live በ{h} ሰዓት {m} ደቂቃ", sched: "{date} · {time}",
  cDone: "Recording ለተመዘገቡ ተሳታፊዎች ይላካል", subsWord: "Subscribers", when: "Day {n} · {date} · {time}",
  titles: [
    "Day 1 — YouTube Monetization ምንድነው? + Niche መምረጥ | LIVE",
    "Day 2 — ቪዲዮ፣ Thumbnail እና Algorithm | LIVE",
    "Day 3 — Copyright፣ AdSense እና ክፍያ መቀበል + Q&A | LIVE",
  ],
  topics: [
    ["YouTube Monetization በትክክል ምንድነው?", "ትርፋማ Niche መምረጥ", "ቻናል Setup እና Branding"],
    ["የሚታዩ ቪዲዮዎች (Hook → Body → CTA)", "Thumbnail እና Title በ Canva", "Algorithm እንዴት ይሰራል"],
    ["Copyright Claim እና Strike ማስወገድ", "AdSense Setup እና በኢትዮጵያ ክፍያ መቀበል", "Live Q&A"],
  ],
  mDate: "ቀናት", mTime: "ሰዓት", mStarts: "ለመጀመር", startsFmt: "{d} ቀን {h} ሰዓት", liveNow: "አሁን Live", ended: "ተጠናቋል",
  whyH: "እያንዳንዱ ቻናል <em>ማለፍ ያለበት</em> መስፈርት",
  whyP: "እነዚህ የ YouTube Partner Program መስፈርቶች ናቸው። ብዙዎች አይደርሱባቸውም — ጥረት ስለጎደላቸው ሳይሆን ዕቅድ ስለሌላቸው።",
  st1: "Subscribers", st2: "Watch Hours · ባለፉት 12 ወራት", or: "ወይም", st3: "Shorts Views · ባለፉት 90 ቀናት",
  joinH: "3 ደረጃዎች። <em>2 ደቂቃ።</em>",
  steps: [
    ["ቻናላችንን Subscribe ያድርጉ", "Live ስልጠናው የሚካሄደው @EthioComputerSchool ላይ ነው።", "Subscribe"],
    ["🔔 Notification ያብሩ", "Live ስንጀምር ወዲያው ይደርስዎታል።", ""],
    ["በ Google ይመዝገቡ", "በ Gmail ገብተው ስልክዎን ያስገቡ — Reminder እና Recording ይደርስዎታል።", "ይመዝገቡ"],
  ],
  freeL: "የእርስዎ ቦታ", price: "ነፃ", cdD: "ቀን", cdH: "ሰዓት", cdM: "ደቂቃ", cdS: "ሰከንድ",
  regNote: "በ Google ይግቡ · 30 ሰከንድ ብቻ · ክፍያ የለም",
  whoH: "ይህ ለእርስዎ ነው፣ <em>እርስዎ…</em>",
  who: [
    "ቻናል ከፍተው Views እና Subscribers ማግኘት ያቃተዎት ከሆነ",
    "ከዜሮ ጀምረው ገቢ የሚያስገኝ ቻናል መገንባት ከፈለጉ",
    "1,000 Subscribers እና 4,000 Watch Hours በፍጥነት ማሟላት ከፈለጉ",
    "ያለ Copyright Claim እና Strike Content መስራት ከፈለጉ",
    "AdSense አዋቅረው ከኢትዮጵያ ክፍያ መቀበል ከፈለጉ",
  ],
  getH: "ቻናልዎን የሚቀይሩ <em>3 ምሽቶች</em>",
  grid: [
    ["Live በ YouTube", "በቀጥታ ይመልከቱ፣ ጥያቄ ይጠይቁ።"],
    ["Step by Step", "በስክሪን አብረን እንሰራለን።"],
    ["Telegram Community", "ከሌሎች Creators ጋር ይማሩ።"],
    ["Recording እና Checklist", "ያመለጠዎትን በፈለጉት ጊዜ ይመልከቱ።"],
  ],
  bio: "Ethio Computer School የተመሰረተው ኢትዮጵያውያን በአማርኛ፣ በስልክ ብቻ ከሶሻል ሚዲያ ገቢ እንዲያገኙ ለማስተማር ነው። በ3 ምሽቶች {subs}+ የ YouTube ተከታዮች የተገነቡበትን ዘዴ በ Live ያያሉ።",
  faqH: "ተደጋጋሚ <em>ጥያቄዎች</em>",
  faq: [
    ["በእውነት ነፃ ነው?", "አዎ። የ3 ቀኑ Live ሙሉ በሙሉ ነፃ ነው — Subscribe አድርገው ይመዝገቡ።"],
    ["Live ስልጠናው የት ነው የሚካሄደው?", "በ YouTube ቻናላችን @EthioComputerSchool ላይ። እንዳያመልጥዎ Subscribe አድርገው Notification ያብሩ።"],
    ["ለምን በ Google እገባለሁ?", "Reminder እና Recording ልንልክልዎ ነው። ስምዎን፣ ኢሜይልዎን እና ስልክዎን ለዚህ ኢቨንት ብቻ እንጠቀማለን።"],
    ["በስልክ ማየት እችላለሁ?", "አዎ — ሁሉም ነገር ለስልክ ተዘጋጅቷል።"],
    ["አንድ ምሽት ቢያመልጠኝስ?", "ለተመዘገቡ ተሳታፊዎች Recording ይላካል።"],
    ["ከኢትዮጵያ የ YouTube ገቢ ማግኘት እችላለሁ?", "አዎ። AdSense Setup እና ክፍያ መቀበያ መንገዶችን እናሳያለን። ውጤቱ በጥረትዎ ይወሰናል — ገቢ ዋስትና የለውም።"],
  ],
  finH: "Day 1 በቅርቡ ይጀምራል። <em>Live ይገኙ።</em>",
  finP: "በነፃ ይመዝገቡ፣ Subscribe ያድርጉ፣ 🔔 ያብሩ። በ YouTube እንገናኝ።",
  disc: "YouTube የ Google LLC የንግድ ምልክት ነው። ይህ ኢቨንት ከ YouTube ጋር ግንኙነት የለውም። ውጤቶች በእያንዳንዱ ሰው ጥረት ይወሰናሉ፤ ገቢ ዋስትና የለውም።",
  rTitle: "<em>ነፃ ቦታዎን</em> ያስይዙ", rSub: "በ Gmail አካውንትዎ ይግቡ፣ ስልክ ቁጥርዎን ያስገቡ — ተመዝግበዋል።",
  rGoogle: "በ Google ይቀጥሉ", rName: "ሙሉ ስም", rEmail: "Gmail", rPhone: "ስልክ ቁጥር", rPhoneHint: "ለምሳሌ 0911 234 567 ወይም +1 202 555 0100",
  rSubmit: "ምዝገባውን ያጠናቅቁ", rBadPhone: "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ።", rBadName: "እባክዎ ስምዎን ያስገቡ።",
  rClosed: "ምዝገባው ተዘግቷል።", rError: "ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
  rDone: "ተመዝግበዋል! 🎉", rDoneSub: "ቦታዎ ተይዟል። Day 1 እንዳያመልጥዎ አሁኑኑ እነዚህን ያድርጉ፦",
  rSeat: "ቦታ ቁጥር", rTg: "የ Telegram ግሩፑን ይቀላቀሉ", rSubYt: "Subscribe ያድርጉ እና 🔔 ያብሩ", rCal: "Google Calendar ላይ ያስቀምጡ",
  rSignOut: "ውጣ", rBack: "← ወደ ኢቨንቱ ገጽ",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  defaultLang: "en",
  registrationOpen: true,
  days: [
    { start: "2026-11-21T20:00:00+03:00", end: "2026-11-21T22:30:00+03:00" },
    { start: "2026-11-22T20:00:00+03:00", end: "2026-11-22T22:30:00+03:00" },
    { start: "2026-11-23T20:00:00+03:00", end: "2026-11-23T22:30:00+03:00" },
  ],
  telegramLink: "https://t.me/ethiocomputerschool",
  subLink: "https://youtube.com/@EthioComputerSchool?sub_confirmation=1",
  ytSubs: "300K",
  hostName: "Getabalew Tadiwos",
  hostRole: "Founder · Ethio Computer School",
  text: { en, am },
};

/** Deep-merge stored settings over defaults so new keys always exist. */
export function mergeSettings<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (typeof base === "object" && base !== null) {
    if (typeof over !== "object" || Array.isArray(over)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
      out[k] = k in out ? mergeSettings(out[k], v) : v;
    }
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

/** Replaces {tokens} in a template. */
export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/* ---------- time helpers (Ethiopia is UTC+3 all year) ---------- */
const EAT = "Africa/Addis_Ababa";

export function dayLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: EAT }).format(new Date(iso));
}

export function dateRange(days: DayWindow[]): string {
  if (!days.length) return "";
  const a = dayLabel(days[0].start), b = dayLabel(days[days.length - 1].start);
  const [ma, da] = a.split(" "), [mb, db] = b.split(" ");
  return a === b ? a : ma === mb ? `${ma} ${da}–${db}` : `${a} – ${b}`;
}

/** "8:00 PM EAT" (en) or Ethiopian clock "ምሽት 2:00" (am). */
export function timeLabel(iso: string, lang: Lang): string {
  const d = new Date(new Date(iso).getTime() + 3 * 3600e3); // shift to EAT, read as UTC
  const h = d.getUTCHours(), m = String(d.getUTCMinutes()).padStart(2, "0");
  if (lang === "en") return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"} EAT`;
  const eh = ((h + 6) % 12) || 12;
  const period = h >= 6 && h < 12 ? "ጠዋት" : h >= 12 && h < 18 ? "ከሰዓት" : h >= 18 ? "ምሽት" : "ሌሊት";
  return `${period} ${eh}:${m}`;
}

/** ISO (+03:00) → value for <input type="datetime-local"> in EAT. */
export function isoToLocalInput(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 3 * 3600e3);
  return d.toISOString().slice(0, 16);
}
export function localInputToIso(v: string): string {
  return `${v.length === 16 ? v + ":00" : v}+03:00`;
}

/** Google Calendar "add event" link. */
export function calendarLink(title: string, details: string, w: DayWindow): string {
  const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${f(w.start)}/${f(w.end)}`, details, location: "YouTube — @EthioComputerSchool" });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
