import { EMBLEM_DESCRIPTORS } from "@/domain/emblems";

interface HeroEmblemProps {
  emblemKey: string;
  accentHex: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export function HeroEmblem({
  emblemKey,
  accentHex,
  name,
  size = "md"
}: HeroEmblemProps) {
  const descriptor = EMBLEM_DESCRIPTORS[emblemKey] ?? EMBLEM_DESCRIPTORS.trireme!;
  const pixelSize = size === "sm" ? 38 : size === "lg" ? 76 : 52;

  return (
    <div
      className={`hero-emblem hero-emblem--${size}`}
      style={{ "--hero-accent": accentHex } as React.CSSProperties}
      title={name}
      aria-label={name}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="#f8f1e2"
          stroke={accentHex}
          strokeWidth="1.75"
        />
        <circle
          cx="24"
          cy="24"
          r="18.5"
          stroke={accentHex}
          strokeWidth="0.75"
          strokeDasharray="2 2"
          opacity="0.55"
        />
        <path
          d={descriptor.svgPath}
          stroke={accentHex}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {descriptor.secondaryPath ? (
          <path
            d={descriptor.secondaryPath}
            stroke="#1a1714"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        ) : null}
      </svg>
      <span className="hero-emblem__monogram">{descriptor.monogram}</span>
    </div>
  );
}
