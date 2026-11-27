import type { DomainId, HeroCorpus, HeroMotif } from "./types";

export interface ExtraSkillSpec {
  title: string;
  description: string;
  domain: DomainId;
  primary: number;
  secondary: number;
}

export interface ExtraHeroSpec {
  id: string;
  slug: string;
  name: string;
  origin: string;
  epithet: string;
  emblemKey: string;
  accentHex: string;
  corpora: readonly HeroCorpus[];
  motifs: readonly HeroMotif[];
  dominants: [ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec];
  appeals: [ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec, ExtraSkillSpec];
}

export const EXTRA_ROSTER_PART_1: readonly ExtraHeroSpec[] = [
  {
    id: "penelope",
    slug: "penelope",
    name: "Пенелопа",
    origin: "Гомеровский эпос",
    epithet: "Ткачиха долгого замысла Итаки",
    emblemKey: "loom",
    accentHex: "#6f4e7c",
    corpora: ["hellenic"],
    motifs: ["reason", "trickster", "will"],
    dominants: [
      {
        title: "Ночной роспуск полотна",
        description: "Разбирает навязанный срок по нитке и возвращает спор к исходному условию.",
        domain: "reason",
        primary: 84,
        secondary: 87
      },
      {
        title: "Испытание старым луком",
        description: "Предлагает проверку, где пустое хвастовство выдаёт себя с первой попытки.",
        domain: "honor",
        primary: 80,
        secondary: 83
      },
      {
        title: "Двадцать лет у очага",
        description: "Переигрывает торопливый напор непоколебимой верностью главной посылке.",
        domain: "will",
        primary: 79,
        secondary: 84
      },
      {
        title: "Тайна оливкового ложа",
        description: "Выводит собеседника на оговорку о детали, известной лишь знающему суть дела.",
        domain: "word",
        primary: 77,
        secondary: 82
      },
      {
        title: "Вещий сон у ворот из рога",
        description: "Подаёт строгий расчёт в виде осторожного предположения, с которым нельзя не считаться.",
        domain: "luck",
        primary: 74,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Условие незаконченного савана",
        description: "Откладывает окончательный приговор, пока не проверены все предпосылки.",
        domain: "reason",
        primary: 66,
        secondary: 84
      },
      {
        title: "Гостеприимство хозяйки дома",
        description: "Сохраняет безупречное достоинство среди шумных и нетерпеливых требований.",
        domain: "honor",
        primary: 63,
        secondary: 79
      },
      {
        title: "Тихая память сердца",
        description: "Не позволяет внешнему блеску чужой речи заслонить подлинную цель.",
        domain: "heart",
        primary: 62,
        secondary: 81
      },
      {
        title: "Осторожность перед вестью",
        description: "Не принимает на веру даже желанный вывод без твёрдого подтверждения.",
        domain: "will",
        primary: 60,
        secondary: 78
      },
      {
        title: "Пряжа двойного узора",
        description: "Связывает уступку на словах со скрытым укреплением собственной позиции.",
        domain: "word",
        primary: 58,
        secondary: 80
      }
    ]
  },
  {
    id: "achilles",
    slug: "achilles",
    name: "Ахилл",
    origin: "Гомеровский эпос",
    epithet: "Быстроногий выбор бессмертной славы",
    emblemKey: "spear",
    accentHex: "#a63a2b",
    corpora: ["hellenic"],
    motifs: ["will", "honor"],
    dominants: [
      {
        title: "Пелиonское копьё",
        description: "Наносит прямой тезис такой тяжести, которую не способен поднять посредственный спорщик.",
        domain: "will",
        primary: 88,
        secondary: 82
      },
      {
        title: "Выбор короткой и громкой доли",
        description: "Отказывается от удобного компромисса ради безусловной ясности принципа.",
        domain: "honor",
        primary: 85,
        secondary: 80
      },
      {
        title: "Гнев на неправду старейшин",
        description: "Вскрывает корысть за призывами к показной дисциплине.",
        domain: "heart",
        primary: 81,
        secondary: 78
      },
      {
        title: "Клич у глубокого рва",
        description: "Одной открытой формулировкой останавливает наступление целой шеренги софизмов.",
        domain: "word",
        primary: 78,
        secondary: 76
      },
      {
        title: "Жребий двух урн Зевса",
        description: "Напоминает о строгой мере судьбы, уравнивающей торжество и утрату.",
        domain: "reason",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Щит Гефестовой ковки",
        description: "Вписывает частный спор в широкую картину мира, где видна мера каждого довода.",
        domain: "reason",
        primary: 65,
        secondary: 82
      },
      {
        title: "Разговор с Приамом в шатре",
        description: "Укрощает ярость состязания общим человеческим сочувствием.",
        domain: "heart",
        primary: 64,
        secondary: 84
      },
      {
        title: "Отход к кораблям мирмидонян",
        description: "Даёт чужой самоуверенности самой обнаружить свою беспомощность без его участия.",
        domain: "will",
        primary: 61,
        secondary: 76
      },
      {
        title: "Прямота против двоедушия",
        description: "Объявляет ненавистной всякую речь, где на языке одно, а в замысле другое.",
        domain: "honor",
        primary: 62,
        secondary: 77
      },
      {
        title: "Песнь под лиру в тишине",
        description: "Переводит напряжение спора в размеренный эпический строй.",
        domain: "word",
        primary: 57,
        secondary: 74
      }
    ]
  },
  {
    id: "circe",
    slug: "circe",
    name: "Кирка",
    origin: "Эллинские мифы",
    epithet: "Повелительница метаморфоз Ээи",
    emblemKey: "chalice",
    accentHex: "#7b2d56",
    corpora: ["hellenic"],
    motifs: ["trickster", "reason", "voyage"],
    dominants: [
      {
        title: "Чаша проверочного зелья",
        description: "Снимает с тезиса благородную маску и обнажает его подлинный аппетит.",
        domain: "word",
        primary: 85,
        secondary: 86
      },
      {
        title: "Прикосновение лозы",
        description: "Перестраивает форму чужого аргумента так, что он начинает спорить сам с собой.",
        domain: "luck",
        primary: 82,
        secondary: 84
      },
      {
        title: "Навигация мимо Скиллы",
        description: "Заранее раскладывает перед оппонентом цену каждого из двух плохих выборов.",
        domain: "reason",
        primary: 80,
        secondary: 85
      },
      {
        title: "Песня за золотым станком",
        description: "Завораживает слушателей стройностью речи, пока готовится главный поворот.",
        domain: "heart",
        primary: 77,
        secondary: 80
      },
      {
        title: "Закон уединённого острова",
        description: "Диктует собственные правила обсуждения на своей смысловой территории.",
        domain: "will",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Признание корня моли",
        description: "Мгновенно уважает встречный ум, если тот сумел устоять перед первой чарой.",
        domain: "reason",
        primary: 64,
        secondary: 83
      },
      {
        title: "Возвращение прежнего облика",
        description: "Снимает излишнюю резкость и возвращает доводам ясный и достойный вид.",
        domain: "heart",
        primary: 62,
        secondary: 80
      },
      {
        title: "Совет на дорогу к теням",
        description: "Переводит тупиковый спор к первоисточнику, который нельзя обойти.",
        domain: "word",
        primary: 61,
        secondary: 81
      },
      {
        title: "Клятва бессмертных",
        description: "Закрепляет перемирие твёрдым обязательством не чинить скрытого вреда.",
        domain: "honor",
        primary: 59,
        secondary: 76
      },
      {
        title: "Попутный ветер в паруса",
        description: "Легко отпускает отживший тезис ради следующего этапа беседы.",
        domain: "luck",
        primary: 58,
        secondary: 79
      }
    ]
  },
  {
    id: "daedalus",
    slug: "daedalus",
    name: "Дедал",
    origin: "Эллинские мифы",
    epithet: "Зодчий лабиринта и крылатого расчёта",
    emblemKey: "wings",
    accentHex: "#3b627e",
    corpora: ["hellenic"],
    motifs: ["reason", "voyage"],
    dominants: [
      {
        title: "Чертёж Кносского лабиринта",
        description: "Выстраивает систему посылок, где прямолинейный напор сам заходит в тупик.",
        domain: "reason",
        primary: 87,
        secondary: 89
      },
      {
        title: "Нитка в спиральной раковине",
        description: "Решает внешне невыполнимую задачу изящным естественным приёмом.",
        domain: "luck",
        primary: 81,
        secondary: 84
      },
      {
        title: "Полёт средней высоты",
        description: "Проводит мысль ровно между сыростью приземлённого быта и жаром пустого пафоса.",
        domain: "will",
        primary: 79,
        secondary: 82
      },
      {
        title: "Ожившая статуя мастера",
        description: "Придаёт сухой схеме такую точность, что она начинает двигать спор сама.",
        domain: "word",
        primary: 76,
        secondary: 80
      },
      {
        title: "Ответственность ремесла",
        description: "Требует от автора идеи отвечать за последствия своей конструкции.",
        domain: "honor",
        primary: 73,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Предупреждение о солнце и волне",
        description: "Заранее размечает границы, за которыми смелый тезис теряет сцепление.",
        domain: "reason",
        primary: 66,
        secondary: 85
      },
      {
        title: "Перо к перу на воске",
        description: "Собирает надёжную защиту из малых, но точно подогнанных фактов.",
        domain: "will",
        primary: 63,
        secondary: 80
      },
      {
        title: "Поворот за скрытой стеной",
        description: "Уводит уязвимое звено за дополнительный ярус аргументации.",
        domain: "luck",
        primary: 60,
        secondary: 78
      },
      {
        title: "Скорбь об Икаре",
        description: "Остужает безрассудный азарт напоминанием о человеческой цене ошибки.",
        domain: "heart",
        primary: 59,
        secondary: 79
      },
      {
        title: "Точность отвеса и циркуля",
        description: "Отклоняет любые упрёки, не выдерживающие инструментальной проверки.",
        domain: "honor",
        primary: 58,
        secondary: 76
      }
    ]
  },
  {
    id: "orpheus",
    slug: "orpheus",
    name: "Орфей",
    origin: "Эллинские мифы",
    epithet: "Певец, склоняющий камни и судей",
    emblemKey: "lyre",
    accentHex: "#4d5382",
    corpora: ["hellenic"],
    motifs: ["voyage", "will"],
    dominants: [
      {
        title: "Семь струн фракийской лиры",
        description: "Находит такую интонацию, перед которой смолкает самый жёсткий приговор.",
        domain: "heart",
        primary: 87,
        secondary: 88
      },
      {
        title: "Песнь сильнее сирен",
        description: "Перекрывает соблазнительный софизм мелодией более высокой правды.",
        domain: "word",
        primary: 84,
        secondary: 85
      },
      {
        title: "Нисхождение за грань",
        description: "Идёт за доказательством туда, откуда обычная логика возвращается ни с чем.",
        domain: "will",
        primary: 80,
        secondary: 82
      },
      {
        title: "Лад стихий и вёсел",
        description: "Подчиняет разнородные факты единому ритму изложения.",
        domain: "reason",
        primary: 76,
        secondary: 79
      },
      {
        title: "Верность единственному имени",
        description: "Держит весь диспут вокруг одной чистой и неразменной ценности.",
        domain: "honor",
        primary: 74,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Укрощение стража у врат",
        description: "Смягчает агрессивную критику соразмерностью и достоинством тона.",
        domain: "heart",
        primary: 66,
        secondary: 84
      },
      {
        title: "Запрет оглядываться до света",
        description: "Удерживает дисциплину вывода до самого выхода из трудной посылки.",
        domain: "will",
        primary: 62,
        secondary: 79
      },
      {
        title: "Эхо на речной воде",
        description: "Даже разбитый на части тезис продолжает звучать цельной мыслью.",
        domain: "word",
        primary: 63,
        secondary: 82
      },
      {
        title: "Сочувствие теней",
        description: "Привлекает на свою сторону даже прежних противников искренностью речи.",
        domain: "luck",
        primary: 58,
        secondary: 77
      },
      {
        title: "Чистота орфического обета",
        description: "Отвергает грубые приёмы ради внутренней безупречности доказательства.",
        domain: "honor",
        primary: 59,
        secondary: 75
      }
    ]
  },
  {
    id: "hermes",
    slug: "hermes",
    name: "Гермес",
    origin: "Эллинские мифы",
    epithet: "Крылатый вестник границ и договоров",
    emblemKey: "caduceus",
    accentHex: "#b06d27",
    corpora: ["hellenic"],
    motifs: ["voyage", "trickster", "reason"],
    dominants: [
      {
        title: "Следы, ведущие вспять",
        description: "Выстраивает посылки так, что оппонент ищет вывод в прямо противоположной стороне.",
        domain: "luck",
        primary: 85,
        secondary: 87
      },
      {
        title: "Обмен панциря на лиру",
        description: "Превращает острую претензию соперника в выгодное соглашение обеих сторон.",
        domain: "word",
        primary: 83,
        secondary: 85
      },
      {
        title: "Крылатые сандалии перехода",
        description: "Мгновенно переносит спор между бытовым примером и высшим принципом.",
        domain: "reason",
        primary: 80,
        secondary: 82
      },
      {
        title: "Усыпление ста глаз Аргуса",
        description: "Обходит самую бдительную формальную охрану плавной чередой притч.",
        domain: "heart",
        primary: 76,
        secondary: 79
      },
      {
        title: "Жезл неприкосновенного посла",
        description: "Требует выслушать неудобную весть по праву посредника между лагерями.",
        domain: "honor",
        primary: 73,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Улыбка в колыбели",
        description: "Обезоруживает грозное обвинение лёгкой иронией и находчивым алиби.",
        domain: "luck",
        primary: 64,
        secondary: 85
      },
      {
        title: "Толкование на перекрёстке",
        description: "Показывает, что два враждующих тезиса говорят об одном на разных языках.",
        domain: "word",
        primary: 63,
        secondary: 83
      },
      {
        title: "Весы честного торга",
        description: "Сводит пафосный спор к точному балансу взаимных уступок.",
        domain: "reason",
        primary: 61,
        secondary: 79
      },
      {
        title: "Проводник через сумерки",
        description: "Спокойно выводит мысль из самой запутанной части дискуссии.",
        domain: "will",
        primary: 59,
        secondary: 76
      },
      {
        title: "Гостевой дар путнику",
        description: "Располагает судей дружелюбием без потери деловой хватки.",
        domain: "heart",
        primary: 58,
        secondary: 77
      }
    ]
  },
  {
    id: "loki",
    slug: "loki",
    name: "Локи",
    origin: "Старшая и Младшая Эдда",
    epithet: "Изобретатель узлов и оговорок",
    emblemKey: "mask",
    accentHex: "#2e6f57",
    corpora: ["norse"],
    motifs: ["trickster", "reason"],
    dominants: [
      {
        title: "Оговорка о голове без шеи",
        description: "Принимает условие оппонента буквально и делает его неисполнимым на практике.",
        domain: "word",
        primary: 86,
        secondary: 88
      },
      {
        title: "Яблоко раздора на пиру",
        description: "Бросает одно точное замечание, от которого рушится показное единодушие.",
        domain: "luck",
        primary: 83,
        secondary: 85
      },
      {
        title: "Сеть собственного плетения",
        description: "Проверяет прочность чужой логики ловушкой, которую сам же и придумал.",
        domain: "reason",
        primary: 81,
        secondary: 83
      },
      {
        title: "Спор с кузнецами карликов",
        description: "Разжигает состязание так, что стороны сами выкладывают лучшие козыри.",
        domain: "will",
        primary: 76,
        secondary: 79
      },
      {
        title: "Неудобная правда Перебранки",
        description: "Напоминает каждому авторитету о том случае, о котором тот предпочёл бы молчать.",
        domain: "heart",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Смена облика на лету",
        description: "Переходит из защиты в шутку быстрее, чем критика успевает зафиксировать цель.",
        domain: "luck",
        primary: 65,
        secondary: 86
      },
      {
        title: "Выкуп золотыми волосами Сив",
        description: "Исправляет рискованный выпад неожиданным и блестящим дополнением к теме.",
        domain: "word",
        primary: 62,
        secondary: 82
      },
      {
        title: "Буква древнего уговора",
        description: "Укрывается за точным смыслом ранее произнесённого слова.",
        domain: "reason",
        primary: 61,
        secondary: 80
      },
      {
        title: "Побратимство с Одином",
        description: "Апеллирует к давнему союзу ума и власти в основании общего порядка.",
        domain: "honor",
        primary: 57,
        secondary: 74
      },
      {
        title: "Упрямство связанного",
        description: "Даже под самым жёстким давлением не отказывается от своей оценки.",
        domain: "will",
        primary: 59,
        secondary: 76
      }
    ]
  },
  {
    id: "beowulf",
    slug: "beowulf",
    name: "Беовульф",
    origin: "Англосаксонский эпос",
    epithet: "Страж медовой палаты и морских дружин",
    emblemKey: "dragon-prow",
    accentHex: "#36536d",
    corpora: ["norse"],
    motifs: ["voyage", "will", "honor"],
    dominants: [
      {
        title: "Хватка без клинка в Хеороте",
        description: "Отказывается от риторических ухищрений и берёт главный тезис противника напрямую.",
        domain: "will",
        primary: 86,
        secondary: 83
      },
      {
        title: "Обет перед дружиной",
        description: "Заявляет высокую планку доказательства и идёт к ней без права на отступление.",
        domain: "honor",
        primary: 84,
        secondary: 82
      },
      {
        title: "Заплыв в северном проливе",
        description: "Выдерживает затяжной обмен аргументами там, где соперник теряет дыхание.",
        domain: "reason",
        primary: 78,
        secondary: 80
      },
      {
        title: "Ответ скамье Унферта",
        description: "Спокойным изложением фактов гасит завистливую колкость скептика.",
        domain: "word",
        primary: 77,
        secondary: 79
      },
      {
        title: "Выход к последнему кургану",
        description: "Берёт на себя самый опасный вопрос спора ради безопасности общего дела.",
        domain: "heart",
        primary: 75,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Кольчуга работы Веланда",
        description: "Держит удар острых частностей проверенной традицией доказательства.",
        domain: "honor",
        primary: 66,
        secondary: 80
      },
      {
        title: "Плечо верного Виглафа",
        description: "Опирается на единственное, но непоколебимое свидетельство в решающий миг.",
        domain: "heart",
        primary: 63,
        secondary: 82
      },
      {
        title: "Невозмутимость старого конунга",
        description: "Отвечает на бурный выпад сдержанным достоинством пятидесяти лет опыта.",
        domain: "will",
        primary: 64,
        secondary: 79
      },
      {
        title: "Древний клинок на дне озера",
        description: "Находит спасительный аргумент в самом сердце чужой территории.",
        domain: "luck",
        primary: 58,
        secondary: 78
      },
      {
        title: "Суд славы у погребального костра",
        description: "Проверяет каждый довод тем, что останется от него в долгой памяти.",
        domain: "reason",
        primary: 59,
        secondary: 76
      }
    ]
  },
  {
    id: "merlin",
    slug: "merlin",
    name: "Мерлин",
    origin: "Легенды Круглого стола",
    epithet: "Провидец камня и лесной тишины",
    emblemKey: "crystal-orb",
    accentHex: "#3e4a7b",
    corpora: ["chivalry"],
    motifs: ["reason", "trickster"],
    dominants: [
      {
        title: "Два дракона под башней",
        description: "Вскрывает глубинный конфликт основания, из-за которого шатается вся постройка оппонента.",
        domain: "reason",
        primary: 87,
        secondary: 89
      },
      {
        title: "Меч, вкованный в наковальню",
        description: "Формулирует условие такой точности, что случайный претендент не сдвинет спор с места.",
        domain: "will",
        primary: 82,
        secondary: 84
      },
      {
        title: "Пророчество в три строки",
        description: "Задаёт рамку будущего итога так, что соперник сам начинает работать на неё.",
        domain: "word",
        primary: 80,
        secondary: 85
      },
      {
        title: "Перестановка камней Салисбери",
        description: "Лёгким инженерным приёмом переносит тяжеловесные глыбы доказательств.",
        domain: "luck",
        primary: 77,
        secondary: 81
      },
      {
        title: "Наставление юному королю",
        description: "Направляет силу собеседника в русло общей справедливости.",
        domain: "honor",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Взгляд из обратного времени",
        description: "Заранее видит третий шаг чужой атаки и спокойно готовит на него ответ.",
        domain: "reason",
        primary: 66,
        secondary: 86
      },
      {
        title: "Туман Броселианда",
        description: "Рассеивает прямолинейный напор мягкой многозначностью притчи.",
        domain: "word",
        primary: 63,
        secondary: 82
      },
      {
        title: "Улыбка лесного старца",
        description: "Снимает спесь с оппонента простотой вопроса, на который нет книжного ответа.",
        domain: "luck",
        primary: 60,
        secondary: 80
      },
      {
        title: "Верность замыслу Круга",
        description: "Хранит равновесие сторон даже тогда, когда спор грозит расколом.",
        domain: "honor",
        primary: 59,
        secondary: 77
      },
      {
        title: "Хрустальная сень покоя",
        description: "Удерживает внутреннюю ясность мысли в полном уединении.",
        domain: "heart",
        primary: 58,
        secondary: 78
      }
    ]
  },
  {
    id: "lancelot",
    slug: "lancelot",
    name: "Ланселот",
    origin: "Легенды Круглого стола",
    epithet: "Первый клинок Озёрного предела",
    emblemKey: "lance",
    accentHex: "#2e557c",
    corpora: ["chivalry"],
    motifs: ["honor", "will", "voyage"],
    dominants: [
      {
        title: "Сшиб на полном скаку",
        description: "Собирает весь вес доказательства в одной безупречно выверенной встречной фразе.",
        domain: "will",
        primary: 86,
        secondary: 84
      },
      {
        title: "Переправа по Мосту Меча",
        description: "Проходит по самому острому краю допущения, не теряя равновесия мысли.",
        domain: "honor",
        primary: 83,
        secondary: 83
      },
      {
        title: "Турнир под чужим щитом",
        description: "Доказывает правоту тезиса чистым мастерством, без ссылки на громкое имя.",
        domain: "reason",
        primary: 79,
        secondary: 81
      },
      {
        title: "Служение единственной даме",
        description: "Наполняет строгую форму рыцарского спора живой и страстной преданностью.",
        domain: "heart",
        primary: 78,
        secondary: 80
      },
      {
        title: "Куртуазный вызов у шатра",
        description: "Облекает самый трудный вопрос в форму высокой учтивости.",
        domain: "word",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Кольцо Озёрной девы",
        description: "Рассеивает ложные наваждения и возвращает взгляду трезвость.",
        domain: "reason",
        primary: 64,
        secondary: 81
      },
      {
        title: "Смирение на повозке",
        description: "Принимает внешнюю неловкость формы, если она ведёт к спасению главного смысла.",
        domain: "heart",
        primary: 63,
        secondary: 82
      },
      {
        title: "Щит Долорозы",
        description: "Выдерживает двойной и тройной напор без потери боевого строя.",
        domain: "will",
        primary: 65,
        secondary: 79
      },
      {
        title: "Пощада поверженному сопернику",
        description: "Останавливает спор в миг очевидного перевеса, сохраняя честь обеих сторон.",
        domain: "honor",
        primary: 62,
        secondary: 78
      },
      {
        title: "Удачный выбор тропы",
        description: "Находит верный поворот на лесном распутье странствующего диспута.",
        domain: "luck",
        primary: 57,
        secondary: 75
      }
    ]
  },
  {
    id: "gawain",
    slug: "gawain",
    name: "Гавейн",
    origin: "Легенды Круглого стола",
    epithet: "Рыцарь пентаграммы и полуденной силы",
    emblemKey: "green-girdle",
    accentHex: "#2f6b3f",
    corpora: ["chivalry"],
    motifs: ["honor", "voyage", "will"],
    dominants: [
      {
        title: "Сила, растущая к полудню",
        description: "С каждым новым обменом наращивает ясность и весомость аргументов.",
        domain: "will",
        primary: 84,
        secondary: 83
      },
      {
        title: "Пять узлов золотой звезды",
        description: "Связывает пять сторон доказательства в фигуру без единого разрыва.",
        domain: "honor",
        primary: 83,
        secondary: 85
      },
      {
        title: "Учтивая речь Камелота",
        description: "Разбирает чужое возражение так изящно, что оппонент сам соглашается с поправкой.",
        domain: "word",
        primary: 80,
        secondary: 82
      },
      {
        title: "Зимний путь к Зелёной часовне",
        description: "Приходит на назначенную проверку в срок, как бы суровы ни были условия.",
        domain: "reason",
        primary: 76,
        secondary: 79
      },
      {
        title: "Обмен охотничьей добычей",
        description: "Требует честного расчёта: каждый открытый тезис за каждый полученный ответ.",
        domain: "luck",
        primary: 73,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Урок зелёного пояса",
        description: "Открыто признаёт малую человеческую погрешность и тем делает позицию неуязвимой для упрёка.",
        domain: "heart",
        primary: 65,
        secondary: 84
      },
      {
        title: "Неподвижная шея под секирой",
        description: "Выдерживает самый грозный замах критики без тени замешательства.",
        domain: "will",
        primary: 64,
        secondary: 81
      },
      {
        title: "Беседа в замке Бертилака",
        description: "Обходит тонкие искушения безукоризненной вежливостью и мерой.",
        domain: "word",
        primary: 62,
        secondary: 80
      },
      {
        title: "Верность новогоднему слову",
        description: "Держит обет даже тогда, когда все вокруг советуют отступить.",
        domain: "honor",
        primary: 63,
        secondary: 79
      },
      {
        title: "Скользящее касание стали",
        description: "Сводит сокрушительный выпад соперника к лёгкой царапине на второстепенном примере.",
        domain: "luck",
        primary: 58,
        secondary: 77
      }
    ]
  },
  {
    id: "dobrynya",
    slug: "dobrynya",
    name: "Добрыня Никитич",
    origin: "Киевский былинный цикл",
    epithet: "Мастер вежества и посольского слова",
    emblemKey: "mace",
    accentHex: "#8c4a27",
    corpora: ["slavic"],
    motifs: ["honor", "reason", "voyage"],
    dominants: [
      {
        title: "Посольская речь без крика",
        description: "Улаживает и поворачивает в свою пользу спор там, где другие хватаются за резкости.",
        domain: "word",
        primary: 84,
        secondary: 86
      },
      {
        title: "Партия в тавлеи у хана",
        description: "Переигрывает самоуверенного хозяина поля точным расчётом на три хода вперёд.",
        domain: "reason",
        primary: 82,
        secondary: 85
      },
      {
        title: "Укрощение двенадцати хоботов",
        description: "Отсекает побочные отговорки соперника одну за другой, доходя до корня спора.",
        domain: "will",
        primary: 80,
        secondary: 81
      },
      {
        title: "Служба по чести, а не за похвалу",
        description: "Берётся за самое трудное поручение, от которого отказались остальные.",
        domain: "honor",
        primary: 78,
        secondary: 80
      },
      {
        title: "Шляпа земли греческой",
        description: "Находит неожиданный подручный довод в самую тесную минуту схватки.",
        domain: "luck",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Природное богатырское вежество",
        description: "Ни на миг не теряет чинного тона ни в княжеской палате, ни в чистом поле.",
        domain: "honor",
        primary: 65,
        secondary: 83
      },
      {
        title: "Материнский наказ в дорогу",
        description: "Вовремя вспоминает коренное правило и удерживается от лишнего шага.",
        domain: "heart",
        primary: 63,
        secondary: 81
      },
      {
        title: "Второй заход в Пучай-реку",
        description: "Исправляет прежнюю недосказанность полным и окончательным решением.",
        domain: "will",
        primary: 62,
        secondary: 79
      },
      {
        title: "Разбор грамоты по складам",
        description: "Проверяет условия договора до последней буквы, не оставляя лазеек.",
        domain: "reason",
        primary: 61,
        secondary: 80
      },
      {
        title: "Звончатая струна на пиру",
        description: "Разряжает сгустившуюся атмосферу тонкой и уместной присказкой.",
        domain: "word",
        primary: 58,
        secondary: 77
      }
    ]
  },
  {
    id: "alyosha-popovich",
    slug: "alyosha-popovich",
    name: "Алёша Попович",
    origin: "Киевский былинный цикл",
    epithet: "Находчивый стрелок внезапного манёвра",
    emblemKey: "bow-horn",
    accentHex: "#9b6b24",
    corpora: ["slavic"],
    motifs: ["trickster", "honor"],
    dominants: [
      {
        title: "Оглядка на чистое поле",
        description: "Заставляет тяжеловесного соперника обернуться на мнимую помеху и терять строй мысли.",
        domain: "luck",
        primary: 84,
        secondary: 86
      },
      {
        title: "Переодевание в калику перехожего",
        description: "Подходит к чужому тезису в скромном виде и наносит удар с близкой дистанции.",
        domain: "word",
        primary: 82,
        secondary: 83
      },
      {
        title: "Выстрел из-за дубовой ветви",
        description: "Находит единственную незащищённую точку в громоздком построении Тугарина.",
        domain: "reason",
        primary: 79,
        secondary: 81
      },
      {
        title: "Удалая смелость младшего",
        description: "Выходит вперёд там, где рассудительные спорщики долго взвешивают риск.",
        domain: "will",
        primary: 76,
        secondary: 77
      },
      {
        title: "Стояние за родной рубеж",
        description: "За лукавой манерой речи твёрдо держит общую заставу вместе со старшими братьями.",
        domain: "honor",
        primary: 74,
        secondary: 76
      }
    ],
    appeals: [
      {
        title: "Внезапный дождь по крыльям",
        description: "Осаживает высокопарный полёт чужой риторики трезвым земным обстоятельством.",
        domain: "luck",
        primary: 64,
        secondary: 84
      },
      {
        title: "Быстрая отговорка с прищуром",
        description: "Выворачивается из прямого упрёка живой шуткой, которую поддерживает зал.",
        domain: "word",
        primary: 62,
        secondary: 82
      },
      {
        title: "Расчёт не силой, а сметкой",
        description: "Бережёт ресурс там, где прямой обмен давлением невыгоден.",
        domain: "reason",
        primary: 60,
        secondary: 79
      },
      {
        title: "Примирение у братского стола",
        description: "Искренне уступает первенство старшему доводу, сохраняя единство позиции.",
        domain: "heart",
        primary: 59,
        secondary: 77
      },
      {
        title: "Лёгкое стремя отхода",
        description: "Вовремя меняет рубеж защиты до того, как оппонент сомкнёт кольцо.",
        domain: "will",
        primary: 58,
        secondary: 75
      }
    ]
  },
  {
    id: "sadko",
    slug: "sadko",
    name: "Садко",
    origin: "Новгородский былинный цикл",
    epithet: "Гусельник Ильмень-озера и тридцати кораблей",
    emblemKey: "gusli",
    accentHex: "#2b6f77",
    corpora: ["slavic"],
    motifs: ["voyage", "trickster"],
    dominants: [
      {
        title: "Заклад о рыбе золотые перья",
        description: "Выдвигает смелый тезис против всего купеческого ряда и подтверждает его делом.",
        domain: "luck",
        primary: 84,
        secondary: 86
      },
      {
        title: "Игра на яровчатых гуслях",
        description: "Задаёт такой темп спора, что даже хозяин морской пучины пускается в пляс по его ладу.",
        domain: "word",
        primary: 83,
        secondary: 85
      },
      {
        title: "Караван червлёных кораблей",
        description: "Разворачивает за одним примером целую флотилию весомых свидетельств.",
        domain: "reason",
        primary: 78,
        secondary: 80
      },
      {
        title: "Спокойный жребий на волне",
        description: "Без суеты принимает на себя главный вопрос, когда жребий указывает прямо на него.",
        domain: "honor",
        primary: 76,
        secondary: 78
      },
      {
        title: "Поклон реке Волхову",
        description: "Соединяет дальновидную предприимчивость с благодарной памятью о своих корнях.",
        domain: "heart",
        primary: 74,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Оборванные вовремя струны",
        description: "Останавливает собственный напор ровно в тот миг, когда избыток силы мог бы навредить делу.",
        domain: "reason",
        primary: 64,
        secondary: 84
      },
      {
        title: "Выбор скромной Чернавушки",
        description: "Среди трёхсот блестящих соблазнов выбирает единственное решение, ведущее домой.",
        domain: "luck",
        primary: 63,
        secondary: 83
      },
      {
        title: "Некупитая слава Новгорода",
        description: "Честно признаёт, что богатство отдельного довода не выше целого корпуса знания.",
        domain: "honor",
        primary: 61,
        secondary: 79
      },
      {
        title: "Песня на озёрном берегу",
        description: "Хранит душевное равновесие и в бедности, и в палатах морского царя.",
        domain: "heart",
        primary: 60,
        secondary: 80
      },
      {
        title: "Дубовая доска в синем море",
        description: "Даже оставшись один против стихии, сохраняет инструмент и ясность ума.",
        domain: "will",
        primary: 59,
        secondary: 76
      }
    ]
  },
  {
    id: "marya-morevna",
    slug: "marya-morevna",
    name: "Марья Моревна",
    origin: "Русские народные сказки",
    epithet: "Королевна ратного поля и серебряных ключей",
    emblemKey: "falcon",
    accentHex: "#8d2f45",
    corpora: ["slavic"],
    motifs: ["will", "honor"],
    dominants: [
      {
        title: "Разгром рати в чистом поле",
        description: "Складывает разрозненные возражения противника в ровные ряды уже решённых вопросов.",
        domain: "will",
        primary: 86,
        secondary: 84
      },
      {
        title: "Двенадцать цепей в чулане",
        description: "Держит самую опасную ложную предпосылку под строгим логическим замком.",
        domain: "reason",
        primary: 83,
        secondary: 85
      },
      {
        title: "Прямой наказ перед походом",
        description: "Чётко отделяет дозволенные допущения от одного гибельного шага.",
        domain: "honor",
        primary: 80,
        secondary: 81
      },
      {
        title: "Погоня на добром коне",
        description: "Настигает ускользающий тезис раньше, чем тот успеет укрыться за оговорками.",
        domain: "luck",
        primary: 76,
        secondary: 78
      },
      {
        title: "Великодушие к нарушенному запрету",
        description: "Даёт союзной мысли шанс исправить оплошность, не разрушая общего замысла.",
        domain: "heart",
        primary: 74,
        secondary: 79
      }
    ],
    appeals: [
      {
        title: "Табун у морской ведуньи",
        description: "Опирается на выносливость, воспитанную в самых трудных испытаниях.",
        domain: "will",
        primary: 65,
        secondary: 82
      },
      {
        title: "Три зятя-крылатых вестника",
        description: "Призывает на помощь родственные области знания — сокола, орла и ворона.",
        domain: "luck",
        primary: 62,
        secondary: 81
      },
      {
        title: "Державный порядок в теремах",
        description: "Всякий довод знает своё место и свой ключ в общей связке.",
        domain: "reason",
        primary: 63,
        secondary: 80
      },
      {
        title: "Царственная сдержанность слова",
        description: "Не тратит лишних фраз там, где достаточно одного твёрдого взгляда.",
        domain: "word",
        primary: 59,
        secondary: 77
      },
      {
        title: "Верность данному союзу",
        description: "Выдерживает три попытки перехвата, не сдавая главной позиции.",
        domain: "honor",
        primary: 60,
        secondary: 78
      }
    ]
  },
  {
    id: "baba-yaga",
    slug: "baba-yaga",
    name: "Баба-яга",
    origin: "Русские народные сказки",
    epithet: "Стражница лесной межи и прямого спроса",
    emblemKey: "mortar",
    accentHex: "#5b4a33",
    corpora: ["slavic"],
    motifs: ["trickster", "reason"],
    dominants: [
      {
        title: "Дело пытаешь али от дела лытаешь?",
        description: "С первого вопроса отсекает праздную риторику и требует назвать подлинную цель спора.",
        domain: "word",
        primary: 85,
        secondary: 87
      },
      {
        title: "Избушка к лесу задом",
        description: "Разворачивает предмет обсуждения лицом к проверяющему, лишая оппонента укрытия.",
        domain: "reason",
        primary: 82,
        secondary: 85
      },
      {
        title: "Помело, сметающее след",
        description: "Убирает за своим выводом промежуточные леса, так что сопернику не за что уцепиться.",
        domain: "luck",
        primary: 80,
        secondary: 83
      },
      {
        title: "Проверка трёх всадников",
        description: "Сопоставляет тезис со сменой утра, дня и ночи, выявляя его долговечность.",
        domain: "will",
        primary: 77,
        secondary: 79
      },
      {
        title: "Древний обычай порога",
        description: "Кто выдержал спрос по чину — получает путеводный клубок без утайки.",
        domain: "honor",
        primary: 74,
        secondary: 77
      }
    ],
    appeals: [
      {
        title: "Сперва накорми да расспроси",
        description: "Требует соблюсти процедуру уважения к собеседнику прежде любого обвинения.",
        domain: "honor",
        primary: 64,
        secondary: 82
      },
      {
        title: "Заветный клубочек под ноги",
        description: "Находит неожиданную, но безошибочную тропу там, где рассудок видит лишь чащу.",
        domain: "luck",
        primary: 63,
        secondary: 84
      },
      {
        title: "Загадка с железным замком",
        description: "Ограждает суть ответа плотной иносказательной бронёй.",
        domain: "word",
        primary: 62,
        secondary: 81
      },
      {
        title: "Зоркость на чужой дух",
        description: "Мгновенно чует подмену понятий за самой гладкой формулировкой.",
        domain: "reason",
        primary: 61,
        secondary: 80
      },
      {
        title: "Вековая стоянка на меже",
        description: "Не сдвигается со своего пограничного места ни от угроз, ни от лести.",
        domain: "will",
        primary: 59,
        secondary: 76
      }
    ]
  },
  {
    id: "ivan-the-fool",
    slug: "ivan-the-fool",
    name: "Иван-дурак",
    origin: "Русские народные сказки",
    epithet: "Несчётный третий брат удачного простодушия",
    emblemKey: "feather-fire",
    accentHex: "#b85c1f",
    corpora: ["slavic"],
    motifs: ["trickster", "voyage"],
    dominants: [
      {
        title: "Прыжок на третий венец",
        description: "С третьей попытки берёт ту высоту обобщения, до которой не дотянулись расчётливые братья.",
        domain: "luck",
        primary: 86,
        secondary: 88
      },
      {
        title: "Перо Жар-птицы в рукаве",
        description: "Предъявляет один сияющий факт, который освещает всю темноту чужих оговорок.",
        domain: "heart",
        primary: 82,
        secondary: 84
      },
      {
        title: "Простодушный вопрос царю",
        description: "Говорит вслух то, о чём хитрецы умалчивают из опасения показаться смешными.",
        domain: "word",
        primary: 80,
        secondary: 82
      },
      {
        title: "Ночной дозор в пшенице",
        description: "Терпеливо сидит до полуночи там, где другие бросили проверку на полпути.",
        domain: "will",
        primary: 77,
        secondary: 79
      },
      {
        title: "Раздел по совести, а не по чину",
        description: "Отказывается от нечестной выгоды и тем выигрывает главное доверие зала.",
        domain: "honor",
        primary: 75,
        secondary: 78
      }
    ],
    appeals: [
      {
        title: "Подсказка Конька-Горбунка",
        description: "Превращает грозный приказ оппонента в ступеньку к собственному торжеству.",
        domain: "luck",
        primary: 65,
        secondary: 86
      },
      {
        title: "Смех над собственной неудачей",
        description: "Не боится выглядеть простым, поэтому колкости соскальзывают без следа.",
        domain: "heart",
        primary: 63,
        secondary: 82
      },
      {
        title: "Живая вода после котла",
        description: "Выходит из самого жёсткого испытания обновлённым и ещё более убедительным.",
        domain: "will",
        primary: 62,
        secondary: 80
      },
      {
        title: "Сказка в лад да в меру",
        description: "Отвечает складной присказкой, запоминающейся лучше учёного трактата.",
        domain: "word",
        primary: 60,
        secondary: 79
      },
      {
        title: "Крестьянская сметка на деле",
        description: "За кажущейся простотой держит точный практический расчёт.",
        domain: "reason",
        primary: 58,
        secondary: 77
      }
    ]
  }
];
