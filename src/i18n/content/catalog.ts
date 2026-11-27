export interface NamedCopy {
  name: string;
  origin: string;
  epithet: string;
}

export interface TitledCopy {
  title: string;
  subtitle: string;
}

export interface SkillText {
  title: string;
  description: string;
}

export const HERO_COPY: Record<string, Record<"en" | "es", NamedCopy>> = {
  odysseus: {
    en: { name: "Odysseus", origin: "Homeric epic", epithet: "The many-minded helmsman of Ithaca" },
    es: { name: "Odiseo", origin: "Epopeya homérica", epithet: "El timonel de muchos ingenios de Ítaca" }
  },
  "sherlock-holmes": {
    en: { name: "Sherlock Holmes", origin: "The Baker Street chronicles", epithet: "Analyst of residual clues" },
    es: { name: "Sherlock Holmes", origin: "Crónicas de Baker Street", epithet: "Analista de indicios residuales" }
  },
  heracles: {
    en: { name: "Heracles", origin: "Hellenic myths", epithet: "Tamer of twelve impossibilities" },
    es: { name: "Heracles", origin: "Mitos helénicos", epithet: "Domador de doce imposibles" }
  },
  vasilisa: {
    en: { name: "Vasilisa the Wise", origin: "Russian folk tales", epithet: "Keeper of patterned meaning" },
    es: { name: "Vasilisa la Sabia", origin: "Cuentos populares rusos", epithet: "Guardiana del sentido bordado" }
  },
  "don-quixote": {
    en: { name: "Don Quixote", origin: "The novel of the hidalgo of La Mancha", epithet: "Knight of the elevated assumption" },
    es: { name: "Don Quijote", origin: "Novela del hidalgo de La Mancha", epithet: "Caballero de la hipótesis elevada" }
  },
  alice: {
    en: { name: "Alice", origin: "Tales of Wonderland and the Looking-Glass", epithet: "Explorer of inversions and paradoxes" },
    es: { name: "Alicia", origin: "Cuentos del País de las Maravillas y del Espejo", epithet: "Exploradora de inversiones y paradojas" }
  },
  "robin-hood": {
    en: { name: "Robin Hood", origin: "Ballads of Sherwood Forest", epithet: "Free archer of justice" },
    es: { name: "Robin Hood", origin: "Baladas del bosque de Sherwood", epithet: "Arquero libre de la justicia" }
  },
  "sun-wukong": {
    en: { name: "Sun Wukong", origin: "Journey to the West", epithet: "Sage equal to Heaven in debate" },
    es: { name: "Sun Wukong", origin: "Viaje al Oeste", epithet: "Sabio igual al Cielo en la polémica" }
  },
  "king-arthur": {
    en: { name: "King Arthur", origin: "Legends of the Round Table", epithet: "Keeper of the circle of equals" },
    es: { name: "Rey Arturo", origin: "Leyendas de la Mesa Redonda", epithet: "Guardián del círculo de iguales" }
  },
  sindbad: {
    en: { name: "Sinbad", origin: "Tales of the Thousand and One Nights", epithet: "Mariner of seven incredible voyages" },
    es: { name: "Simbad", origin: "Cuentos de las mil y una noches", epithet: "Marino de siete viajes increíbles" }
  },
  dartagnan: {
    en: { name: "d'Artagnan", origin: "Chronicles of the king's musketeers", epithet: "Gascon blade of the quick reply" },
    es: { name: "d'Artagnan", origin: "Crónicas de los mosqueteros del rey", epithet: "Hoja gascona de la réplica rápida" }
  },
  "ilya-muromets": {
    en: { name: "Ilya Muromets", origin: "The Kievan bylina cycle", epithet: "Watch-hero of the straight road of truth" },
    es: { name: "Ilya Muromets", origin: "Ciclo de bylinas de Kiev", epithet: "Héroe vigía de la verdad en línea recta" }
  },
  "elizabeth-bennet": {
    en: { name: "Elizabeth Bennet", origin: "Chronicles of Hertfordshire", epithet: "Master of fine irony and self-revision" },
    es: { name: "Elizabeth Bennet", origin: "Crónicas de Hertfordshire", epithet: "Maestra de la ironía fina y de revisarse a sí misma" }
  },
  "captain-nemo": {
    en: { name: "Captain Nemo", origin: "Chronicles of the Nautilus", epithet: "Engineer of the deep sea and of independence" },
    es: { name: "Capitán Nemo", origin: "Crónicas del Nautilus", epithet: "Ingeniero de las profundidades y de la independencia" }
  },
  thor: {
    en: { name: "Thor", origin: "The Poetic and Prose Edda", epithet: "Thunderer of the direct argument" },
    es: { name: "Thor", origin: "La Edda poética y la Edda prosaica", epithet: "Tronador del argumento directo" }
  },
  cinderella: {
    en: { name: "Cinderella", origin: "Old European fairy tales", epithet: "Keeper of exact measure until midnight" },
    es: { name: "Cenicienta", origin: "Viejos cuentos europeos", epithet: "Guardiana de la medida exacta hasta medianoche" }
  }
};

export const TOURNAMENT_COPY: Record<string, Record<"en" | "es", TitledCopy>> = {
  "cup-1-winter-cathedral": {
    en: {
      title: "Cup I: Winter Cathedral of Ideas",
      subtitle: "The first great draw of the six domains among sixteen classic heroes"
    },
    es: {
      title: "Copa I: Catedral Invernal de las Ideas",
      subtitle: "El primer gran sorteo de los seis dominios entre dieciséis héroes clásicos"
    }
  },
  "cup-2-spring-amphora": {
    en: {
      title: "Cup II: Spring Amphora of Rhetoric",
      subtitle: "The second convocation, seeded from the debut Elo rating"
    },
    es: {
      title: "Copa II: Ánfora Primaveral de la Retórica",
      subtitle: "La segunda convocatoria, sembrada según el Elo de debut"
    }
  },
  "cup-3-autumn-meridian": {
    en: {
      title: "Cup III: Autumn Meridian of Thought",
      subtitle: "The third archived cup: new pot leaders and fresh knockout pairings"
    },
    es: {
      title: "Copa III: Meridiano Otoñal del Pensamiento",
      subtitle: "La tercera copa de archivo: cambian los líderes de bombo y los cruces"
    }
  },
  "cup-4-current-grand-dispute": {
    en: {
      title: "Cup IV: The Grand Dispute of Heritage",
      subtitle: "The current tournament: daily skill announcements and the fight to leave the groups"
    },
    es: {
      title: "Copa IV: La Gran Disputa del Legado",
      subtitle: "El torneo en curso: anuncios diarios de habilidades y la lucha por salir del grupo"
    }
  }
};
