import type {
  EpisodeContent,
  LocalizedText,
} from "@/lib/content/types";

function localized(
  sr: string,
  en: string = sr,
): LocalizedText {
  return {
    sr,
    en,
  };
}

export const episodes: EpisodeContent[] = [
  {
    id: "mrzim-ep-01",
    slug: "mrzim-svog-brata-ep-01",
    visibility: "public",

    title: localized(
      "KUĆA",
    ),

    description: localized(
      "Upoznajemo Gvozdena, Jadranku i Anu i život koji su zajedno izgradili u Bosni. Porodica, zemlja, susedi i vera u zajedničku državu čine svet za koji Gvozden veruje da je trajan.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 1,
    status: "planned",

    chapterStart: 1,
    chapterEnd: 1,

    logline: localized(
      "Pre nego što rat promeni sve, Gvozden veruje da poznaje svoj svet.",
    ),

    featured: true,
  },

  {
    id: "mrzim-ep-02",
    slug: "mrzim-svog-brata-ep-02",
    visibility: "public",

    title: localized(
      "PISMO",
    ),

    description: localized(
      "Godine prolaze, ali promene u zemlji postaju sve očiglednije. Kada Gvozden dobije vojni poziv, pokušava da ubedi Jadranku da je sve prolazno i da će se uskoro vratiti kući.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 2,
    status: "planned",

    chapterStart: 2,
    chapterEnd: 3,

    logline: localized(
      "Jedno pismo prekida svakodnevicu i prvi put tera Gvozdena da ozbiljno pogleda prema onome što dolazi.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-03",
    slug: "mrzim-svog-brata-ep-03",
    visibility: "public",

    title: localized(
      "RAT",
    ),

    description: localized(
      "U kasarni upoznaje Radeta i sluša govor koji potvrđuje ono čega se najviše plašio. Rat više nije glasina. Gvozden pokušava da ostane veran svojim pravilima dok oko njega počinje da nestaje svet koji poznaje.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 3,
    status: "planned",

    chapterStart: 3,
    chapterEnd: 4,

    logline: localized(
      "Gvozden odlazi na ono što je trebalo da bude vojna obaveza i prvi put shvata da se zemlja zaista raspada.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-04",
    slug: "mrzim-svog-brata-ep-04",
    visibility: "public",

    title: localized(
      "PUKOTINA",
    ),

    description: localized(
      "Put prema selima pretvara vojnu misiju u moralni pad. Gvozden sve više pokušava da zaštiti ono što je njegovo, dok Rade počinje da shvata da njegov novi prijatelj nosi mnogo dublju opasnost nego što je izgledalo.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 4,
    status: "planned",

    chapterStart: 4,
    chapterEnd: 5,

    logline: localized(
      "Rat prvi put izvlači iz Gvozdena stranu koju ni on sam više ne prepoznaje.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-05",
    slug: "mrzim-svog-brata-ep-05",
    visibility: "public",

    title: localized(
      "POVRATAK",
    ),

    description: localized(
      "Gvozden saznaje da je njegovo selo napadnuto i kreće nazad sa Radetom. Dok se približava kući, između nade i straha pokušava da veruje da su Jadranka i Ana preživele.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 5,
    status: "planned",

    chapterStart: 6,
    chapterEnd: 6,

    logline: localized(
      "Jedna vest pretvara Gvozdenov strah u najgori mogući povratak kući.",
    ),

    featured: true,
  },

  {
    id: "mrzim-ep-06",
    slug: "mrzim-svog-brata-ep-06",
    visibility: "public",

    title: localized(
      "PEPEO",
    ),

    description: localized(
      "Posle povratka kući Gvozden se suočava sa posledicama napada i potpunim raspadom svog starog sveta. Rade prvi put vidi da pred njim više ne stoji čovek kakvog je poznavao.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 6,
    status: "planned",

    chapterStart: 7,
    chapterEnd: 8,

    logline: localized(
      "Gubitak porodice završava jedan Gvozdenov život i počinje drugi.",
    ),

    featured: true,
  },

  {
    id: "mrzim-ep-07",
    slug: "mrzim-svog-brata-ep-07",
    visibility: "public",

    title: localized(
      "LOV",
    ),

    description: localized(
      "Umesto da napusti rat, Gvozden bira da ostane. Pronalazi način da formira novu jedinicu i kreće u potragu za Senadom, verujući da će upravo on dati odgovor na tragediju koja mu je uništila porodicu.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 7,
    status: "planned",

    chapterStart: 9,
    chapterEnd: 9,

    logline: localized(
      "Gvozden svoju tragediju pretvara u potragu za jednim čovekom.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-08",
    slug: "mrzim-svog-brata-ep-08",
    visibility: "public",

    title: localized(
      "POTRAGA",
    ),

    description: localized(
      "Dani postaju nedelje, a nedelje meseci. Gvozdenova jedinica kruži kroz sela tražeći Senada, dok se granica između ratovanja, osvete i ličnog interesa sve više briše.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 8,
    status: "planned",

    chapterStart: 10,
    chapterEnd: 10,

    logline: localized(
      "Potraga traje duže nego što je Gvozden očekivao, a rat sve više postaje samo kulisa njegovoj opsesiji.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-09",
    slug: "mrzim-svog-brata-ep-09",
    visibility: "public",

    title: localized(
      "SARAJEVO",
    ),

    description: localized(
      "Ofanziva na Sarajevo otvara novi prostor za potragu. Gvozden ulazi u grad sa jedinicom i dolazi do mesta na kojem očekuje da će konačno pronaći Senada.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 9,
    status: "planned",

    chapterStart: 11,
    chapterEnd: 11,

    logline: localized(
      "Gvozden konačno dolazi blizu čoveka kojeg traži, ali rat odlučuje drugačije.",
    ),

    featured: true,
  },

  {
    id: "mrzim-ep-10",
    slug: "mrzim-svog-brata-ep-10",
    visibility: "public",

    title: localized(
      "BEKSTVO",
    ),

    description: localized(
      "Posle Sarajeva Gvozden nestaje iz Bosne i pokušava da pronađe način da preživi i sačuva poslednju mogućnost da jednog dana pronađe Senada. Godine prolaze, država za koju je verovao da će trajati više ne postoji.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 10,
    status: "planned",

    chapterStart: 12,
    chapterEnd: 14,

    logline: localized(
      "Rat se završava, ali Gvozdenov život ne može da se vrati tamo gde je nekada bio.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-11",
    slug: "mrzim-svog-brata-ep-11",
    visibility: "public",

    title: localized(
      "HAG",
    ),

    description: localized(
      "Posle godina skrivanja Gvozden je pronađen i odveden u Hag. Prvi put više ne određuje pravila. Pred njim je proces, prošlost i mogućnost da će konačno morati da pogleda iza svojih odluka.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 11,
    status: "planned",

    chapterStart: 15,
    chapterEnd: 15,

    logline: localized(
      "Prošlost konačno pronalazi Gvozdena.",
    ),

    featured: false,
  },

  {
    id: "mrzim-ep-12",
    slug: "mrzim-svog-brata-ep-12",
    visibility: "public",

    title: localized(
      "BRAT",
    ),

    description: localized(
      "U završnom delu priče Gvozden i Senad se konačno suočavaju. Senadovo svedočenje vraća događaje na njihov početak i otkriva kako je niz pogrešnih pretpostavki, odluka i osvete uništio više života.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 12,
    status: "planned",

    chapterStart: 16,
    chapterEnd: 16,

    logline: localized(
      "Čovek kojeg je Gvozden godinama tražio ulazi u sudnicu i otvara priču koju niko više ne može da promeni.",
    ),

    featured: true,
  },
];