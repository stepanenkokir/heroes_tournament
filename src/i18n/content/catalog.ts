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
  },
  penelope: {
    en: { name: "Penelope", origin: "Homeric epic", epithet: "Weaver of Ithaca's long design" },
    es: { name: "Penélope", origin: "Epopeya homérica", epithet: "Tejedora del largo designio de Ítaca" }
  },
  achilles: {
    en: { name: "Achilles", origin: "Homeric epic", epithet: "Swift-footed choice of undying renown" },
    es: { name: "Aquiles", origin: "Epopeya homérica", epithet: "Elección veloz de la fama inmortal" }
  },
  circe: {
    en: { name: "Circe", origin: "Hellenic myths", epithet: "Mistress of Aeaean transformations" },
    es: { name: "Circe", origin: "Mitos helénicos", epithet: "Señora de las metamorfosis de Eea" }
  },
  daedalus: {
    en: { name: "Daedalus", origin: "Hellenic myths", epithet: "Architect of the labyrinth and winged calculation" },
    es: { name: "Dédalo", origin: "Mitos helénicos", epithet: "Arquitecto del laberinto y del cálculo alado" }
  },
  orpheus: {
    en: { name: "Orpheus", origin: "Hellenic myths", epithet: "Singer who bends stones and judges" },
    es: { name: "Orfeo", origin: "Mitos helénicos", epithet: "Cantor que inclina las piedras y a los jueces" }
  },
  hermes: {
    en: { name: "Hermes", origin: "Hellenic myths", epithet: "Winged herald of borders and pacts" },
    es: { name: "Hermes", origin: "Mitos helénicos", epithet: "Heraldo alado de fronteras y pactos" }
  },
  loki: {
    en: { name: "Loki", origin: "The Poetic and Prose Edda", epithet: "Inventor of knots and loopholes" },
    es: { name: "Loki", origin: "La Edda poética y la Edda prosaica", epithet: "Inventor de nudos y salvedades" }
  },
  beowulf: {
    en: { name: "Beowulf", origin: "Anglo-Saxon epic", epithet: "Warden of the mead-hall and sea-bands" },
    es: { name: "Beowulf", origin: "Epopeya anglosajona", epithet: "Guardián de la sala del hidromiel y las huestes del mar" }
  },
  merlin: {
    en: { name: "Merlin", origin: "Legends of the Round Table", epithet: "Seer of the stone and forest silence" },
    es: { name: "Merlín", origin: "Leyendas de la Mesa Redonda", epithet: "Vidente de la piedra y del silencio del bosque" }
  },
  lancelot: {
    en: { name: "Lancelot", origin: "Legends of the Round Table", epithet: "First blade of the Lake's realm" },
    es: { name: "Lanzarote", origin: "Leyendas de la Mesa Redonda", epithet: "Primera hoja del dominio del Lago" }
  },
  gawain: {
    en: { name: "Gawain", origin: "Legends of the Round Table", epithet: "Knight of the pentangle and noonday strength" },
    es: { name: "Gawain", origin: "Leyendas de la Mesa Redonda", epithet: "Caballero del pentáculo y la fuerza del mediodía" }
  },
  dobrynya: {
    en: { name: "Dobrynya Nikitich", origin: "The Kievan bylina cycle", epithet: "Master of courtesy and the envoy's word" },
    es: { name: "Dobrynya Nikítich", origin: "Ciclo de bylinas de Kiev", epithet: "Maestro de la cortesía y la palabra de embajador" }
  },
  "alyosha-popovich": {
    en: { name: "Alyosha Popovich", origin: "The Kievan bylina cycle", epithet: "Resourceful archer of the sudden maneuver" },
    es: { name: "Aliosha Popóvich", origin: "Ciclo de bylinas de Kiev", epithet: "Arquero ingenioso de la maniobra súbita" }
  },
  sadko: {
    en: { name: "Sadko", origin: "The Novgorod bylina cycle", epithet: "Gusli player of Lake Ilmen and thirty ships" },
    es: { name: "Sadkó", origin: "Ciclo de bylinas de Nóvgorod", epithet: "Tañedor del lago Ilmen y de treinta naves" }
  },
  "marya-morevna": {
    en: { name: "Marya Morevna", origin: "Russian folk tales", epithet: "Princess of the martial field and silver keys" },
    es: { name: "Maria Morevna", origin: "Cuentos populares rusos", epithet: "Princesa del campo marcial y las llaves de plata" }
  },
  "baba-yaga": {
    en: { name: "Baba Yaga", origin: "Russian folk tales", epithet: "Warden of the forest border and direct questioning" },
    es: { name: "Baba Yagá", origin: "Cuentos populares rusos", epithet: "Guardiana del linde del bosque y la pregunta directa" }
  },
  "ivan-the-fool": {
    en: { name: "Ivan the Fool", origin: "Russian folk tales", epithet: "Unreckoned third brother of fortunate simplicity" },
    es: { name: "Iván el Tonto", origin: "Cuentos populares rusos", epithet: "Tercer hermano de la sencillez afortunada" }
  },
  scheherazade: {
    en: { name: "Scheherazade", origin: "Tales of the Thousand and One Nights", epithet: "Keeper of the dawn pause and a thousand knots" },
    es: { name: "Sherezade", origin: "Cuentos de las mil y una noches", epithet: "Guardiana de la pausa del alba y de mil nudos" }
  },
  nasreddin: {
    en: { name: "Hodja Nasreddin", origin: "Eastern parables and jests", epithet: "Disturber of the peace and judge of judges" },
    es: { name: "Nasreddín Hodja", origin: "Parábolas y anécdotas de Oriente", epithet: "Perturbador de la calma y juez de los jueces" }
  },
  aladdin: {
    en: { name: "Aladdin", origin: "Tales of the Thousand and One Nights", epithet: "Seeker of hidden light under a brass lid" },
    es: { name: "Aladino", origin: "Cuentos de las mil y una noches", epithet: "Buscador de la luz secreta bajo el bronce" }
  },
  anansi: {
    en: { name: "Anansi", origin: "West African tales", epithet: "Keeper of the box of all the world's stories" },
    es: { name: "Anansi", origin: "Relatos del África Occidental", epithet: "Guardián del cofre de todas las historias del mundo" }
  },
  "zhu-bajie": {
    en: { name: "Zhu Bajie", origin: "Journey to the West", epithet: "Marshal of the Heavenly Canopy and earthly sense" },
    es: { name: "Zhu Bajie", origin: "Viaje al Oeste", epithet: "Mariscal del Dosel Celeste y del sentido terrenal" }
  },
  "zhuge-liang": {
    en: { name: "Zhuge Liang", origin: "Romance of the Three Kingdoms", epithet: "Sleeping Dragon of the feather-fan calculation" },
    es: { name: "Zhuge Liang", origin: "Romance de los Tres Reinos", epithet: "Dragón Dormido del cálculo con abanico de plumas" }
  },
  "hua-mulan": {
    en: { name: "Hua Mulan", origin: "Ancient Chinese ballad", epithet: "Rider of filial duty and unbought renown" },
    es: { name: "Hua Mulan", origin: "Antigua balada china", epithet: "Jinete del deber filial y la fama limpia" }
  },
  hamlet: {
    en: { name: "Hamlet", origin: "The tragedy of the Prince of Denmark", epithet: "Tester of conscience and of time out of joint" },
    es: { name: "Hamlet", origin: "La tragedia del príncipe de Dinamarca", epithet: "Examinador de la conciencia y del tiempo fuera de quicio" }
  },
  falstaff: {
    en: { name: "Falstaff", origin: "The Boar's Head chronicles", epithet: "Knight of inexhaustible wit and life" },
    es: { name: "Falstaff", origin: "Crónicas de la Cabeza de Jabalí", epithet: "Caballero del ingenio inagotable y de la vida" }
  },
  cyrano: {
    en: { name: "Cyrano de Bergerac", origin: "The heroic comedy of the Gascon", epithet: "Poet of the blade and the unstained plume" },
    es: { name: "Cyrano de Bergerac", origin: "Comedia heroica del gascón", epithet: "Poeta de la espada y del penacho sin mancha" }
  },
  athos: {
    en: { name: "Athos", origin: "Chronicles of the king's musketeers", epithet: "Count de La Fere of impeccable dignity" },
    es: { name: "Athos", origin: "Crónicas de los mosqueteros del rey", epithet: "Conde de La Fère de dignidad impecable" }
  },
  "edmond-dantes": {
    en: { name: "Edmond Dantes", origin: "Chronicles of the Chateau d'If and Monte Cristo", epithet: "Architect of long reckoning and patience" },
    es: { name: "Edmundo Dantés", origin: "Crónicas del castillo de If y Montecristo", epithet: "Arquitecto de la larga espera y la retribución" }
  },
  faust: {
    en: { name: "Faust", origin: "The tragedy of the scholarly seeker", epithet: "Tester of the bounds of knowledge and deed" },
    es: { name: "Fausto", origin: "Tragedia del sabio buscador", epithet: "Explorador de los límites del saber y de la acción" }
  },
  figaro: {
    en: { name: "Figaro", origin: "The Seville chronicles of Beaumarchais", epithet: "Master of a hundred trades and merry intrigue" },
    es: { name: "Fígaro", origin: "Crónicas sevillanas de Beaumarchais", epithet: "Maestro de cien oficios y de la intriga alegre" }
  },
  munchausen: {
    en: { name: "Baron Munchausen", origin: "The most truthful fireside tales", epithet: "Knight of inventive hyperbole and exact flight" },
    es: { name: "Barón de Münchhausen", origin: "Los relatos más veraces junto a la chimenea", epithet: "Caballero de la hipérbole ingeniosa y del vuelo exacto" }
  },
  gulliver: {
    en: { name: "Lemuel Gulliver", origin: "Travels into several remote nations", epithet: "Witness of Lilliputians, giants, and sober measure" },
    es: { name: "Lemuel Gulliver", origin: "Viajes a varias naciones remotas", epithet: "Testigo de liliputienses, gigantes y medida sobria" }
  },
  dupin: {
    en: { name: "Auguste Dupin", origin: "Parisian analytical studies", epithet: "Knight of pure ratiocination in plain sight" },
    es: { name: "Auguste Dupin", origin: "Estudios analíticos de París", epithet: "Caballero del raciocinio puro a plena vista" }
  }
};

export const TOURNAMENT_COPY: Record<string, Record<"en" | "es", TitledCopy>> = {
  "cup-1-winter-cathedral": {
    en: {
      title: "Cup I: Winter Cathedral of Ideas",
      subtitle: "Open convocation: sixteen heroes drawn by seed from the fifty-hero roster"
    },
    es: {
      title: "Copa I: Catedral Invernal de las Ideas",
      subtitle: "Convocatoria abierta: dieciséis héroes sorteados entre el plantel de cincuenta"
    }
  },
  "cup-2-ancient-epic-circle": {
    en: {
      title: "Cup II: Circle of Myth and Bylina",
      subtitle: "Themed draw: Hellas, the North, Slavic epic, and the Round Table"
    },
    es: {
      title: "Copa II: Círculo del Mito y la Bylina",
      subtitle: "Sorteo temático: Hélade, el Norte, la épica eslava y la Mesa Redonda"
    }
  },
  "cup-3-seven-winds-compass": {
    en: {
      title: "Cup III: Compass of Road and Sea",
      subtitle: "Themed draw: mariners, wanderers, and seekers of distant shores"
    },
    es: {
      title: "Copa III: Brújula de Camino y Mar",
      subtitle: "Sorteo temático: navegantes, caminantes y buscadores de costas lejanas"
    }
  },
  "cup-4-spring-amphora": {
    en: {
      title: "Cup IV: Spring Amphora of Rhetoric",
      subtitle: "Open convocation seeded by the running Elo ledger"
    },
    es: {
      title: "Copa IV: Ánfora Primaveral de la Retórica",
      subtitle: "Convocatoria abierta sembrada según el libro continuo de Elo"
    }
  },
  "cup-5-carnival-of-riddles": {
    en: {
      title: "Cup V: Carnival of Wits and Tricksters",
      subtitle: "Themed draw: masters of inversion, parable, and the unexpected turn"
    },
    es: {
      title: "Copa V: Carnaval de Ingenios y Pícaros",
      subtitle: "Sorteo temático: maestros de la inversión, la parábola y el giro inesperado"
    }
  },
  "cup-6-chamber-of-direct-proof": {
    en: {
      title: "Cup VI: Chamber of Direct Argument",
      subtitle: "Themed draw: disputants of strict reason, word, and unbending honor"
    },
    es: {
      title: "Copa VI: Cámara del Argumento Directo",
      subtitle: "Sorteo temático: disputantes de la razón estricta, la palabra y el honor"
    }
  },
  "cup-7-summer-solstice-convocation": {
    en: {
      title: "Cup VII: Solstice Convocation",
      subtitle: "Open draw across all traditions and domains at mid-season"
    },
    es: {
      title: "Copa VII: Convocatoria del Solsticio",
      subtitle: "Sorteo abierto entre todas las tradiciones y dominios a mitad de ciclo"
    }
  },
  "cup-8-northern-and-bylina-shield": {
    en: {
      title: "Cup VIII: Shield of Sagas and Epics",
      subtitle: "Second themed convocation of mythic, northern, and bylina heroes"
    },
    es: {
      title: "Copa VIII: Escudo de Sagas y Epopeyas",
      subtitle: "Segunda convocatoria temática de héroes míticos, nórdicos y de bylina"
    }
  },
  "cup-9-autumn-meridian": {
    en: {
      title: "Cup IX: Autumn Meridian of Voyagers",
      subtitle: "Themed draw of road and sea: long routes and tested helmsmen"
    },
    es: {
      title: "Copa IX: Meridiano Otoñal de los Navegantes",
      subtitle: "Sorteo temático de camino y mar: rutas largas y timoneles probados"
    }
  },
  "cup-10-lantern-of-paradoxes": {
    en: {
      title: "Cup X: Lantern of Paradoxes",
      subtitle: "Themed draw of tricksters and storytellers before the grand open cup"
    },
    es: {
      title: "Copa X: Linterna de las Paradojas",
      subtitle: "Sorteo temático de pícaros y narradores antes de la gran copa abierta"
    }
  },
  "cup-11-current-grand-dispute": {
    en: {
      title: "Cup XI: The Grand Dispute of Heritage",
      subtitle: "Current open tournament: daily skill announcements, crowd support, and group battles"
    },
    es: {
      title: "Copa XI: La Gran Disputa del Legado",
      subtitle: "Torneo abierto en curso: anuncios diarios, apoyo del público y lucha en los grupos"
    }
  }
};
