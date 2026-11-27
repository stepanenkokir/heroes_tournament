import type { ExtraHeroSpec } from "./roster-extra-1";

export const EXTRA_ROSTER_PART_2: readonly ExtraHeroSpec[] = [
  {
    id: "scheherazade",
    slug: "scheherazade",
    name: "Шахерезада",
    origin: "Сказки тысячи и одной ночи",
    epithet: "Хранительница рассветной паузы и тысячи узлов",
    emblemKey: "scroll-lamp",
    accentHex: "#9b3d62",
    corpora: ["arab"],
    motifs: ["trickster", "reason", "will"],
    dominants: [
      {
        title: "Обрыв речи на самом рассвете",
        description: "Останавливает доказательство в точке наивысшего интереса, заставляя судью самому требовать продолжения.",
        domain: "word",
        primary: 88,
        secondary: 89
      },
      {
        title: "Рассказ внутри рассказа",
        description: "Вкладывает частный довод в три концентрических примера, так что опровергнуть один значит подтвердить следующий.",
        domain: "reason",
        primary: 84,
        secondary: 86
      },
      {
        title: "Исцеление ожесточённого ума",
        description: "Шаг за шагом заменяет предвзятую подозрительность оппонента живым соучастием.",
        domain: "heart",
        primary: 81,
        secondary: 84
      },
      {
        title: "Тысяча и одна ночь выдержки",
        description: "Ведёт долгую линию мысли без единого срыва интонации под смертельным давлением.",
        domain: "will",
        primary: 78,
        secondary: 82
      },
      {
        title: "Добровольный выход за сестёр",
        description: "Берёт слово не ради тщеславия, а ради защиты всех, кого затронет решение.",
        domain: "honor",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Но это ещё не диковина...",
        description: "Мягко переводит удар критики на более широкий и удивительный случай.",
        domain: "word",
        primary: 66,
        secondary: 86
      },
      {
        title: "Память ста хроник и поэтов",
        description: "Находит в сокровищнице преданий точный прецедент на любое возражение.",
        domain: "reason",
        primary: 64,
        secondary: 83
      },
      {
        title: "Сочувствие младшей Дуньязады",
        description: "Вовремя поданная реплика возвращает беседе живой человеческий отклик.",
        domain: "heart",
        primary: 62,
        secondary: 81
      },
      {
        title: "Светильник, не гаснущий до утра",
        description: "Сохраняет собранность и ровный голос на протяжении всей серии обменов.",
        domain: "will",
        primary: 60,
        secondary: 79
      },
      {
        title: "Счастливый поворот судьбы",
        description: "Находит спасительную развязку в самом тесном переплетении обстоятельств.",
        domain: "luck",
        primary: 58,
        secondary: 78
      }
    ]
  },
  {
    id: "nasreddin",
    slug: "nasreddin",
    name: "Ходжа Насреддин",
    origin: "Восточные притчи и анекдоты",
    epithet: "Возмутитель спокойствия и судья над судьями",
    emblemKey: "donkey-lantern",
    accentHex: "#b56a21",
    corpora: ["arab"],
    motifs: ["trickster", "voyage", "reason"],
    dominants: [
      {
        title: "Плата звоном за запах плова",
        description: "Отвечает на мнимую претензию столь же невесомым, но безупречно симметричным расчётом.",
        domain: "reason",
        primary: 86,
        secondary: 88
      },
      {
        title: "И ты прав, и жена права",
        description: "Соглашается со всеми сторонами сразу, обнажая скрытое противоречие в самом вопросе.",
        domain: "word",
        primary: 84,
        secondary: 86
      },
      {
        title: "Поиск ключа под фонарём",
        description: "Показывает, что оппонент ищет ответ не там, где истина, а там, где ему удобнее спорить.",
        domain: "luck",
        primary: 81,
        secondary: 84
      },
      {
        title: "Смех базарной площади",
        description: "Одним живым сравнением лишает напыщенный приговор всякой грозности.",
        domain: "heart",
        primary: 78,
        secondary: 80
      },
      {
        title: "Срок обучения эмирского осла",
        description: "Переигрывает самоуверенную власть долгим горизонтом времени.",
        domain: "will",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Халат, которому подают плов",
        description: "Отделяет уважение к сути дела от поклонения внешней должности.",
        domain: "honor",
        primary: 63,
        secondary: 81
      },
      {
        title: "Езда лицом к хвосту",
        description: "Оправдывает нестандартный порядок посылок тем, что так виднее оба края спора.",
        domain: "luck",
        primary: 65,
        secondary: 85
      },
      {
        title: "Мудрость под маской простака",
        description: "Пропускает мимо ушей высокомерие и бьёт точно в логическую суть.",
        domain: "reason",
        primary: 64,
        secondary: 83
      },
      {
        title: "Короткая притча в чайхане",
        description: "Переводит сложную отвлечённость на язык понятной каждому житейской правды.",
        domain: "word",
        primary: 62,
        secondary: 82
      },
      {
        title: "Доброта к маленькому человеку",
        description: "Никогда не обращает остроумие против того, кто и без того стеснён.",
        domain: "heart",
        primary: 60,
        secondary: 79
      }
    ]
  },
  {
    id: "aladdin",
    slug: "aladdin",
    name: "Аладдин",
    origin: "Сказки тысячи и одной ночи",
    epithet: "Искатель сокровенного света под медной крышкой",
    emblemKey: "magic-lamp",
    accentHex: "#a35229",
    corpora: ["arab"],
    motifs: ["trickster", "voyage"],
    dominants: [
      {
        title: "Свет из потёртой меди",
        description: "Извлекает сокрушительный по масштабу аргумент из самого неприметного наблюдения.",
        domain: "luck",
        primary: 85,
        secondary: 86
      },
      {
        title: "Дворец за одну ночь",
        description: "Разворачивает перед судьями законченную картину доказательства там, где вчера было пустое место.",
        domain: "will",
        primary: 81,
        secondary: 82
      },
      {
        title: "Новые лампы взамен старых!",
        description: "Распознаёт и обращает против соперника его собственную попытку неравноценного обмена.",
        domain: "reason",
        primary: 79,
        secondary: 83
      },
      {
        title: "Двадцать четвёртое окно",
        description: "Оставляет одну деталь незавершённой, чтобы показать тщетность чужого подражания.",
        domain: "word",
        primary: 77,
        secondary: 80
      },
      {
        title: "Щедрость вчерашнего бедняка",
        description: "Делится плодами победы со всем залом, располагая слушателей к своему тезису.",
        domain: "heart",
        primary: 74,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Кольцо магрибинца на пальце",
        description: "В минуту, когда главный довод перехвачен, выручает малый запасной аргумент.",
        domain: "luck",
        primary: 65,
        secondary: 85
      },
      {
        title: "Каменные плоды подземного сада",
        description: "То, что казалось тяжёлым грузом по дороге, оказывается драгоценным подтверждением в финале.",
        domain: "reason",
        primary: 62,
        secondary: 81
      },
      {
        title: "Верность слову перед султаном",
        description: "Выполняет каждое заявленное условие в точности и без утайки.",
        domain: "honor",
        primary: 60,
        secondary: 78
      },
      {
        title: "Союз с Бадр аль-Будур",
        description: "Сочетает уличную находчивость с тонким придворным тактом.",
        domain: "heart",
        primary: 61,
        secondary: 79
      },
      {
        title: "Упрямство под заваленным сводом",
        description: "Не складывает рук даже в полной темноте без видимого выхода.",
        domain: "will",
        primary: 59,
        secondary: 77
      }
    ]
  },
  {
    id: "anansi",
    slug: "anansi",
    name: "Ананси",
    origin: "Западноафриканские сказания",
    epithet: "Хранитель короба всех историй мира",
    emblemKey: "web",
    accentHex: "#8a5a1e",
    corpora: ["east"],
    motifs: ["trickster", "reason"],
    dominants: [
      {
        title: "Выкуп за короб историй",
        description: "Берёт неподъёмную цену доказательства и платит её не силой, а точным знанием повадок.",
        domain: "reason",
        primary: 85,
        secondary: 87
      },
      {
        title: "Мерка из бамбуковой жерди",
        description: "Приглашает длинный и грозный тезис соперника самому вытянуться вдоль линейки и связать себя.",
        domain: "word",
        primary: 84,
        secondary: 86
      },
      {
        title: "Тыква с дождевым ливнем",
        description: "Сгоняет рой мелких придирок в одно место одним искусным приёмом.",
        domain: "luck",
        primary: 81,
        secondary: 83
      },
      {
        title: "Восемь тонких нитей",
        description: "Связывает разрозненные реплики оппонента в единую сеть противоречий.",
        domain: "will",
        primary: 76,
        secondary: 79
      },
      {
        title: "История принадлежит всем",
        description: "Превращает закрытое знание элиты в общее достояние слушателей.",
        domain: "heart",
        primary: 74,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Шаг по невидимой паутине",
        description: "Удерживает равновесие там, где тяжёлый аргумент проваливается в пустоту.",
        domain: "luck",
        primary: 64,
        secondary: 85
      },
      {
        title: "Разговор с леопардом у ямы",
        description: "Выходит из опасного соседства за счёт безупречно вежливой логики.",
        domain: "word",
        primary: 63,
        secondary: 83
      },
      {
        title: "Шестеро умелых сыновей",
        description: "В трудный миг передаёт эстафету защиты соседнему приёму из той же семьи.",
        domain: "heart",
        primary: 61,
        secondary: 79
      },
      {
        title: "Урок жадного горшка",
        description: "Самокритичной притчей опережает упрёк соперника и забирает мораль себе.",
        domain: "reason",
        primary: 60,
        secondary: 80
      },
      {
        title: "Слово перед небесным Ньяме",
        description: "Отчитывается перед высшим арбитром точным исполнением всех трёх заданий.",
        domain: "honor",
        primary: 58,
        secondary: 76
      }
    ]
  },
  {
    id: "zhu-bajie",
    slug: "zhu-bajie",
    name: "Чжу Бацзе",
    origin: "Путешествие на Запад",
    epithet: "Маршал Небесного Занавеса и земного здравого смысла",
    emblemKey: "rake",
    accentHex: "#9e5437",
    corpora: ["east"],
    motifs: ["voyage", "trickster"],
    dominants: [
      {
        title: "Девятизубые грабли",
        description: "Вспахивает цветистую риторику соперника до грубой и наглядной сути.",
        domain: "will",
        primary: 82,
        secondary: 80
      },
      {
        title: "А где же наш обед?",
        description: "Сбивает отвлечённый пафос простым вопросом о практической пользе тезиса.",
        domain: "reason",
        primary: 81,
        secondary: 83
      },
      {
        title: "Тридцать шесть житейских уловок",
        description: "Находит приземлённый, но удивительно рабочий обходной манёвр.",
        domain: "luck",
        primary: 80,
        secondary: 84
      },
      {
        title: "Самоходная жалоба с шуткой",
        description: "Заставляет зал смеяться, а оппонента — оправдываться за излишнюю строгость.",
        domain: "word",
        primary: 77,
        secondary: 79
      },
      {
        title: "Доброе сердце под ворчанием",
        description: "Сколько бы ни спорил о трудностях, в решающий час встаёт на защиту спутников.",
        domain: "heart",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Неспешный шаг с поклажей",
        description: "Тянет груз доказательства день за днём, не надрываясь на громких лозунгах.",
        domain: "will",
        primary: 64,
        secondary: 79
      },
      {
        title: "Отдых в тени под деревом",
        description: "Пережидает бурю чужого красноречия без малейшего ущерба для настроения.",
        domain: "luck",
        primary: 63,
        secondary: 83
      },
      {
        title: "Повинная голова с улыбкой",
        description: "Легко признаёт мелкую слабость, лишая обвинителя главного пафоса.",
        domain: "heart",
        primary: 62,
        secondary: 81
      },
      {
        title: "Старый чин речного флота",
        description: "В водной и зыбкой среде спора ориентируется лучше кабинетных мудрецов.",
        domain: "reason",
        primary: 60,
        secondary: 78
      },
      {
        title: "Не бросить посох в конце пути",
        description: "Доходит до западного предела наравне с самыми возвышенными умами.",
        domain: "honor",
        primary: 58,
        secondary: 75
      }
    ]
  },
  {
    id: "zhuge-liang",
    slug: "zhuge-liang",
    name: "Чжугэ Лян",
    origin: "Троецарствие",
    epithet: "Спящий Дракон веерного расчёта",
    emblemKey: "feather-fan",
    accentHex: "#2d5f6e",
    corpora: ["east"],
    motifs: ["reason", "honor"],
    dominants: [
      {
        title: "Стратегия пустого города",
        description: "Раскрывает ворота тезиса с таким спокойствием, что оппонент сам отступает, опасаясь засады.",
        domain: "reason",
        primary: 89,
        secondary: 90
      },
      {
        title: "Сто тысяч стрел на соломенных лодках",
        description: "Подставляет мнимую мишень и забирает весь запас возражений соперника в свой арсенал.",
        domain: "luck",
        primary: 84,
        secondary: 87
      },
      {
        title: "Призыв восточного ветра у Красной скалы",
        description: "Точно угадывает поворот настроения зала и направляет его в паруса своего вывода.",
        domain: "word",
        primary: 82,
        secondary: 84
      },
      {
        title: "Семь пленений и семь освобождений",
        description: "Побеждает соперника не подавлением, а тем, что тот сам внутренне признаёт правоту.",
        domain: "heart",
        primary: 79,
        secondary: 83
      },
      {
        title: "Доклад перед северным походом",
        description: "Ставит личный долг и безупречную отчётность выше собственной выгоды.",
        domain: "honor",
        primary: 78,
        secondary: 81
      }
    ],
    appeals: [
      {
        title: "План трёх частей из хижины",
        description: "Держит в уме всю карту турнира ещё до первого обмена.",
        domain: "reason",
        primary: 67,
        secondary: 87
      },
      {
        title: "Мелодия циня на городской стене",
        description: "Невозмутимый ритм речи скрывает временную нехватку резервов.",
        domain: "word",
        primary: 64,
        secondary: 84
      },
      {
        title: "Каменный лабиринт восьми построений",
        description: "Перестраивает ряды защиты при любом смещении угла атаки.",
        domain: "will",
        primary: 63,
        secondary: 81
      },
      {
        title: "Верность трём визитам Лю Бэя",
        description: "Не изменяет однажды принятому обязательству до последнего вздоха.",
        domain: "honor",
        primary: 62,
        secondary: 80
      },
      {
        title: "Запечатанный мешочек с советом",
        description: "Заранее заготовленная инструкция срабатывает ровно в час крайнего затруднения.",
        domain: "luck",
        primary: 60,
        secondary: 82
      }
    ]
  },
  {
    id: "hua-mulan",
    slug: "hua-mulan",
    name: "Хуа Мулань",
    origin: "Древняя китайская баллада",
    epithet: "Всадница сыновнего долга и чистой славы",
    emblemKey: "magnolia-blade",
    accentHex: "#8f324a",
    corpora: ["east"],
    motifs: ["honor", "will", "voyage"],
    dominants: [
      {
        title: "Двенадцать лет в одном строю",
        description: "Доказывает равенство и силу мысли безупречной выдержкой на всей дистанции.",
        domain: "will",
        primary: 86,
        secondary: 85
      },
      {
        title: "Выход в поход вместо отца",
        description: "Берёт на себя чужую непосильную обязанность по велению сердца и чести.",
        domain: "honor",
        primary: 84,
        secondary: 84
      },
      {
        title: "Два зайца на бегу у земли",
        description: "Снимает предрассудки наглядным вопросом: в деле кто отличит внешнюю бирку от сути?",
        domain: "reason",
        primary: 81,
        secondary: 83
      },
      {
        title: "Переход через Чёрную воду",
        description: "Проводит аргумент через самые холодные и неблагоприятные условия.",
        domain: "luck",
        primary: 75,
        secondary: 78
      },
      {
        title: "Отказ от министерского чина",
        description: "После победы просит лишь попутного ветра к дому, обезоруживая завистников.",
        domain: "heart",
        primary: 78,
        secondary: 82
      }
    ],
    appeals: [
      {
        title: "Мерный стук ткацкого станка",
        description: "За воинской твёрдостью сохраняет мирную созидательную меру.",
        domain: "heart",
        primary: 65,
        secondary: 83
      },
      {
        title: "Ночной сторожевой гонг",
        description: "Ни один внезапный выпад не застаёт защиту врасплох.",
        domain: "will",
        primary: 64,
        secondary: 81
      },
      {
        title: "Сдержанность среди однополчан",
        description: "Не раскрывает лишнего, пока дело не доведено до победного конца.",
        domain: "reason",
        primary: 62,
        secondary: 80
      },
      {
        title: "Чистое имя без корысти",
        description: "Невозможно упрекнуть в расчёте того, кто не взял за подвиг ни золота, ни печати.",
        domain: "honor",
        primary: 63,
        secondary: 79
      },
      {
        title: "Простая речь баллады",
        description: "Говорит ясно и сжато, без придворной вычурности.",
        domain: "word",
        primary: 58,
        secondary: 76
      }
    ]
  },
  {
    id: "hamlet",
    slug: "hamlet",
    name: "Гамлет",
    origin: "Трагедия о принце Датском",
    epithet: "Испытатель совести и распавшейся связи времён",
    emblemKey: "skull-crown",
    accentHex: "#3a3f58",
    corpora: ["letters"],
    motifs: ["reason", "honor"],
    dominants: [
      {
        title: "Сцена «Мышеловки»",
        description: "Разыгрывает перед оппонентом модель его же поступка, пока тот сам не выдаст себя реакцией.",
        domain: "reason",
        primary: 86,
        secondary: 88
      },
      {
        title: "На флейте не сыграешь, а на мне?",
        description: "Одной беспощадной метафорой пресекает попытку манипулировать собеседником.",
        domain: "word",
        primary: 85,
        secondary: 86
      },
      {
        title: "Быть или не быть вопросу",
        description: "Ставит проблему на предельную глубину, где мелкие отговорки теряют всякий вес.",
        domain: "will",
        primary: 81,
        secondary: 84
      },
      {
        title: "Зеркало перед самой природой",
        description: "Показывает добродетели её собственные черты, а фальши — её подлинный облик.",
        domain: "honor",
        primary: 78,
        secondary: 80
      },
      {
        title: "Память о бедном Йорике",
        description: "Уравнивает спесь великих мира сего перед лицом конечной человеческой меры.",
        domain: "heart",
        primary: 76,
        secondary: 81
      }
    ],
    appeals: [
      {
        title: "Метода в кажущемся безумии",
        description: "Сбивает чужой прицел парадоксальной репликой, сохраняя внутри холодный расчёт.",
        domain: "word",
        primary: 65,
        secondary: 85
      },
      {
        title: "Подмена пакета на корабле",
        description: "Вовремя распознаёт заготовленную ловушку и возвращает её авторам.",
        domain: "luck",
        primary: 62,
        secondary: 83
      },
      {
        title: "Свидетельство верного Горацио",
        description: "Опирается на трезвого и беспристрастного наблюдателя, не подвластного страстям.",
        domain: "reason",
        primary: 64,
        secondary: 82
      },
      {
        title: "Готовность — это всё",
        description: "Принимает любой жребий финального обмена с полным внутренним достоинством.",
        domain: "will",
        primary: 61,
        secondary: 79
      },
      {
        title: "Забота о честном имени",
        description: "Оставляет после спора выверенный и правдивый отчёт о причинах.",
        domain: "honor",
        primary: 59,
        secondary: 77
      }
    ]
  },
  {
    id: "falstaff",
    slug: "falstaff",
    name: "Фальстаф",
    origin: "Хроники «Кабаньей головы»",
    epithet: "Рыцарь неистощимого остроумия и жизни",
    emblemKey: "tankard",
    accentHex: "#9e472a",
    corpora: ["letters"],
    motifs: ["trickster"],
    dominants: [
      {
        title: "Катехизис о пустой чести",
        description: "Проверяет громкие лозунги простым вопросом: может ли отвлечённое слово вправить живое плечо?",
        domain: "reason",
        primary: 84,
        secondary: 86
      },
      {
        title: "Одиннадцать человек в парусине",
        description: "Раздувает гиперболу до такого блеска, что сам вымысел становится художественным доводом.",
        domain: "word",
        primary: 85,
        secondary: 84
      },
      {
        title: "Я не только сам остроумен...",
        description: "Превращает любую нападку на себя в повод для всеобщего веселья на своей стороне.",
        domain: "luck",
        primary: 82,
        secondary: 85
      },
      {
        title: "Защита весёлого Старого Джека",
        description: "Просить изгнать его — значит просить изгнать из беседы весь живой мир.",
        domain: "heart",
        primary: 80,
        secondary: 82
      },
      {
        title: "Инстинкт льва перед принцем",
        description: "Находит неопровержимое благородное объяснение самому сомнительному отступлению.",
        domain: "honor",
        primary: 72,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Лучшая часть доблести — осторожность",
        description: "Вовремя уклоняется от лобового удара, чтобы вернуться в спор живым и с последним словом.",
        domain: "luck",
        primary: 66,
        secondary: 86
      },
      {
        title: "Кружка хереса для ясности ума",
        description: "Снимает чопорную сухость протокола тёплой житейской полнотой.",
        domain: "heart",
        primary: 64,
        secondary: 82
      },
      {
        title: "Встречный счёт трактирщице",
        description: "Переводит обвинение в бесконечное уточнение мелких бытовых обстоятельств.",
        domain: "word",
        primary: 63,
        secondary: 83
      },
      {
        title: "Трезвый взгляд со дна корзины",
        description: "Даже в самом комическом положении видит человеческое лицемерие насквозь.",
        domain: "reason",
        primary: 60,
        secondary: 79
      },
      {
        title: "Неунывающая живучесть",
        description: "Поднимается после любого опровержения, словно ничего не случилось.",
        domain: "will",
        primary: 58,
        secondary: 76
      }
    ]
  },
  {
    id: "cyrano",
    slug: "cyrano",
    name: "Сирано де Бержерак",
    origin: "Героическая комедия о гасконце",
    epithet: "Поэт клинка и неприкосновенного султана",
    emblemKey: "plume-hat",
    accentHex: "#7d2c3b",
    corpora: ["letters", "chivalry"],
    motifs: ["honor", "reason", "will"],
    dominants: [
      {
        title: "В конце посылки я колю!",
        description: "Ведёт стихотворный силлогизм и ставит неопровержимую точку точно на последней строке.",
        domain: "word",
        primary: 88,
        secondary: 88
      },
      {
        title: "Двадцать вариантов про собственный нос",
        description: "Сам произносит против себя все мыслимые остроты вдесятеро лучше, лишая критика речи.",
        domain: "reason",
        primary: 84,
        secondary: 86
      },
      {
        title: "Монолог о «Нет, благодарю!»",
        description: "Отвергает мелкое покровительство и защищает полную независимость суждения.",
        domain: "honor",
        primary: 85,
        secondary: 84
      },
      {
        title: "Один против сотни у Нельских ворот",
        description: "Разбивает целую толпу шаблонных возражений в один вечер.",
        domain: "will",
        primary: 81,
        secondary: 80
      },
      {
        title: "Голос из тени под балконом",
        description: "Вкладывает в доказательство такую искренность чувства, что слушатель забывает о форме.",
        domain: "heart",
        primary: 79,
        secondary: 83
      }
    ],
    appeals: [
      {
        title: "Мой белый султан без пятна",
        description: "Даже уступая в счёте, уносит из спора незапятнанную прямоту позиции.",
        domain: "honor",
        primary: 66,
        secondary: 84
      },
      {
        title: "Шесть способов долететь до Луны",
        description: "Удерживает соперника блистательной научной фантазией, пока готовится главный шаг.",
        domain: "luck",
        primary: 62,
        secondary: 82
      },
      {
        title: "Флейта гасконских кадетов",
        description: "Поднимает дух защиты в осаде воспоминанием о родном крае.",
        domain: "heart",
        primary: 63,
        secondary: 81
      },
      {
        title: "Урок фехтования рифмой",
        description: "Отбивает грубый выпад строгим соблюдением размера и логики.",
        domain: "word",
        primary: 64,
        secondary: 83
      },
      {
        title: "Стоя у дерева до конца",
        description: "Встречает финальный обмен на ногах и с открытым забралом.",
        domain: "will",
        primary: 61,
        secondary: 78
      }
    ]
  },
  {
    id: "athos",
    slug: "athos",
    name: "Атос",
    origin: "Хроники королевских мушкетёров",
    epithet: "Граф де Ла Фер безупречного достоинства",
    emblemKey: "fleur-de-lis",
    accentHex: "#2c4365",
    corpora: ["letters", "chivalry"],
    motifs: ["honor", "will"],
    dominants: [
      {
        title: "Слово графа де Ла Фер",
        description: "Произносит суждение так веско, что даже короли и кардиналы принимают его без присяги.",
        domain: "honor",
        primary: 87,
        secondary: 86
      },
      {
        title: "Холодный разбор без гнева",
        description: "Отделяет личную боль от строгой справедливости вывода.",
        domain: "reason",
        primary: 83,
        secondary: 85
      },
      {
        title: "Оборона винного погреба в Амьене",
        description: "Превращает замкнутую позицию в неприступную крепость спокойного превосходства.",
        domain: "will",
        primary: 82,
        secondary: 82
      },
      {
        title: "Краткость благородного слога",
        description: "Говорит втрое меньше соперника, но каждое слово ложится точно в цель.",
        domain: "word",
        primary: 78,
        secondary: 80
      },
      {
        title: "Завет отцовской шпаги",
        description: "Напоминает о нравственной ответственности тех, кто берёт в руки сильный аргумент.",
        domain: "heart",
        primary: 75,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Невозмутимость под пулями бастиона",
        description: "Ни один натиск не заставляет ускорить шаг или повысить голос.",
        domain: "will",
        primary: 66,
        secondary: 83
      },
      {
        title: "Совет старшего товарища",
        description: "Удерживает союзный довод от опрометчивой крайности.",
        domain: "reason",
        primary: 64,
        secondary: 82
      },
      {
        title: "Верность памяти друзей",
        description: "Ставит человеческую привязанность выше политических перемен.",
        domain: "heart",
        primary: 63,
        secondary: 81
      },
      {
        title: "Отказ от наград двора",
        description: "Сохраняет полную свободу совести перед любым арбитром.",
        domain: "honor",
        primary: 65,
        secondary: 80
      },
      {
        title: "Удачный бросок костей",
        description: "Спокойно принимает каприз случая и обращает его в урок выдержки.",
        domain: "luck",
        primary: 57,
        secondary: 75
      }
    ]
  },
  {
    id: "edmond-dantes",
    slug: "edmond-dantes",
    name: "Эдмон Дантес",
    origin: "Хроники замка Иф и Монте-Кристо",
    epithet: "Архитектор долгого воздаяния и ожидания",
    emblemKey: "compass-rose",
    accentHex: "#244d54",
    corpora: ["letters"],
    motifs: ["voyage", "reason", "will"],
    dominants: [
      {
        title: "Уроки аббата Фариа",
        description: "Выводит скрытую связь причин и интересов методом чистой дедукции в тишине.",
        domain: "reason",
        primary: 87,
        secondary: 89
      },
      {
        title: "Четырнадцать лет терпения",
        description: "Готовит аргумент годами, чтобы предъявить его ровно в тот день, когда защита соперника дала трещину.",
        domain: "will",
        primary: 86,
        secondary: 86
      },
      {
        title: "Телеграфная депеша из Испании",
        description: "Одним точно рассчитанным известием обрушивает дутый кредит чужого тезиса.",
        domain: "word",
        primary: 82,
        secondary: 84
      },
      {
        title: "Счёт старых долгов",
        description: "Предъявляет документальное доказательство там, где оппонент надеялся на давность лет.",
        domain: "honor",
        primary: 79,
        secondary: 81
      },
      {
        title: "Клад кардинала Спады",
        description: "Подкрепляет каждую гипотезу неисчерпаемым запасом проверенных фактов.",
        domain: "luck",
        primary: 76,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Ждать и надеяться",
        description: "Сводит всю философию удержания к двум словам, против которых бессильна суета.",
        domain: "will",
        primary: 67,
        secondary: 86
      },
      {
        title: "Вовремя положенный предел",
        description: "Останавливает собственный суд, когда видит, что строгая кара может задеть невиновного.",
        domain: "heart",
        primary: 64,
        secondary: 83
      },
      {
        title: "Три имени одного человека",
        description: "Отвечает каждому оппоненту на его собственном языке — моряка, учёного или дипломата.",
        domain: "word",
        primary: 62,
        secondary: 81
      },
      {
        title: "Точность до единой минуты",
        description: "Появляется с ответом ровно на последнем ударе часов.",
        domain: "reason",
        primary: 63,
        secondary: 82
      },
      {
        title: "Квитанция для Морреля",
        description: "Доказывает благодарность и благородство тайным делом, а не публичной похвальбой.",
        domain: "honor",
        primary: 60,
        secondary: 78
      }
    ]
  },
  {
    id: "faust",
    slug: "faust",
    name: "Фауст",
    origin: "Трагедия об учёном искателе",
    epithet: "Испытатель пределов знания и деяния",
    emblemKey: "alembic",
    accentHex: "#513b6b",
    corpora: ["letters"],
    motifs: ["reason", "will", "voyage"],
    dominants: [
      {
        title: "В начале было Дело",
        description: "Переводит отвлечённый спор о словах и смыслах в плоскость созидательного действия.",
        domain: "will",
        primary: 86,
        secondary: 87
      },
      {
        title: "Критика четырёх факультетов",
        description: "Показывает ограниченность школьной догматики перед живым устройством природы.",
        domain: "reason",
        primary: 85,
        secondary: 88
      },
      {
        title: "Пари о мгновении",
        description: "Ставит условие: тезис проигран лишь тогда, когда мысль перестанет двигаться вперёд.",
        domain: "honor",
        primary: 80,
        secondary: 82
      },
      {
        title: "Нисхождение к Матерям",
        description: "Обращается к первообразам идей, лежащим глубже текущих мнений.",
        domain: "word",
        primary: 78,
        secondary: 83
      },
      {
        title: "Свободная земля у моря",
        description: "Завершает долгий поиск картиной общего труда для будущих поколений.",
        domain: "heart",
        primary: 77,
        secondary: 81
      }
    ],
    appeals: [
      {
        title: "Часть силы, творящей благо",
        description: "Обращает даже едкое отрицание оппонента на пользу общему развитию мысли.",
        domain: "reason",
        primary: 66,
        secondary: 86
      },
      {
        title: "Пасхальный колокольный звон",
        description: "Удерживает ум у края отчаяния простой и тёплой памятью о жизни.",
        domain: "heart",
        primary: 63,
        secondary: 82
      },
      {
        title: "Неутомимо стремящийся",
        description: "Сама непрерывность поиска служит оправданием отдельных ошибок пути.",
        domain: "will",
        primary: 64,
        secondary: 81
      },
      {
        title: "Союз классической меры и порыва",
        description: "Уравновешивает бурный замысел строгой гармонией античной формы.",
        domain: "word",
        primary: 61,
        secondary: 79
      },
      {
        title: "Неожиданный исход тяжбы",
        description: "Выигрывает спор в последнем акте вопреки формальной расписке.",
        domain: "luck",
        primary: 59,
        secondary: 78
      }
    ]
  },
  {
    id: "figaro",
    slug: "figaro",
    name: "Фигаро",
    origin: "Севильские хроники Бомарше",
    epithet: "Мастер ста ремёсел и весёлой интриги",
    emblemKey: "tuning-fork",
    accentHex: "#c25929",
    corpora: ["letters"],
    motifs: ["trickster", "reason"],
    dominants: [
      {
        title: "Вы дали себе труд только родиться",
        description: "Блестящим монологом противопоставляет личный ум и труд спесивому праву привилегии.",
        domain: "word",
        primary: 87,
        secondary: 88
      },
      {
        title: "Семь нитей одной интриги",
        description: "Переплетает встречные ходы соперников так, что они сами мешают друг другу.",
        domain: "reason",
        primary: 84,
        secondary: 85
      },
      {
        title: "Смеяться, чтобы не заплакать",
        description: "Перехватывает инициативу стремительной иронией в самую острую минуту спора.",
        domain: "luck",
        primary: 82,
        secondary: 84
      },
      {
        title: "Записка на булавке",
        description: "Маленькая улика меняет местами обвинителя и оправдывающегося.",
        domain: "will",
        primary: 76,
        secondary: 79
      },
      {
        title: "Союз с умной Сюзанной",
        description: "Удваивает силу довода живым взаимопониманием и человеческим теплом.",
        domain: "heart",
        primary: 75,
        secondary: 80
      }
    ],
    appeals: [
      {
        title: "Фигаро здесь, Фигаро там",
        description: "Оказывается с готовым ответом сразу на обоих флангах обсуждения.",
        domain: "luck",
        primary: 66,
        secondary: 86
      },
      {
        title: "Прыжок в садовый цветник",
        description: "Мягко гасит инерцию чужого разоблачения и тут же берёт след заново.",
        domain: "word",
        primary: 63,
        secondary: 83
      },
      {
        title: "Разбор судебного протокола по запятой",
        description: "Маленький спор о союзе «и» или «или» связывает приговор по рукам и ногам.",
        domain: "reason",
        primary: 64,
        secondary: 84
      },
      {
        title: "Честь простолюдина",
        description: "Держит слово перед друзьями крепче, чем вельможи свои грамоты.",
        domain: "honor",
        primary: 60,
        secondary: 78
      },
      {
        title: "Неутомимость ста профессий",
        description: "Если закрыт один приём — тут же достаёт инструмент из соседнего ремесла.",
        domain: "will",
        primary: 59,
        secondary: 77
      }
    ]
  },
  {
    id: "munchausen",
    slug: "munchausen",
    name: "Барон Мюнхгаузен",
    origin: "Правдивейшие рассказы у камина",
    epithet: "Рыцарь находчивой гиперболы и точного полёта",
    emblemKey: "cannonball",
    accentHex: "#8c3b2b",
    corpora: ["letters"],
    motifs: ["voyage", "trickster"],
    dominants: [
      {
        title: "Полёт на пушечном ядре",
        description: "Садится верхом на самый убойный аргумент соперника и возвращается обратно на встречном.",
        domain: "luck",
        primary: 87,
        secondary: 88
      },
      {
        title: "За собственную косичку из болота",
        description: "Выводит доказательство из безвыходной посылки чисто внутренней логикой приёма.",
        domain: "will",
        primary: 83,
        secondary: 85
      },
      {
        title: "Вишнёвое дерево на лбу оленя",
        description: "Даже случайная оговорка со временем приносит в его речи цветущий плод смысла.",
        domain: "word",
        primary: 82,
        secondary: 84
      },
      {
        title: "Самый правдивый человек на свете",
        description: "Утверждает невероятный тезис с такой честной ясностью глаз, что сомневаться невежливо.",
        domain: "honor",
        primary: 77,
        secondary: 80
      },
      {
        title: "Оттаявшие звуки охотничьего рожка",
        description: "В нужный момент оживляет аргументы, которые оппонент считал давно замёрзшими.",
        domain: "reason",
        primary: 75,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Половина коня у водопоя",
        description: "Даже если отсечь часть примера, передняя половина продолжает исправно работать.",
        domain: "luck",
        primary: 65,
        secondary: 86
      },
      {
        title: "Невозмутимый тон у камина",
        description: "Отвечает на скепсис дружелюбной улыбкой бывалого путешественника.",
        domain: "heart",
        primary: 62,
        secondary: 81
      },
      {
        title: "Точный расчёт рикошета",
        description: "За каждым фантастическим образом прячет удивительно стройную геометрию.",
        domain: "reason",
        primary: 61,
        secondary: 80
      },
      {
        title: "Восемь искр из одного кремня",
        description: "Находится с ответом даже тогда, когда под рукой нет привычных заготовок.",
        domain: "word",
        primary: 63,
        secondary: 83
      },
      {
        title: "Осанка старого кавалериста",
        description: "Ни при каких обстоятельствах не теряет присутствия духа и учтивости.",
        domain: "honor",
        primary: 59,
        secondary: 77
      }
    ]
  },
  {
    id: "gulliver",
    slug: "gulliver",
    name: "Лемюэль Гулливер",
    origin: "Странствия к дальним народам мира",
    epithet: "Свидетель лилипутов, великанов и трезвой меры",
    emblemKey: "spyglass",
    accentHex: "#3b5f4e",
    corpora: ["letters"],
    motifs: ["voyage", "reason"],
    dominants: [
      {
        title: "Спор тупоконечников и остроконечников",
        description: "Показывает, как ничтожна причина, из-за которой стороны развели мировую распрю.",
        domain: "reason",
        primary: 86,
        secondary: 88
      },
      {
        title: "Взгляд с ладони в Бробдингнеге",
        description: "Меняет масштаб рассмотрения так, что мнимое величие обнажает грубые поры и изъяны.",
        domain: "word",
        primary: 83,
        secondary: 85
      },
      {
        title: "Флот Лилипутии на одном канате",
        description: "Спокойно уводит целую эскадру мелких колкостей одним выверенным движением.",
        domain: "will",
        primary: 79,
        secondary: 81
      },
      {
        title: "Проекты академии Лагадо",
        description: "Разоблачает бесплодность умозрительных схем, оторванных от здравого опыта.",
        domain: "honor",
        primary: 77,
        secondary: 80
      },
      {
        title: "Беседа в стране гуигнгнмов",
        description: "Требует называть вещи своими именами без того, чего не существует в природе правды.",
        domain: "heart",
        primary: 74,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Тысяча тонких нитей на земле",
        description: "Терпеливо распутывает мелкие формальные ограничения одно за другим.",
        domain: "will",
        primary: 64,
        secondary: 81
      },
      {
        title: "Точная опись карманов",
        description: "Описывает самые странные явления сухой и достоверной прозой судового врача.",
        domain: "reason",
        primary: 65,
        secondary: 85
      },
      {
        title: "Ящик, подхваченный орлом",
        description: "Даже самое невероятное происшествие поворачивается к возвращению на верный курс.",
        domain: "luck",
        primary: 60,
        secondary: 79
      },
      {
        title: "Кротость великана на площади",
        description: "Имея силу раздавить слабый довод, бережно обходит его стороной.",
        domain: "heart",
        primary: 62,
        secondary: 80
      },
      {
        title: "Свидетельство без прикрас",
        description: "Отказывается добавлять хотя бы одно лишнее прилагательное ради красного словца.",
        domain: "honor",
        primary: 61,
        secondary: 78
      }
    ]
  },
  {
    id: "dupin",
    slug: "dupin",
    name: "Огюст Дюпен",
    origin: "Парижские аналитические этюды",
    epithet: "Рыцарь чистой рациоцинации у самого виду",
    emblemKey: "sealed-letter",
    accentHex: "#464d68",
    corpora: ["letters"],
    motifs: ["reason", "honor"],
    dominants: [
      {
        title: "Письмо на самом видном месте",
        description: "Находит решение не в тайниках, а в очевидном факте, который все пропустили из-за его простоты.",
        domain: "reason",
        primary: 89,
        secondary: 90
      },
      {
        title: "Отождествление с умом игрока",
        description: "Вычисляет следующий ход оппонента по складу его характера, а не по шаблонам учебника.",
        domain: "word",
        primary: 84,
        secondary: 86
      },
      {
        title: "Необычайность как ключ к разгадке",
        description: "Использует самое странное отклонение в деле как прямую нить к единственному выводу.",
        domain: "luck",
        primary: 80,
        secondary: 83
      },
      {
        title: "Расчёт поэта и математика",
        description: "Соединяет алгебраическую строгость с воображением, способным охватить целое.",
        domain: "will",
        primary: 78,
        secondary: 81
      },
      {
        title: "Возврат украденной чести",
        description: "Действует бесшумно и точно, восстанавливая справедливость без лишней огласки.",
        domain: "honor",
        primary: 76,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Закрытые ставни при свечах",
        description: "Отсекает суету внешнего дня, чтобы сосредоточиться на чистой связи идей.",
        domain: "reason",
        primary: 67,
        secondary: 86
      },
      {
        title: "Различие шашек и шахмат",
        description: "Не тратит силы на многоходовую суету там, где решает качество внимания.",
        domain: "will",
        primary: 63,
        secondary: 81
      },
      {
        title: "Подмена печати из хлебного мякиша",
        description: "Перехватывает инициативу соперника так незаметно, что тот ещё долго считает позицию своей.",
        domain: "luck",
        primary: 62,
        secondary: 84
      },
      {
        title: "Тонкая цитата в постскриптуме",
        description: "Оставляет противнику изящный знак того, кто именно распутал его замысел.",
        domain: "word",
        primary: 61,
        secondary: 80
      },
      {
        title: "Бескорыстная дружба аналитика",
        description: "За холодным блеском ума хранит верность товарищу и делу.",
        domain: "heart",
        primary: 58,
        secondary: 77
      }
    ]
  }
];
