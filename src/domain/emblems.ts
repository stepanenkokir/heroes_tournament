export interface EmblemDescriptor {
  key: string;
  monogram: string;
  svgPath: string;
  secondaryPath?: string;
}

export const EMBLEM_DESCRIPTORS: Record<string, EmblemDescriptor> = {
  trireme: {
    key: "trireme",
    monogram: "ОД",
    svgPath: "M8 38 C16 42, 32 42, 40 38 L44 30 L4 30 Z M24 10 L24 30 M24 12 L36 24 L24 24",
    secondaryPath: "M6 44 Q15 40 24 44 T42 44"
  },
  lens: {
    key: "lens",
    monogram: "ШХ",
    svgPath: "M21 10 A11 11 0 1 0 21 32 A11 11 0 1 0 21 10 Z M29 29 L41 41",
    secondaryPath: "M17 17 L25 25 M25 17 L17 25"
  },
  lion: {
    key: "lion",
    monogram: "ГР",
    svgPath: "M24 8 L38 16 L38 30 C38 38 24 43 24 43 C24 43 10 38 10 30 L10 16 Z",
    secondaryPath: "M18 22 L24 16 L30 22 L24 34 Z"
  },
  spindle: {
    key: "spindle",
    monogram: "ВП",
    svgPath: "M24 6 L30 24 L24 42 L18 24 Z",
    secondaryPath: "M10 24 C16 16, 32 16, 38 24 C32 32, 16 32, 10 24 Z"
  },
  windmill: {
    key: "windmill",
    monogram: "ДК",
    svgPath: "M18 42 L21 24 L27 24 L30 42 Z M24 22 L10 8 M24 22 L38 8 M24 22 L38 36 M24 22 L10 36",
    secondaryPath: "M22 22 A2 2 0 1 0 26 22 A2 2 0 1 0 22 22"
  },
  "chess-crown": {
    key: "chess-crown",
    monogram: "АЛ",
    svgPath: "M10 36 L14 16 L20 25 L24 12 L28 25 L34 16 L38 36 Z",
    secondaryPath: "M10 40 L38 40"
  },
  arrow: {
    key: "arrow",
    monogram: "РГ",
    svgPath: "M10 38 L38 10 M38 10 L28 10 M38 10 L38 20",
    secondaryPath: "M14 12 C26 14, 34 22, 36 34"
  },
  "staff-cloud": {
    key: "staff-cloud",
    monogram: "СУ",
    svgPath: "M10 38 L38 10 M14 30 C14 24, 22 24, 24 28 C28 22, 36 26, 34 33 L14 33 Z",
    secondaryPath: "M8 40 L14 34 M34 14 L40 8"
  },
  "round-table": {
    key: "round-table",
    monogram: "КА",
    svgPath: "M24 8 A16 16 0 1 0 24 40 A16 16 0 1 0 24 8 Z M24 8 L24 40 M8 24 L40 24",
    secondaryPath: "M13 13 L35 35 M35 13 L13 35"
  },
  astrolabe: {
    key: "astrolabe",
    monogram: "СМ",
    svgPath: "M24 9 A15 15 0 1 0 24 39 A15 15 0 1 0 24 9 Z M12 24 C18 16, 30 16, 36 24",
    secondaryPath: "M24 6 L24 42 M13 15 L35 33"
  },
  rapier: {
    key: "rapier",
    monogram: "ДА",
    svgPath: "M24 6 L24 36 M15 30 C19 26, 29 26, 33 30 M20 36 L28 36 M24 36 L24 43",
    secondaryPath: "M18 14 L30 26 M30 14 L18 26"
  },
  "oak-shield": {
    key: "oak-shield",
    monogram: "ИМ",
    svgPath: "M12 10 L36 10 L36 26 C36 35 24 42 24 42 C24 42 12 35 12 26 Z",
    secondaryPath: "M24 14 L24 36 M17 22 L31 22"
  },
  quill: {
    key: "quill",
    monogram: "ЭБ",
    svgPath: "M12 38 C16 24, 26 12, 38 10 C36 22, 28 32, 16 34 Z",
    secondaryPath: "M10 40 L28 22"
  },
  nautilus: {
    key: "nautilus",
    monogram: "КН",
    svgPath: "M26 26 A4 4 0 1 1 22 22 A8 8 0 1 1 30 30 A13 13 0 1 1 14 14",
    secondaryPath: "M24 24 L36 16 M24 24 L38 26"
  },
  mjolnir: {
    key: "mjolnir",
    monogram: "ТР",
    svgPath: "M10 14 L38 14 L36 26 L12 26 Z M22 26 L22 41 L26 41 L26 26",
    secondaryPath: "M24 8 L24 14"
  },
  slipper: {
    key: "slipper",
    monogram: "ЗЛ",
    svgPath: "M10 32 C16 32, 22 26, 28 18 L38 24 C36 32, 30 36, 12 36 Z",
    secondaryPath: "M32 36 L34 42 M24 12 L26 16 M22 14 L28 14"
  }
};
