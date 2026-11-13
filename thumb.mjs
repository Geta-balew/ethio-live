import { chromium } from "playwright-core";
const u = process.argv[2];
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await p.goto(u, { waitUntil: "networkidle" });
await p.evaluate(() => document.querySelectorAll(".rv").forEach(e => e.classList.add("in")));
await p.waitForTimeout(700);
for (const [sel, n] of [[".player", "th-player"], [".host-photo", "th-host"]]) { const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await el.screenshot({ path: `../${n}.png` }); }
await b.close();
