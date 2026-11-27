import type { Messages } from "./messages";

export const es: Messages = {
  meta: {
    title: "Torneo de Héroes · Disputa intelectual de seis dominios",
    description:
      "Portal de espectadores de un certamen de héroes literarios y legendarios: dominantes, apelaciones, fase de grupos, eliminatorias y una clasificación Elo con pruebas."
  },
  brand: {
    seal: "TH",
    title: "Torneo de Héroes",
    subtitle: "Academia de la disputa retórica"
  },
  nav: {
    aria: "Navegación principal",
    today: "Cartel del día",
    current: "Copa actual",
    archive: "Archivo de copas",
    ratings: "Clasificación y pruebas",
    rules: "Reglas y fórmula",
    cabinet: "Gabinete y votos"
  },
  footer: {
    line: "Portal de espectadores de certámenes intelectuales (plantel de 50 héroes, 16 por copa, 6 dominios, una fórmula limpia).",
    timezone: "Zona horaria del calendario y del cierre del día: Europe/Moscow"
  },
  locale: { label: "Idioma de la interfaz" },
  theme: { label: "Tema de color", light: "Tema claro", dark: "Tema oscuro" },
  home: {
    kicker: "Cartel del día · {date} · Europe/Moscow",
    title: "Disputas de hoy: las habilidades están abiertas, el resultado llega mañana",
    subtitle:
      "Cada mañana el portal cierra los protocolos de ayer y anuncia dos dominantes y dos apelaciones para los encuentros de hoy. Antes del mediodía el público puede votar para reforzar una característica en los cruces próximos.",
    openCup: "Abrir la tabla y el calendario de la copa →",
    openRatings: "Elo y pruebas de los 50 héroes",
    openRules: "Fórmula del reconocimiento, temas y código legal",
    billboardTitle: "Cartel del día · disputas: {count}",
    billboardSubtitle:
      "Ya se conocen dos habilidades de ataque (dominantes) y dos de respuesta (apelaciones). El marcador aparece a las 00:00, hora de Moscú.",
    fullCalendar: "Calendario completo (13 días) →",
    recentTitle: "Protocolos recién cerrados de la copa actual",
    recentSubtitle: "El resultado de ayer, con el reconocimiento, la retención y el delta de Elo paso a paso.",
    leadersTitle: "Líderes de la clasificación Elo continua",
    leadersSubtitle: "La clasificación parte de 1500 y sigue a través de todas las copas, archivadas y actuales.",
    fullTable: "Tabla completa y libro de pruebas →",
    overall: "EN LA GENERAL",
    archiveTitle: "Archivo de copas terminadas",
    archiveSubtitle:
      "Diez torneos jugados por completo (abiertos y temáticos, 31 disputas cada uno), con tablas de grupo y cuadro eliminatorio.",
    allTournaments: "Todos los torneos →",
    completed: "Terminado · {edition}",
    champion: "Poseedor de la Copa",
    finalAgainst: "Final contra: {name}",
    openProtocols: "Abrir las tablas de grupo y los 31 protocolos →"
  },
  common: {
    acclaim: "reconocimiento",
    retentionShort: "ret.",
    dominant: "Dominante",
    appeal: "Apelación",
    sharpness: "Agudeza",
    depth: "Profundidad",
    firmness: "Firmeza",
    wit: "Ingenio",
    sharpShort: "Agud.",
    depthShort: "Prof.",
    firmShort: "Firm.",
    witShort: "Ing.",
    waiting: "En espera",
    pairWinner: "Ganador del cruce",
    sideA: "Lado A",
    sideB: "Lado B",
    protocolSeed: "semilla del protocolo: {seed}",
    day: "Día {n}",
    dayShort: "D{n}",
    group: "Grupo {code}",
    groupStage: "Fase de grupos",
    quarter: "Cuartos de final",
    semi: "Semifinal",
    final: "Final de la Copa",
    exchangeOrder: "Orden: A1→B1 · B1→A1 · A2→B2 · B2→A2",
    openProtocol: "Abrir el protocolo de la disputa →",
    openAnnouncement: "Ver la ficha del anuncio →",
    scheduleCard: "Ficha del calendario →",
    statusAnnounced: "Anuncio del día · El resultado se abre mañana",
    statusCompleted: "Protocolo cerrado",
    statusScheduled: "En el calendario",
    resolutionSealed: "Resuelto por el 3.er par lacrado",
    resolutionDecisive: "Argumentos decisivos ({a}:{b})",
    resolutionGlory: "Resuelto por el Sorteo de la Gloria",
    dispute: "DISPUTA",
    exchanges4: "4 intercambios",
    retentionLine: "ret. {a} · {b}",
    openSkills: "Habilidades abiertas · {name}",
    dominantTag: "{side}{n} Dominante",
    appealTag: "{side}{n} Apelación",
    sealedNote: "+ el 3.er par de habilidades está lacrado por si hay empate en la eliminatoria",
    wdlHeader: "G · E · P",
    letters: "{w}G · {d}E · {l}P"
  },
  stage: {
    groupDay: "Fase de grupos · Día {day} de 6",
    qfDays: "Cuartos de final (días 7–10)",
    sfDays: "Semifinales (días 11–12)",
    finalDay: "Final de la Copa (día 13)"
  },
  status: {
    active: "En curso",
    archive: "Archivo",
    currentDraw: "Sorteo actual",
    archivedCup: "Copa de archivo"
  },
  cup: {
    champion: "Triunfador de la Copa",
    runnerUp: "Disputante de plata",
    dayNotice:
      "Reglamento del día (Europe/Moscow): en la fase de grupos se abre una disputa en cada uno de los cuatro grupos. Las habilidades anunciadas permanecen visibles todo el día y el resultado se computa al día siguiente.",
    groupsTitle: "Fase de grupos · Cuatro grupos de cuatro héroes",
    groupsSubtitle: "Victoria: 3 puntos. Empate: 1. Derrota: 0. Pasan el 1.º y el 2.º de cada grupo.",
    sliceAria: "Vista de la tabla de grupos",
    tableCurrent: "Tabla actual",
    tableStart: "En la salida (día 1 · 0 jugados)",
    afterDraw: "Estado tras el sorteo por bombos",
    qualify: "Clasificación: puestos 1–2",
    colPot: "Bombo del sorteo",
    colPlayed: "Disputas jugadas",
    colWins: "Victorias",
    colDraws: "Empates",
    colLosses: "Derrotas",
    colAcclaim: "Reconocimiento (a favor — en contra)",
    colDiff: "Diferencia de reconocimiento",
    colRetention: "Suma de retención",
    colPoints: "Puntos del grupo",
    matches: "Partidos del grupo {code} (6 disputas)",
    announced: "Anuncio",
    scheduled: "Calendario",
    bracketTitle: "Cuadro eliminatorio · Cuartos, semifinales y final",
    bracketSubtitle:
      "Cruces 1A–2B, 1B–2A, 1C–2D, 1D–2C. No hay empate: se abre el 3.er par lacrado, luego los argumentos decisivos (reconocimiento ≥ 12) y el Sorteo de la Gloria.",
    calendarTitle: "Calendario de la copa por días (13 jornadas)",
    calendarSubtitle:
      "Días 1–6: una disputa en cada grupo (4 al día). Días 7–13: una disputa eliminatoria al día.",
    allDays: "Los 13 días",
    todayBadge: "Hoy en la arena",
    potSeedNote: "Siembra por bombos antes de que empiece el juego",
    hero: "Héroe"
  },
  tie: {
    h2hPoints: "Por encima en puntos del enfrentamiento directo",
    h2hDiff: "Por encima en la diferencia de reconocimiento del enfrentamiento directo",
    acclaimDiff: "Por encima en la diferencia global de reconocimiento",
    acclaimFor: "Por encima en reconocimiento anotado",
    retention: "Por encima en la suma de retención",
    rating: "Por encima en la clasificación inicial",
    seed: "Por encima en el sorteo de siembra"
  },
  source: {
    groupPlace: "{place} del grupo {group}",
    pairWinner: "Ganador del cruce {pair}",
    semiWinner: "Ganador de la semifinal {n}"
  },
  ratings: {
    kicker: "Libro continuo de Elo",
    dates: "Clasificación inicial: {initial} · Pruebas en el libro: {count}",
    title: "Tabla de todos los héroes, con pruebas",
    subtitle:
      "Cada cambio de clasificación enlaza al protocolo de una disputa concreta. Abre un héroe para ver el libro cronológico completo, de la primera copa hasta hoy.",
    verifyLabel: "Comprobación automática del libro:",
    verifyOk:
      "Las {heroes} clasificaciones coinciden al recalcular por completo {events} eventos desde los {initial} puntos iniciales.",
    verifyBad: "Se encontró una discrepancia en el libro de clasificación.",
    howElo: "Cómo funciona la fórmula Elo (K = 20 / 28 / 36) →",
    place: "Puesto",
    hero: "Héroe",
    current: "Elo actual",
    from1500: "Desde 1500",
    peak: "Pico de Elo",
    cups: "Copas",
    disputes: "Disputas",
    wdl: "G · E · P",
    lastFive: "Últimas 5 pruebas (clic → protocolo)",
    journal: "Libro",
    trophy: "{count}× Copa",
    proofTitle: "{date}: contra {name} ({before} → {after})",
    allProofs: "Las {count} pruebas →",
    versus: "contra"
  },
  archive: {
    kicker: "Crónica de los certámenes",
    dates: "Sorteos en el libro: {count}",
    title: "Tablas de las copas pasadas y de la actual",
    subtitle:
      "Cada copa tiene fase de grupos (4 grupos de 4 héroes, 24 disputas) y una eliminatoria de 7 disputas. Todos los protocolos se guardan con una semilla determinista.",
    open: "Abrir tablas y cuadro →",
    inProgress: "La fase de grupos sigue en curso · Los anuncios diarios están en la portada",
    champion: "Triunfador",
    finalist: "Finalista"
  },
  hero: {
    back: "← Todos los héroes y la clasificación",
    rank: "#{rank} en la clasificación Elo · {origin}",
    elo: "Clasificación Elo",
    disputes: "Disputas",
    wdl: "G · E · P",
    cups: "Copas",
    today: "Hoy este héroe participa en una disputa anunciada:",
    openToday: "abrir la ficha del anuncio de hoy →",
    arsenalTitle: "Arsenal del disputante: 5 dominantes y 5 apelaciones",
    arsenalSubtitle:
      "Antes de cada certamen el sorteo elige 2 habilidades abiertas de cada tipo y 1 lacrada por si hay prórroga en la eliminatoria.",
    dominantsTitle: "5 Dominantes (con qué presiona en la disputa)",
    appealsTitle: "5 Apelaciones (a qué apela en la respuesta)",
    sharpDepth: "Agudeza y Profundidad",
    firmWit: "Firmeza e Ingenio",
    ledgerTitle: "Pruebas de clasificación: libro completo ({count} disputas terminadas)",
    ledgerSubtitle:
      "Cada fila guarda la clasificación antes del encuentro, la expectativa matemática E, el coeficiente de fase K, el delta y un enlace directo al protocolo.",
    date: "Fecha",
    tournamentStage: "Torneo y fase",
    opponent: "Rival",
    score: "Marcador de reconocimiento",
    ratingBefore: "Clasificación previa",
    expected: "Expectativa E",
    delta: "Delta",
    ratingAfter: "Clasificación posterior",
    protocol: "Protocolo",
    win: "Victoria",
    loss: "Derrota",
    draw: "Empate",
    proofLink: "Prueba →"
  },
  rules: {
    kicker: "Código y matemáticas del torneo",
    edition: "Edición del reglamento · plantel de 50 héroes · 16 por copa · 6 dominios",
    title: "Reglas de la disputa intelectual, votación del público y fuentes",
    lead: "En el Torneo de Héroes no hay daño físico ni pelea: el certamen es una disputa pública, donde los participantes presionan con dominantes y sostienen la posición con apelaciones.",
    s1Title: "1. Plantel de 50 héroes, temas y habilidades",
    s1Lead: "El plantel reúne 50 héroes de dominio público; cada copa sortea 16 participantes por semilla determinista (Sorteo abierto o tema: Mito y bylina, Camino y mar, Pícaros, Argumento directo). Cada héroe tiene 10 habilidades de autor:",
    s1Dom: "5 dominantes — tesis con las que el héroe presiona. Características: Agudeza (30–90) y Profundidad (30–90).",
    s1App: "5 apelaciones — respuestas a las que el héroe recurre para defender la posición. Características: Firmeza (30–90) e Ingenio (30–90).",
    s1Day: "El día de la disputa se abren 2 dominantes y 2 apelaciones de cada héroe. El tercer par se sortea enseguida y queda lacrado: solo se abre si el reconocimiento queda empatado en la eliminatoria.",
    s2Title: "2. El anillo de los seis dominios",
    s2Lead:
      "Los dominios forman un anillo: cada uno vence al siguiente de la cadena (multiplicador ×1.2) y cede ante el anterior (multiplicador ×0.8). En el resto de combinaciones el coeficiente es ×1.0.",
    s3Title: "3. Fórmula de un intercambio e instantánea de votos",
    s3Lead:
      "La serie principal tiene cuatro intercambios: A1→B1, B1→A1, A2→B2, B2→A2. Antes del anuncio del día, cada espectador puede emitir una papeleta por encuentro (presupuesto 6 puntos, peso previo 24, tope +3 por característica dentro de 30–90). El plantel base nunca muta.",
    formula:
      "press = agudeza * (0.7 + 0.3 * profundidad / 100) * affinity\nhold  = firmeza * (0.7 + 0.3 * ingenio / 100)\nreconocimiento = max(0, round(press * j - hold))\nretención = round(min(press * j, hold))",
    s3Note:
      "El multiplicador j está entre 0.95 y 1.05 y se calcula de forma determinista a partir de la semilla de la disputa y del número de intercambio. El marcador es la suma del reconocimiento de los intercambios propios. La retención muestra cuánta presión contuvo la apelación: no se resta otra vez del marcador. Mide la calidad de la defensa y desempata en el grupo.",
    s4Title: "4. Fase de grupos y eliminatoria sin empates",
    s4Lead:
      "En el grupo, la victoria vale 3 puntos, el empate 1 y la derrota 0. Si hay igualdad de puntos, los puestos se deciden en este orden:",
    s4b1: "Enfrentamientos directos entre los empatados (puntos y luego diferencia de reconocimiento)",
    s4b2: "Diferencia global de reconocimiento en el grupo",
    s4b3: "Suma del reconocimiento anotado",
    s4b4: "Suma de la retención",
    s4b5: "Elo al inicio de la copa y, después, el sorteo de la semilla",
    s4Playoff:
      "En la eliminatoria (cuadro 1A–2B, 1B–2A, 1C–2D, 1D–2C), si hay empate se abre el 3.er par lacrado. Si sigue igual, se juega una serie de 5 argumentos decisivos (reconocimiento ≥ 12: el argumento es aceptado). Si todo queda igual, decide un Sorteo de la Gloria determinista y justo.",
    s5Title: "5. Clasificación Elo y pruebas",
    s5Lead:
      "Todos los héroes empiezan la historia con 1500 puntos, antes de la primera copa. La clasificación no entra en la fórmula del intercambio (el favorito puede caer por un reparto adverso de dominios), pero determina los bombos del siguiente torneo.",
    eloFormula: "E_A = 1 / (1 + 10 ^ ((R_B - R_A) / 400))\ndelta = round(K * (S - E))",
    s5Note:
      "S vale 1 (victoria), 0.5 (empate en el grupo) o 0 (derrota). Importancia de la fase: K = 20 en el grupo, K = 28 en cuartos y semifinales, K = 36 en la final. Cada delta se redondea a un entero por separado, así que en ciertos umbrales impares la suma de los dos deltas puede alejarse de cero en ±1 punto. Todos los eventos quedan en el libro abierto y se pueden recomprobar desde cero.",
    s6Title: "6. Fuentes de dominio público, propuestas y exclusión de apuestas",
    s6Lead:
      "Los 50 héroes proceden exclusivamente del mito, el folclore y la literatura clásica de dominio público (Homero, las Eddas, bylinas eslavas, Las mil y una noches, Shakespeare, Cervantes, Dumas, Goethe, Beaumarchais, Swift, Poe, Austen, Verne, Carroll, Luo Guanzhong, Wu Cheng'en). No se emplean imágenes de estudios ni cómics, sino monogramas SVG propios y textos originales.",
    s6PublicDomain:
      "El resumen analítico del protocolo se genera a partir de los números del intercambio y los dominios sin citar traducciones protegidas.",
    s6Submissions:
      "Las propuestas de nuevos héroes o habilidades se desbloquean al alcanzar el umbral de reputación (1 por temporada), pasan por moderación obligatoria y exigen confirmación de dominio público y licencia no exclusiva al proyecto.",
    s6NoBetting:
      "El portal no acepta apuestas de dinero sobre el resultado ni entrega premios en metálico. El apoyo a un lado opera solo dentro del presupuesto fijo del encuentro (BUDGET = 6, PRIOR = 24, tope +3 por característica) y no multiplica la reputación."
  },
  themes: {
    open: "Sorteo abierto (los 50 héroes)",
    myth_bylina: "Tema: Mito y bylina",
    road_sea: "Tema: Camino y mar",
    tricksters: "Tema: Pícaros y enigmas",
    direct_argument: "Tema: Argumento directo"
  },
  voting: {
    sectionTitle: "Votación del público antes de abrir la jornada",
    sectionSubtitle:
      "Mientras se conoce el cruce y la disputa sigue «En el calendario», cada espectador puede enviar una papeleta a una característica de habilidad. A las 12:00 (Europe/Moscow) se cierra la ventana y se congela la instantánea.",
    openWindowBadge: "Ventana de voto abierta",
    frozenBadge: "Instantánea congelada",
    budgetFormula: "Fórmula del público: share = W / (W_match + 24) · raw = 6 × share · tope +3 (30..90)",
    chooseSide: "1. Lado de la disputa",
    chooseSkill: "2. Habilidad del héroe",
    chooseStat: "3. Característica",
    statPrimary: "Primaria (Agudeza / Firmeza)",
    statSecondary: "Secundaria (Profundidad / Ingenio)",
    submitVote: "Guardar papeleta en la instantánea",
    savedNotice: "Papeleta registrada. Puedes cambiarla hasta el anuncio de habilidades.",
    signInPrompt: "Inicia sesión en el Gabinete (Telegram / Google / VK ID) para votar y sumar reputación.",
    noShiftsYet: "No se registraron votos del público para esta disputa (estadísticas base del plantel).",
    crowdShifted: "El público desplazó estas características antes del inicio:",
    bonusBadge: "+{bonus} caract.",
    shareNote: "peso {weight} · cuota {share}"
  },
  cabinet: {
    kicker: "Gabinete del espectador y padrino",
    title: "Acceso OAuth, papeletas, reputación y propuesta de temporada",
    subtitle:
      "Una sola cuenta vincula Telegram, Google (YouTube) y VK ID. Cada victoria del lado elegido otorga +1 punto de reputación sin importar el peso del voto.",
    oauthTitle: "Acceso y vinculación de perfiles sociales (OAuth)",
    oauthLead:
      "Instagram y TikTok funcionan como escaparates de vídeo corto y carteles del día, mientras que el acceso contra bots usa Telegram Login, Google y VK ID.",
    connectTelegram: "Entrar / vincular Telegram",
    connectGoogle: "Entrar / vincular Google",
    connectVk: "Entrar / vincular VK ID",
    logout: "Cerrar sesión",
    linkedProviders: "Accesos vinculados",
    statsReputation: "Reputación",
    statsWins: "Lados ganadores",
    statsVotes: "Papeletas",
    statsStreak: "Racha (máx.: {best})",
    achievementsTitle: "Logros de padrino",
    noAchievements: "Emite tu primera papeleta en una disputa abierta para desbloquear el primer logro.",
    achFirstBallot: "Primera Papeleta — participación en la preparación de una disputa",
    achFirstVictory: "Primer Acierto — tu héroe elegido ganó el encuentro",
    achStreak3: "Racha Triple — tres elecciones ganadoras seguidas",
    achOracle5: "Cinco Fallos — cinco protocolos cerrados a favor de tu lado",
    achPatronProposer: "Autor de Convocatoria — propuesta enviada a moderación",
    ballotsOpenTitle: "Papeletas abiertas (pendientes de cierre)",
    ballotsClosedTitle: "Papeletas cerradas y reputación otorgada",
    noBallots: "Todavía no hay papeletas registradas.",
    wonPoint: "+1 reputación (el lado ganó)",
    noPoint: "0 (ganó el otro lado o empate)",
    proposalTitle: "Propuesta de temporada: héroe o habilidad (umbral: {threshold} rep.)",
    proposalLead:
      "Una vez por temporada al alcanzar el umbral de reputación puedes proponer un héroe de dominio público o una habilidad para un héroe existente. La propuesta pasa por moderación y no altera la semilla en curso.",
    proposalLocked: "Suma {need} puntos más de reputación en disputas abiertas para desbloquear el formulario.",
    proposalKindHero: "Nuevo héroe (dominio público)",
    proposalKindSkill: "Nueva habilidad para un héroe existente",
    proposalNameLabel: "Nombre del héroe o título de la habilidad",
    proposalOriginLabel: "Fuente literaria / mítica y dominio",
    proposalDescLabel: "Epíteto y efecto retórico en la disputa",
    proposalAttestPd: "Confirmo que el personaje y su base argumental pertenecen al dominio público (sin imágenes de estudios)",
    proposalGrantLicense: "Concedo al proyecto una licencia gratuita y no exclusiva para usar el texto enviado",
    proposalSubmit: "Enviar propuesta a moderación",
    proposalPendingBadge: "En moderación · Temporada #{season}",
    leaderboardTitle: "Clasificación de padrinos por reputación"
  },
  channels: {
    dailyCardTitle: "Escaparate para Telegram, VK, Shorts y Reels",
    dailyCardLead:
      "Tarjeta lista con ambos emblemas y resumen del día para canales sociales y vídeo vertical.",
    downloadSvgCard: "Abrir cartel SVG del día (1080×1080) →",
    copyPostText: "Texto del anuncio para Telegram / VK",
    commentaryTitle: "Resumen analítico del protocolo",
    commentaryBadge: "Resumen por cifras del intercambio · sin citas protegidas"
  },
  dispute: {
    dayLine: "{stage} · Día {day} ({date})",
    closed: "Protocolo cerrado y certificado",
    announced: "Anuncio del día · El resultado se abre mañana",
    scheduled: "Disputa programada",
    sideA: "LADO A · {origin}",
    sideB: "LADO B · {origin}",
    waitingA: "A LA ESPERA DEL RIVAL (A)",
    waitingB: "A LA ESPERA DEL RIVAL (B)",
    acclaimSum: "suma de reconocimiento",
    retention: "Retención: {a} — {b}",
    resultTomorrow: "resultado mañana",
    onSchedule: "en el calendario",
    winner: "Victoria en la disputa: {name}",
    draw: "Reconocimiento igualado · Empate de grupo",
    opensTomorrow: "El resultado se abre mañana (00:00 Europe/Moscow)",
    drawnTitle: "Habilidades sorteadas (2 abiertas + 1 lacrada)",
    drawnSubtitle:
      "Las ranuras 1 y 2 entran en los cuatro intercambios principales. La ranura 3 está lacrada y solo se abre si hay empate en la eliminatoria.",
    sideKit: "Juego del lado {side} · {name}",
    sealOpened: "Ranura {side}3 · Lacre roto (prórroga eliminatoria)",
    sealClosed: "Ranura {side}3 · Reserva lacrada de la eliminatoria",
    openSlot: "Ranura abierta {side}{n}",
    sealedBody:
      "La habilidad se sorteó de forma determinista y permanece bajo lacre por si los cuatro intercambios terminan igualados.",
    openTomorrowTitle: "La disputa está abierta: el resultado llega mañana",
    waitingTitle: "La disputa espera su turno en el calendario",
    openTomorrowBody:
      "Las habilidades del encuentro de hoy ya están anunciadas y se pueden analizar. Según el reglamento, el cálculo de los cuatro intercambios y del Elo ocurre al cambiar el día (Europe/Moscow).",
    waitingBody:
      "Esta disputa está fijada para el {date}. El día del encuentro el portal abrirá dos pares de habilidades de cada participante.",
    mainTitle: "Serie principal: cuatro intercambios",
    mainSubtitle:
      "1) Dominante A1 — Apelación B1 · 2) Dominante B1 — Apelación A1 · 3) Dominante A2 — Apelación B2 · 4) Dominante B2 — Apelación A2",
    affinityWin: "El dominio vence (×1.2)",
    affinityLose: "El dominio cede (×0.8)",
    affinityEven: "Dominios neutros (×1.0)",
    exchange: "Intercambio #{step} · Dominante {attack} → Apelación {defend}",
    versusHold: "{affinity} · j = {jitter} · press·j = {press} contra hold = {hold}",
    dominantOf: "Dominante ({name})",
    appealOf: "Apelación ({name})",
    acclaimOf: "Reconocimiento ({name}):",
    retentionOf: "Retención ({name}):",
    sealedTitle: "Se rompe el lacre: el tercer par de habilidades (prórroga)",
    sealedSubtitle:
      "Tras cuatro intercambios el reconocimiento quedó igualado. Se abrieron las ranuras lacradas A3 y B3.",
    extraExchange: "Intercambio extra #{step} (par lacrado) · {attack} → {defend}",
    acclaim: "Reconocimiento:",
    retentionPlain: "Retención:",
    decisiveTitle: "Serie de argumentos decisivos ({a} : {b})",
    decisiveSubtitle:
      "Un reconocimiento ≥ 12 significa que el tribunal aceptó el argumento; si no, la apelación sostuvo la línea.",
    decisiveBadge: "Argumento decisivo #{n} · {attack} contra {defend}",
    accepted: "ARGUMENTO ACEPTADO",
    held: "SOSTENIDO",
    gloryLabel: "Sorteo de la Gloria",
    gloryBody:
      "Tras un empate total de la serie, el sorteo justo de la semilla dio la victoria al lado {side} ({name}).",
    eloTitle: "Prueba del recálculo Elo al cierre de la disputa",
    eloSubtitle:
      "Coeficiente de fase K = {k}. La expectativa E se calcula con la fórmula clásica de Elo antes del intercambio.",
    eloDelta: "{delta} Elo",
    ratingBefore: "Clasificación previa",
    expected: "Expectativa E",
    outcome: "Resultado S",
    ratingAfter: "Clasificación posterior"
  },
  domainBeats: "vence al dominio «{name}»",
  domains: {
    reason: { title: "Razón", rule: "La Razón apaga la Palabra con una revisión estricta de las premisas" },
    word: { title: "Palabra", rule: "La Palabra intercepta el Corazón con una imagen y un tono precisos" },
    heart: { title: "Corazón", rule: "El Corazón ablanda la Voluntad con compasión y verdad humana" },
    will: { title: "Voluntad", rule: "La Voluntad sobrevive a la Suerte con resistencia a larga distancia" },
    luck: { title: "Suerte", rule: "La Suerte quiebra un Honor demasiado recto con un giro inesperado" },
    honor: {
      title: "Honor",
      rule: "El Honor no discute con la Razón astuta: plantea una pregunta directa de deber"
    }
  }
};
