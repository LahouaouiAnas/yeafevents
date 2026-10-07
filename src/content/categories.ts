import type { Locale } from "@/i18n/config";
import type { EventCategory } from "@/lib/content/types";
import type { CategoryKey, ServiceKey } from "@/lib/routes";
import { getImage, getVideo, type ImageId, type VideoId } from "./media";

type LocalizedCategory = Omit<EventCategory, "key" | "image" | "gallery" | "video" | "relatedServices">;

type CategoryMedia = {
  image?: ImageId;
  gallery: ImageId[];
  video?: VideoId;
  relatedServices: ServiceKey[];
};

/** Birthdays have no dedicated photo yet: the hero uses a real table setting, the gallery stays empty. */
const media: Record<CategoryKey, CategoryMedia> = {
  wedding: {
    image: "weddingTable",
    gallery: ["weddingPavilion", "pavilionStage"],
    video: "lightPavilion",
    relatedServices: ["entertainment", "production"],
  },
  privateParty: {
    image: "liveMusicians",
    gallery: ["liveSinger"],
    video: "dancingGuests",
    relatedServices: ["entertainment", "production"],
  },
  birthday: {
    image: "stringLightsTable",
    gallery: [],
    relatedServices: ["entertainment", "production"],
  },
  festival: {
    image: "concertStage",
    gallery: ["djCourtyard"],
    relatedServices: ["production", "entertainment"],
  },
  seminar: {
    image: "congressHall",
    gallery: ["congressAudience", "congressStage"],
    relatedServices: ["production", "teamBuilding"],
  },
};

const content: Record<CategoryKey, Record<Locale, LocalizedCategory>> = {
  wedding: {
    fr: {
      label: "Mariages",
      singular: "Mariage",
      title: "Organisation de mariage à Marrakech",
      phrase: "Un jour unique, pensé dans ses moindres détails.",
      lead: "De la scénographie à la coordination du jour J, nous imaginons un mariage qui vous ressemble, à Marrakech et partout au Maroc.",
      introTitle: "Un mariage à votre image",
      intro: [
        "Organiser un mariage, c'est orchestrer des dizaines de décisions tout en profitant pleinement de chaque étape. Nous vous accompagnons avec méthode et sensibilité, de la première idée au dernier invité.",
        "Pour les couples venant de l'étranger, nous coordonnons à distance lieux, prestataires et logistique des invités, afin que tout soit prêt à votre arrivée au Maroc.",
      ],
      includes: [
        "Accompagnement et planning global",
        "Recherche de lieux de réception",
        "Scénographie, fleurs et décoration",
        "Coordination des prestataires",
        "Animation, musique et artistes",
        "Logistique des invités",
      ],
      occasions: ["Mariages", "Destination weddings", "Henné et cérémonies", "Brunchs du lendemain"],
      serviceType: "Organisation de mariages",
      seo: {
        title: "Organisation de mariage à Marrakech & au Maroc",
        description:
          "Mariage à Marrakech ou destination wedding au Maroc : Yeaf Events imagine et orchestre votre mariage, de la scénographie à la coordination du jour J.",
      },
    },
    en: {
      label: "Weddings",
      singular: "Wedding",
      title: "Wedding planner in Marrakech",
      phrase: "A unique day, designed down to the last detail.",
      lead: "From set design to on-the-day coordination, we create a wedding that feels like you, in Marrakech and across Morocco.",
      introTitle: "A wedding that reflects you",
      intro: [
        "Planning a wedding means orchestrating dozens of decisions while still enjoying every step. We guide you with method and care, from the first idea to the last guest.",
        "For couples coming from abroad, we coordinate venues, suppliers and guest logistics remotely, so everything is ready when you arrive in Morocco.",
      ],
      includes: [
        "Guidance and overall planning",
        "Reception venue sourcing",
        "Set design, flowers and decoration",
        "Supplier coordination",
        "Entertainment, music and performers",
        "Guest logistics",
      ],
      occasions: ["Weddings", "Destination weddings", "Henna and ceremonies", "Day-after brunches"],
      serviceType: "Wedding planning",
      seo: {
        title: "Wedding planner in Marrakech & Morocco",
        description:
          "A wedding in Marrakech or a destination wedding in Morocco: Yeaf Events designs and orchestrates your day, from set design to on-the-day coordination.",
      },
    },
  },
  privateParty: {
    fr: {
      label: "Private Parties",
      singular: "Private party",
      title: "Soirées privées à Marrakech",
      phrase: "Des soirées sur mesure, à votre image.",
      lead: "Villa, riad, désert d'Agafay ou lieu d'exception : nous concevons des soirées privées dont vos invités se souviendront.",
      introTitle: "L'art de recevoir, en privé",
      intro: [
        "Une soirée privée se vit avant tout comme une expérience personnelle. Nous imaginons avec vous l'atmosphère, le lieu et chaque détail, de l'accueil des invités au dernier morceau.",
        "Marrakech et ses environs offrent des cadres exceptionnels : villas, riads, jardins, désert. Nous vous aidons à choisir celui qui correspond à votre soirée.",
      ],
      includes: [
        "Direction artistique et thème de la soirée",
        "Sélection du lieu",
        "Décoration, fleurs et mise en lumière",
        "DJ, musiciens et artistes",
        "Traiteur, bar et service",
        "Coordination le jour J",
      ],
      occasions: ["Fiançailles", "Soirées entre amis", "Célébrations familiales", "Week-ends privés"],
      serviceType: "Organisation de soirées privées",
      seo: {
        title: "Organisation de soirée privée à Marrakech",
        description:
          "Villa, riad ou désert d'Agafay : Yeaf Events organise votre soirée privée à Marrakech, du choix du lieu à l'animation et à la coordination le jour J.",
      },
    },
    en: {
      label: "Private Parties",
      singular: "Private party",
      title: "Private parties in Marrakech",
      phrase: "Bespoke evenings that reflect who you are.",
      lead: "A villa, a riad, the Agafay desert or an exceptional venue: we design private parties your guests will remember.",
      introTitle: "The art of hospitality, in private",
      intro: [
        "A private party is first and foremost a personal experience. Together we imagine the atmosphere, the venue and every detail, from welcoming your guests to the very last song.",
        "Marrakech and its surroundings offer remarkable settings: villas, riads, gardens and desert. We help you choose the one that suits your evening.",
      ],
      includes: [
        "Creative direction and party theme",
        "Venue selection",
        "Decoration, flowers and lighting",
        "DJs, musicians and performers",
        "Catering, bar and service",
        "On-the-day coordination",
      ],
      occasions: ["Engagements", "Celebrations with friends", "Family gatherings", "Private weekends"],
      serviceType: "Private party planning",
      seo: {
        title: "Private party planner in Marrakech",
        description:
          "Villa, riad or Agafay desert: Yeaf Events plans your private party in Marrakech, from venue selection to entertainment and on-the-day coordination.",
      },
    },
  },
  birthday: {
    fr: {
      label: "Anniversaires",
      singular: "Anniversaire",
      title: "Organisation d'anniversaire à Marrakech",
      phrase: "Célébrer une date qui compte, avec élégance.",
      lead: "Dîner intime, grande soirée ou surprise soigneusement orchestrée : nous concevons un anniversaire à la hauteur du moment.",
      introTitle: "Une célébration qui vous ressemble",
      intro: [
        "Un anniversaire marque une étape. Nous partons de votre histoire, de vos envies et de vos invités pour imaginer l'atmosphère, le lieu et le déroulé de la célébration.",
        "Décoration, lumière, musique, traiteur et coordination : nous prenons en charge chaque détail afin que vous profitiez pleinement de votre soirée.",
      ],
      includes: [
        "Concept et thème de la célébration",
        "Sélection du lieu",
        "Décoration, fleurs et mise en lumière",
        "DJ, musiciens et artistes",
        "Traiteur, bar et service",
        "Coordination le jour J",
      ],
      occasions: ["Anniversaires", "Anniversaires de mariage", "Fêtes surprises", "Célébrations en famille"],
      serviceType: "Organisation d'anniversaires",
      seo: {
        title: "Organisation d'anniversaire à Marrakech",
        description:
          "Dîner intime ou grande soirée : Yeaf Events organise votre anniversaire à Marrakech et au Maroc, du choix du lieu à la coordination le jour J.",
      },
    },
    en: {
      label: "Birthdays",
      singular: "Birthday",
      title: "Birthday party planner in Marrakech",
      phrase: "Celebrating a date that matters, with elegance.",
      lead: "An intimate dinner, a grand party or a carefully orchestrated surprise: we design a birthday worthy of the moment.",
      introTitle: "A celebration that feels like you",
      intro: [
        "A birthday marks a milestone. We start from your story, your wishes and your guests to imagine the atmosphere, the venue and the flow of the celebration.",
        "Decoration, lighting, music, catering and coordination: we take care of every detail so you can fully enjoy your evening.",
      ],
      includes: [
        "Celebration concept and theme",
        "Venue selection",
        "Decoration, flowers and lighting",
        "DJs, musicians and performers",
        "Catering, bar and service",
        "On-the-day coordination",
      ],
      occasions: ["Birthdays", "Wedding anniversaries", "Surprise parties", "Family celebrations"],
      serviceType: "Birthday party planning",
      seo: {
        title: "Birthday party planner in Marrakech",
        description:
          "An intimate dinner or a grand party: Yeaf Events plans your birthday in Marrakech and across Morocco, from venue selection to on-the-day coordination.",
      },
    },
  },
  festival: {
    fr: {
      label: "Festivals",
      singular: "Festival",
      title: "Organisation de festivals au Maroc",
      phrase: "Scène, son et lumière : l'énergie du live.",
      lead: "Du concept à la régie générale, nous réunissons production technique et programmation artistique pour donner vie à votre festival.",
      introTitle: "L'expérience du public avant tout",
      intro: [
        "Un festival se joue sur l'expérience du public : une programmation, une scène, une lumière et une organisation sans faille.",
        "Nous réunissons nos savoir-faire en production technique et en programmation artistique pour concevoir et coordonner votre événement, du concept à l'exécution.",
      ],
      includes: [
        "Concept et identité de l'événement",
        "Programmation artistique",
        "Scène, son, lumière et vidéo",
        "Scénographie des espaces",
        "Plans techniques, montage et démontage",
        "Régie générale et coordination des prestataires",
      ],
      occasions: ["Festivals", "Concerts privés", "Soirées DJ", "Événements en plein air"],
      serviceType: "Organisation de festivals et production événementielle",
      seo: {
        title: "Organisation de festival & production événementielle au Maroc",
        description:
          "Scène, son, lumière et programmation artistique : Yeaf Events conçoit et produit vos festivals et concerts, à Marrakech et partout au Maroc.",
      },
    },
    en: {
      label: "Festivals",
      singular: "Festival",
      title: "Festival organisation in Morocco",
      phrase: "Stage, sound and light: the energy of live events.",
      lead: "From concept to show management, we combine technical production and artistic programming to bring your festival to life.",
      introTitle: "The audience experience comes first",
      intro: [
        "A festival lives through its audience's experience: a line-up, a stage, lighting and flawless organisation.",
        "We bring together our expertise in technical production and artistic programming to design and coordinate your event, from concept to execution.",
      ],
      includes: [
        "Event concept and identity",
        "Artistic programming",
        "Stage, sound, lighting and video",
        "Space design",
        "Technical plans, set-up and teardown",
        "Show management and supplier coordination",
      ],
      occasions: ["Festivals", "Private concerts", "DJ nights", "Open-air events"],
      serviceType: "Festival organisation and event production",
      seo: {
        title: "Festival organisation & event production in Morocco",
        description:
          "Stage, sound, lighting and artistic programming: Yeaf Events designs and produces festivals and concerts in Marrakech and across Morocco.",
      },
    },
  },
  seminar: {
    fr: {
      label: "Séminaires",
      singular: "Séminaire",
      title: "Organisation de séminaires à Marrakech",
      phrase: "Séminaires, congrès et conventions, orchestrés avec précision.",
      lead: "Fédérer vos équipes, réunir vos clients, porter un message : nous concevons des séminaires qui servent vos objectifs, à Marrakech et partout au Maroc.",
      introTitle: "Un format au service de vos objectifs",
      intro: [
        "Un séminaire réussi sert un objectif précis : embarquer une équipe, transmettre un message, réunir une communauté. Nous partons de cet objectif pour construire le format, le lieu et l'expérience.",
        "De la conception à la coordination sur place, Yeaf Events prend en charge l'ensemble de la logistique pour que vos équipes restent concentrées sur l'essentiel : vos participants.",
      ],
      includes: [
        "Conception du concept et du déroulé",
        "Recherche et réservation de lieux",
        "Scénographie, décoration et signalétique",
        "Son, lumière, scène et captation",
        "Restauration et coordination des prestataires",
        "Accueil, transferts et gestion des participants",
      ],
      occasions: ["Séminaires", "Congrès", "Conventions", "Soirées de gala", "Incentives", "Lancements de produit"],
      serviceType: "Organisation de séminaires et d'événements d'entreprise",
      seo: {
        title: "Organisation de séminaire à Marrakech & au Maroc",
        description:
          "Séminaires, congrès, conventions et soirées de gala : Yeaf Events organise vos événements professionnels à Marrakech et partout au Maroc.",
      },
    },
    en: {
      label: "Seminars",
      singular: "Seminar",
      title: "Seminar organisation in Marrakech",
      phrase: "Seminars, congresses and conventions, orchestrated with precision.",
      lead: "Bringing teams together, hosting clients, carrying a message: we design seminars that serve your goals, in Marrakech and across Morocco.",
      introTitle: "A format built around your goals",
      intro: [
        "A successful seminar serves a clear purpose: engaging a team, delivering a message, gathering a community. We start from that purpose to shape the format, the venue and the experience.",
        "From concept to on-site coordination, Yeaf Events handles the entire logistics so your team can focus on what matters most: your participants.",
      ],
      includes: [
        "Concept and run-of-show design",
        "Venue sourcing and booking",
        "Set design, decoration and signage",
        "Sound, lighting, staging and filming",
        "Catering and supplier coordination",
        "Participant welcome, transfers and management",
      ],
      occasions: ["Seminars", "Congresses", "Conventions", "Gala dinners", "Incentive trips", "Product launches"],
      serviceType: "Seminar and corporate event organisation",
      seo: {
        title: "Seminar organisation in Marrakech & Morocco",
        description:
          "Seminars, congresses, conventions and gala dinners: Yeaf Events organises your professional events in Marrakech and across Morocco.",
      },
    },
  },
};

/** Photo IDs of a category as shipped, for the first import into Sanity. */
export function getCategoryMedia(key: CategoryKey): { image?: ImageId; gallery: ImageId[] } {
  return { image: media[key].image, gallery: media[key].gallery };
}

export function getCategoryContent(key: CategoryKey, locale: Locale): EventCategory {
  const { image, gallery, video, relatedServices } = media[key];
  return {
    key,
    ...content[key][locale],
    image: image ? getImage(image, locale) : undefined,
    gallery: gallery.map((id) => getImage(id, locale)),
    video: video ? getVideo(video, locale) : undefined,
    relatedServices,
  };
}
