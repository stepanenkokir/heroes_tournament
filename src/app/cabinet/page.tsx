import { cookies } from "next/headers";
import { USER_COOKIE, verifyUserSession } from "@/auth-cookie";
import { CabinetClient } from "@/components/CabinetClient";
import { getCabinetView, getHomePortalData } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function CabinetPage() {
  const cookieStore = await cookies();
  const userId = verifyUserSession(cookieStore.get(USER_COOKIE)?.value);
  const cabinet = getCabinetView(userId);
  const { upcomingVotingDisputes } = getHomePortalData();

  return <CabinetClient cabinet={cabinet} openDisputes={upcomingVotingDisputes} />;
}
