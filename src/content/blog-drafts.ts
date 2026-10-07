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
    id: "soiree-privee-agafay",
    cover: "liveMusicians",
    relatedCategories: ["privateParty", "birthday"],
    content: {
      fr: {
        title: "Organiser une soirée privée dans le désert d'Agafay",
        slug: "soiree-privee-desert-agafay",
        excerpt:
          "À moins d'une heure de Marrakech, le désert d'Agafay offre un décor unique pour une soirée privée. Ambiance, saison, logistique : nos conseils.",
        category: "Soirée privée",
        seoTitle: "Soirée privée dans le désert d'Agafay, près de Marrakech",
        seoDescription:
          "Anniversaire, fiançailles ou soirée entre amis : comment organiser une soirée privée inoubliable dans le désert d'Agafay, près de Marrakech.",
        body: [
          [
            "p",
            "Un dîner sous les étoiles, des collines de pierre qui changent de couleur au coucher du soleil, les sommets de l'Atlas à l'horizon : le désert d'Agafay est l'un des plus beaux décors pour une soirée privée au Maroc. Et il se trouve à moins d'une heure de Marrakech.",
          ],
          ["h", "Pourquoi choisir Agafay pour votre soirée ?"],
          ["li", "Le dépaysement : un vrai paysage désertique, sans les longues heures de route vers le Sahara."],
          ["li", "La proximité : vos invités logent à Marrakech et rentrent le soir même."],
          ["li", "L'intimité : un cadre privatisable, loin de l'agitation de la ville."],
          ["li", "La magie du soir : coucher de soleil, ciel étoilé, lumière des bougies et des lanternes."],
          [
            "p",
            "C'est un lieu idéal pour un anniversaire, des fiançailles, une soirée entre amis, un enterrement de vie de célibataire ou une célébration en famille.",
          ],
          ["h", "Choisir le bon moment"],
          [
            "p",
            "Le printemps et l'automne offrent des soirées douces, parfaites pour profiter de l'extérieur. En été, les journées sont très chaudes mais les soirées agréables : on fait commencer la fête au coucher du soleil. En hiver, les nuits sont fraîches : on prévoit des braseros, des plaids et des espaces abrités.",
          ],
          [
            "p",
            "Prévoyez d'arriver avant le coucher du soleil : c'est le moment le plus spectaculaire, idéal pour l'apéritif et les photos.",
          ],
          ["h", "Créer l'ambiance"],
          [
            "p",
            "Dans le désert, tout est à construire, et c'est ce qui rend chaque soirée unique. Tapis et coussins, tables basses ou longue tablée, mise en lumière avec bougies, lanternes et guirlandes, tentes berbères ou structures légères : la scénographie se pense en fonction de votre thème et du nombre d'invités.",
          ],
          [
            "p",
            "Côté musique, tout est possible : musiciens traditionnels, groupe live, DJ jusque tard dans la nuit, ou spectacle de feu pour un moment fort.",
          ],
          ["h", "La logistique, la clé d'une soirée réussie"],
          ["p", "Organiser une fête dans le désert demande d'anticiper :"],
          ["li", "Les transferts aller et retour depuis Marrakech, avec des horaires clairs pour vos invités."],
          ["li", "L'électricité, le son et l'éclairage, loin de toute installation fixe."],
          ["li", "Le traiteur et le bar, avec une équipe de service sur place."],
          ["li", "Un plan B en cas de vent ou de fraîcheur : tentes, paravents, chauffage."],
          ["li", "Le confort : sanitaires, vestiaire, et pourquoi pas un espace détente."],
          [
            "p",
            "Vous rêvez d'une soirée privée à Agafay ? Racontez-nous votre projet : nous imaginons l'ambiance, choisissons le lieu et gérons toute l'organisation, pour que vous n'ayez qu'à profiter de vos invités.",
          ],
        ],
        faq: [
          {
            question: "À quelle distance de Marrakech se trouve le désert d'Agafay ?",
            answer:
              "À moins d'une heure de route. Vos invités peuvent loger à Marrakech et rentrer le soir même grâce aux transferts organisés.",
          },
          {
            question: "Quelle est la meilleure saison pour une soirée à Agafay ?",
            answer:
              "Le printemps et l'automne pour des soirées douces. En été, la fête commence au coucher du soleil ; en hiver, on prévoit braseros, plaids et espaces abrités.",
          },
          {
            question: "Peut-on avoir de la musique et un DJ dans le désert ?",
            answer:
              "Oui. Nous installons le son, l'éclairage et l'électricité nécessaires, que ce soit pour des musiciens traditionnels, un groupe live ou un DJ.",
          },
        ],
      },
      en: {
        title: "Hosting a private party in the Agafay desert",
        slug: "private-party-agafay-desert",
        excerpt:
          "Less than an hour from Marrakech, the Agafay desert is a unique setting for a private party. Atmosphere, season, logistics: our advice.",
        category: "Private party",
        seoTitle: "Private party in the Agafay desert near Marrakech",
        seoDescription:
          "Birthday, engagement or a night with friends: how to host an unforgettable private party in the Agafay desert, near Marrakech.",
        body: [
          [
            "p",
            "Dinner under the stars, stony hills that change colour at sunset, the Atlas peaks on the horizon: the Agafay desert is one of the most beautiful settings for a private party in Morocco. And it is less than an hour from Marrakech.",
          ],
          ["h", "Why choose Agafay for your party?"],
          ["li", "A change of scene: a true desert landscape, without the long drive to the Sahara."],
          ["li", "Proximity: your guests stay in Marrakech and head back the same night."],
          ["li", "Privacy: a setting you can have to yourselves, far from the bustle of the city."],
          ["li", "Evening magic: sunset, a starry sky, candlelight and lanterns."],
          [
            "p",
            "It is an ideal place for a birthday, an engagement, a night with friends, a bachelor or bachelorette party, or a family celebration.",
          ],
          ["h", "Choosing the right time"],
          [
            "p",
            "Spring and autumn bring mild evenings, perfect for enjoying the outdoors. In summer, days are very hot but evenings are pleasant: the party starts at sunset. In winter, nights are cool: plan fire pits, blankets and sheltered areas.",
          ],
          [
            "p",
            "Plan to arrive before sunset: it is the most spectacular moment, ideal for drinks and photos.",
          ],
          ["h", "Creating the atmosphere"],
          [
            "p",
            "In the desert, everything is built from scratch, which is what makes every party unique. Rugs and cushions, low tables or a long banquet table, lighting with candles, lanterns and string lights, Berber tents or light structures: the set design follows your theme and the number of guests.",
          ],
          [
            "p",
            "For music, anything is possible: traditional musicians, a live band, a DJ late into the night, or a fire show for a standout moment.",
          ],
          ["h", "Logistics, the key to a successful party"],
          ["p", "Throwing a party in the desert means planning ahead:"],
          ["li", "Return transfers from Marrakech, with clear timings for your guests."],
          ["li", "Power, sound and lighting, far from any permanent installation."],
          ["li", "Catering and bar, with a service team on site."],
          ["li", "A plan B for wind or cool nights: tents, screens, heating."],
          ["li", "Comfort: restrooms, a cloakroom, and perhaps a lounge area."],
          [
            "p",
            "Dreaming of a private party in Agafay? Tell us about your project: we design the atmosphere, choose the venue and handle all the organisation, so you can simply enjoy your guests.",
          ],
        ],
        faq: [
          {
            question: "How far is the Agafay desert from Marrakech?",
            answer:
              "Less than an hour's drive. Your guests can stay in Marrakech and head back the same night with organised transfers.",
          },
          {
            question: "What is the best season for a party in Agafay?",
            answer:
              "Spring and autumn for mild evenings. In summer the party starts at sunset; in winter we plan fire pits, blankets and sheltered areas.",
          },
          {
            question: "Can we have music and a DJ in the desert?",
            answer:
              "Yes. We install the sound, lighting and power needed, whether for traditional musicians, a live band or a DJ.",
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
  {
    id: "seminaire-marrakech-guide",
    cover: "congressHall",
    relatedCategories: ["seminar"],
    content: {
      fr: {
        title: "Organiser un séminaire d'entreprise à Marrakech : le guide",
        slug: "organiser-seminaire-entreprise-marrakech",
        excerpt:
          "Objectifs, lieu, programme, logistique et budget : les étapes pour réussir le séminaire de vos équipes à Marrakech.",
        category: "Séminaire",
        seoTitle: "Organiser un séminaire d'entreprise à Marrakech : le guide",
        seoDescription:
          "Choisir le lieu, construire le programme, gérer la logistique et la technique : notre guide pour organiser un séminaire d'entreprise réussi à Marrakech.",
        body: [
          [
            "p",
            "Marrakech s'est imposée comme l'une des destinations favorites des entreprises pour leurs séminaires, conventions et voyages incentive. Bien desservie par avion depuis l'Europe, ensoleillée une grande partie de l'année et riche en lieux d'exception, la ville permet d'allier travail, cohésion et dépaysement. Voici les étapes clés pour réussir votre séminaire.",
          ],
          ["h", "1. Clarifier les objectifs"],
          [
            "p",
            "Tout part d'une question simple : que doivent retenir vos équipes en rentrant ? Présenter une stratégie, lancer un produit, fédérer après une réorganisation, récompenser une année réussie… L'objectif guide ensuite chaque choix : le lieu, le rythme du programme, la part de travail et de détente, le ton des soirées.",
          ],
          ["h", "2. Choisir le bon lieu"],
          ["p", "Marrakech offre des cadres très différents selon le format :"],
          ["li", "Les hôtels avec centre de conférences : pratiques pour les grands groupes, tout est sur place."],
          ["li", "Les domaines et villas de la Palmeraie : idéals pour un comité de direction ou un groupe de taille moyenne, en toute discrétion."],
          ["li", "Les riads privatisés : une atmosphère intime et typiquement marocaine pour les petits groupes."],
          ["li", "Le désert d'Agafay et les contreforts de l'Atlas : pour une journée ou une soirée qui marque les esprits, à moins d'une heure de la ville."],
          [
            "p",
            "Vérifiez la capacité des salles, la lumière naturelle, la qualité de la connexion internet, les espaces pour les ateliers en sous-groupes et la distance avec l'hébergement.",
          ],
          ["h", "3. Construire un programme équilibré"],
          [
            "p",
            "Les séminaires les plus réussis alternent les temps forts. Une plénière le matin, quand l'attention est maximale, des ateliers en petits groupes, puis des activités de cohésion l'après-midi. Le soir, un dîner dans un lieu emblématique prolonge les échanges dans un cadre détendu. Évitez les journées trop chargées : les moments informels sont souvent ceux où les équipes se rapprochent le plus.",
          ],
          ["h", "4. Soigner la production technique"],
          [
            "p",
            "Son, éclairage, écrans LED, régie, captation vidéo, traduction simultanée si votre public est international : la technique conditionne la qualité de vos prises de parole. Une répétition la veille avec les intervenants permet de régler chaque détail et d'aborder le jour J sereinement.",
          ],
          ["h", "5. Anticiper la logistique"],
          ["p", "Pour un séminaire, la logistique fait la différence :"],
          ["li", "L'accueil à l'aéroport et les transferts entre l'hôtel et les lieux du programme."],
          ["li", "L'hébergement, avec des chambres regroupées autant que possible."],
          ["li", "La restauration, en tenant compte des régimes alimentaires de chacun."],
          ["li", "Un interlocuteur unique sur place, joignable à tout moment."],
          ["h", "6. Maîtriser le budget"],
          [
            "p",
            "Le budget dépend surtout du nombre de participants, de la durée, de la saison, du niveau d'hébergement et du programme d'activités. Fixez tôt une enveloppe globale et vos priorités : cela permet de construire une proposition sur mesure et d'éviter les mauvaises surprises.",
          ],
          [
            "p",
            "Vous préparez un séminaire à Marrakech ou ailleurs au Maroc ? Parlez-nous de vos objectifs : nous prenons en charge le lieu, la production technique, la logistique et le programme, pour que vous puissiez vous concentrer sur vos équipes.",
          ],
        ],
        faq: [
          {
            question: "Combien de temps à l'avance organiser un séminaire à Marrakech ?",
            answer:
              "Idéalement trois à six mois avant pour un groupe important, afin de réserver les meilleurs lieux et hébergements. Pour un petit comité, quelques semaines peuvent suffire selon les disponibilités.",
          },
          {
            question: "Quelle est la meilleure période pour un séminaire à Marrakech ?",
            answer:
              "Le printemps et l'automne offrent des températures idéales. L'hiver est doux en journée ; en été, on privilégie les activités tôt le matin et en soirée.",
          },
          {
            question: "Pouvez-vous gérer la partie technique de nos plénières ?",
            answer:
              "Oui : son, éclairage, écrans, régie et captation vidéo. Nous coordonnons aussi la répétition avec vos intervenants la veille de l'événement.",
          },
        ],
      },
      en: {
        title: "Planning a corporate seminar in Marrakech: the guide",
        slug: "corporate-seminar-marrakech-guide",
        excerpt:
          "Objectives, venue, programme, logistics and budget: the steps to a successful seminar for your teams in Marrakech.",
        category: "Seminar",
        seoTitle: "Planning a corporate seminar in Marrakech: the guide",
        seoDescription:
          "Choosing the venue, building the programme, handling logistics and technical production: our guide to a successful corporate seminar in Marrakech.",
        body: [
          [
            "p",
            "Marrakech has become one of companies' favourite destinations for seminars, conventions and incentive trips. Well connected by air to Europe, sunny for much of the year and full of exceptional venues, the city combines work, team spirit and a change of scene. Here are the key steps to a successful seminar.",
          ],
          ["h", "1. Clarify your objectives"],
          [
            "p",
            "It all starts with one simple question: what should your teams take home? Presenting a strategy, launching a product, bringing people together after a reorganisation, rewarding a successful year… The objective then guides every choice: the venue, the pace of the programme, the balance between work and relaxation, the tone of the evenings.",
          ],
          ["h", "2. Choose the right venue"],
          ["p", "Marrakech offers very different settings depending on the format:"],
          ["li", "Hotels with conference centres: practical for large groups, with everything on site."],
          ["li", "Estates and villas in the Palm Grove: ideal for a leadership team or a mid-sized group, in complete privacy."],
          ["li", "Privately booked riads: an intimate, typically Moroccan atmosphere for small groups."],
          ["li", "The Agafay desert and the Atlas foothills: for a day or an evening to remember, less than an hour from the city."],
          [
            "p",
            "Check room capacity, natural light, internet quality, breakout spaces for workshops and the distance from the accommodation.",
          ],
          ["h", "3. Build a balanced programme"],
          [
            "p",
            "The most successful seminars alternate key moments: a plenary session in the morning, when attention is at its peak, small-group workshops, then team activities in the afternoon. In the evening, dinner at an iconic venue keeps the conversation going in a relaxed setting. Avoid overloaded days: informal moments are often when teams grow closest.",
          ],
          ["h", "4. Get the technical production right"],
          [
            "p",
            "Sound, lighting, LED screens, control room, video capture, simultaneous interpreting for an international audience: technical production shapes the quality of every talk. A rehearsal the day before with the speakers fine-tunes every detail so the big day runs smoothly.",
          ],
          ["h", "5. Plan the logistics"],
          ["p", "For a seminar, logistics make the difference:"],
          ["li", "Airport welcome and transfers between the hotel and programme venues."],
          ["li", "Accommodation, with rooms grouped together wherever possible."],
          ["li", "Catering that takes everyone's dietary requirements into account."],
          ["li", "A single point of contact on site, reachable at any time."],
          ["h", "6. Control the budget"],
          [
            "p",
            "The budget depends mainly on the number of participants, the length of stay, the season, the standard of accommodation and the activity programme. Set an overall envelope and your priorities early: it makes a tailored proposal possible and avoids unpleasant surprises.",
          ],
          [
            "p",
            "Planning a seminar in Marrakech or elsewhere in Morocco? Tell us about your objectives: we take care of the venue, technical production, logistics and programme, so you can focus on your teams.",
          ],
        ],
        faq: [
          {
            question: "How far in advance should you plan a seminar in Marrakech?",
            answer:
              "Ideally three to six months ahead for a large group, to secure the best venues and accommodation. For a small team, a few weeks can be enough depending on availability.",
          },
          {
            question: "What is the best time of year for a seminar in Marrakech?",
            answer:
              "Spring and autumn bring ideal temperatures. Winter days are mild; in summer, activities are best scheduled early in the morning and in the evening.",
          },
          {
            question: "Can you handle the technical side of our plenary sessions?",
            answer:
              "Yes: sound, lighting, screens, control room and video capture. We also coordinate the rehearsal with your speakers the day before the event.",
          },
        ],
      },
    },
  },
];
