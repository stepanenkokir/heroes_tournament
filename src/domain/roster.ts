import type { DomainId, HeroDefinition, HeroSkill } from "./types";

interface CompactSkillSpec {
  title: string;
  description: string;
  domain: DomainId;
  primary: number;
  secondary: number;
}

interface CompactHeroSpec {
  id: string;
  slug: string;
  name: string;
  origin: string;
  epithet: string;
  emblemKey: string;
  accentHex: string;
  dominants: [
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec
  ];
  appeals: [
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec,
    CompactSkillSpec
  ];
}

function expandHero(spec: CompactHeroSpec): HeroDefinition {
  const dominants: HeroSkill[] = spec.dominants.map((s, idx) => ({
    id: `${spec.id}:dom:${idx + 1}`,
    heroId: spec.id,
    kind: "dominant",
    slot: idx + 1,
    title: s.title,
    description: s.description,
    domain: s.domain,
    primaryStat: s.primary,
    secondaryStat: s.secondary
  }));

  const appeals: HeroSkill[] = spec.appeals.map((s, idx) => ({
    id: `${spec.id}:app:${idx + 1}`,
    heroId: spec.id,
    kind: "appeal",
    slot: idx + 1,
    title: s.title,
    description: s.description,
    domain: s.domain,
    primaryStat: s.primary,
    secondaryStat: s.secondary
  }));

  return {
    id: spec.id,
    slug: spec.slug,
    name: spec.name,
    origin: spec.origin,
    epithet: spec.epithet,
    emblemKey: spec.emblemKey,
    accentHex: spec.accentHex,
    dominants,
    appeals
  };
}

const COMPACT_ROSTER: readonly CompactHeroSpec[] = [
  {
    id: "odysseus",
    slug: "odysseus",
    name: "Одиссей",
    origin: "Гомеровский эпос",
    epithet: "Многоумный кормчий Итаки",
    emblemKey: "trireme",
    accentHex: "#9e3b24",
    dominants: [
      {
        title: "Троянский силлогизм",
        description: "Прячет главный тезис внутри уступки, которую оппонент сам принимает в дар.",
        domain: "reason",
        primary: 84,
        secondary: 88
      },
      {
        title: "Имя «Никто»",
        description: "Размывает позицию субъекта так, что обвинение теряет адресата.",
        domain: "word",
        primary: 80,
        secondary: 82
      },
      {
        title: "Лук женихов",
        description: "Выдвигает критерий проверки, который под силу выполнить только автору тезиса.",
        domain: "will",
        primary: 78,
        secondary: 76
      },
      {
        title: "Попутный расчёт ветров",
        description: "Превращает случайную оговорку собеседника в главный курс диспута.",
        domain: "luck",
        primary: 74,
        secondary: 79
      },
      {
        title: "Долг возвращения",
        description: "Ставит конечную цель выше любых промежуточных соблазнов.",
        domain: "honor",
        primary: 72,
        secondary: 74
      }
    ],
    appeals: [
      {
        title: "Воск и канат у мачты",
        description: "Заранее связывает собственные слабости процедурным ограничением.",
        domain: "reason",
        primary: 64,
        secondary: 82
      },
      {
        title: "Память о доме",
        description: "Отводит отвлечённую риторику к простым вещам, ради которых ведётся спор.",
        domain: "heart",
        primary: 60,
        secondary: 76
      },
      {
        title: "Десятилетний шторм",
        description: "Показывает, что затянутое давление лишь закаляет исходный аргумент.",
        domain: "will",
        primary: 62,
        secondary: 74
      },
      {
        title: "Плот калипсо",
        description: "Собирает устойчивый ответ из обломков только что разбитой посылки.",
        domain: "luck",
        primary: 56,
        secondary: 80
      },
      {
        title: "Рассказ у алкиноя",
        description: "Переводит сухую претензию в притчу, где слушатели сами оправдывают путника.",
        domain: "word",
        primary: 58,
        secondary: 78
      }
    ]
  },
  {
    id: "sherlock-holmes",
    slug: "sherlock-holmes",
    name: "Шерлок Холмс",
    origin: "Хроники Бейкер-стрит",
    epithet: "Аналитик остаточных улик",
    emblemKey: "lens",
    accentHex: "#235763",
    dominants: [
      {
        title: "Отсечение невозможного",
        description: "Последовательно закрывает альтернативы, оставляя одну неудобную истину.",
        domain: "reason",
        primary: 88,
        secondary: 90
      },
      {
        title: "Пепел на обшлаге",
        description: "Выводит глобальное противоречие из крошечной детали в речи визави.",
        domain: "reason",
        primary: 82,
        secondary: 86
      },
      {
        title: "Молчаливая собака ночи",
        description: "Указывает на довод, который оппонент обязан был привести, но обошёл стороной.",
        domain: "word",
        primary: 79,
        secondary: 84
      },
      {
        title: "Холодный эксперимент",
        description: "Требует немедленной проверки красивой гипотезы на фактах.",
        domain: "will",
        primary: 75,
        secondary: 78
      },
      {
        title: "Цена репутации",
        description: "Напоминает о безупречной точности прежних разборов.",
        domain: "honor",
        primary: 71,
        secondary: 72
      }
    ],
    appeals: [
      {
        title: "Чертоги разума",
        description: "Отсекает эмоциональный шум, оставляя на столе только проверяемые суждения.",
        domain: "reason",
        primary: 66,
        secondary: 86
      },
      {
        title: "Скрипичная пауза",
        description: "Сбивает темп чужого натиска парадоксальным переключением регистра.",
        domain: "word",
        primary: 59,
        secondary: 80
      },
      {
        title: "Преждевременность выводов",
        description: "Отказывается признавать тезис, пока не предъявлены все звенья цепи.",
        domain: "will",
        primary: 61,
        secondary: 75
      },
      {
        title: "Заступничество за невиновного",
        description: "Вскрывает человеческую несправедливость за формально гладким обвинением.",
        domain: "heart",
        primary: 55,
        secondary: 72
      },
      {
        title: "Счастливая оплошность противника",
        description: "Ловит момент, когда чужой напор сам выдаёт недостающее звено.",
        domain: "luck",
        primary: 57,
        secondary: 78
      }
    ]
  },
  {
    id: "heracles",
    slug: "heracles",
    name: "Геракл",
    origin: "Эллинские мифы",
    epithet: "Укротитель двенадцати непреодолимостей",
    emblemKey: "lion",
    accentHex: "#a84c20",
    dominants: [
      {
        title: "Свод на собственных плечах",
        description: "Берёт на себя самую тяжёлую предпосылку спора и выдерживает её вес.",
        domain: "will",
        primary: 87,
        secondary: 82
      },
      {
        title: "Русло Алфея",
        description: "Вместо мелких возражений направляет весь поток фактов сквозь шаткие построения.",
        domain: "reason",
        primary: 78,
        secondary: 75
      },
      {
        title: "Узел Немейского довода",
        description: "Сжимает витиеватую риторику соперника до прямого вопроса «да или нет».",
        domain: "will",
        primary: 82,
        secondary: 76
      },
      {
        title: "Клятва у развилки",
        description: "Противопоставляет лёгкому пути трудный, но безупречный выбор.",
        domain: "honor",
        primary: 79,
        secondary: 80
      },
      {
        title: "Золотое яблоко Гесперид",
        description: "Приносит редкий аргумент оттуда, куда оппонент счёл невозможным дойти.",
        domain: "luck",
        primary: 73,
        secondary: 72
      }
    ],
    appeals: [
      {
        title: "Шкура неуязвимого смысла",
        description: "Гасит колкие частности за счёт монолитности главной мысли.",
        domain: "will",
        primary: 66,
        secondary: 72
      },
      {
        title: "Искупление трудом",
        description: "Признаёт былую шероховатость и перекрывает её двенадцатикратным делом.",
        domain: "honor",
        primary: 62,
        secondary: 76
      },
      {
        title: "Прижигание гидры",
        description: "Не даёт одному разбитому аргументу соперника размножиться на десять новых.",
        domain: "reason",
        primary: 59,
        secondary: 74
      },
      {
        title: "Побратимское плечо",
        description: "Апеллирует к солидарности тех, кто делит общий труд.",
        domain: "heart",
        primary: 57,
        secondary: 70
      },
      {
        title: "Медный треск Стимфала",
        description: "Разгоняет стаю мелких придирок одним звучным обобщением.",
        domain: "word",
        primary: 55,
        secondary: 68
      }
    ]
  },
  {
    id: "vasilisa",
    slug: "vasilisa",
    name: "Василиса Премудрая",
    origin: "Русские народные сказки",
    epithet: "Хранительница узорного смысла",
    emblemKey: "spindle",
    accentHex: "#8c3328",
    dominants: [
      {
        title: "Отбор зерна по зёрнышку",
        description: "Разбирает запутанную речь на чистые посылки и пустую шелуху до рассвета.",
        domain: "reason",
        primary: 83,
        secondary: 88
      },
      {
        title: "Живая притча на рукаве",
        description: "Разворачивает наглядную картину, в которой слабость чужого тезиса видна без слов.",
        domain: "word",
        primary: 81,
        secondary: 85
      },
      {
        title: "Тихий вопрос у порога",
        description: "Задаёт кроткий, но точный вопрос о совести и намерении говорящего.",
        domain: "heart",
        primary: 79,
        secondary: 84
      },
      {
        title: "Три невыполнимых урока",
        description: "Ставит перед оппонентом задачу на меру, точность и терпение.",
        domain: "will",
        primary: 76,
        secondary: 80
      },
      {
        title: "Благословение куколки",
        description: "Находит спасительную нить рассуждения там, где логика казалась заведённой в чащу.",
        domain: "luck",
        primary: 74,
        secondary: 82
      }
    ],
    appeals: [
      {
        title: "Тepпение ночной пряжи",
        description: "Пережидает бурный напор, связывая разрозненные реплики в ровное полотно.",
        domain: "will",
        primary: 62,
        secondary: 82
      },
      {
        title: "Доброе слово у очага",
        description: "Снимает враждебность спора, возвращая разговор к человеческому теплу.",
        domain: "heart",
        primary: 64,
        secondary: 84
      },
      {
        title: "Загадка с двойным дном",
        description: "Отвечает иносказанием, о которое притупляется прямолинейная критика.",
        domain: "word",
        primary: 60,
        secondary: 80
      },
      {
        title: "Строгий счёт меркам",
        description: "Проверяет соразмерность обвинения и доказательства.",
        domain: "reason",
        primary: 58,
        secondary: 78
      },
      {
        title: "Верность данному обету",
        description: "Держит слово даже тогда, когда формальная выгода зовёт отступить.",
        domain: "honor",
        primary: 57,
        secondary: 74
      }
    ]
  },
  {
    id: "don-quixote",
    slug: "don-quixote",
    name: "Дон Кихот",
    origin: "Роман о Ламанчском идальго",
    epithet: "Рыцарь возвышенного допущения",
    emblemKey: "windmill",
    accentHex: "#b04825",
    dominants: [
      {
        title: "Примат идеала над бытом",
        description: "Объявляет мелкий прагматизм оппонента слепотой перед великим замыслом.",
        domain: "honor",
        primary: 86,
        secondary: 88
      },
      {
        title: "Вызов великанам",
        description: "Видит за привычными механизмами крупную нравственную проблему и идёт на неё.",
        domain: "will",
        primary: 82,
        secondary: 80
      },
      {
        title: "Гимн Золотому веку",
        description: "Поднимает слог беседы на такую высоту, где расчётливая колкость звучит мелко.",
        domain: "word",
        primary: 79,
        secondary: 84
      },
      {
        title: "Бескорыстное заступничество",
        description: "Призывает судить о тезисе по милосердию к слабейшему.",
        domain: "heart",
        primary: 77,
        secondary: 82
      },
      {
        title: "Нечаянный триумф странника",
        description: "Искрений порыв оказывается точнее любого холодного расчёта.",
        domain: "luck",
        primary: 73,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Шлем Мамбрина",
        description: "Преображает внешнюю уязвимость своей позиции в символ высокой веры.",
        domain: "honor",
        primary: 65,
        secondary: 82
      },
      {
        title: "Чистота помыслов",
        description: "Обезоруживает сарказм абсолютной искренностью намерения.",
        domain: "heart",
        primary: 62,
        secondary: 80
      },
      {
        title: "Неутомимость Росинанта",
        description: "Продолжает защищать тезис после любых насмешек, не снижая достоинства.",
        domain: "will",
        primary: 60,
        secondary: 76
      },
      {
        title: "Пословица оруженосца",
        description: "В нужный миг опирается на простой житейский здравый смысл.",
        domain: "reason",
        primary: 55,
        secondary: 74
      },
      {
        title: "Рыцарский канон учтивости",
        description: "Удерживает спор в благородных берегах изящным оборотом.",
        domain: "word",
        primary: 57,
        secondary: 76
      }
    ]
  },
  {
    id: "alice",
    slug: "alice",
    name: "Алиса",
    origin: "Сказки Чудес и Зазеркалья",
    epithet: "Исследовательница инверсий и парадоксов",
    emblemKey: "chess-crown",
    accentHex: "#2c6472",
    dominants: [
      {
        title: "Детский вопрос к аксиоме",
        description: "Спрашивает «почему?», вскрывая условность правила, которым давит оппонент.",
        domain: "reason",
        primary: 82,
        secondary: 86
      },
      {
        title: "Инверсия Зазеркалья",
        description: "Выворачивает метафору соперника буквально, обнажая её внутренний абсурд.",
        domain: "word",
        primary: 84,
        secondary: 87
      },
      {
        title: "Смена масштаба",
        description: "То укрупняет деталь до исполина, то уменьшает громкий лозунг до пустяка.",
        domain: "luck",
        primary: 78,
        secondary: 82
      },
      {
        title: "Вы ведь всего лишь колода!",
        description: "Отказывается бояться напыщенного авторитета, возвращая спору здравую меру.",
        domain: "will",
        primary: 76,
        secondary: 79
      },
      {
        title: "Живое любопытство",
        description: "Искренним интересом ломает заготовленную оборонительную позу собеседника.",
        domain: "heart",
        primary: 73,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Улыбка без кота",
        description: "Оставляет в воздухе смысл ответа, уводя сам тезис из-под прямого удара.",
        domain: "word",
        primary: 62,
        secondary: 85
      },
      {
        title: "Здравый смысл среди безумия",
        description: "Спокойно напоминает о законах логики посреди софистического чаепития.",
        domain: "reason",
        primary: 61,
        secondary: 80
      },
      {
        title: "Счастливый шаг на восьмую горизонталь",
        description: "Неожиданным переходом превращает пешку аргумента в ферзя.",
        domain: "luck",
        primary: 59,
        secondary: 82
      },
      {
        title: "Вежливость воспитанной гостьи",
        description: "Гасит резкость диалога безукоризненным тоном.",
        domain: "honor",
        primary: 55,
        secondary: 74
      },
      {
        title: "Сочувствие Белому Рыцарю",
        description: "Принимает чужую странность с мягкой улыбкой, лишая спор злости.",
        domain: "heart",
        primary: 57,
        secondary: 76
      }
    ]
  },
  {
    id: "robin-hood",
    slug: "robin-hood",
    name: "Робин Гуд",
    origin: "Баллады Шервудского леса",
    epithet: "Вольный стрелок справедливости",
    emblemKey: "arrow",
    accentHex: "#2d6045",
    dominants: [
      {
        title: "Стрела в древко первой",
        description: "Берёт собственный аргумент соперника и попадает точнее в ту же самую мишень.",
        domain: "luck",
        primary: 85,
        secondary: 84
      },
      {
        title: "Суд зелёной дубравы",
        description: "Противопоставляет казённому формализму живую справедливость общего блага.",
        domain: "heart",
        primary: 80,
        secondary: 82
      },
      {
        title: "Острота шервудской баллады",
        description: "Одной крылатой строкой делает напыщенный довод смешным для зала.",
        domain: "word",
        primary: 78,
        secondary: 80
      },
      {
        title: "Передел весов",
        description: "Требует вернуть завышенному тезису ровно ту долю истины, которую он заслужил.",
        domain: "honor",
        primary: 76,
        secondary: 77
      },
      {
        title: "Засада на тракте",
        description: "Встречает чужой вывод ровно в том узком месте, где он не может свернуть.",
        domain: "reason",
        primary: 74,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Шаг в лесную тень",
        description: "Уходит от тяжеловесного нажима лёгкой сменой ракурса.",
        domain: "luck",
        primary: 62,
        secondary: 84
      },
      {
        title: "Голос вольного братства",
        description: "Показывает, что тезис разделяют простые люди, а не только книжники.",
        domain: "heart",
        primary: 61,
        secondary: 79
      },
      {
        title: "Кодекс вольного стрелка",
        description: "Не пользуется нечестной уловкой даже ради лёгкого балла.",
        domain: "honor",
        primary: 59,
        secondary: 75
      },
      {
        title: "Весёлый отклик рога",
        description: "Снимает напряжение раунда живой шуткой без потери сути.",
        domain: "word",
        primary: 57,
        secondary: 77
      },
      {
        title: "Дубовый посох у переправы",
        description: "Стоит на простом житейском факте, когда спор уходит в тонкости.",
        domain: "will",
        primary: 58,
        secondary: 72
      }
    ]
  },
  {
    id: "sun-wukong",
    slug: "sun-wukong",
    name: "Сунь Укун",
    origin: "Путешествие на Запад",
    epithet: "Мудрец, равный Небу в полемике",
    emblemKey: "staff-cloud",
    accentHex: "#b84424",
    dominants: [
      {
        title: "Семьдесят два обертона смысла",
        description: "Мгновенно меняет форму аргумента, находя лазейку в самой плотной защите.",
        domain: "luck",
        primary: 87,
        secondary: 88
      },
      {
        title: "Посох желаемой меры",
        description: "Делает довод то тонким, как игла, для анализа, то сокрушительным обобщением.",
        domain: "will",
        primary: 82,
        secondary: 83
      },
      {
        title: "Огненные зрачки истины",
        description: "Распознаёт подмену понятий под самым благообразным обликом.",
        domain: "reason",
        primary: 79,
        secondary: 82
      },
      {
        title: "Дерзкий смех на пиру",
        description: "Разрушает ложную торжественность чужой догмы озорным парадоксом.",
        domain: "word",
        primary: 77,
        secondary: 84
      },
      {
        title: "Страж странствующего учителя",
        description: "Защищает хрупкую нравственную правду от хищных софизмов.",
        domain: "honor",
        primary: 72,
        secondary: 74
      }
    ],
    appeals: [
      {
        title: "Кувырок на сто восемь тысяч ли",
        description: "Оказывается за пределами ловушки прежде, чем оппонент захлопнет силлогизм.",
        domain: "luck",
        primary: 64,
        secondary: 88
      },
      {
        title: "Закалка в восьмигранной печи",
        description: "Из самого жёсткого критического разбора выходит лишь яснее и твёрже.",
        domain: "will",
        primary: 62,
        secondary: 80
      },
      {
        title: "Горсть двойников-примеров",
        description: "На одно возражение выставляет сразу рой живых аналогий.",
        domain: "word",
        primary: 59,
        secondary: 82
      },
      {
        title: "Золотой обруч меры",
        description: "Вовремя сдерживает собственный азарт ради чистоты доказательства.",
        domain: "reason",
        primary: 56,
        secondary: 74
      },
      {
        title: "Преданность спутникам пути",
        description: "Напоминает, что спор — часть общего странствия к истине.",
        domain: "heart",
        primary: 55,
        secondary: 72
      }
    ]
  },
  {
    id: "king-arthur",
    slug: "king-arthur",
    name: "Король Артур",
    origin: "Легенды Круглого стола",
    epithet: "Хранитель равноправного круга",
    emblemKey: "round-table",
    accentHex: "#8f3c24",
    dominants: [
      {
        title: "Извлечение клинка из камня",
        description: "Поднимает неподъёмный общий вопрос легко и по праву призванного.",
        domain: "honor",
        primary: 86,
        secondary: 85
      },
      {
        title: "Закон Круглого стола",
        description: "Требует равной меры доказательств и для именитого, и для безвестного.",
        domain: "reason",
        primary: 79,
        secondary: 80
      },
      {
        title: "Призыв Камелота",
        description: "Объединяет разрозненные частные истины в стройный государственный замысел.",
        domain: "word",
        primary: 77,
        secondary: 79
      },
      {
        title: "Стояние при Бадоне",
        description: "Держит ключевой рубеж спора без единого шага назад.",
        domain: "will",
        primary: 81,
        secondary: 78
      },
      {
        title: "Милость государя",
        description: "Даёт сопернику сохранить лицо, одновременно забирая первенство в тезисе.",
        domain: "heart",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Ножны Экскалибура",
        description: "Берегут аргумент от потерь лучше любого встречного выпада.",
        domain: "honor",
        primary: 66,
        secondary: 82
      },
      {
        title: "Совет равных голосов",
        description: "Распределяет нагрузку возражения на целую традицию мысли.",
        domain: "reason",
        primary: 60,
        secondary: 78
      },
      {
        title: "Клятва верности королевству",
        description: "Ставит общее согласие выше личного тщеславия спорщика.",
        domain: "will",
        primary: 61,
        secondary: 75
      },
      {
        title: "Покои Авалона",
        description: "Спокойно откладывает преждевременный спор до созревания фактов.",
        domain: "heart",
        primary: 58,
        secondary: 74
      },
      {
        title: "Знамение Мерлина",
        description: "Оборачивает неожиданное обстоятельство в пользу долгого замысла.",
        domain: "luck",
        primary: 55,
        secondary: 72
      }
    ]
  },
  {
    id: "sindbad",
    slug: "sindbad",
    name: "Синдбад",
    origin: "Сказки тысячи и одной ночи",
    epithet: "Мореход семи невероятных странствий",
    emblemKey: "astrolabe",
    accentHex: "#205d68",
    dominants: [
      {
        title: "Свидетельство седьмого моря",
        description: "Опровергает кабинетную догму живым опытом дальних берегов.",
        domain: "luck",
        primary: 84,
        secondary: 85
      },
      {
        title: "Крыло птицы Рух",
        description: "Поднимается над локальным тупиком спора на высоту целой картины мира.",
        domain: "word",
        primary: 81,
        secondary: 84
      },
      {
        title: "Алмазы из ущелья",
        description: "Извлекает ценнейший довод со дна самой безнадёжной посылки.",
        domain: "reason",
        primary: 78,
        secondary: 81
      },
      {
        title: "Щедрость багдадского дома",
        description: "Располагает аудиторию открытостью и широтой взгляда.",
        domain: "heart",
        primary: 75,
        secondary: 79
      },
      {
        title: "Курс сквозь магнитную гору",
        description: "Ведёт мысль там, где чужие конструкции рассыпаются без гвоздей.",
        domain: "will",
        primary: 74,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Удача уцелевшего кормчего",
        description: "Находит доску спасения в самом крутом водовороте полемики.",
        domain: "luck",
        primary: 64,
        secondary: 86
      },
      {
        title: "Беседа двух Синдбадов",
        description: "Примиряет взгляд труженика и взгляд путешественника в одном ответе.",
        domain: "heart",
        primary: 60,
        secondary: 79
      },
      {
        title: "Уроки старого лоцмана",
        description: "Распознаёт обманчивую отмель до того, как спор сядет на мель.",
        domain: "reason",
        primary: 59,
        secondary: 78
      },
      {
        title: "Занимательный поворот рассказа",
        description: "Удерживает внимание судей, когда оппонент пытается навязать скуку.",
        domain: "word",
        primary: 61,
        secondary: 82
      },
      {
        title: "Купеческое слово",
        description: "Точно взвешивает обещанное и исполненное в каждой реплике.",
        domain: "honor",
        primary: 55,
        secondary: 72
      }
    ]
  },
  {
    id: "dartagnan",
    slug: "dartagnan",
    name: "д'Артаньян",
    origin: "Хроники королевских мушкетёров",
    epithet: "Гасконский клинок быстрой реплики",
    emblemKey: "rapier",
    accentHex: "#a23c26",
    dominants: [
      {
        title: "Туше в первой фразе",
        description: "Наносит точный риторический укол прежде, чем соперник развернёт преамбулу.",
        domain: "word",
        primary: 85,
        secondary: 83
      },
      {
        title: "Три встречи на один полдень",
        description: "Успевает ответить сразу на три линии критики и обратить их в союзники.",
        domain: "luck",
        primary: 82,
        secondary: 84
      },
      {
        title: "Один за всех",
        description: "Связывает частные аргументы круговой порукой так, что один усиливает все.",
        domain: "honor",
        primary: 80,
        secondary: 82
      },
      {
        title: "Гонка за подвесками",
        description: "Доводит доказательство до цели в срок, который казался немыслимым.",
        domain: "will",
        primary: 77,
        secondary: 78
      },
      {
        title: "Гасконское обаяние",
        description: "Завоёвывает симпатию зала смелой прямотой и живым темпераментом.",
        domain: "heart",
        primary: 75,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Парирование в терцию",
        description: "Отводит остриё чужой колкости едва заметным поворотом слова.",
        domain: "word",
        primary: 63,
        secondary: 84
      },
      {
        title: "Плащ и шляпа гвардейца",
        description: "Сохраняет достоинство и осанку под самым плотным градом упрёков.",
        domain: "honor",
        primary: 61,
        secondary: 78
      },
      {
        title: "Счастливый случай в трактире",
        description: "Превращает внезапную заминку в выигрышную диспозицию.",
        domain: "luck",
        primary: 60,
        secondary: 82
      },
      {
        title: "Хладнокровие бастиона Сен-Жерве",
        description: "Спокойно продолжает разбор тезиса под перекрёстным давлением.",
        domain: "will",
        primary: 59,
        secondary: 75
      },
      {
        title: "Совет рассудительного друга",
        description: "Опирается на трезвую логику там, где одной горячности мало.",
        domain: "reason",
        primary: 56,
        secondary: 74
      }
    ]
  },
  {
    id: "ilya-muromets",
    slug: "ilya-muromets",
    name: "Илья Муромец",
    origin: "Киевский былинный цикл",
    epithet: "Сторожевой богатырь прямоезжей правды",
    emblemKey: "oak-shield",
    accentHex: "#7c4724",
    dominants: [
      {
        title: "Прямоезжая дорога",
        description: "Отвергает окольные уловки и ставит главный вопрос лицом к лицу.",
        domain: "honor",
        primary: 87,
        secondary: 84
      },
      {
        title: "Тяга земная",
        description: "Опирает тезис на вековой здравый уклад, который не сдвинуть модной фразой.",
        domain: "will",
        primary: 85,
        secondary: 83
      },
      {
        title: "Укрощение посвиста",
        description: "Лишает оглушительную риторику соперника её пугающего шума.",
        domain: "reason",
        primary: 78,
        secondary: 77
      },
      {
        title: "Заступничество за сирых",
        description: "Проверяет каждую теорию тем, каково от неё простому человеку.",
        domain: "heart",
        primary: 79,
        secondary: 80
      },
      {
        title: "Веское былинное слово",
        description: "Говорит редко, но каждая фраза ложится как межевой камень.",
        domain: "word",
        primary: 74,
        secondary: 75
      }
    ],
    appeals: [
      {
        title: "Тридцать лет сосредоточения",
        description: "Не спешит с ответом, накапливая неопровержимую основательность.",
        domain: "will",
        primary: 67,
        secondary: 80
      },
      {
        title: "Богатырская застава",
        description: "Спокойно встречает любой напор на границе проверенных понятий.",
        domain: "honor",
        primary: 64,
        secondary: 78
      },
      {
        title: "Чаша странников",
        description: "Черпает свежесть мысли из простого человеческого участия.",
        domain: "heart",
        primary: 60,
        secondary: 76
      },
      {
        title: "Камень на распутье",
        description: "Заранее просчитывает цену каждого из трёх возможных решений.",
        domain: "reason",
        primary: 58,
        secondary: 74
      },
      {
        title: "Сказ без бахвальства",
        description: "Отвечает сдержанно и ровно, лишая критика повода придраться к тону.",
        domain: "word",
        primary: 56,
        secondary: 72
      }
    ]
  },
  {
    id: "elizabeth-bennet",
    slug: "elizabeth-bennet",
    name: "Элизабет Беннет",
    origin: "Хроники Хартфордшира",
    epithet: "Мастер тонкой иронии и самопересмотра",
    emblemKey: "quill",
    accentHex: "#8d3848",
    dominants: [
      {
        title: "Улыбка сквозь реверанс",
        description: "Безупречно учтивой фразой вскрывает спесь и логическую пустоту оппонента.",
        domain: "word",
        primary: 86,
        secondary: 89
      },
      {
        title: "Анатомия предубеждения",
        description: "Показывает, где суждение визави продиктовано сословной привычкой, а не разумом.",
        domain: "reason",
        primary: 82,
        secondary: 85
      },
      {
        title: "Отказ в танце и в уступке",
        description: "Твёрдо отклоняет покровительственный тон, требуя разговора на равных.",
        domain: "honor",
        primary: 79,
        secondary: 82
      },
      {
        title: "Живое участие к ближнему",
        description: "Улавливает подлинный мотив человека точнее сухих правил приличия.",
        domain: "heart",
        primary: 78,
        secondary: 84
      },
      {
        title: "Прогулка пешком по росе",
        description: "Предпочитает живую самостоятельность скованным условностям.",
        domain: "will",
        primary: 73,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Честность перед собственным письмом",
        description: "Способность самой первой уточнить свой тезис выбивает почву у критика.",
        domain: "reason",
        primary: 63,
        secondary: 86
      },
      {
        title: "Изящная самоирония",
        description: "Перехватывает колкость улыбкой, делая дальнейший выпад неуклюжим.",
        domain: "word",
        primary: 64,
        secondary: 85
      },
      {
        title: "Тепло родного круга",
        description: "Защищает человеческое достоинство от холодного снобизма.",
        domain: "heart",
        primary: 61,
        secondary: 80
      },
      {
        title: "Независимость суждения",
        description: "Не склоняется перед авторитетом титула и громкого тона.",
        domain: "will",
        primary: 59,
        secondary: 78
      },
      {
        title: "Счастливая перемена взгляда",
        description: "Находит согласие там, где вчера стояла стена непонимания.",
        domain: "luck",
        primary: 55,
        secondary: 74
      }
    ]
  },
  {
    id: "captain-nemo",
    slug: "captain-nemo",
    name: "Капитан Немо",
    origin: "Хроники «Наутилуса»",
    epithet: "Инженер морских глубин и независимости",
    emblemKey: "nautilus",
    accentHex: "#1e5162",
    dominants: [
      {
        title: "Подвижное в подвижной среде",
        description: "Строит динамическую модель вопроса, в которой застывшие догмы тонут.",
        domain: "reason",
        primary: 87,
        secondary: 89
      },
      {
        title: "Глубина двадцати тысяч льё",
        description: "Погружает спор на уровень первопричин, куда поверхностная критика не доходит.",
        domain: "will",
        primary: 83,
        secondary: 84
      },
      {
        title: "Приговор произволу",
        description: "Неумолимо обличает злоупотребление силой и неправоту угнетения.",
        domain: "honor",
        primary: 78,
        secondary: 80
      },
      {
        title: "Жемчужина тайного грота",
        description: "Предъявляет редчайший научный факт, меняющий всю расстановку сил.",
        domain: "luck",
        primary: 74,
        secondary: 78
      },
      {
        title: "Органная фуга под толщей вод",
        description: "Сочетает математическую строгость с трагической глубиной чувства.",
        domain: "heart",
        primary: 74,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Двойная обшивка «Наутилуса»",
        description: "Выдерживает внешнее давление за счёт точного инженерного расчёта.",
        domain: "reason",
        primary: 66,
        secondary: 84
      },
      {
        title: "Автономия океана",
        description: "Не зависит от предрассудков суши и сиюминутной моды.",
        domain: "will",
        primary: 63,
        secondary: 80
      },
      {
        title: "Тайная помощь угнетённым",
        description: "Доказывает правоту не декларацией, а незримой поддержкой правого дела.",
        domain: "heart",
        primary: 58,
        secondary: 76
      },
      {
        title: "Подводный проход Суэца",
        description: "Находит скрытый канал связи между двумя, казалось бы, разделёнными областями.",
        domain: "luck",
        primary: 57,
        secondary: 78
      },
      {
        title: "Лаконизм бортового журнала",
        description: "Отвечает точными цифрами и координатами без лишних прилагательных.",
        domain: "word",
        primary: 56,
        secondary: 74
      }
    ]
  },
  {
    id: "thor",
    slug: "thor",
    name: "Тор",
    origin: "Старшая и Младшая Эдда",
    epithet: "Громовержец прямого довода",
    emblemKey: "mjolnir",
    accentHex: "#8c4220",
    dominants: [
      {
        title: "Возвратный удар Мьёльнира",
        description: "Тезис не только бьёт в цель, но и возвращается к автору ещё более веским.",
        domain: "will",
        primary: 86,
        secondary: 81
      },
      {
        title: "Гром над Мидгардом",
        description: "Прямое и честное слово, от которого рассыпаются туманные оговорки.",
        domain: "honor",
        primary: 83,
        secondary: 80
      },
      {
        title: "Испытание в Утгарде",
        description: "Даже столкнувшись с иллюзией, сдвигает саму основу мироздания.",
        domain: "will",
        primary: 80,
        secondary: 78
      },
      {
        title: "Вопросы до рассвета Альвиссу",
        description: "Удерживает собеседника серией предметных вопросов, пока не рассеется морок.",
        domain: "reason",
        primary: 76,
        secondary: 79
      },
      {
        title: "Добродушие защитника очагов",
        description: "За грозным голосом стоит искренняя забота о мире людей.",
        domain: "heart",
        primary: 74,
        secondary: 75
      }
    ],
    appeals: [
      {
        title: "Пояс удвоенной твёрдости",
        description: "Чем сильнее встречный нажим, тем плотнее становится защита тезиса.",
        domain: "will",
        primary: 66,
        secondary: 78
      },
      {
        title: "Железные рукавицы прямоты",
        description: "Берётся за самый раскалённый тезис соперника без боязни обжечься.",
        domain: "honor",
        primary: 63,
        secondary: 76
      },
      {
        title: "Улыбка над чашей моря",
        description: "Не смущается временной неудачей, если за ней виден масштаб задачи.",
        domain: "heart",
        primary: 58,
        secondary: 74
      },
      {
        title: "Жребий двух козлов",
        description: "Восстанавливает строй аргументов к следующему утру после любого спора.",
        domain: "luck",
        primary: 57,
        secondary: 75
      },
      {
        title: "Краткость северной саги",
        description: "Отсекает витиеватость одной ёмкой поговоркой.",
        domain: "word",
        primary: 55,
        secondary: 70
      }
    ]
  },
  {
    id: "cinderella",
    slug: "cinderella",
    name: "Золушка",
    origin: "Старинные европейские сказки",
    epithet: "Хранительница точной меры до полуночи",
    emblemKey: "slipper",
    accentHex: "#315f72",
    dominants: [
      {
        title: "Мерка хрустальной туфельки",
        description: "Предлагает критерий такой точности, что чужая натяжка не помещается ни на долю.",
        domain: "reason",
        primary: 84,
        secondary: 87
      },
      {
        title: "Кротость сильнее спеси",
        description: "Тихим достоинством выставляет напоказ несправедливость высокомерного тона.",
        domain: "heart",
        primary: 82,
        secondary: 86
      },
      {
        title: "Двенадцатый удар часов",
        description: "Снимает с пышной риторики соперника позолоту, возвращая её к настоящему виду.",
        domain: "luck",
        primary: 79,
        secondary: 83
      },
      {
        title: "Зола и чистое золото",
        description: "Показывает, что за скромной формой скрывается самая прочная суть.",
        domain: "honor",
        primary: 76,
        secondary: 80
      },
      {
        title: "Беседа с неузнанной гостьей",
        description: "Заставляет судить о мысли по её грации, а не по внешнему званию.",
        domain: "word",
        primary: 75,
        secondary: 81
      }
    ],
    appeals: [
      {
        title: "Достоинство у холодного очага",
        description: "Ни один несправедливый упрёк не способен ожесточить или сбить тон ответа.",
        domain: "heart",
        primary: 65,
        secondary: 84
      },
      {
        title: "Вторая туфелька в кармане",
        description: "В решающий момент предъявляет парное доказательство, снимающее все сомнения.",
        domain: "luck",
        primary: 62,
        secondary: 85
      },
      {
        title: "Уход за минуту до полуночи",
        description: "Вовремя завершает тезис на вершине убедительности, не затягивая речь.",
        domain: "reason",
        primary: 60,
        secondary: 80
      },
      {
        title: "Трудолюбие без жалоб",
        description: "Спокойно выполняет всю черновую работу доказательства.",
        domain: "will",
        primary: 59,
        secondary: 77
      },
      {
        title: "Великодушие к сёстрам",
        description: "Побеждая в споре, не унижает побеждённую сторону.",
        domain: "honor",
        primary: 58,
        secondary: 76
      }
    ]
  }
];

export const HERO_ROSTER: readonly HeroDefinition[] = COMPACT_ROSTER.map(expandHero);

export const HERO_BY_ID: ReadonlyMap<string, HeroDefinition> = new Map(
  HERO_ROSTER.map((h) => [h.id, h])
);

export const HERO_BY_SLUG: ReadonlyMap<string, HeroDefinition> = new Map(
  HERO_ROSTER.map((h) => [h.slug, h])
);
