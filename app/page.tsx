import Landing from "@/components/landing";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { hideVenue } from "@/lib/settings-shared";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);
  const registered = user ? !!(await db.registration.findUnique({ where: { userId: user.id }, select: { id: true } })) : false;
  return <Landing s={registered ? s : hideVenue(s)} registered={registered} />;
}
