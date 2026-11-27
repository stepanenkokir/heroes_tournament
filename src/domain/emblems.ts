export interface EmblemDescriptor {
  key: string;
  svgPath: string;
  secondaryPath?: string;
}

export const EMBLEM_DESCRIPTORS: Record<string, EmblemDescriptor> = {
  trireme: {
    key: "trireme",
    svgPath: "M8 38 C16 42, 32 42, 40 38 L44 30 L4 30 Z M24 10 L24 30 M24 12 L36 24 L24 24",
    secondaryPath: "M6 44 Q15 40 24 44 T42 44"
  },
  lens: {
    key: "lens",
    svgPath: "M21 10 A11 11 0 1 0 21 32 A11 11 0 1 0 21 10 Z M29 29 L41 41",
    secondaryPath: "M17 17 L25 25 M25 17 L17 25"
  },
  lion: {
    key: "lion",
    svgPath: "M24 8 L38 16 L38 30 C38 38 24 43 24 43 C24 43 10 38 10 30 L10 16 Z",
    secondaryPath: "M18 22 L24 16 L30 22 L24 34 Z"
  },
  spindle: {
    key: "spindle",
    svgPath: "M24 6 L30 24 L24 42 L18 24 Z",
    secondaryPath: "M10 24 C16 16, 32 16, 38 24 C32 32, 16 32, 10 24 Z"
  },
  windmill: {
    key: "windmill",
    svgPath: "M18 42 L21 24 L27 24 L30 42 Z M24 22 L10 8 M24 22 L38 8 M24 22 L38 36 M24 22 L10 36",
    secondaryPath: "M22 22 A2 2 0 1 0 26 22 A2 2 0 1 0 22 22"
  },
  "chess-crown": {
    key: "chess-crown",
    svgPath: "M10 36 L14 16 L20 25 L24 12 L28 25 L34 16 L38 36 Z",
    secondaryPath: "M10 40 L38 40"
  },
  arrow: {
    key: "arrow",
    svgPath: "M10 38 L38 10 M38 10 L28 10 M38 10 L38 20",
    secondaryPath: "M14 12 C26 14, 34 22, 36 34"
  },
  "staff-cloud": {
    key: "staff-cloud",
    svgPath: "M10 38 L38 10 M14 30 C14 24, 22 24, 24 28 C28 22, 36 26, 34 33 L14 33 Z",
    secondaryPath: "M8 40 L14 34 M34 14 L40 8"
  },
  "round-table": {
    key: "round-table",
    svgPath: "M24 8 A16 16 0 1 0 24 40 A16 16 0 1 0 24 8 Z M24 8 L24 40 M8 24 L40 24",
    secondaryPath: "M13 13 L35 35 M35 13 L13 35"
  },
  astrolabe: {
    key: "astrolabe",
    svgPath: "M24 9 A15 15 0 1 0 24 39 A15 15 0 1 0 24 9 Z M12 24 C18 16, 30 16, 36 24",
    secondaryPath: "M24 6 L24 42 M13 15 L35 33"
  },
  rapier: {
    key: "rapier",
    svgPath: "M24 6 L24 36 M15 30 C19 26, 29 26, 33 30 M20 36 L28 36 M24 36 L24 43",
    secondaryPath: "M18 14 L30 26 M30 14 L18 26"
  },
  "oak-shield": {
    key: "oak-shield",
    svgPath: "M12 10 L36 10 L36 26 C36 35 24 42 24 42 C24 42 12 35 12 26 Z",
    secondaryPath: "M24 14 L24 36 M17 22 L31 22"
  },
  quill: {
    key: "quill",
    svgPath: "M12 38 C16 24, 26 12, 38 10 C36 22, 28 32, 16 34 Z",
    secondaryPath: "M10 40 L28 22"
  },
  nautilus: {
    key: "nautilus",
    svgPath: "M26 26 A4 4 0 1 1 22 22 A8 8 0 1 1 30 30 A13 13 0 1 1 14 14",
    secondaryPath: "M24 24 L36 16 M24 24 L38 26"
  },
  mjolnir: {
    key: "mjolnir",
    svgPath: "M10 14 L38 14 L36 26 L12 26 Z M22 26 L22 41 L26 41 L26 26",
    secondaryPath: "M24 8 L24 14"
  },
  slipper: {
    key: "slipper",
    svgPath: "M10 32 C16 32, 22 26, 28 18 L38 24 C36 32, 30 36, 12 36 Z",
    secondaryPath: "M32 36 L34 42 M24 12 L26 16 M22 14 L28 14"
  },
  loom: {
    key: "loom",
    svgPath: "M10 10 L38 10 L38 38 L10 38 Z M16 10 L16 38 M24 10 L24 38 M32 10 L32 38",
    secondaryPath: "M10 20 Q24 14 38 20 M10 28 Q24 34 38 28"
  },
  spear: {
    key: "spear",
    svgPath: "M10 38 L34 14 M38 10 L28 14 L34 20 Z",
    secondaryPath: "M16 32 A8 8 0 1 0 32 16"
  },
  chalice: {
    key: "chalice",
    svgPath: "M14 12 L34 12 C34 24 28 28 24 28 C20 28 14 24 14 12 Z M24 28 L24 38 M16 38 L32 38",
    secondaryPath: "M18 8 Q24 4 30 8"
  },
  wings: {
    key: "wings",
    svgPath: "M24 28 C16 14 8 12 8 22 C8 30 16 32 24 28 C32 32 40 30 40 22 C40 12 32 14 24 28 Z",
    secondaryPath: "M24 12 L24 38"
  },
  lyre: {
    key: "lyre",
    svgPath: "M14 12 C10 22 14 34 24 36 C34 34 38 22 34 12 M16 36 L32 36",
    secondaryPath: "M20 14 L20 35 M24 14 L24 36 M28 14 L28 35"
  },
  caduceus: {
    key: "caduceus",
    svgPath: "M24 8 L24 40 M14 16 C20 12 28 20 34 16 M14 28 C20 24 28 32 34 28",
    secondaryPath: "M16 10 L24 14 L32 10"
  },
  mask: {
    key: "mask",
    svgPath: "M12 12 L36 12 C36 28 30 36 24 40 C18 36 12 28 12 12 Z",
    secondaryPath: "M17 20 L21 20 M27 20 L31 20 M18 30 Q24 34 30 28"
  },
  "dragon-prow": {
    key: "dragon-prow",
    svgPath: "M10 36 C20 38 34 34 38 22 C38 14 30 10 24 14 L28 18 C22 24 16 26 10 26 Z",
    secondaryPath: "M8 40 Q24 36 40 40"
  },
  "crystal-orb": {
    key: "crystal-orb",
    svgPath: "M24 10 A12 12 0 1 0 24 34 A12 12 0 1 0 24 10 Z M16 38 L32 38 L28 34 L20 34 Z",
    secondaryPath: "M20 16 L28 24 M28 16 L20 24"
  },
  lance: {
    key: "lance",
    svgPath: "M8 40 L38 10 M30 10 L38 10 L38 18",
    secondaryPath: "M26 14 L34 22 L22 26 Z"
  },
  "green-girdle": {
    key: "green-girdle",
    svgPath: "M24 8 L30 20 L42 22 L33 31 L35 42 L24 36 L13 42 L15 31 L6 22 L18 20 Z",
    secondaryPath: "M16 16 L32 32 M32 16 L16 32"
  },
  mace: {
    key: "mace",
    svgPath: "M24 22 L24 42 M24 8 L30 14 L24 22 L18 14 Z M14 14 L34 14",
    secondaryPath: "M18 10 L30 18 M30 10 L18 18"
  },
  "bow-horn": {
    key: "bow-horn",
    svgPath: "M14 10 C30 14 30 34 14 38 M14 10 L14 38",
    secondaryPath: "M22 24 L38 20 L34 28 Z"
  },
  gusli: {
    key: "gusli",
    svgPath: "M10 34 L16 12 L38 18 L34 34 Z",
    secondaryPath: "M16 34 L20 14 M22 34 L26 15 M28 34 L32 17"
  },
  falcon: {
    key: "falcon",
    svgPath: "M24 10 L38 22 L28 26 L32 38 L24 32 L16 38 L20 26 L10 22 Z",
    secondaryPath: "M20 18 L28 18"
  },
  mortar: {
    key: "mortar",
    svgPath: "M14 20 L34 20 L30 38 L18 38 Z M28 10 L20 28",
    secondaryPath: "M12 38 L36 38"
  },
  "feather-fire": {
    key: "feather-fire",
    svgPath: "M24 8 C34 16 34 30 24 40 C14 30 14 16 24 8 Z",
    secondaryPath: "M24 14 L24 36 M19 22 L24 17 L29 22"
  },
  "scroll-lamp": {
    key: "scroll-lamp",
    svgPath: "M10 30 C16 30 20 22 30 22 L38 26 C34 34 22 36 12 36 Z",
    secondaryPath: "M34 18 C34 12 38 12 38 18"
  },
  "donkey-lantern": {
    key: "donkey-lantern",
    svgPath: "M20 12 L28 12 L32 22 L28 34 L20 34 L16 22 Z",
    secondaryPath: "M24 8 L24 12 M22 20 L26 26"
  },
  "magic-lamp": {
    key: "magic-lamp",
    svgPath: "M12 28 C18 22 30 22 36 28 L42 24 C36 34 18 36 12 28 Z M20 34 L28 34",
    secondaryPath: "M36 18 Q30 10 22 14"
  },
  web: {
    key: "web",
    svgPath: "M24 8 L24 40 M8 24 L40 24 M13 13 L35 35 M35 13 L13 35",
    secondaryPath: "M24 16 L32 24 L24 32 L16 24 Z"
  },
  rake: {
    key: "rake",
    svgPath: "M24 14 L24 40 M12 14 L36 14 M14 14 L14 22 M20 14 L20 22 M28 14 L28 22 M34 14 L34 22",
    secondaryPath: "M20 36 L28 36"
  },
  "feather-fan": {
    key: "feather-fan",
    svgPath: "M24 38 L24 26 M12 24 C12 12 36 12 36 24 C30 28 18 28 12 24 Z",
    secondaryPath: "M18 16 L24 26 L30 16"
  },
  "magnolia-blade": {
    key: "magnolia-blade",
    svgPath: "M12 36 L36 12 C38 18 32 26 22 32 Z",
    secondaryPath: "M10 38 L18 30 M16 16 C20 12 24 16 20 20"
  },
  "skull-crown": {
    key: "skull-crown",
    svgPath: "M14 24 L18 14 L24 20 L30 14 L34 24 Z M14 28 L34 28 L32 36 L16 36 Z",
    secondaryPath: "M20 32 L20 36 M28 32 L28 36"
  },
  tankard: {
    key: "tankard",
    svgPath: "M14 14 L30 14 L28 38 L16 38 Z M30 18 L36 18 L36 30 L29 30",
    secondaryPath: "M14 12 Q22 8 30 12"
  },
  "plume-hat": {
    key: "plume-hat",
    svgPath: "M8 32 L40 32 M14 32 C16 22 28 22 32 32",
    secondaryPath: "M26 24 C30 12 38 10 40 16"
  },
  "fleur-de-lis": {
    key: "fleur-de-lis",
    svgPath: "M24 8 C20 16 20 24 24 36 C28 24 28 16 24 8 Z M14 22 C14 16 20 18 22 26 M34 22 C34 16 28 18 26 26",
    secondaryPath: "M16 30 L32 30"
  },
  "compass-rose": {
    key: "compass-rose",
    svgPath: "M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z",
    secondaryPath: "M24 18 A6 6 0 1 0 24 30 A6 6 0 1 0 24 18 Z"
  },
  alembic: {
    key: "alembic",
    svgPath: "M18 14 L26 14 L26 22 L32 34 L12 34 L18 22 Z",
    secondaryPath: "M26 16 L38 22"
  },
  "tuning-fork": {
    key: "tuning-fork",
    svgPath: "M18 10 L18 24 C18 30 30 30 30 24 L30 10 M24 29 L24 40",
    secondaryPath: "M14 16 L10 16 M34 16 L38 16"
  },
  cannonball: {
    key: "cannonball",
    svgPath: "M28 24 A10 10 0 1 0 28 24.01 Z",
    secondaryPath: "M8 32 L20 26 M6 24 L18 22 M10 38 L22 30"
  },
  spyglass: {
    key: "spyglass",
    svgPath: "M10 34 L34 14 L38 18 L14 38 Z",
    secondaryPath: "M22 24 L26 28 M30 17 L34 21"
  },
  "sealed-letter": {
    key: "sealed-letter",
    svgPath: "M10 14 L38 14 L38 34 L10 34 Z M10 14 L24 26 L38 14",
    secondaryPath: "M24 24 A3 3 0 1 0 24 30 A3 3 0 1 0 24 24 Z"
  }
};
