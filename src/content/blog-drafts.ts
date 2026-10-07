import type { Locale } from "@/i18n/config";
import type { CategoryKey } from "@/lib/routes";
import type { ImageId } from "./media";

/**
 * First blog articles, imported once into Sanity as DRAFTS (src/lib/cms/seed.ts): they appear
 * in the Studio for review and are only online once published there. After the import, Sanity
 * is the only source: editing this file changes nothing.
 *
 * Body blocks: "h" = heading, "p" = paragraph, "li" = bullet (consecutive bullets form one list).
 */

export type DraftBlock = ["h" | "p" | "li", string];

type DraftLocale = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  body: DraftBlock[];
  faq: { question: string; answer: string }[];
};

export type BlogDraft = {
  id: string;
  cover: ImageId;
  relatedCategories: CategoryKey[];
  content: Record<Locale, DraftLocale>;
};

export const blogDrafts: BlogDraft[] = [
  {
    id: "mariage-marrakech-guide",
    cover: "weddingPavilion",
    relatedCategories: ["wedding"],
    content: {
      fr: {
        title: "Organiser son mariage à Marrakech : le guide étape par étape",
        slug: "organiser-mariage-marrakech",
        excerpt:
          "Saison, lieu, budget, prestataires, invités venus de loin : les étapes clés pour préparer sereinement un mariage à Marrakech.",
        category: "Mariage",
        seoTitle: "Organiser son mariage à Marrakech : le guide complet",
        seoDescription:
          "Choisir la saison, le lieu, les prestataires et accueillir vos invités : notre guide pour organiser un mariage réussi à Marrakech.",
        body: [
          [
            "p",
            "Marrakech fait rêver les couples du monde entier : la lumière, les jardins, les riads, la palmeraie, le désert tout proche et un art de recevoir unique. Mais organiser un mariage ici demande de la méthode. Voici les étapes que nous suivons avec chaque couple.",
          ],
          ["h", "1. Choisir la bonne saison"],
          [
            "p",
            "Le printemps (mars à mai) et l'automne (septembre à novembre) offrent les températures les plus agréables pour une réception en extérieur. L'été est très chaud en journée : il se prête mieux aux mariages du soir, avec un dîner à la tombée de la nuit. L'hiver est doux le jour mais frais le soir, à prévoir pour les espaces extérieurs.",
          ],
          [
            "p",
            "Les dates les plus demandées partent vite : pour un mariage en haute saison, comptez idéalement neuf à douze mois d'anticipation pour réserver le lieu.",
          ],
          ["h", "2. Trouver le lieu qui vous ressemble"],
          ["p", "Le lieu donne le ton de toute la journée. Les grandes familles de lieux à Marrakech :"],
          ["li", "La Palmeraie : grands jardins, villas et domaines, idéals pour les réceptions nombreuses."],
          ["li", "Les riads de la médina : intimes et authentiques, parfaits pour les petits comités."],
          ["li", "Le désert d'Agafay : paysages minéraux et couchers de soleil spectaculaires, à moins d'une heure de la ville."],
          ["li", "Les contreforts de l'Atlas : nature, fraîcheur et vues sur les montagnes."],
          [
            "p",
            "Au-delà de la beauté du lieu, vérifiez la capacité, les solutions en cas de pluie ou de vent, les horaires autorisés pour la musique et l'accès pour les prestataires.",
          ],
          ["h", "3. Fixer un budget réaliste"],
          [
            "p",
            "Le budget dépend surtout du nombre d'invités, du lieu, de la décoration et de la durée des festivités. Définissez tôt une enveloppe globale et vos priorités (lieu, gastronomie, scénographie, musique) : c'est ce qui permet de faire les bons arbitrages sans mauvaise surprise.",
          ],
          ["h", "4. Réunir les bons prestataires"],
          [
            "p",
            "Traiteur, fleuriste, scénographie et lumière, son, musiciens et DJ, photographe et vidéaste, beauté, transport : un mariage mobilise souvent une quinzaine de prestataires. Le rôle d'un wedding planner est de les sélectionner, de négocier, de coordonner les plannings et de tout vérifier le jour J, pour que vous n'ayez qu'à profiter.",
          ],
          ["h", "5. Penser à vos invités"],
          [
            "p",
            "Beaucoup d'invités viennent de l'étranger ou d'autres villes. Prévoyez des options d'hébergement à proximité, les transferts depuis l'aéroport et entre les lieux, et pourquoi pas un programme sur plusieurs jours : soirée de bienvenue, cérémonie, brunch du lendemain.",
          ],
          ["h", "6. Le jour J"],
          [
            "p",
            "Un déroulé minute par minute, partagé avec tous les prestataires, est la clé d'une journée fluide. Le jour J, une équipe de coordination gère l'installation, les timings, les imprévus et les échanges avec chaque intervenant.",
          ],
          [
            "p",
            "Vous préparez votre mariage à Marrakech ? Parlez-nous de votre projet : nous vous accompagnons de la première idée au dernier invité.",
          ],
        ],
        faq: [
          {
            question: "Combien de temps à l'avance faut-il organiser un mariage à Marrakech ?",
            answer:
              "Idéalement neuf à douze mois pour un mariage en haute saison, afin d'avoir le choix du lieu et des prestataires. Pour un mariage plus intime, quelques mois peuvent suffire selon les disponibilités.",
          },
          {
            question: "Quelle est la meilleure période pour se marier à Marrakech ?",
            answer:
              "Le printemps et l'automne offrent les températures les plus agréables. L'été convient bien aux réceptions du soir, l'hiver aux espaces couverts ou chauffés.",
          },
          {
            question: "Peut-on organiser son mariage à Marrakech en vivant à l'étranger ?",
            answer:
              "Oui. Nous coordonnons à distance le lieu, les prestataires et la logistique des invités, avec des points réguliers en visio, pour que tout soit prêt à votre arrivée.",
          },
        ],
      },
      en: {
        title: "Planning your wedding in Marrakech: a step-by-step guide",
        slug: "planning-wedding-marrakech",
        excerpt:
          "Season, venue, budget, suppliers, guests travelling from abroad: the key steps to plan a wedding in Marrakech with peace of mind.",
        category: "Wedding",
        seoTitle: "Planning a wedding in Marrakech: the complete guide",
        seoDescription:
          "Choosing the season, the venue and the suppliers, and welcoming your guests: our guide to planning a successful wedding in Marrakech.",
        body: [
          [
            "p",
            "Marrakech captivates couples from all over the world: the light, the gardens, the riads, the palm grove, the nearby desert and a unique sense of hospitality. But planning a wedding here takes method. Here are the steps we follow with every couple.",
          ],
          ["h", "1. Choose the right season"],
          [
            "p",
            "Spring (March to May) and autumn (September to November) bring the most pleasant temperatures for an outdoor reception. Summer days are very hot, which suits evening weddings with dinner at nightfall. Winter is mild during the day but cool at night, something to plan for in outdoor spaces.",
          ],
          [
            "p",
            "The most popular dates go fast: for a high-season wedding, ideally allow nine to twelve months to book your venue.",
          ],
          ["h", "2. Find a venue that reflects you"],
          ["p", "The venue sets the tone for the whole day. The main kinds of venues in Marrakech:"],
          ["li", "The Palm Grove: large gardens, villas and estates, ideal for big receptions."],
          ["li", "Riads in the medina: intimate and authentic, perfect for smaller gatherings."],
          ["li", "The Agafay desert: mineral landscapes and spectacular sunsets, less than an hour from the city."],
          ["li", "The Atlas foothills: nature, cooler air and mountain views."],
          [
            "p",
            "Beyond its beauty, check the venue's capacity, its plan for rain or wind, the hours allowed for music and access for suppliers.",
          ],
          ["h", "3. Set a realistic budget"],
          [
            "p",
            "The budget depends mostly on the number of guests, the venue, the decoration and how long the celebrations last. Set an overall envelope and your priorities early (venue, food, set design, music): that is what makes the right trade-offs possible, without unpleasant surprises.",
          ],
          ["h", "4. Bring together the right suppliers"],
          [
            "p",
            "Caterer, florist, set design and lighting, sound, musicians and DJ, photographer and videographer, beauty, transport: a wedding often involves around fifteen suppliers. A wedding planner selects them, negotiates, coordinates schedules and checks everything on the day, so that all you have to do is enjoy it.",
          ],
          ["h", "5. Think of your guests"],
          [
            "p",
            "Many guests travel from abroad or from other cities. Plan accommodation options nearby, transfers from the airport and between venues, and perhaps a programme over several days: welcome evening, ceremony, day-after brunch.",
          ],
          ["h", "6. On the day"],
          [
            "p",
            "A minute-by-minute run sheet shared with every supplier is the key to a smooth day. On the day, a coordination team handles set-up, timings, the unexpected and every exchange with suppliers.",
          ],
          [
            "p",
            "Planning your wedding in Marrakech? Tell us about your project: we are with you from the first idea to the last guest.",
          ],
        ],
        faq: [
          {
            question: "How far in advance should you plan a wedding in Marrakech?",
            answer:
              "Ideally nine to twelve months for a high-season wedding, to have a choice of venues and suppliers. For a more intimate wedding, a few months can be enough depending on availability.",
          },
          {
            question: "What is the best time of year to get married in Marrakech?",
            answer:
              "Spring and autumn bring the most pleasant temperatures. Summer suits evening receptions, winter covered or heated spaces.",
          },
          {
            question: "Can we plan our wedding in Marrakech while living abroad?",
            answer:
              "Yes. We coordinate the venue, suppliers and guest logistics remotely, with regular video calls, so that everything is ready when you arrive.",
          },
        ],
      },
    },
  },
  {
    id: "seminaire-agafay",
    cover: "congressHall",
    relatedCategories: ["seminar"],
    content: {
      fr: {
        title: "Organiser un séminaire dans le désert d'Agafay : ce qu'il faut savoir",
        slug: "seminaire-desert-agafay",
        excerpt:
          "À moins d'une heure de Marrakech, le désert d'Agafay offre un cadre spectaculaire pour un séminaire. Logistique, programme et conseils pratiques.",
        category: "Séminaire",
        seoTitle: "Séminaire dans le désert d'Agafay près de Marrakech",
        seoDescription:
          "Organiser un séminaire d'entreprise dans le désert d'Agafay : accès, saisons, logistique, activités et conseils pour une expérience réussie.",
        body: [
          [
            "p",
            "Pour un séminaire qui marque les esprits, peu de cadres rivalisent avec le désert d'Agafay. Son paysage de collines de pierre, face aux sommets de l'Atlas, crée une rupture totale avec le quotidien, tout en restant proche de Marrakech.",
          ],
          ["h", "Pourquoi choisir Agafay ?"],
          ["li", "La proximité : à moins d'une heure de route de Marrakech et de son aéroport."],
          ["li", "Le dépaysement : un vrai paysage désertique, sans les longues heures de route vers le Sahara."],
          ["li", "La flexibilité : camps, lodges et espaces privatisables pour des groupes de tailles variées."],
          [
            "p",
            "C'est un lieu idéal pour les séminaires de direction, les incentives, les lancements et les soirées de gala.",
          ],
          ["h", "Bien choisir la saison"],
          [
            "p",
            "Le printemps et l'automne sont les périodes les plus confortables. En été, il fait très chaud en journée : on privilégie alors les activités tôt le matin et en soirée. En hiver, les journées sont agréables mais les nuits fraîches : prévoyez chauffage et plaids pour les moments en extérieur.",
          ],
          ["h", "La logistique, clé de la réussite"],
          [
            "p",
            "Le désert impose une organisation rigoureuse. Les points à anticiper :",
          ],
          ["li", "Les transferts des participants depuis Marrakech, avec des horaires précis."],
          ["li", "L'électricité, le son et l'éclairage pour les plénières et les soirées."],
          ["li", "La connexion internet si vous prévoyez des présentations ou des visioconférences."],
          ["li", "Un plan B en cas de vent, avec des espaces couverts ou des tentes adaptées."],
          ["li", "La restauration et l'hydratation tout au long de la journée."],
          ["h", "Composer un programme équilibré"],
          [
            "p",
            "Un bon séminaire alterne travail et expériences. Une matinée de plénière ou d'ateliers, puis des activités de cohésion l'après-midi, et un dîner sous les étoiles pour clôturer la journée. Le désert se prête aussi aux activités de team building : défis en équipe, balades, ou moments plus contemplatifs au coucher du soleil.",
          ],
          [
            "p",
            "Vous envisagez un séminaire à Agafay ou ailleurs au Maroc ? Nous prenons en charge le lieu, la production technique, la logistique et le programme, pour que vous puissiez vous concentrer sur vos équipes.",
          ],
        ],
        faq: [
          {
            question: "À quelle distance de Marrakech se trouve le désert d'Agafay ?",
            answer: "Il se trouve à moins d'une heure de route de Marrakech, ce qui facilite les transferts des participants.",
          },
          {
            question: "Peut-on organiser une plénière dans le désert ?",
            answer:
              "Oui, avec une installation adaptée : tente ou espace couvert, son, éclairage, écrans et alimentation électrique. Nous gérons toute la production technique.",
          },
          {
            question: "Quelle est la meilleure saison pour un séminaire à Agafay ?",
            answer:
              "Le printemps et l'automne. En été, on programme les temps forts tôt le matin et en soirée ; en hiver, on prévoit du chauffage pour les soirées.",
          },
        ],
      },
      en: {
        title: "Hosting a seminar in the Agafay desert: what you need to know",
        slug: "seminar-agafay-desert",
        excerpt:
          "Less than an hour from Marrakech, the Agafay desert is a spectacular setting for a seminar. Logistics, programme and practical tips.",
        category: "Seminar",
        seoTitle: "Corporate seminar in the Agafay desert near Marrakech",
        seoDescription:
          "Hosting a corporate seminar in the Agafay desert: access, seasons, logistics, activities and tips for a successful event.",
        body: [
          [
            "p",
            "For a seminar people will remember, few settings rival the Agafay desert. Its landscape of stony hills facing the Atlas peaks creates a complete break from daily routine, while staying close to Marrakech.",
          ],
          ["h", "Why choose Agafay?"],
          ["li", "Proximity: less than an hour's drive from Marrakech and its airport."],
          ["li", "A change of scene: a true desert landscape, without the long drive to the Sahara."],
          ["li", "Flexibility: camps, lodges and spaces that can be booked exclusively for groups of different sizes."],
          ["p", "It is an ideal place for leadership seminars, incentives, product launches and gala evenings."],
          ["h", "Choosing the right season"],
          [
            "p",
            "Spring and autumn are the most comfortable periods. In summer the days are very hot, so activities are best scheduled early in the morning and in the evening. In winter the days are pleasant but the nights are cool: plan heating and blankets for outdoor moments.",
          ],
          ["h", "Logistics, the key to success"],
          ["p", "The desert calls for rigorous organisation. Points to plan ahead:"],
          ["li", "Participant transfers from Marrakech, with precise timings."],
          ["li", "Power, sound and lighting for plenary sessions and evenings."],
          ["li", "Internet access if you plan presentations or video calls."],
          ["li", "A plan B for wind, with covered spaces or suitable tents."],
          ["li", "Catering and hydration throughout the day."],
          ["h", "Building a balanced programme"],
          [
            "p",
            "A good seminar alternates work and experiences: a morning of plenary sessions or workshops, team activities in the afternoon, and dinner under the stars to close the day. The desert also lends itself to team building: team challenges, walks, or quieter moments at sunset.",
          ],
          [
            "p",
            "Considering a seminar in Agafay or elsewhere in Morocco? We take care of the venue, technical production, logistics and programme, so you can focus on your teams.",
          ],
        ],
        faq: [
          {
            question: "How far is the Agafay desert from Marrakech?",
            answer: "It is less than an hour's drive from Marrakech, which makes participant transfers easy.",
          },
          {
            question: "Can you hold a plenary session in the desert?",
            answer:
              "Yes, with the right set-up: a tent or covered space, sound, lighting, screens and power. We handle all the technical production.",
          },
          {
            question: "What is the best season for a seminar in Agafay?",
            answer:
              "Spring and autumn. In summer, key moments are scheduled early in the morning and in the evening; in winter, heating is planned for the evenings.",
          },
        ],
      },
    },
  },
  {
    id: "destination-wedding-maroc",
    cover: "candlelitDinner",
    relatedCategories: ["wedding", "privateParty"],
    content: {
      fr: {
        title: "Destination wedding au Maroc : les étapes pour les couples venant de l'étranger",
        slug: "destination-wedding-maroc",
        excerpt:
          "Vous vivez à l'étranger et rêvez de vous marier au Maroc ? Organisation à distance, invités, cérémonie : comment préparer votre destination wedding.",
        category: "Mariage",
        seoTitle: "Destination wedding au Maroc : organiser son mariage à distance",
        seoDescription:
          "Couples vivant à l'étranger : comment organiser votre destination wedding au Maroc, à distance, de la cérémonie à l'accueil des invités.",
        body: [
          [
            "p",
            "Se marier au Maroc quand on vit à Paris, Londres ou Montréal, c'est offrir à ses proches un voyage autant qu'une fête. C'est aussi un projet qui se pilote à distance. Voici comment nous l'organisons avec les couples venant de l'étranger.",
          ],
          ["h", "Commencer par l'essentiel"],
          [
            "p",
            "Trois décisions structurent tout le reste : la date, le nombre d'invités et l'ambiance souhaitée (jardin, riad, désert, montagne). Une fois ces repères posés, on peut sélectionner les lieux et construire un budget cohérent.",
          ],
          ["h", "Organiser à distance, sans stress"],
          ["p", "La préparation à distance repose sur une méthode claire :"],
          ["li", "Des points réguliers en visio pour avancer étape par étape."],
          ["li", "Des visites de lieux en vidéo, photos et plans à l'appui."],
          ["li", "Un interlocuteur unique qui coordonne tous les prestataires sur place."],
          ["li", "Un planning partagé avec les échéances de chaque décision."],
          [
            "p",
            "Si votre emploi du temps le permet, un voyage de repérage quelques mois avant le mariage permet de valider le lieu, de goûter le menu et de rencontrer les prestataires clés.",
          ],
          ["h", "La cérémonie"],
          [
            "p",
            "Beaucoup de couples célèbrent l'union civile dans leur pays de résidence, puis organisent au Maroc une cérémonie laïque ou symbolique, entièrement personnalisée. Pour toute démarche officielle, nous vous conseillons de vous renseigner auprès de votre consulat et des autorités compétentes.",
          ],
          ["h", "Prendre soin de vos invités"],
          [
            "p",
            "Un destination wedding se vit souvent sur plusieurs jours. Pensez à informer vos invités tôt (save the date au moins six mois avant), à proposer des hébergements, à organiser les transferts et à composer un programme : soirée de bienvenue, cérémonie et dîner, brunch ou excursion le lendemain.",
          ],
          ["h", "Le jour J, vous profitez"],
          [
            "p",
            "Le jour du mariage, notre équipe coordonne l'installation, le déroulé et tous les intervenants. Vous et vos proches n'avez qu'une chose à faire : vivre le moment.",
          ],
          [
            "p",
            "Vous préparez votre mariage au Maroc depuis l'étranger ? Écrivez-nous : nous construisons avec vous un projet à votre image, où que vous soyez.",
          ],
        ],
        faq: [
          {
            question: "Peut-on tout organiser sans venir au Maroc avant le mariage ?",
            answer:
              "Oui, grâce aux échanges en visio, aux visites de lieux en vidéo et à une coordination sur place. Un voyage de repérage reste un plus si votre agenda le permet.",
          },
          {
            question: "Le mariage au Maroc a-t-il une valeur légale ?",
            answer:
              "Les démarches dépendent de votre nationalité. Beaucoup de couples se marient civilement dans leur pays puis célèbrent au Maroc une cérémonie symbolique. Renseignez-vous auprès de votre consulat pour les formalités officielles.",
          },
          {
            question: "Quand prévenir les invités d'un destination wedding ?",
            answer:
              "Idéalement six mois à un an avant, pour leur laisser le temps d'organiser leur voyage et leur hébergement.",
          },
        ],
      },
      en: {
        title: "Destination wedding in Morocco: the steps for couples coming from abroad",
        slug: "destination-wedding-morocco",
        excerpt:
          "Living abroad and dreaming of getting married in Morocco? Remote planning, guests, ceremony: how to prepare your destination wedding.",
        category: "Wedding",
        seoTitle: "Destination wedding in Morocco: planning your wedding remotely",
        seoDescription:
          "Couples living abroad: how to plan your destination wedding in Morocco remotely, from the ceremony to welcoming your guests.",
        body: [
          [
            "p",
            "Getting married in Morocco while living in Paris, London or New York means offering your loved ones a journey as much as a celebration. It is also a project you run from afar. Here is how we organise it with couples coming from abroad.",
          ],
          ["h", "Start with the essentials"],
          [
            "p",
            "Three decisions shape everything else: the date, the number of guests and the atmosphere you want (garden, riad, desert, mountains). Once these are set, venues can be shortlisted and a consistent budget built.",
          ],
          ["h", "Planning remotely, stress-free"],
          ["p", "Remote planning relies on a clear method:"],
          ["li", "Regular video calls to move forward step by step."],
          ["li", "Video tours of venues, backed by photos and floor plans."],
          ["li", "A single point of contact coordinating every supplier on the ground."],
          ["li", "A shared schedule with the deadline for each decision."],
          [
            "p",
            "If your schedule allows, a scouting trip a few months before the wedding lets you confirm the venue, taste the menu and meet the key suppliers.",
          ],
          ["h", "The ceremony"],
          [
            "p",
            "Many couples hold the civil marriage in their country of residence, then celebrate a fully personalised symbolic ceremony in Morocco. For any official formalities, we recommend checking with your consulate and the relevant authorities.",
          ],
          ["h", "Taking care of your guests"],
          [
            "p",
            "A destination wedding often spans several days. Tell your guests early (a save the date at least six months ahead), suggest accommodation, organise transfers and put together a programme: welcome evening, ceremony and dinner, brunch or an excursion the next day.",
          ],
          ["h", "On the day, you simply enjoy it"],
          [
            "p",
            "On the wedding day, our team coordinates set-up, timings and every supplier. You and your loved ones have one thing to do: live the moment.",
          ],
          [
            "p",
            "Planning your wedding in Morocco from abroad? Write to us: we will build a project that reflects you, wherever you are.",
          ],
        ],
        faq: [
          {
            question: "Can we plan everything without coming to Morocco before the wedding?",
            answer:
              "Yes, through video calls, video venue tours and on-site coordination. A scouting trip is still a plus if your schedule allows.",
          },
          {
            question: "Is a wedding in Morocco legally binding?",
            answer:
              "Formalities depend on your nationality. Many couples marry civilly at home and then celebrate a symbolic ceremony in Morocco. Check with your consulate for the official requirements.",
          },
          {
            question: "When should we tell guests about a destination wedding?",
            answer: "Ideally six months to a year ahead, so they have time to arrange travel and accommodation.",
          },
        ],
      },
    },
  },
];
