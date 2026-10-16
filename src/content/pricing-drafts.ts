import type { Locale } from "@/i18n/config";
import type { CategoryKey } from "@/lib/routes";

/**
 * Starting content of the "Formules & prix" tab, imported once per event type into Sanity
 * (src/lib/cms/seed.ts), from the agency's own guides: three packages for weddings, private
 * parties and birthdays, and what the agency delivers for festivals and seminars. Wedding prices
 * are stored but only shown once "Afficher les prix" is ticked; the other guides have no price
 * ("personalised quotation"), so their packages are shown without one ("Afficher sans prix").
 */

type Localized = Record<Locale, string>;

export type FormulaDraft = {
  name: Localized;
  guestsMin?: number;
  guestsMax?: number;
  audience?: Localized;
  priceGbp?: number;
  /** No price in the guide: shown anyway, without a price. */
  onRequest?: boolean;
  featured?: boolean;
  inclusions: Localized[];
  extras?: Localized;
};

/**
 * "packs": packages side by side, each with its "Choose" button.
 * "services": what the agency delivers, as short cards without a button (festivals, seminars).
 */
export type PricingStyle = "packs" | "services";

export type PricingDraft = { title: Localized; note: Localized; style: PricingStyle; formulas: FormulaDraft[] };

const tiers = {
  essential: { fr: "Formule Essentielle", en: "Essential" },
  signature: { fr: "Formule Signature", en: "Signature" },
  prestige: { fr: "Formule Prestige", en: "Prestige" },
} satisfies Record<string, Localized>;

const item = (fr: string, en: string): Localized => ({ fr, en });

/** Wedding introduction, without prices (they are hidden unless "Afficher les prix" is ticked). */
const weddingNote = item(
  "Chaque formule est ajustée à votre date, à votre lieu, au nombre d'invités et aux prestations choisies. Hors vols, hébergement et transport des invités. Votre proposition personnalisée confirme le lieu, les prestations et le prix.",
  "Each package is tailored to your date, venue, guest count and selected services. Guest flights, accommodation and transport are not included. Your personalised proposal confirms the venue, services and price.",
);

/** Wedding introduction shipped with the guide, which mentioned "indicative starting prices". */
export const formerWeddingNote =
  "Prix de départ indicatifs, selon la date, le lieu, le nombre d'invités et les prestations choisies. Hors vols, hébergement et transport des invités. Votre proposition personnalisée confirme le lieu, les prestations, les taxes et le prix final.";

/** The three wedding plans of the agency's guide, with its indicative starting prices in GBP (hidden by default). */
const weddingGuide: PricingDraft = {
  title: item("Nos formules mariage", "Our wedding packages"),
  note: weddingNote,
  style: "packs",
  formulas: [
    {
      name: tiers.essential,
      guestsMin: 60,
      guestsMax: 80,
      audience: item("Une journée et une soirée", "One wedding day and evening"),
      priceGbp: 10900,
      inclusions: [
        item("Riad privatisé ou villa standard", "Private riad or standard villa"),
        item("Repas marocain en trois services et personnel de service", "Three-course Moroccan meal and service staff"),
        item("Décoration de table : bougies et fleurs simples", "Table styling with candles and simple flowers"),
        item("DJ, sonorisation et éclairage", "DJ with sound and lighting"),
        item("Organisation à distance et coordination le jour J", "Remote planning and wedding-day coordination"),
      ],
      extras: item(
        "En option : negafa et location de tenues, photographe, vidéaste, orchestre live et navettes pour les invités.",
        "Optional: negafa and bridal outfit hire, photographer, videographer, live band and guest shuttles.",
      ),
    },
    {
      name: tiers.signature,
      guestsMin: 100,
      guestsMax: 150,
      audience: item("Location de la villa sur deux jours", "Two-day villa hire"),
      priceGbp: 21030,
      featured: true,
      inclusions: [
        item("Villa premium avec jardin et piscine", "Premium villa with garden and pool"),
        item("Repas de mariage et cocktail de bienvenue", "Wedding meal and welcome drinks reception"),
        item("Negafa avec trois tenues et entrée en amariya", "Negafa with three bridal outfits and an amariya entrance"),
        item("Décoration florale et mobilier lounge", "Floral design and lounge furniture"),
        item("Photographe et vidéaste", "Photographer and videographer"),
        item("Orchestre live et DJ", "Live band and DJ"),
        item("Organisation à distance et équipe sur place", "Remote planning and an on-site team"),
      ],
      extras: item(
        "La location sur deux jours n'inclut pas automatiquement deux jours de traiteur ni l'hébergement des invités. Soirée henné ou dîner de bienvenue : sur devis.",
        "Two-day venue hire does not automatically include two days of catering or guest accommodation. A henna evening or welcome dinner is quoted separately.",
      ),
    },
    {
      name: tiers.prestige,
      guestsMin: 150,
      guestsMax: 250,
      audience: item("Deux à trois jours de célébrations", "Two to three days of celebrations"),
      priceGbp: 41390,
      inclusions: [
        item("Domaine d'exception ou palais événementiel, location sur trois jours", "Exceptional estate or event palace with three-day hire"),
        item("Soirée henné, mariage et brunch d'adieu", "Henna evening, wedding and farewell brunch"),
        item("Traiteur gastronomique", "Gourmet catering"),
        item("Décoration sur mesure", "Bespoke styling"),
        item("Negafa premium avec cinq à sept tenues", "Premium negafa with five to seven outfits"),
        item("Amariya et dakka (tambours traditionnels)", "Amariya and traditional drummers"),
        item("Équipe photo et film avec drone", "Photo and film team with drone"),
        item("Animations live", "Live entertainment"),
        item("Trois coordinateurs et conciergerie pour les invités", "Three coordinators and guest concierge support"),
      ],
      extras: item(
        "Feux d'artifice en option, selon l'autorisation du lieu et la disponibilité.",
        "Fireworks are optional, subject to venue permission and availability.",
      ),
    },
  ],
};

/**
 * The first, price-less wedding formulas (French names and inclusions) imported before the
 * guide existed. A wedding tab still holding exactly these was never edited, so it is safely
 * replaced by the guide (seed.ts).
 */
export const formerWeddingDraft = [
  ["Formule Essentielle", ["Coordination sur place", "Décoration et mise en lumière", "Sonorisation et DJ"]],
  [
    "Formule Signature",
    ["Recherche et réservation du lieu", "Scénographie sur mesure", "Traiteur, service et bar", "Sonorisation et DJ", "Coordination sur place"],
  ],
  [
    "Formule Prestige",
    [
      "Planification complète, de l'idée au jour J",
      "Recherche et réservation du lieu",
      "Scénographie sur mesure",
      "Traiteur, service et bar",
      "Animation artistique",
      "Accueil et transferts des invités",
    ],
  ],
] as const;


// Shared lines of the private-party and birthday guides.
const venueHire = item("Recherche et location du lieu pour les horaires convenus", "Venue sourcing and hire for the agreed event hours");
const seatedDinner = item("Dîner servi à table ou buffet, avec personnel de service", "Seated dinner or buffet with service staff");
const backgroundMusic = item("Musique d'ambiance et sonorisation", "Background music and sound system");
const remotePlanning = item("Rendez-vous de préparation à distance", "Remote planning consultations");
const onSite = item("Coordination sur place", "On-site event coordination");
const riadVilla = item("Riad ou villa privatisé pour les horaires convenus", "Private riad or villa venue for the agreed event hours");
const welcomeDinner = item("Cocktail de bienvenue, puis dîner ou buffet", "Welcome drinks reception and dinner or buffet");
const djLights = item("DJ, sonorisation et éclairage festif", "DJ, sound system and party lighting");
const photographer = item("Photographe pour une durée convenue", "Photographer for an agreed coverage period");
const videoTour = item("Préparation à distance et visite du lieu en vidéo", "Remote planning and venue video tour");
const onSiteTeam = item("Équipe de coordination sur place", "On-site coordination team");
const premiumVenue = item("Villa premium ou domaine pour les horaires convenus", "Premium villa or estate for the agreed event hours");
const bespokeMenu = item("Menu sur mesure et cocktail de bienvenue", "Bespoke menu and welcome drinks reception");
const liveProgramme = item("DJ et programme d'animations live", "DJ and a live entertainment programme");
const proSoundLight = item("Son et lumière professionnels", "Professional sound and lighting");
const photoVideo = item("Photographe et vidéaste pour des durées convenues", "Photographer and videographer for agreed coverage periods");
const productionTeam = item("Équipe dédiée, de la préparation à la production sur place", "Dedicated planning and on-site production team");
const signatureExtras = item(
  "En option : musiciens live, vidéaste, artistes et photos supplémentaires.",
  "Optional: live musicians, videographer, performers and additional photography coverage.",
);
const prestigeExtras = item(
  "Sur devis séparé : dîner de bienvenue, brunch le lendemain, artistes supplémentaires, prolongation du lieu. Horaires prolongés selon les règles du lieu ; hébergement non inclus.",
  "Quoted separately: a welcome dinner, next-day brunch, additional performers and extended venue hire. Extended hours remain subject to venue rules; overnight accommodation is not included.",
);
const partyTerms =
  " Le nombre d'invités est indicatif, selon la capacité du lieu, et chaque formule est ajustée dans votre devis personnalisé. Hors vols, hébergement et transport des invités ; boissons alcoolisées uniquement si elles figurent au devis.";
const partyTermsEn =
  " Guest counts are suggestions, subject to venue capacity, and each package is tailored in your personalised quotation. Guest flights, accommodation and transport are not included; alcoholic drinks only when listed in the proposal.";

const privateParties: PricingDraft = {
  title: item("Nos formules soirée privée", "Our private party packages"),
  note: item(
    "Fiançailles, anniversaires de mariage, célébrations entre proches : trois formats pensés autour de votre occasion, de votre style et de votre budget." +
      partyTerms,
    "Engagements, anniversaries and celebrations with your favourite people: three formats designed around your occasion, style and budget." +
      partyTermsEn,
  ),
  style: "packs",
  formulas: [
    {
      name: tiers.essential,
      guestsMin: 15,
      guestsMax: 30,
      audience: item("Une soirée · La célébration intime", "One evening · The intimate celebration"),
      onRequest: true,
      inclusions: [
        venueHire,
        seatedDinner,
        item("Décoration de table, bougies et compositions florales simples", "Table styling, candles and simple floral arrangements"),
        backgroundMusic,
        remotePlanning,
        onSite,
      ],
      extras: item(
        "En option : gâteau de célébration, photographe, DJ et décoration personnalisée.",
        "Optional: celebration cake, photographer, DJ and personalised decorations.",
      ),
    },
    {
      name: tiers.signature,
      guestsMin: 30,
      guestsMax: 60,
      audience: item("Une soirée · La soirée privée", "One evening · The private party"),
      onRequest: true,
      featured: true,
      inclusions: [
        riadVilla,
        welcomeDinner,
        item("Décoration personnalisée et compositions florales", "Personalised event styling and floral arrangements"),
        djLights,
        item("Gâteau de célébration", "Celebration cake"),
        photographer,
        videoTour,
        onSiteTeam,
      ],
      extras: signatureExtras,
    },
    {
      name: tiers.prestige,
      guestsMin: 60,
      guestsMax: 100,
      audience: item("Une soirée prolongée · L'expérience sur mesure", "An extended evening · The celebration experience"),
      onRequest: true,
      inclusions: [
        premiumVenue,
        bespokeMenu,
        item("Scénographie sur mesure, fleurs et mobilier lounge", "Custom event design, florals and lounge furniture"),
        liveProgramme,
        proSoundLight,
        item("Gâteau de célébration sur mesure ou table de desserts", "Bespoke celebration cake or dessert table"),
        photoVideo,
        productionTeam,
      ],
      extras: prestigeExtras,
    },
  ],
};

const birthdays: PricingDraft = {
  title: item("Nos formules anniversaire", "Our birthday packages"),
  note: item(
    "Du dîner d'anniversaire élégant à la grande fête d'un anniversaire marquant : trois formats pensés autour de votre personnalité, du nombre d'invités et de votre budget. Formules pour adultes ; les anniversaires d'enfants sont sur devis, avec des activités adaptées." +
      partyTerms,
    "From a stylish birthday dinner to a milestone party: three formats designed around your personality, guest count and budget. These formats are for adults; children's parties are quoted separately, with age-appropriate activities." +
      partyTermsEn,
  ),
  style: "packs",
  formulas: [
    {
      name: tiers.essential,
      guestsMin: 15,
      guestsMax: 30,
      audience: item("Une soirée · Le dîner d'anniversaire", "One evening · The birthday dinner"),
      onRequest: true,
      inclusions: [
        venueHire,
        seatedDinner,
        item("Décoration de table d'anniversaire, bougies et fleurs simples", "Birthday table styling, candles and simple floral arrangements"),
        item("Gâteau d'anniversaire personnalisé", "Personalised birthday cake"),
        backgroundMusic,
        remotePlanning,
        onSite,
      ],
      extras: item(
        "En option : photographe, DJ, décor de ballons et fond photo personnalisé.",
        "Optional: photographer, DJ, balloon arrangements and a personalised birthday backdrop.",
      ),
    },
    {
      name: tiers.signature,
      guestsMin: 30,
      guestsMax: 60,
      audience: item("Une soirée · L'anniversaire Signature", "One evening · The signature birthday"),
      onRequest: true,
      featured: true,
      inclusions: [
        riadVilla,
        welcomeDinner,
        item("Décoration personnalisée, fleurs et fond photo d'anniversaire", "Personalised birthday styling, florals and a birthday backdrop"),
        djLights,
        item("Gâteau d'anniversaire personnalisé", "Personalised birthday cake"),
        photographer,
        videoTour,
        onSiteTeam,
      ],
      extras: signatureExtras,
    },
    {
      name: tiers.prestige,
      guestsMin: 60,
      guestsMax: 100,
      audience: item("Une soirée prolongée · L'anniversaire d'exception", "An extended evening · The milestone experience"),
      onRequest: true,
      inclusions: [
        premiumVenue,
        bespokeMenu,
        item("Décor d'anniversaire sur mesure, fond photo, fleurs et mobilier lounge", "Custom birthday design, a personalised backdrop, florals and lounge furniture"),
        liveProgramme,
        proSoundLight,
        item("Gâteau sur mesure et table de desserts", "Bespoke birthday cake and a styled dessert table"),
        photoVideo,
        productionTeam,
      ],
      extras: prestigeExtras,
    },
  ],
};

/** A "services" card: a title and one line, no price. */
const service = (fr: string, en: string, frText: string, enText: string): FormulaDraft => ({
  name: item(fr, en),
  audience: item(frText, enText),
  onRequest: true,
  inclusions: [],
});

const festivals: PricingDraft = {
  title: item("Ce que nous réalisons avec vous", "What we can help you deliver"),
  note: item(
    "Festivals de musique ou culturels, expériences gastronomiques, événements de marque : nous adaptons notre accompagnement à votre public, à votre site et à votre programme, et nous convenons du périmètre et des prestataires avant de confirmer. Autorisations, sécurité, gestion du public et assistance médicale sont étudiées pour chaque événement avec les professionnels et autorités concernés.",
    "Music and cultural festivals, food experiences, brand-led events: we shape our support around your audience, venue and programme, and agree the scope and suppliers before confirming. Permissions, security, crowd management and medical provision are assessed for each event with the relevant professionals and authorities.",
  ),
  style: "services",
  formulas: [
    service("Concept et organisation", "Event concept & planning", "Format, programmation, planning de production et budget, construits autour de vos objectifs.", "Develop the event format, programme, production schedule and budget around your objectives."),
    service("Lieu et site", "Venue & site coordination", "Recherche de lieux adaptés et coordination de l'implantation, des accès, des installations et des espaces.", "Source suitable locations and coordinate the layout, access, supplier installations and event spaces."),
    service("Scène, son et lumière", "Stage, sound & lighting", "Coordination des prestataires techniques : scène, son, lumière et écrans, selon les besoins de production.", "Coordinate technical suppliers for staging, audio, lighting and screens according to production requirements."),
    service("Artistes et animations", "Artists & entertainment", "Recherche d'artistes, coordination des réservations, planning des passages et organisation des loges.", "Support artist sourcing, booking coordination, performance schedules and backstage arrangements."),
    service("Image de marque et expérience du public", "Branding & audience experience", "Signalétique, espaces de marque, activations partenaires, espaces de restauration et de boissons.", "Bring together signage, branded spaces, sponsor activations and food and beverage areas."),
    service("Coordination sur place", "On-site delivery", "Coordination des prestataires, des équipes et du déroulé, du montage jusqu'à la fin de l'événement.", "Coordinate suppliers, event teams and the running order, from setup through to the close of the event."),
  ],
};

const seminars: PricingDraft = {
  title: item("Comment nous accompagnons votre séminaire", "How we support your event"),
  note: item(
    "Réunions de direction, formations, séminaires et retraites d'entreprise : nous coordonnons le lieu, les prestataires et le programme autour de vos objectifs. Rendez-vous à distance, présentation des lieux et proposition claire vous permettent de décider avant de vous déplacer. Hébergement, transferts, interprétariat et services spécialisés sont proposés sur devis séparé.",
    "Leadership meetings, training sessions, seminars and company retreats: we coordinate the venue, suppliers and programme around your objectives. Remote planning calls, venue presentations and a clear proposal help your team decide before travelling. Accommodation, transfers, interpretation and specialist services can be quoted separately.",
  ),
  style: "services",
  formulas: [
    service("Programme et organisation", "Programme & planning", "Ordre du jour, planning des sessions et budget, construits autour de vos objectifs et des besoins des participants.", "Shape the agenda, session timetable and budget around your business goals and delegate needs."),
    service("Lieu et salles de réunion", "Venue & meeting spaces", "Hôtels, salles de réunion ou lieux privés ; configuration des salles, espaces annexes et accès.", "Source hotels, meeting rooms or private venues; coordinate room layouts, breakout spaces and access."),
    service("Technique et présentations", "Technical & presentation support", "Micros, écrans et matériel de présentation ; connexion internet et besoins hybrides étudiés à l'avance.", "Coordinate microphones, screens and presentation equipment, with internet and hybrid needs scoped in advance."),
    service("Accueil et restauration", "Hospitality & delegate experience", "Pauses café, déjeuners et dîners de networking, avec les régimes alimentaires convenus à l'avance.", "Arrange coffee breaks, lunches and networking dinners, with dietary requirements agreed beforehand."),
    service("Activités d'équipe et networking", "Team activities & networking", "Activités d'équipe, expériences culturelles et moments de networking, en option dans le programme.", "Build optional team activities, cultural experiences and networking moments into the programme."),
    service("Image de marque et coordination sur place", "Branding & on-site coordination", "Signalétique, accueil des participants, prestataires et déroulé tout au long de l'événement.", "Coordinate signage, delegate welcome, suppliers and the running order throughout the event."),
  ],
};

export const pricingDrafts: Record<CategoryKey, PricingDraft> = {
  wedding: weddingGuide,
  privateParty: privateParties,
  birthday: birthdays,
  festival: festivals,
  seminar: seminars,
};

/**
 * The first, price-less formulas imported before the agency's guides (French names and
 * inclusions). A tab still holding exactly these was never edited, so it is safely replaced by
 * the guide (seed.ts).
 */
export const formerDrafts: Record<CategoryKey, readonly (readonly [string, readonly string[]])[]> = {
  wedding: formerWeddingDraft,
  privateParty: [
    ["Formule Essentielle", ["Décoration et mise en lumière", "Sonorisation et DJ", "Coordination sur place"]],
    ["Formule Signature", ["Recherche et réservation du lieu", "Décoration et mise en lumière", "Traiteur, service et bar", "Sonorisation et DJ", "Coordination sur place"]],
    ["Formule Prestige", ["Planification complète, de l'idée au jour J", "Recherche et réservation du lieu", "Scénographie sur mesure", "Traiteur, service et bar", "Animation artistique", "Accueil et transferts des invités"]],
  ],
  birthday: [
    ["Formule Essentielle", ["Décoration et mise en lumière", "Sonorisation et DJ", "Coordination sur place"]],
    ["Formule Signature", ["Recherche et réservation du lieu", "Décoration et mise en lumière", "Traiteur, service et bar", "Sonorisation et DJ", "Coordination sur place"]],
    ["Formule Prestige", ["Planification complète, de l'idée au jour J", "Recherche et réservation du lieu", "Scénographie sur mesure", "Traiteur, service et bar", "Animation artistique"]],
  ],
  festival: [
    ["Formule Essentielle", ["Son et lumière", "Régie technique"]],
    ["Formule Signature", ["Scène, son et lumière", "Régie technique", "Scénographie sur mesure", "Coordination sur place"]],
    ["Formule Prestige", ["Planification complète, de l'idée au jour J", "Scène, son, lumière et écrans LED", "Scénographie sur mesure", "Animation artistique", "Coordination sur place"]],
  ],
  seminar: [
    ["Formule Essentielle", ["Salle et équipement audiovisuel", "Pauses café", "Coordination sur place"]],
    ["Formule Signature", ["Recherche et réservation du lieu", "Salle et équipement audiovisuel", "Pauses café et déjeuners", "Team building", "Coordination sur place"]],
    ["Formule Prestige", ["Planification complète, de l'idée au jour J", "Scène, écrans LED et captation vidéo", "Soirée de gala", "Team building", "Accueil et transferts des invités"]],
  ],
};
