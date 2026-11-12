import type { Metadata } from "next";
import RegisterFlow from "@/components/register-flow";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Register — YouTube Monetization Live" };

export default async function RegisterPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);
  const reg = user ? await db.registration.findUnique({ where: { userId: user.id } }) : null;
  return (
    <RegisterFlow
      s={s}
      user={user ? { name: user.name, email: user.email, image: user.image } : null}
      reg={reg ? { seat: reg.seat, name: reg.name, phone: reg.phone } : null}
    />
  );
}
