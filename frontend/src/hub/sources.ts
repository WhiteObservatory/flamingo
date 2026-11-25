import { тр } from '../lib/язык.ts'
/** Flamingo HUB — чужие открытые источники мира.
 *
 *  Источники, у каждого сказано словами: что даёт, что можно,
 *  чего нельзя и что будет, если он замолчит. Право — четыре человеческие
 *  формулировки, а не четыре названия лицензий: их читает ученик, а не юрист.
 *
 *  Состав перенесён с утверждённого листа «Источники мира»; 10.11.2026 владелец
 *  добавил музеи с открытыми собраниями.
 *
 *  🔴 ПОЛЯ `state` ЗДЕСЬ НЕТ И БЫТЬ НЕ МОЖЕТ. Оно стояло: `ok` / `live` / `down`,
 *  и три экрана выводили по нему «отвечает · проверено сегодня», «молчит с 09:40»,
 *  «Ответили 29 из 36», «молчат 1 из 36». Ни одной проверки за этими словами не
 *  было ни разу: буква была набрана руками, время «09:40» выдумано мной, а числа
 *  «29» и «1» посчитаны по выдуманным буквам. Осмотр 08.09, находка 19.
 *
 *  Опросить эти 36 сайтов со страницы нельзя в принципе: чужой сервер не отвечает
 *  на запрос из браузера (CORS), нужен опрос со стороны сервера — отдельная работа,
 *  и она не сделана. Пока её нет, каталог не произносит ни слова о доступности.
 *
 *  Вместо состояния карточка говорит то, что мы про источник ЗНАЕМ наверняка и что
 *  человеку на уроке нужнее: что с ним МОЖНО делать (`RIGHTS[...].tag`).
 */

export type Right = 'link' | 'own' | 'attr' | 'show' | 'live'
export type Kind = 'интерактивы' | 'снимки' | 'данные' | 'карты' | 'книги' | 'трансляции'

export type Source = {
  id: string
  kind: Kind
  name: string
  gives: string
  right: Right
  /** Куда идти за самим источником. Без адреса каталог — витрина имён:
   *  человек выбрал строку и упёрся в тупик (поймано владельцем 31.08). */
  home: string
}

/** 🔴 `tag` — та же мысль, что `short`, но в одну строку карточки.
 *  Мерено 08.09: `short` у права `live` — 37 знаков, в колонку каталога (255 px
 *  на четырёх колонках) не влезает и переносится второй строкой. Соседние
 *  карточки ряда от этого разъезжаются кромками (ПРАВИЛА 3.3, 6.7а). Поэтому у
 *  карточки своя метка до двадцати знаков, а полные четыре формулировки ПРАВИЛ
 *  8.10 остаются там, где на них есть место, — в витрине источника. */
/** 🔴 У ЭТИХ ИСТОЧНИКОВ ВИТРИНА — РЕКЛАМА, А НЕ ВИД, И РЕШИЛ ЭТО ЧЕЛОВЕК.
 *
 *  Суточный обход берёт то, что сайт объявил своей витриной (`og:image`), и
 *  сам по себе он не отличает вид мира от рекламной карточки: у PubMed Central
 *  это постановочное фото за ноутбуком с юридической оговоркой мелким шрифтом —
 *  по краям, цветам и весу оно не отличается от настоящей фотографии. Числа
 *  тут не помогают: любой порог, который отсёк бы эту карточку, отсёк бы заодно
 *  снимок «Джеймса Уэбба».
 *
 *  Поэтому машина приносит кандидатов, а отказывает человек — и говорит, чем
 *  именно карточка не годится. Строка отсюда сразу перестаёт и скачиваться, и
 *  отдаваться: старый файл на диске остаётся, но наружу больше не идёт.
 *
 *  Проверено глазами на боевых снимках 12.09.
 */
export const БЕЗ_СНИМКА: Record<string, string> = {
  inat: тр("логотип на белом фоне"),
  owid: тр("слайд с лозунгом, ни одной картинки"),
  europeana: тр("фирменная рисованная карта Европы со значками"),
  pmc: тр("постановочное фото с юридической оговоркой мелким шрифтом"),
}

export const RIGHTS: Record<Right, { tag: string; short: string; can: string; cant: string }> = {
  link: { tag: тр("на сайте автора"), short: тр("открыть у автора"), can: тр("можно: перейти к материалу по ссылке"), cant: тр("условия использования указаны у автора") },
  own: {
    tag: тр("можно брать себе"),
    short: тр("можно брать в свою работу"),
    can: тр("можно: показывать, скачивать, вставлять в свою работу и публиковать её"),
    cant: тр("нельзя: выдавать за своё — источник называется рядом"),
  },
  attr: {
    tag: тр("можно, назвав автора"),
    short: тр("можно, если назвать автора"),
    can: тр("можно: показывать и вставлять в работу, назвав автора и источник"),
    cant: тр("нельзя: продавать и убирать имя автора"),
  },
  show: {
    tag: тр("можно показывать"),
    short: тр("можно показывать классу"),
    can: тр("можно: открыть на уроке и на проекторе, читать вслух"),
    cant: тр("нельзя: копировать в свою работу и раздавать файлом"),
  },
  live: {
    tag: тр("только на уроке"),
    short: тр("только внутри урока, копий не остаётся"),
    can: тр("можно: вывести живой поток классу на время урока"),
    cant: тр("нельзя: записывать и пересматривать — записей у нас нет вообще"),
  },
}

export const KINDS: Kind[] = ['интерактивы', 'снимки', 'данные', 'карты', 'книги', 'трансляции']

export const SOURCES: Source[] = [
  { id: 'assembly', kind: 'интерактивы', name: тр("Anatomy Assembly"), gives: тр("Соберите тело по системам: расставьте кости, органы, сосуды и нервы."), right: 'link', home: 'https://sciencegameslab.com/games/anatomy-assembly/' },
  { id: 'skeleton', kind: 'интерактивы', name: тр("Build a Skeleton · Dairy Australia"), gives: тр("Перетащите каждую кость на своё место в скелете."), right: 'link', home: 'https://www.dairy.com.au/education/students/dairy-games/build-a-skeleton' },
  { id: 'kidworld', kind: 'интерактивы', name: тр("Build a Skeleton · KidWorld"), gives: тр("Соберите скелет на рентгеновском контуре."), right: 'link', home: 'https://kidworld.org/play/science-build-a-skeleton' },
  { id: 'studio', kind: 'интерактивы', name: тр("BioDigital Human Studio"), gives: тр("Редактор для преподавателя: настройте собственную сцену из готовой модели. По ссылке — описание и вход в продукт."), right: 'link', home: 'https://www.biodigital.com/product/human-studio' },
  { id: 'cogni', kind: 'интерактивы', name: тр("Cogni Anatomy"), gives: тр("Изолируйте сердце или мозг, скрывайте ткани и изучайте срезы."), right: 'link', home: 'https://cogni.cards/anatomy/' },
  { id: 'learn3d', kind: 'интерактивы', name: тр("LearnAnatomy3D"), gives: тр("Вращайте тело, переключайте системы и выбирайте плоскость сечения."), right: 'link', home: 'https://learnanatomy3d.com/' },
  { id: 'ana3d', kind: 'интерактивы', name: тр("Ana3D"), gives: тр("Выберите атлас тела, отдельной области или органа."), right: 'link', home: 'https://ana3d.app/en/' },
  { id: 'mazze', kind: 'интерактивы', name: тр("Mazze Studios · 3D Atlas"), gives: тр("Исследуйте отдельно органы, кости и мышцы."), right: 'link', home: 'https://www.mazzestudios.com/tools/anatomy-atlas/' },
  { id: 'interface', kind: 'интерактивы', name: тр("Anatomy Interface"), gives: тр("Выберите область тела и исследуйте слои."), right: 'link', home: 'https://anatomyinterface.com/' },
  { id: 'humanatlas', kind: 'интерактивы', name: тр("Human Atlas"), gives: тр("Выделите органы и кости на объёмной модели."), right: 'link', home: 'https://human-atlas.co/' },
  { id: 'lorea', kind: 'интерактивы', name: тр("Lorea · Human Body Atlas"), gives: тр("Разведите части модели и проверьте себя после осмотра."), right: 'link', home: 'https://www.lorea.app/3d-library/human-body-atlas' },
  { id: 'astraon', kind: 'интерактивы', name: тр("Astraon · Human Atlas"), gives: тр("Поверните тело, разберите модель и найдите структуру по названию."), right: 'link', home: 'https://astraonlabs.com/atlas/' },
  { id: 'skeleton-bio', kind: 'интерактивы', name: тр("BioDigital · скелет"), gives: тр("Рассмотрите костную систему отдельно от остальных систем тела."), right: 'link', home: 'https://anatomy.biodigital.com/skeletal-system' },
  { id: 'collections-louvre-fr', kind: 'снимки', name: тр("Лувр · коллекции"), gives: тр("Найдите экспонат по эпохе или материалу"), right: 'show', home: 'https://collections.louvre.fr/' },
  { id: 'portal-brain-map-org', kind: 'интерактивы', name: тр("Allen Brain Atlas"), gives: тр("Сопоставьте срезы и области мозга"), right: 'show', home: 'https://portal.brain-map.org/' },
  { id: 'animaldiversity-org', kind: 'данные', name: тр("Animal Diversity Web"), gives: тр("Сравните строение и среду обитания животных"), right: 'show', home: 'https://animaldiversity.org/' },
  { id: 'ccsb-scripps-edu-cellpaint', kind: 'интерактивы', name: тр("CellPAINT"), gives: тр("Соберите иллюстрацию клетки из молекул"), right: 'show', home: 'https://ccsb.scripps.edu/cellpaint/' },
  { id: 'climatereanalyzer-org', kind: 'карты', name: тр("Climate Reanalyzer"), gives: тр("Изучайте карты температур и климатические ряды"), right: 'show', home: 'https://climatereanalyzer.org/' },
  { id: 'desmos-com-geometry', kind: 'интерактивы', name: тр("Desmos · геометрия"), gives: тр("Постройте фигуру и проверьте её свойства"), right: 'show', home: 'https://www.desmos.com/geometry' },
  { id: 'desmos-com-calculator', kind: 'интерактивы', name: тр("Desmos · графики"), gives: тр("Измените коэффициент и проследите за графиком"), right: 'show', home: 'https://www.desmos.com/calculator' },
  { id: 'desmos-com-3d', kind: 'интерактивы', name: тр("Desmos · графики в 3D"), gives: тр("Постройте поверхность по уравнению"), right: 'show', home: 'https://www.desmos.com/3d' },
  { id: 'ebird-org-map', kind: 'интерактивы', name: тр("eBird · карты наблюдений"), gives: тр("Найдите, где встречается выбранный вид птиц"), right: 'show', home: 'https://ebird.org/map' },
  { id: 'sky-esa-int', kind: 'интерактивы', name: тр("ESASky"), gives: тр("Сравните один участок неба в разных диапазонах"), right: 'show', home: 'https://sky.esa.int/' },
  { id: 'mapper-obis-org', kind: 'интерактивы', name: тр("Explore the ocean · Ocean Biodiversity Information System"), gives: тр("Изучайте наблюдения морских видов на карте"), right: 'show', home: 'https://mapper.obis.org/' },
  { id: 'gapminder-org-tools', kind: 'данные', name: тр("Gapminder Tools"), gives: тр("Сравните доходы и продолжительность жизни стран по годам"), right: 'show', home: 'https://www.gapminder.org/tools/' },
  { id: 'globalforestwatch-org-map', kind: 'карты', name: тр("Global Forest Watch"), gives: тр("Сравните изменения лесного покрова по годам"), right: 'show', home: 'https://www.globalforestwatch.org/map/' },
  { id: 'proteinatlas-org', kind: 'данные', name: тр("Human Protein Atlas"), gives: тр("Рассмотрите изображения тканей и клеток"), right: 'show', home: 'https://www.proteinatlas.org/' },
  { id: 'learningmusic-ableton-com', kind: 'интерактивы', name: тр("Learning Music · Ableton"), gives: тр("Соберите ритм и сравните последовательности аккордов"), right: 'show', home: 'https://learningmusic.ableton.com/' },
  { id: 'learningsynths-ableton-com', kind: 'интерактивы', name: тр("Learning Synths · Ableton"), gives: тр("Меняйте форму волны и слушайте тембр"), right: 'show', home: 'https://learningsynths.ableton.com/' },
  { id: 'polypad-amplify-com-p', kind: 'интерактивы', name: тр("Mathigon Polypad"), gives: тр("Собирайте фигуры, дроби и мозаики"), right: 'show', home: 'https://polypad.amplify.com/p' },
  { id: 'ocw-mit-edu', kind: 'книги', name: тр("MIT OpenCourseWare"), gives: тр("Выберите курс с конспектами и заданиями"), right: 'show', home: 'https://ocw.mit.edu/' },
  { id: 'molview-org', kind: 'интерактивы', name: тр("MolView · модели молекул"), gives: тр("Переходите от структурной формулы к объёмной молекуле"), right: 'show', home: 'https://molview.org/' },
  { id: 'musicca-com-exercises', kind: 'интерактивы', name: тр("Musicca"), gives: тр("Тренируйтесь узнавать интервалы и ноты"), right: 'show', home: 'https://www.musicca.com/exercises' },
  { id: 'climate-nasa-gov-interactives-climate-time-machine', kind: 'карты', name: тр("NASA Climate Time Machine"), gives: тр("Проследите изменения ледового покрова и температуры"), right: 'show', home: 'https://climate.nasa.gov/interactives/climate-time-machine/' },
  { id: 'eyes-nasa-gov-apps-asteroids', kind: 'интерактивы', name: тр("NASA Eyes · астероиды"), gives: тр("Рассмотрите траектории астероидов рядом с Землёй"), right: 'show', home: 'https://eyes.nasa.gov/apps/asteroids/' },
  { id: 'eyes-nasa-gov-apps-solar-system', kind: 'интерактивы', name: тр("NASA Eyes · Солнечная система"), gives: тр("Вращайте модель планет и сравнивайте орбиты"), right: 'show', home: 'https://eyes.nasa.gov/apps/solar-system/' },
  { id: 'eyes-nasa-gov-apps-exo', kind: 'интерактивы', name: тр("NASA Eyes · экзопланеты"), gives: тр("Исследуйте планеты у других звёзд"), right: 'show', home: 'https://eyes.nasa.gov/apps/exo/' },
  { id: 'firms-modaps-eosdis-nasa-gov-map', kind: 'карты', name: тр("NASA FIRMS"), gives: тр("Найдите области пожаров на спутниковой карте"), right: 'show', home: 'https://firms.modaps.eosdis.nasa.gov/map/' },
  { id: 'nobaproject-com', kind: 'книги', name: тр("Noba"), gives: тр("Читайте учебные модули по психологии"), right: 'show', home: 'https://nobaproject.com/' },
  { id: 'oldmapsonline-org', kind: 'книги', name: тр("Old Maps Online"), gives: тр("Найдите старые карты одного места"), right: 'show', home: 'https://www.oldmapsonline.org/' },
  { id: 'onezoom-org', kind: 'интерактивы', name: тр("OneZoom · древо жизни"), gives: тр("Проследите родство от одного вида к другому"), right: 'show', home: 'https://www.onezoom.org/' },
  { id: 'openinframap-org', kind: 'карты', name: тр("OpenInfraMap"), gives: тр("Проследите маршруты линий электропередачи"), right: 'show', home: 'https://openinframap.org/' },
  { id: 'open-edu-openlearn', kind: 'книги', name: тр("OpenLearn"), gives: тр("Найдите открытый курс по предмету"), right: 'show', home: 'https://www.open.edu/openlearn/' },
  { id: 'openrailwaymap-org', kind: 'карты', name: тр("OpenRailwayMap"), gives: тр("Сравните железнодорожные сети разных стран"), right: 'show', home: 'https://www.openrailwaymap.org/' },
  { id: 'map-openseamap-org', kind: 'карты', name: тр("OpenSeaMap"), gives: тр("Исследуйте порты и навигационные знаки"), right: 'show', home: 'https://map.openseamap.org/' },
  { id: 'opentopomap-org', kind: 'карты', name: тр("OpenTopoMap"), gives: тр("Читайте рельеф по горизонталям"), right: 'show', home: 'https://opentopomap.org/' },
  { id: 'perseus-tufts-edu-hopper', kind: 'книги', name: тр("Perseus Digital Library"), gives: тр("Читайте античные тексты и сопоставляйте переводы"), right: 'show', home: 'https://www.perseus.tufts.edu/hopper/' },
  { id: 'phet-states-of-matter', kind: 'интерактивы', name: тр("PhET · Агрегатные состояния"), gives: тр("Нагрейте вещество и наблюдайте движение частиц"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/states-of-matter' },
  { id: 'phet-wave-on-a-string', kind: 'интерактивы', name: тр("PhET · Волна на струне"), gives: тр("Меняйте частоту и наблюдайте отражение волны"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/wave-on-a-string' },
  { id: 'phet-geometric-optics', kind: 'интерактивы', name: тр("PhET · Геометрическая оптика"), gives: тр("Перемещайте линзу и наблюдайте изображение"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/geometric-optics' },
  { id: 'phet-gravity-force-lab', kind: 'интерактивы', name: тр("PhET · Гравитационные силы"), gives: тр("Измерьте силу при разных расстояниях"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/gravity-force-lab' },
  { id: 'phet-gravity-and-orbits', kind: 'интерактивы', name: тр("PhET · Гравитация и орбиты"), gives: тр("Измените скорость спутника и проследите траекторию"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/gravity-and-orbits' },
  { id: 'phet-graphing-lines', kind: 'интерактивы', name: тр("PhET · Графики прямых"), gives: тр("Измените наклон прямой и сравните уравнения"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/graphing-lines' },
  { id: 'phet-masses-and-springs', kind: 'интерактивы', name: тр("PhET · Грузы и пружины"), gives: тр("Подберите груз и измерьте растяжение"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/masses-and-springs' },
  { id: 'phet-projectile-motion', kind: 'интерактивы', name: тр("PhET · Движение под углом"), gives: тр("Подберите угол для попадания в цель"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/projectile-motion' },
  { id: 'phet-diffusion', kind: 'интерактивы', name: тр("PhET · Диффузия"), gives: тр("Откройте перегородку и проследите смешивание частиц"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/diffusion' },
  { id: 'phet-natural-selection', kind: 'интерактивы', name: тр("PhET · Естественный отбор"), gives: тр("Меняйте условия среды и сравнивайте поколения"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/natural-selection' },
  { id: 'phet-hookes-law', kind: 'интерактивы', name: тр("PhET · Закон Гука"), gives: тр("Сопоставьте силу и удлинение пружины"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/hookes-law' },
  { id: 'phet-ohms-law', kind: 'интерактивы', name: тр("PhET · Закон Ома"), gives: тр("Сравните ток при разном напряжении и сопротивлении"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/ohms-law' },
  { id: 'phet-faradays-law', kind: 'интерактивы', name: тр("PhET · Закон Фарадея"), gives: тр("Проведите магнит через катушку и наблюдайте напряжение"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/faradays-law' },
  { id: 'phet-charges-and-fields', kind: 'интерактивы', name: тр("PhET · Заряды и поля"), gives: тр("Разместите заряды и исследуйте электрическое поле"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/charges-and-fields' },
  { id: 'phet-fractions-intro', kind: 'интерактивы', name: тр("PhET · Знакомство с дробями"), gives: тр("Представьте одну дробь разными способами"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/fractions-intro' },
  { id: 'phet-isotopes-and-atomic-mass', kind: 'интерактивы', name: тр("PhET · Изотопы"), gives: тр("Сравните массы изотопов одного элемента"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/isotopes-and-atomic-mass' },
  { id: 'phet-wave-interference', kind: 'интерактивы', name: тр("PhET · Интерференция волн"), gives: тр("Сопоставьте картины от двух источников"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/wave-interference' },
  { id: 'phet-graphing-quadratics', kind: 'интерактивы', name: тр("PhET · Квадратичные функции"), gives: тр("Меняйте коэффициенты параболы"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/graphing-quadratics' },
  { id: 'phet-acid-base-solutions', kind: 'интерактивы', name: тр("PhET · Кислоты и основания"), gives: тр("Сравните свойства растворов по показаниям приборов"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/acid-base-solutions' },
  { id: 'phet-capacitor-lab-basics', kind: 'интерактивы', name: тр("PhET · Конденсатор"), gives: тр("Меняйте расстояние между пластинами"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/capacitor-lab-basics' },
  { id: 'phet-function-builder', kind: 'интерактивы', name: тр("PhET · Конструктор функций"), gives: тр("Соберите цепочку преобразований чисел"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/function-builder' },
  { id: 'phet-concentration', kind: 'интерактивы', name: тр("PhET · Концентрация"), gives: тр("Добавьте растворитель и сравните показания"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/concentration' },
  { id: 'phet-least-squares-regression', kind: 'интерактивы', name: тр("PhET · Линейная регрессия"), gives: тр("Добавьте точки и сравните линии приближения"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/least-squares-regression' },
  { id: 'phet-pendulum-lab', kind: 'интерактивы', name: тр("PhET · Маятник"), gives: тр("Измерьте период при разной длине нити"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/pendulum-lab' },
  { id: 'phet-molarity', kind: 'интерактивы', name: тр("PhET · Молярность"), gives: тр("Измените объём и число молей вещества"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/molarity' },
  { id: 'phet-neuron', kind: 'интерактивы', name: тр("PhET · Нейрон"), gives: тр("Проследите распространение импульса"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/neuron' },
  { id: 'phet-greenhouse-effect', kind: 'интерактивы', name: тр("PhET · Парниковый эффект"), gives: тр("Сопоставьте прохождение излучения при разных условиях"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/greenhouse-effect' },
  { id: 'phet-membrane-transport', kind: 'интерактивы', name: тр("PhET · Перенос через мембрану"), gives: тр("Наблюдайте перенос частиц через мембрану"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/membrane-transport' },
  { id: 'phet-density', kind: 'интерактивы', name: тр("PhET · Плотность"), gives: тр("Сравните массу и объём разных тел"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/density' },
  { id: 'phet-area-model-algebra', kind: 'интерактивы', name: тр("PhET · Площадь и алгебра"), gives: тр("Разложите произведение с помощью прямоугольников"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/area-model-algebra' },
  { id: 'phet-area-builder', kind: 'интерактивы', name: тр("PhET · Площадь и периметр"), gives: тр("Соберите фигуры с заданной площадью"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/area-builder' },
  { id: 'phet-fraction-matcher', kind: 'интерактивы', name: тр("PhET · Подбор дробей"), gives: тр("Сопоставьте рисунки и числовые записи"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/fraction-matcher' },
  { id: 'phet-curve-fitting', kind: 'интерактивы', name: тр("PhET · Подбор кривой"), gives: тр("Сравните модели по отклонению от точек"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/curve-fitting' },
  { id: 'phet-molecule-polarity', kind: 'интерактивы', name: тр("PhET · Полярность молекул"), gives: тр("Измените электроотрицательность и сравните диполи"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/molecule-polarity' },
  { id: 'phet-bending-light', kind: 'интерактивы', name: тр("PhET · Преломление света"), gives: тр("Измерьте углы падения и преломления"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/bending-light' },
  { id: 'phet-fractions-equality', kind: 'интерактивы', name: тр("PhET · Равенство дробей"), gives: тр("Подберите эквивалентные дроби"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/fractions-equality' },
  { id: 'phet-balancing-act', kind: 'интерактивы', name: тр("PhET · Равновесие рычага"), gives: тр("Уравновесьте грузы на разных плечах"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/balancing-act' },
  { id: 'phet-reactants-products-and-leftovers', kind: 'интерактивы', name: тр("PhET · Реагенты и остатки"), gives: тр("Найдите реагент, который закончится первым"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/reactants-products-and-leftovers' },
  { id: 'phet-gas-properties', kind: 'интерактивы', name: тр("PhET · Свойства газов"), gives: тр("Изменяйте объём сосуда и измеряйте давление"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/gas-properties' },
  { id: 'phet-forces-and-motion-basics', kind: 'интерактивы', name: тр("PhET · Силы и движение"), gives: тр("Меняйте силу и трение и наблюдайте разгон"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics' },
  { id: 'phet-vector-addition', kind: 'интерактивы', name: тр("PhET · Сложение векторов"), gives: тр("Сложите векторы и проверьте результирующее направление"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/vector-addition' },
  { id: 'phet-resistance-in-a-wire', kind: 'интерактивы', name: тр("PhET · Сопротивление провода"), gives: тр("Измените длину и сечение проводника"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/resistance-in-a-wire' },
  { id: 'phet-collision-lab', kind: 'интерактивы', name: тр("PhET · Столкновения"), gives: тр("Сравните скорости до и после удара"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/collision-lab' },
  { id: 'phet-build-an-atom', kind: 'интерактивы', name: тр("PhET · Строим атом"), gives: тр("Добавляйте частицы и определяйте элемент"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/build-an-atom' },
  { id: 'phet-plate-tectonics', kind: 'интерактивы', name: тр("PhET · Тектоника плит"), gives: тр("Сравните движения литосферных плит"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/plate-tectonics' },
  { id: 'phet-trig-tour', kind: 'интерактивы', name: тр("PhET · Тригонометрический круг"), gives: тр("Сопоставьте угол на окружности и значение функции"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/trig-tour' },
  { id: 'phet-unit-rates', kind: 'интерактивы', name: тр("PhET · Удельные величины"), gives: тр("Сравните цены и скорости на единицу"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/unit-rates' },
  { id: 'phet-molecule-shapes', kind: 'интерактивы', name: тр("PhET · Форма молекулы"), gives: тр("Меняйте число связей и вращайте модель"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/molecule-shapes' },
  { id: 'phet-balancing-chemical-equations', kind: 'интерактивы', name: тр("PhET · Химические уравнения"), gives: тр("Подберите коэффициенты перед молекулами"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/balancing-chemical-equations' },
  { id: 'phet-color-vision', kind: 'интерактивы', name: тр("PhET · Цветовое зрение"), gives: тр("Смешивайте свет и сравнивайте воспринимаемый цвет"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/color-vision' },
  { id: 'phet-ph-scale', kind: 'интерактивы', name: тр("PhET · Шкала pH"), gives: тр("Измерьте pH разных жидкостей"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/ph-scale' },
  { id: 'phet-gene-expression-essentials', kind: 'интерактивы', name: тр("PhET · Экспрессия генов"), gives: тр("Проследите путь от гена к белку"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/gene-expression-essentials' },
  { id: 'phet-energy-skate-park', kind: 'интерактивы', name: тр("PhET · Энергия на скейт-площадке"), gives: тр("Меняйте форму трассы и следите за энергией"), right: 'show', home: 'https://phet.colorado.edu/en/simulations/energy-skate-park' },
  { id: 'populationpyramid-net', kind: 'данные', name: тр("Population Pyramid"), gives: тр("Сопоставьте возрастные пирамиды стран"), right: 'show', home: 'https://www.populationpyramid.net/' },
  { id: 'stellarium-web-org', kind: 'интерактивы', name: тр("Stellarium Web"), gives: тр("Исследуйте ночное небо и находите созвездия"), right: 'show', home: 'https://stellarium-web.org/' },
  { id: 'teoria-com', kind: 'интерактивы', name: тр("Teoria"), gives: тр("Тренируйте слух и читайте нотные примеры"), right: 'show', home: 'https://www.teoria.com/' },
  { id: 'art-thewalters-org', kind: 'снимки', name: тр("The Walters Art Museum"), gives: тр("Рассмотрите детали музейных экспонатов"), right: 'show', home: 'https://art.thewalters.org/' },
  { id: 'slavevoyages-org', kind: 'книги', name: тр("Trans-Atlantic Slave Trade Database"), gives: тр("Исследуйте исторические маршруты по архивным данным"), right: 'show', home: 'https://www.slavevoyages.org/' },
  { id: 'data-un-org', kind: 'данные', name: тр("UN Data"), gives: тр("Сравните статистические показатели стран"), right: 'show', home: 'https://data.un.org/' },
  { id: 'databrowser-uis-unesco-org', kind: 'данные', name: тр("UNESCO Institute for Statistics"), gives: тр("Исследуйте международную статистику образования"), right: 'show', home: 'https://databrowser.uis.unesco.org/' },
  { id: 'ventusky-com', kind: 'карты', name: тр("Ventusky"), gives: тр("Посмотрите, как движутся воздушные массы"), right: 'show', home: 'https://www.ventusky.com/' },
  { id: 'walter-fendt-de-html5-phen', kind: 'интерактивы', name: тр("Walter Fendt"), gives: тр("Исследуйте физические явления в моделях HTML5"), right: 'show', home: 'https://www.walter-fendt.de/html5/phen/' },
  { id: 'windy-com', kind: 'карты', name: тр("Windy"), gives: тр("Сопоставьте карты ветра, облачности и осадков"), right: 'show', home: 'https://www.windy.com/' },
  { id: 'worldwidetelescope-org-webclient', kind: 'интерактивы', name: тр("WorldWide Telescope"), gives: тр("Перемещайтесь по панораме неба и изучайте объекты"), right: 'show', home: 'https://worldwidetelescope.org/webclient/' },
  { id: 'biodigital', kind: 'интерактивы', name: тр("BioDigital Human · анатомия"), gives: тр("Вращайте тело и выделяйте отдельные органы"), right: 'show', home: 'https://human.biodigital.com/' },
  { id: 'zygote', kind: 'интерактивы', name: тр("Zygote Body · слои тела"), gives: тр("Снимайте слои модели, чтобы увидеть органы под ними"), right: 'show', home: 'https://www.zygotebody.com/' },
  { id: 'cellscale', kind: 'интерактивы', name: тр("Размеры клеток"), gives: тр("Меняйте масштаб и сравнивайте клетки с молекулами"), right: 'show', home: 'https://learn.genetics.utah.edu/content/cells/scale/' },
  { id: 'phet-dc', kind: 'интерактивы', name: тр("PhET · электрические цепи"), gives: тр("Соберите цепь и сравните последовательное и параллельное соединение"), right: 'show', home: 'https://phet.colorado.edu/ru/simulations/circuit-construction-kit-dc' },
  { id: 'chemcollective', kind: 'интерактивы', name: тр("ChemCollective · химическая лаборатория"), gives: тр("Выбирайте растворы и исследуйте их концентрацию"), right: 'show', home: 'https://chemcollective.org/vlab/vlab.php' },
  { id: 'geogebra3d', kind: 'интерактивы', name: тр("GeoGebra · геометрия в 3D"), gives: тр("Стройте объёмные фигуры и исследуйте их сечения"), right: 'show', home: 'https://www.geogebra.org/3d' },
  { id: 'nullschool', kind: 'карты', name: тр("Earth Nullschool · ветер и океан"), gives: тр("Вращайте глобус и сравнивайте движение ветра в разные дни"), right: 'show', home: 'https://earth.nullschool.net/' },
  { id: 'apollo11', kind: 'интерактивы', name: тр("Smithsonian 3D · Аполлон-11"), gives: тр("Рассмотрите командный модуль и найдите люк и иллюминаторы"), right: 'show', home: 'https://3d.si.edu/object/nasm_A19700102000' },
  { id: 'songmaker', kind: 'интерактивы', name: тр("Song Maker · музыкальная лаборатория"), gives: тр("Нарисуйте мелодию по нотам и прослушайте свой ритм"), right: 'show', home: 'https://musiclab.chromeexperiments.com/Song-Maker/' },
  { id: 'apod', kind: 'снимки', name: тр("NASA · снимок дня"), gives: тр("Один астрономический снимок в сутки с объяснением на английском"), right: 'own', home: 'https://apod.nasa.gov/apod/astropix.html' },
  { id: 'hubble', kind: 'снимки', name: тр("Телескоп «Хаббл» · архив"), gives: тр("Тридцать лет снимков галактик, туманностей и планет"), right: 'own', home: 'https://hubblesite.org/images' },
  { id: 'jwst', kind: 'снимки', name: тр("Телескоп «Джеймс Уэбб»"), gives: тр("Инфракрасные снимки: видно то, что не видно в обычный свет"), right: 'own', home: 'https://webbtelescope.org/images' },
  { id: 'sdo', kind: 'данные', name: тр("NASA SDO · Солнце"), gives: тр("Снимок Солнца каждые 12 секунд, десять длин волн"), right: 'own', home: 'https://sdo.gsfc.nasa.gov/data/' },
  { id: 'earth', kind: 'карты', name: 'NASA Earthdata', gives: тр("Спутниковые снимки Земли: пожары, лёд, облака, растительность"), right: 'own', home: 'https://worldview.earthdata.nasa.gov/' },
  { id: 'iss', kind: 'трансляции', name: тр("МКС · внешняя камера"), gives: тр("Живой вид Земли со станции, звук отсутствует"), right: 'live', home: 'https://www.nasa.gov/live/' },
  { id: 'esa', kind: 'снимки', name: тр("ESA · Европейское космическое агентство"), gives: тр("Снимки миссий и Земли из космоса, подписи на английском"), right: 'attr', home: 'https://www.esa.int/ESA_Multimedia/Images' },
  { id: 'eso', kind: 'снимки', name: тр("ESO · южная обсерватория"), gives: тр("Снимки Чили: Млечный Путь, экзопланеты, телескопы"), right: 'attr', home: 'https://www.eso.org/public/images/' },
  { id: 'lapalma', kind: 'трансляции', name: тр("Обсерватория Ла-Пальма"), gives: тр("Живая картинка с площадки телескопов, задержка около 8 секунд"), right: 'live', home: 'https://www.gtc.iac.es/multimedia/webcams.php' },
  { id: 'noaa', kind: 'данные', name: тр("NOAA · погода и океан"), gives: тр("Температура, ветер, ураганы — числа и карты за 40 лет"), right: 'own', home: 'https://www.noaa.gov/climate' },
  { id: 'usgs', kind: 'данные', name: тр("USGS · землетрясения"), gives: тр("Все землетрясения мира, обновление каждые пять минут"), right: 'own', home: 'https://earthquake.usgs.gov/earthquakes/map/' },
  { id: 'kvert', kind: 'трансляции', name: тр("Камчатка · камеры на вулканах"), gives: тр("Живая картинка с вулканов, ночью почти ничего не видно"), right: 'live', home: 'https://glob.emsd.ru/visual-observations/' },
  { id: 'met', kind: 'снимки', name: тр("Метрополитен-музей · открытая коллекция"), gives: тр("490 тысяч изображений вещей и картин"), right: 'own', home: 'https://www.metmuseum.org/art/collection' },
  { id: 'rijks', kind: 'снимки', name: тр("Рейксмузеум"), gives: тр("Голландская живопись в очень высоком разрешении"), right: 'own', home: 'https://www.rijksmuseum.nl/en/collection' },
  { id: 'smith', kind: 'снимки', name: тр("Смитсоновский институт"), gives: тр("Три миллиона предметов: от насекомых до самолётов"), right: 'own', home: 'https://www.si.edu/openaccess' },
  /* Музеи с открытыми собраниями — добавлены по слову владельца 10.11.2026.
     Право сверено по страницам самих музеев: CC0 или общественное достояние —
     «можно брать себе»; у Британского музея лицензия некоммерческая и с
     указанием автора — «можно, назвав автора». */
  { id: 'artic', kind: 'снимки', name: тр("Чикагский институт искусств"), gives: тр("Больше 50 тысяч картин и вещей: импрессионисты, Хокусай"), right: 'own', home: 'https://www.artic.edu/collection' },
  { id: 'cleveland', kind: 'снимки', name: тр("Кливлендский музей искусств"), gives: тр("Искусство от Древнего Египта до модерна в высоком разрешении"), right: 'own', home: 'https://www.clevelandart.org/art/collection/search' },
  { id: 'nga', kind: 'снимки', name: тр("Национальная галерея искусства · Вашингтон"), gives: тр("Европейская и американская живопись: Леонардо, Вермеер, Ван Гог"), right: 'own', home: 'https://www.nga.gov/collection/collection-search.html' },
  { id: 'getty', kind: 'снимки', name: тр("Музей Гетти"), gives: тр("Рукописи, античность, старые мастера и ранняя фотография"), right: 'own', home: 'https://www.getty.edu/about/whatwedo/opencontent.html' },
  { id: 'parismusees', kind: 'снимки', name: тр("Музеи Парижа"), gives: тр("Собрания городских музеев Парижа: от Средневековья до моды"), right: 'own', home: 'https://www.parismuseescollections.paris.fr/' },
  { id: 'britishmuseum', kind: 'снимки', name: тр("Британский музей"), gives: тр("Почти два миллиона снимков вещей всех эпох и континентов"), right: 'attr', home: 'https://www.britishmuseum.org/collection' },
  /* 🔴 РУССКИЕ МУЗЕИ — «МОЖНО ПОКАЗЫВАТЬ», НЕ БОЛЬШЕ (владелец, 11.11: «давай их
     подключай»). Собрания открыты для просмотра, но воспроизводить музейные
     предметы у нас можно только с разрешения музея — поэтому на уроке смотрим
     на их сайте, а в свою работу не берём. Адреса проверены 11.11.2026. */
  { id: 'hermitage', kind: 'снимки', name: тр("Эрмитаж"), gives: тр("Собрание Эрмитажа: живопись, скульптура, древности — с поиском по коллекции"), right: 'show', home: 'https://www.hermitagemuseum.org/explore/artworks' },
  { id: 'tretyakov', kind: 'снимки', name: тр("Третьяковская галерея"), gives: тр("Русское искусство от икон до авангарда: тысячи произведений с описаниями"), right: 'show', home: 'https://my.tretyakov.ru/app/gallery' },
  { id: 'pushkin', kind: 'снимки', name: тр("Пушкинский музей"), gives: тр("Шедевры ГМИИ: Древний мир, старые мастера, импрессионисты"), right: 'show', home: 'https://collection.pushkinmuseum.art/entity/OBJECT?uniq=true' },
  { id: 'rusmuseum', kind: 'снимки', name: тр("Русский музей"), gives: тр("Виртуальный Русский музей: коллекция онлайн и прогулки по залам"), right: 'show', home: 'https://rusmuseumvrm.ru/collections/' },
  /* Лувр: снимки вещей, на которые уже нет авторского права, разрешено брать для
     учёбы бесплатно — с подписью и постоянной ссылкой (условия сайта собраний). */
  { id: 'louvre', kind: 'снимки', name: тр("Лувр"), gives: тр("Почти полмиллиона вещей Лувра — от Месопотамии до XIX века"), right: 'attr', home: 'https://collections.louvre.fr/en/' },
  { id: 'vangogh', kind: 'снимки', name: тр("Музей Ван Гога"), gives: тр("Картины, рисунки и письма Ван Гога в высоком разрешении"), right: 'show', home: 'https://www.vangoghmuseum.nl/en/collection' },
  { id: 'loc', kind: 'книги', name: тр("Библиотека Конгресса"), gives: тр("Карты, фотографии, газеты, звукозаписи XIX–XX веков"), right: 'own', home: 'https://www.loc.gov/collections/' },
  { id: 'gallica', kind: 'книги', name: тр("Gallica · Национальная библиотека Франции"), gives: тр("Рукописи, атласы и газеты, оцифрованные страницами"), right: 'show', home: 'https://gallica.bnf.fr/' },
  { id: 'bl', kind: 'книги', name: тр("Британская библиотека"), gives: тр("Средневековые рукописи и первые печатные книги"), right: 'show', home: 'https://www.bl.uk/collection/digitised-manuscripts-archives' },
  { id: 'bodleian', kind: 'книги', name: тр("Бодлианская библиотека"), gives: тр("Оксфордские собрания: наука и география до XIX века"), right: 'show', home: 'https://digital.bodleian.ox.ac.uk/' },
  { id: 'cambridge', kind: 'книги', name: тр("Кембриджская цифровая библиотека"), gives: тр("Тетради Ньютона его почерком, страница за страницей"), right: 'show', home: 'https://cudl.lib.cam.ac.uk/' },
  { id: 'gutenberg', kind: 'книги', name: тр("Проект «Гутенберг»"), gives: тр("70 тысяч книг, у которых кончился срок охраны"), right: 'own', home: 'https://www.gutenberg.org/' },
  { id: 'archive', kind: 'книги', name: тр("Интернет-архив"), gives: тр("Книги, звук, старое видео и копии исчезнувших сайтов"), right: 'attr', home: 'https://archive.org/' },
  { id: 'europeana', kind: 'книги', name: 'Europeana', gives: тр("Собрания музеев и архивов Европы в одном поиске"), right: 'attr', home: 'https://www.europeana.eu/' },
  { id: 'wiki', kind: 'снимки', name: тр("Викисклад"), gives: тр("Сто миллионов файлов, право у каждого своё и указано"), right: 'attr', home: 'https://commons.wikimedia.org/' },
  { id: 'rumsey', kind: 'карты', name: тр("Карты Дэвида Румзи"), gives: тр("Сто тысяч старых карт, наложенных на современную Землю"), right: 'attr', home: 'https://www.davidrumsey.com/' },
  { id: 'osm', kind: 'карты', name: 'OpenStreetMap', gives: тр("Карта мира, которую можно разобрать на слои и данные"), right: 'attr', home: 'https://www.openstreetmap.org/' },
  { id: 'gbif', kind: 'данные', name: тр("GBIF · биоразнообразие"), gives: тр("Где и когда каких животных и растений видели — два миллиарда записей"), right: 'own', home: 'https://www.gbif.org/' },
  { id: 'inat', kind: 'снимки', name: 'iNaturalist', gives: тр("Фотографии живого, снятые людьми и определённые сообществом"), right: 'attr', home: 'https://www.inaturalist.org/' },
  { id: 'eol', kind: 'книги', name: тр("Энциклопедия жизни"), gives: тр("Статья на каждый известный вид, с фотографиями"), right: 'attr', home: 'https://eol.org/' },
  { id: 'pdb', kind: 'данные', name: тр("Банк белковых структур"), gives: тр("Трёхмерные модели белков и вирусов, можно вертеть"), right: 'own', home: 'https://www.rcsb.org/' },
  { id: 'cern', kind: 'данные', name: тр("CERN · открытые данные"), gives: тр("Настоящие данные столкновений частиц и инструменты к ним"), right: 'own', home: 'https://opendata.cern.ch/' },
  { id: 'arxiv', kind: 'книги', name: 'arXiv', gives: тр("Свежие научные статьи по физике и математике до журнала"), right: 'show', home: 'https://arxiv.org/' },
  { id: 'pmc', kind: 'книги', name: 'PubMed Central', gives: тр("Медицинские и биологические статьи в открытом доступе"), right: 'show', home: 'https://www.ncbi.nlm.nih.gov/pmc/' },
  /* Добавлены по слову владельца 10.11.2026. У обоих лицензия некоммерческая:
     учителю на уроке — свободно, поэтому право здесь — «можно показывать».
     PhET с 30.03.2026 — CC BY-NC; OpenStax — CC BY-NC-SA. Письма о размещении
     на площадке владелец пишет сам. */
  { id: 'phet', kind: 'данные', name: тр("PhET · интерактивные опыты"), gives: тр("Опыты по физике, химии и математике, которые можно крутить руками"), right: 'show', home: 'https://phet.colorado.edu/' },
  { id: 'openstax', kind: 'книги', name: тр("OpenStax · учебники"), gives: тр("Университетские и школьные учебники на английском, целиком"), right: 'show', home: 'https://openstax.org/' },
  { id: 'wb', kind: 'данные', name: тр("Всемирный банк · открытые данные"), gives: тр("Население, доходы, электричество — по странам и годам"), right: 'own', home: 'https://data.worldbank.org/' },
  { id: 'owid', kind: 'данные', name: 'Our World in Data', gives: тр("Готовые графики по климату, здоровью, энергии с источниками"), right: 'attr', home: 'https://ourworldindata.org/' },
  { id: 'eurostat', kind: 'данные', name: 'Eurostat', gives: тр("Статистика Европы: цены, работа, транспорт, учёба"), right: 'own', home: 'https://ec.europa.eu/eurostat/data/database' },
]

/** Что будет, если источник замолчит — сказано у каждого вида отдельно. */
export const IF_SILENT: Record<Kind, string> = {
  интерактивы: тр("Если инструмент не загрузился, откройте его позже."),
  снимки: тр("Уже вставленные в урок снимки останутся: они лежат в самом уроке. Новых не будет, пока источник не ответит."),
  данные: тр("Числа, которые вы уже показали классу, никуда не денутся. Свежие перестанут обновляться."),
  карты: тр("Открытая карта доживёт до конца урока. Новые слои не подгрузятся."),
  книги: тр("Открытая страница останется на экране. Перелистнуть дальше не выйдет."),
  трансляции: тр("Трансляция оборвётся сразу: она идёт сейчас и нигде не хранится. Записей у нас нет вообще."),
}

/** 🔴 РАЗДЕЛ — ПО ПРЕДМЕТУ, ВИД — ПО СУЩНОСТИ (владелец, 10.11.2026: «наведи
 *  порядок во вкладках — распредели чётко по предметам и сущности»).
 *  `kind` отвечает на вопрос «что это» (снимки, данные, книги…) и остаётся как
 *  был: по нему живут обложки и выбор источника в комнате урока. Раздел отвечает
 *  на вопрос «к какому уроку это» — по нему разложен каталог.
 *
 *  Раздел записан ОТДЕЛЬНО от строки источника, а не полем в ней: строки
 *  каталога читает разбор для сервера (`scripts/хаб-список.mjs`), и новое поле
 *  в строке — повод ему ошибиться. Источник без раздела ловит `разделИсточника`:
 *  он уходит в «историю и библиотеки» и виден в каталоге, а не пропадает. */
export type Раздел = 'Анатомия' | 'Биология' | 'Физика' | 'Химия' | 'Математика' | 'Астрономия' | 'География' | 'Геология' | 'Климатология' | 'История' | 'Демография' | 'Музыка' | 'Музеи' | 'Библиотеки' | 'Учебники' | 'Научные статьи' | 'Курсы' | 'Карты' | 'Статистические данные' | 'Живые камеры' | 'Коллекции опытов'

export const РАЗДЕЛЫ: { id: Раздел; имя: string }[] = [
  { id: 'Анатомия', имя: тр("Анатомия") },
  { id: 'Биология', имя: тр("Биология") },
  { id: 'Физика', имя: тр("Физика") },
  { id: 'Химия', имя: тр("Химия") },
  { id: 'Математика', имя: тр("Математика") },
  { id: 'Астрономия', имя: тр("Астрономия") },
  { id: 'География', имя: тр("География") },
  { id: 'Геология', имя: тр("Геология") },
  { id: 'Климатология', имя: тр("Климатология") },
  { id: 'История', имя: тр("История") },
  { id: 'Демография', имя: тр("Демография") },
  { id: 'Музыка', имя: тр("Музыка") },
  { id: 'Музеи', имя: тр("Музеи") },
  { id: 'Библиотеки', имя: тр("Библиотеки") },
  { id: 'Учебники', имя: тр("Учебники") },
  { id: 'Научные статьи', имя: тр("Научные статьи") },
  { id: 'Курсы', имя: тр("Курсы") },
  { id: 'Карты', имя: тр("Карты") },
  { id: 'Статистические данные', имя: тр("Статистические данные") },
  { id: 'Живые камеры', имя: тр("Живые камеры") },
  { id: 'Коллекции опытов', имя: тр("Коллекции опытов") },
]

const ПО_РАЗДЕЛАМ: Record<Раздел, string[]> = {
  'Анатомия': ['portal-brain-map-org', 'biodigital', 'zygote', 'assembly', 'skeleton', 'kidworld', 'studio', 'cogni', 'learn3d', 'ana3d', 'mazze', 'interface', 'humanatlas', 'lorea', 'astraon', 'skeleton-bio'],
  'Биология': ['animaldiversity-org', 'ccsb-scripps-edu-cellpaint', 'ebird-org-map', 'mapper-obis-org', 'proteinatlas-org', 'onezoom-org', 'phet-natural-selection', 'phet-neuron', 'phet-membrane-transport', 'phet-gene-expression-essentials', 'cellscale', 'gbif', 'inat', 'eol', 'pdb'],
  'Физика': ['phet-states-of-matter', 'phet-wave-on-a-string', 'phet-geometric-optics', 'phet-gravity-force-lab', 'phet-gravity-and-orbits', 'phet-masses-and-springs', 'phet-projectile-motion', 'phet-diffusion', 'phet-hookes-law', 'phet-ohms-law', 'phet-faradays-law', 'phet-charges-and-fields', 'phet-wave-interference', 'phet-capacitor-lab-basics', 'phet-pendulum-lab', 'phet-density', 'phet-bending-light', 'phet-balancing-act', 'phet-gas-properties', 'phet-forces-and-motion-basics', 'phet-resistance-in-a-wire', 'phet-collision-lab', 'phet-color-vision', 'phet-energy-skate-park', 'walter-fendt-de-html5-phen', 'phet-dc', 'cern'],
  'Химия': ['molview-org', 'phet-isotopes-and-atomic-mass', 'phet-acid-base-solutions', 'phet-concentration', 'phet-molarity', 'phet-molecule-polarity', 'phet-reactants-products-and-leftovers', 'phet-build-an-atom', 'phet-molecule-shapes', 'phet-balancing-chemical-equations', 'phet-ph-scale', 'chemcollective'],
  'Математика': ['desmos-com-geometry', 'desmos-com-calculator', 'desmos-com-3d', 'polypad-amplify-com-p', 'phet-graphing-lines', 'phet-fractions-intro', 'phet-graphing-quadratics', 'phet-function-builder', 'phet-least-squares-regression', 'phet-area-model-algebra', 'phet-area-builder', 'phet-fraction-matcher', 'phet-curve-fitting', 'phet-fractions-equality', 'phet-vector-addition', 'phet-trig-tour', 'phet-unit-rates', 'geogebra3d'],
  'Астрономия': ['sky-esa-int', 'eyes-nasa-gov-apps-asteroids', 'eyes-nasa-gov-apps-solar-system', 'eyes-nasa-gov-apps-exo', 'stellarium-web-org', 'worldwidetelescope-org-webclient', 'apod', 'hubble', 'jwst', 'sdo', 'esa', 'eso'],
  'География': ['globalforestwatch-org-map', 'firms-modaps-eosdis-nasa-gov-map', 'earth'],
  'Геология': ['phet-plate-tectonics', 'usgs'],
  'Климатология': ['climatereanalyzer-org', 'climate-nasa-gov-interactives-climate-time-machine', 'phet-greenhouse-effect', 'ventusky-com', 'windy-com', 'nullschool', 'noaa'],
  'История': ['oldmapsonline-org', 'slavevoyages-org'],
  'Демография': ['populationpyramid-net'],
  'Музыка': ['learningmusic-ableton-com', 'learningsynths-ableton-com', 'musicca-com-exercises', 'teoria-com', 'songmaker'],
  'Музеи': ['collections-louvre-fr', 'art-thewalters-org', 'apollo11', 'met', 'rijks', 'smith', 'artic', 'cleveland', 'nga', 'getty', 'parismusees', 'britishmuseum', 'hermitage', 'tretyakov', 'pushkin', 'rusmuseum', 'louvre', 'vangogh'],
  'Библиотеки': ['perseus-tufts-edu-hopper', 'loc', 'gallica', 'bl', 'bodleian', 'cambridge', 'gutenberg', 'archive', 'europeana', 'wiki'],
  'Учебники': ['nobaproject-com', 'openstax'],
  'Научные статьи': ['arxiv', 'pmc'],
  'Курсы': ['ocw-mit-edu', 'open-edu-openlearn'],
  'Карты': ['openinframap-org', 'openrailwaymap-org', 'map-openseamap-org', 'opentopomap-org', 'rumsey', 'osm'],
  'Статистические данные': ['gapminder-org-tools', 'data-un-org', 'databrowser-uis-unesco-org', 'wb', 'owid', 'eurostat'],
  'Живые камеры': ['iss', 'lapalma', 'kvert'],
  'Коллекции опытов': ['phet'],
}

const РАЗДЕЛ_ПО_ID = new Map<string, Раздел>(
  (Object.keys(ПО_РАЗДЕЛАМ) as Раздел[]).flatMap((р) => ПО_РАЗДЕЛАМ[р].map((id) => [id, р] as [string, Раздел])),
)

export function разделИсточника(id: string): Раздел {
  return РАЗДЕЛ_ПО_ID.get(id) ?? 'Библиотеки'
}

/** Источники раздела — в том порядке, в каком они названы в разделе. */
export function источникиРаздела(р: Раздел): Source[] {
  const свои = SOURCES.filter((x) => разделИсточника(x.id) === р)
  const место = (id: string) => { const i = ПО_РАЗДЕЛАМ[р].indexOf(id); return i < 0 ? ПО_РАЗДЕЛАМ[р].length : i }
  return свои.sort((a, b) => место(a.id) - место(b.id))
}
