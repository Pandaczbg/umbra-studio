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
      "We meet Gvozden, Jadranka and Ana and the life they have built together in Bosnia. Family, land, neighbors and faith in a shared country form a world Gvozden believes will endure.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 1,
    status: "planned",

    chapterStart: 1,
    chapterEnd: 1,

    logline: localized(
      "Pre nego što rat promeni sve, Gvozden veruje da poznaje svoj svet.",
      "Before the war changes everything, Gvozden believes he knows the world around him.",
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
      "Years pass, but the changes in the country become increasingly impossible to ignore. When Gvozden receives his military call-up, he tries to convince Jadranka that everything will pass and that he will soon return home.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 2,
    status: "planned",

    chapterStart: 2,
    chapterEnd: 3,

    logline: localized(
      "Jedno pismo prekida svakodnevicu i prvi put tera Gvozdena da ozbiljno pogleda prema onome što dolazi.",
      "One letter breaks the routine of everyday life and, for the first time, forces Gvozden to seriously face what is coming.",
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
      "At the barracks, he meets Rade and hears a speech that confirms what he feared most. The war is no longer a rumor. Gvozden tries to remain true to his principles as the world he knows begins to disappear around him.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 3,
    status: "planned",

    chapterStart: 3,
    chapterEnd: 4,

    logline: localized(
      "Gvozden odlazi na ono što je trebalo da bude vojna obaveza i prvi put shvata da se zemlja zaista raspada.",
      "Gvozden leaves for what was supposed to be military service and realizes for the first time that the country is truly falling apart.",
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
      "The journey through the villages turns a military mission into a moral descent. Gvozden becomes increasingly determined to protect what is his, while Rade begins to realize that his new friend carries a far deeper danger than he first appeared to.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 4,
    status: "planned",

    chapterStart: 4,
    chapterEnd: 5,

    logline: localized(
      "Rat prvi put izvlači iz Gvozdena stranu koju ni on sam više ne prepoznaje.",
      "For the first time, the war draws a side of Gvozden to the surface that even he no longer recognizes.",
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
      "Gvozden learns that his village has been attacked and heads back with Rade. As he approaches home, caught between hope and fear, he tries to believe that Jadranka and Ana have survived.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 5,
    status: "planned",

    chapterStart: 6,
    chapterEnd: 6,

    logline: localized(
      "Jedna vest pretvara Gvozdenov strah u najgori mogući povratak kući.",
      "One piece of news turns Gvozden's fear into the worst homecoming imaginable.",
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
      "After returning home, Gvozden confronts the aftermath of the attack and the complete collapse of his old world. For the first time, Rade sees that the man standing before him is no longer the person he once knew.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 6,
    status: "planned",

    chapterStart: 7,
    chapterEnd: 8,

    logline: localized(
      "Gubitak porodice završava jedan Gvozdenov život i počinje drugi.",
      "The loss of his family ends one life for Gvozden and begins another.",
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
      "Instead of leaving the war, Gvozden chooses to stay. He finds a way to form a new unit and sets out to find Senad, believing that he is the one who can answer the tragedy that destroyed his family.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 7,
    status: "planned",

    chapterStart: 9,
    chapterEnd: 9,

    logline: localized(
      "Gvozden svoju tragediju pretvara u potragu za jednim čovekom.",
      "Gvozden turns his tragedy into a search for one man.",
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
      "Days become weeks, and weeks become months. Gvozden's unit moves through villages searching for Senad as the line between warfare, revenge and personal motives becomes increasingly blurred.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 8,
    status: "planned",

    chapterStart: 10,
    chapterEnd: 10,

    logline: localized(
      "Potraga traje duže nego što je Gvozden očekivao, a rat sve više postaje samo kulisa njegovoj opsesiji.",
      "The search lasts longer than Gvozden expected, while the war increasingly becomes nothing more than the backdrop to his obsession.",
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
      "The offensive on Sarajevo opens a new path in the search. Gvozden enters the city with his unit and reaches a place where he expects to finally find Senad.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 9,
    status: "planned",

    chapterStart: 11,
    chapterEnd: 11,

    logline: localized(
      "Gvozden konačno dolazi blizu čoveka kojeg traži, ali rat odlučuje drugačije.",
      "Gvozden finally gets close to the man he has been searching for, but the war decides otherwise.",
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
      "After Sarajevo, Gvozden disappears from Bosnia and tries to find a way to survive while holding on to the last possibility of finding Senad one day. Years pass, and the country he believed would endure no longer exists.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 10,
    status: "planned",

    chapterStart: 12,
    chapterEnd: 14,

    logline: localized(
      "Rat se završava, ali Gvozdenov život ne može da se vrati tamo gde je nekada bio.",
      "The war ends, but Gvozden's life cannot return to what it once was.",
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
      "After years in hiding, Gvozden is found and taken to The Hague. For the first time, he is no longer the one making the rules. Before him stand the trial, the past and the possibility that he will finally have to confront the consequences of his decisions.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 11,
    status: "planned",

    chapterStart: 15,
    chapterEnd: 15,

    logline: localized(
      "Prošlost konačno pronalazi Gvozdena.",
      "The past finally catches up with Gvozden.",
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
      "In the final part of the story, Gvozden and Senad finally face each other. Senad's testimony takes the events back to their beginning and reveals how a chain of false assumptions, decisions and revenge destroyed more than one life.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 12,
    status: "planned",

    chapterStart: 16,
    chapterEnd: 16,

    logline: localized(
      "Čovek kojeg je Gvozden godinama tražio ulazi u sudnicu i otvara priču koju niko više ne može da promeni.",
      "The man Gvozden has searched for over the years enters the courtroom and opens a story that no one can change anymore.",
    ),

    featured: true,
  },
];