import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--f-jakarta", display: "swap" });
const ethiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], weight: ["400", "500", "700", "800"], variable: "--f-ethiopic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: "YouTube Monetization Live — Ethio Computer School",
  description: "Free 3-day YouTube Monetization live online class by Ethio Computer School. Register free with Google.",
  icons: { icon: "/logo-icon.png" },
  openGraph: {
    type: "website",
    title: "YouTube Monetization Live — Free 3-day event",
    description: "After Feb 1, nothing will be the same. Join 3 nights live online — register free.",
    images: [{ url: "/live-thumb.jpg", width: 1280, height: 720 }],
  },
};

export const viewport: Viewport = { themeColor: "#050505", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${ethiopic.variable}`}>
      <body>
        <div className="bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
