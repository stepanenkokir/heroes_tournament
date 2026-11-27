import { notFound } from "next/navigation";
import { TournamentView } from "@/components/TournamentView";
import { getAllTournamentsSummary, getTournamentFullView } from "@/db/queries";

export const dynamic = "force-dynamic";

export default function CurrentTournamentPage() {
  const data = getTournamentFullView("active");
  if (!data) {
    notFound();
  }

  const allTournaments = getAllTournamentsSummary().map((t) => ({
    slug: t.tournament.slug,
    title: t.tournament.title,
    subtitle: t.tournament.subtitle,
    editionNumber: t.tournament.editionNumber,
    status: t.tournament.status
  }));

  return <TournamentView data={data} allTournaments={allTournaments} />;
}
