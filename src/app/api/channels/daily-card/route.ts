import { NextResponse } from "next/server";
import { EMBLEM_DESCRIPTORS, heroMonogram } from "@/domain";
import { getDisputeProtocolView, getHomePortalData } from "@/db/queries";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const disputeId = url.searchParams.get("disputeId");
  const format = url.searchParams.get("format") ?? "svg";

  const cardView = disputeId
    ? getDisputeProtocolView(disputeId)?.card
    : (() => {
        const home = getHomePortalData();
        return home.todayDisputes[0] ?? home.upcomingVotingDisputes[0];
      })();

  if (!cardView || !cardView.heroA || !cardView.heroB) {
    return NextResponse.json({ ok: false, error: "No active dispute card found" }, { status: 404 });
  }

  const { dispute, tournament, heroA, heroB } = cardView;
  const embA = EMBLEM_DESCRIPTORS[heroA.emblemKey];
  const embB = EMBLEM_DESCRIPTORS[heroB.emblemKey];
  const monoA = heroMonogram(heroA.name);
  const monoB = heroMonogram(heroB.name);

  if (format === "json") {
    return NextResponse.json({
      disputeId: dispute.id,
      scheduledDate: dispute.scheduledDate,
      tournamentTitle: tournament.title,
      heroA: { name: heroA.name, origin: heroA.origin, epithet: heroA.epithet },
      heroB: { name: heroB.name, origin: heroB.origin, epithet: heroB.epithet },
      url: `/disputes/${encodeURIComponent(dispute.id)}`
    });
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <rect width="1080" height="1080" fill="#f7f1e3" />
  <rect x="36" y="36" width="1008" height="1008" rx="24" fill="none" stroke="#c8b89a" stroke-width="4" />
  <text x="540" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#7a6852" font-weight="bold">
    ${escapeXml(tournament.title)} · ${escapeXml(dispute.scheduledDate)}
  </text>
  <text x="540" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#231c14" font-weight="bold">
    АФИША ДИСПУТА · ТУРНИР ГЕРОЕВ
  </text>

  <g transform="translate(130, 280)">
    <rect width="340" height="440" rx="20" fill="#efe6d2" stroke="${escapeXml(heroA.accentHex)}" stroke-width="4" />
    <circle cx="170" cy="140" r="76" fill="${escapeXml(heroA.accentHex)}" fill-opacity="0.14" stroke="${escapeXml(heroA.accentHex)}" stroke-width="3" />
    <g transform="translate(110, 80) scale(2.5)">
      <path d="${embA?.svgPath ?? ""}" fill="none" stroke="${escapeXml(heroA.accentHex)}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="170" y="265" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="${escapeXml(heroA.accentHex)}" font-weight="bold">${escapeXml(monoA)}</text>
    <text x="170" y="315" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#231c14" font-weight="bold">${escapeXml(heroA.name)}</text>
    <text x="170" y="355" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#6b5b47">${escapeXml(heroA.origin)}</text>
    <text x="170" y="395" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#4b3f30">${escapeXml(heroA.epithet.slice(0, 34))}</text>
  </g>

  <text x="540" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="#9e3b24" font-weight="bold">VS</text>

  <g transform="translate(610, 280)">
    <rect width="340" height="440" rx="20" fill="#efe6d2" stroke="${escapeXml(heroB.accentHex)}" stroke-width="4" />
    <circle cx="170" cy="140" r="76" fill="${escapeXml(heroB.accentHex)}" fill-opacity="0.14" stroke="${escapeXml(heroB.accentHex)}" stroke-width="3" />
    <g transform="translate(110, 80) scale(2.5)">
      <path d="${embB?.svgPath ?? ""}" fill="none" stroke="${escapeXml(heroB.accentHex)}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="170" y="265" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="${escapeXml(heroB.accentHex)}" font-weight="bold">${escapeXml(monoB)}</text>
    <text x="170" y="315" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#231c14" font-weight="bold">${escapeXml(heroB.name)}</text>
    <text x="170" y="355" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#6b5b47">${escapeXml(heroB.origin)}</text>
    <text x="170" y="395" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#4b3f30">${escapeXml(heroB.epithet.slice(0, 34))}</text>
  </g>

  <text x="540" y="830" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#231c14">
    ${dispute.status === "completed" ? `Счёт признания: ${dispute.acclaimA} : ${dispute.acclaimB}` : "Голосование секундантов до 12:00 Europe/Moscow"}
  </text>
  <text x="540" y="920" text-anchor="middle" font-family="monospace" font-size="22" fill="#7a6852">
    /disputes/${escapeXml(dispute.id)}
  </text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
