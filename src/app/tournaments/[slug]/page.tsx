import { notFound } from "next/navigation";
import { TournamentView } from "@/components/TournamentView";
import { getAllTournamentsSummary, getTournamentFullView } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function TournamentArchiveDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getTournamentFullView(slug);
  if (!data) {
    notFound();
  }

  const allTournaments = getAllTournamentsSummary().map((t) => ({
    slug: t.tournament.slug,
    title: t.tournament.title,
    editionNumber: t.tournament.editionNumber,
    status: t.tournament.status
  }));

  return <TournamentView data={data} allTournaments={allTournaments} />;
}
