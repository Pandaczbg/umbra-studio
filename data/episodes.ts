export type EpisodeStatus =
  | "planned"
  | "in-production"
  | "completed"
  | "published";

export type Episode = {
  id: string;
  projectSlug: string;

  episodeNumber: number;
  title: string;

  status: EpisodeStatus;

  runtime?: string;

  chapterStart?: number;
  chapterEnd?: number;

  logline: string;
  description: string;

  youtubeUrl?: string;
  thumbnail?: string;

  featured: boolean;
};

export const episodes: Episode[] = [
  {
    id: "mrzim-ep-01",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 1,
    title: "KUĆA",

    status: "planned",

    chapterStart: 1,
    chapterEnd: 1,

    logline:
      "Pre nego što rat promeni sve, Gvozden veruje da poznaje svoj svet.",

    description:
      "Upoznajemo Gvozdena, Jadranku i Anu i život koji su zajedno izgradili u Bosni. Porodica, zemlja, susedi i vera u zajedničku državu čine svet za koji Gvozden veruje da je trajan.",

    featured: true,
  },

  {
    id: "mrzim-ep-02",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 2,
    title: "PISMO",

    status: "planned",

    chapterStart: 2,
    chapterEnd: 3,

    logline:
      "Jedno pismo prekida svakodnevicu i prvi put tera Gvozdena da ozbiljno pogleda prema onome što dolazi.",

    description:
      "Godine prolaze, ali promene u zemlji postaju sve očiglednije. Kada Gvozden dobije vojni poziv, pokušava da ubedi Jadranku da je sve prolazno i da će se uskoro vratiti kući.",

    featured: false,
  },

  {
    id: "mrzim-ep-03",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 3,
    title: "RAT",

    status: "planned",

    chapterStart: 3,
    chapterEnd: 4,

    logline:
      "Gvozden odlazi na ono što je trebalo da bude vojna obaveza i prvi put shvata da se zemlja zaista raspada.",

    description:
      "U kasarni upoznaje Radeta i sluša govor koji potvrđuje ono čega se najviše plašio. Rat više nije glasina. Gvozden pokušava da ostane veran svojim pravilima dok oko njega počinje da nestaje svet koji poznaje.",

    featured: false,
  },

  {
    id: "mrzim-ep-04",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 4,
    title: "PUKOTINA",

    status: "planned",

    chapterStart: 4,
    chapterEnd: 5,

    logline:
      "Rat prvi put izvlači iz Gvozdena stranu koju ni on sam više ne prepoznaje.",

    description:
      "Put prema selima pretvara vojnu misiju u moralni pad. Gvozden sve više pokušava da zaštiti ono što je njegovo, dok Rade počinje da shvata da njegov novi prijatelj nosi mnogo dublju opasnost nego što je izgledalo.",

    featured: false,
  },

  {
    id: "mrzim-ep-05",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 5,
    title: "POVRATAK",

    status: "planned",

    chapterStart: 6,
    chapterEnd: 6,

    logline:
      "Jedna vest pretvara Gvozdenov strah u najgori mogući povratak kući.",

    description:
      "Gvozden saznaje da je njegovo selo napadnuto i kreće nazad sa Radetom. Dok se približava kući, između nade i straha pokušava da veruje da su Jadranka i Ana preživele.",

    featured: true,
  },

  {
    id: "mrzim-ep-06",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 6,
    title: "PEPEO",

    status: "planned",

    chapterStart: 7,
    chapterEnd: 8,

    logline:
      "Gubitak porodice završava jedan Gvozdenov život i počinje drugi.",

    description:
      "Posle povratka kući Gvozden se suočava sa posledicama napada i potpunim raspadom svog starog sveta. Rade prvi put vidi da pred njim više ne stoji čovek kakvog je poznavao.",

    featured: true,
  },

  {
    id: "mrzim-ep-07",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 7,
    title: "LOV",

    status: "planned",

    chapterStart: 9,
    chapterEnd: 9,

    logline:
      "Gvozden svoju tragediju pretvara u potragu za jednim čovekom.",

    description:
      "Umesto da napusti rat, Gvozden bira da ostane. Pronalazi način da formira novu jedinicu i kreće u potragu za Senadom, verujući da će upravo on dati odgovor na tragediju koja mu je uništila porodicu.",

    featured: false,
  },

  {
    id: "mrzim-ep-08",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 8,
    title: "POTRAGA",

    status: "planned",

    chapterStart: 10,
    chapterEnd: 10,

    logline:
      "Potraga traje duže nego što je Gvozden očekivao, a rat sve više postaje samo kulisa njegovoj opsesiji.",

    description:
      "Dani postaju nedelje, a nedelje meseci. Gvozdenova jedinica kruži kroz sela tražeći Senada, dok se granica između ratovanja, osvete i ličnog interesa sve više briše.",

    featured: false,
  },

  {
    id: "mrzim-ep-09",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 9,
    title: "SARAJEVO",

    status: "planned",

    chapterStart: 11,
    chapterEnd: 11,

    logline:
      "Gvozden konačno dolazi blizu čoveka kojeg traži, ali rat odlučuje drugačije.",

    description:
      "Ofanziva na Sarajevo otvara novi prostor za potragu. Gvozden ulazi u grad sa jedinicom i dolazi do mesta na kojem očekuje da će konačno pronaći Senada.",

    featured: true,
  },

  {
    id: "mrzim-ep-10",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 10,
    title: "BEKSTVO",

    status: "planned",

    chapterStart: 12,
    chapterEnd: 14,

    logline:
      "Rat se završava, ali Gvozdenov život ne može da se vrati tamo gde je nekada bio.",

    description:
      "Posle Sarajeva Gvozden nestaje iz Bosne i pokušava da pronađe način da preživi i sačuva poslednju mogućnost da jednog dana pronađe Senada. Godine prolaze, država za koju je verovao da će trajati više ne postoji.",

    featured: false,
  },

  {
    id: "mrzim-ep-11",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 11,
    title: "HAG",

    status: "planned",

    chapterStart: 15,
    chapterEnd: 15,

    logline:
      "Prošlost konačno pronalazi Gvozdena.",

    description:
      "Posle godina skrivanja Gvozden je pronađen i odveden u Hag. Prvi put više ne određuje pravila. Pred njim je proces, prošlost i mogućnost da će konačno morati da pogleda iza svojih odluka.",

    featured: false,
  },

  {
    id: "mrzim-ep-12",
    projectSlug: "mrzim-svog-brata",

    episodeNumber: 12,
    title: "BRAT",

    status: "planned",

    chapterStart: 16,
    chapterEnd: 16,

    logline:
      "Čovek kojeg je Gvozden godinama tražio ulazi u sudnicu i otvara priču koju niko više ne može da promeni.",

    description:
      "U završnom delu priče Gvozden i Senad se konačno suočavaju. Senadovo svedočenje vraća događaje na njihov početak i otkriva kako je niz pogrešnih pretpostavki, odluka i osvete uništio više života.",

    featured: true,
  },
];
