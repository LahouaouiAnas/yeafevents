import type { Locale } from "@/i18n/config";
import type { Service } from "@/lib/content/types";
import type { ServiceKey } from "@/lib/routes";
import { getImage, type ImageId } from "./media";

type LocalizedService = Omit<Service, "key" | "image">;

/** Team building has no real photo yet. */
const serviceImages: Record<ServiceKey, ImageId | undefined> = {
  teamBuilding: undefined,
  entertainment: "liveSinger",
  production: "pavilionStage",
};

const content: Record<ServiceKey, Record<Locale, LocalizedService>> = {
  teamBuilding: {
    fr: {
      title: "Team building",
      label: "Team building",
      tagline: "Des expériences collectives dans les décors du Maroc.",
      excerpt:
        "Désert, montagne, médina : des activités de cohésion qui rassemblent vraiment vos équipes, adaptées à votre groupe.",
      intro: [
        "Un bon team building crée des souvenirs communs et renforce les liens. Nous concevons des activités adaptées à la taille, au profil et aux objectifs de votre équipe.",
        "Les paysages autour de Marrakech — désert d'Agafay, Atlas, palmeraie — se prêtent à des expériences fortes, qui peuvent s'intégrer à un séminaire.",
      ],
      includes: [
        "Conception d'activités sur mesure",
        "Repérage et choix des sites",
        "Encadrement et animation",
        "Transport et logistique",
        "Restauration",
        "Intégration à un séminaire",
      ],
      occasions: ["Séminaires", "Incentives", "Journées de cohésion", "Intégration de nouvelles équipes"],
      serviceType: "Team building",
      seo: {
        title: "Team building à Marrakech",
        description:
          "Activités de cohésion dans le désert d'Agafay, l'Atlas ou la médina : Yeaf Events conçoit votre team building à Marrakech et au Maroc.",
      },
    },
    en: {
      title: "Team building",
      label: "Team building",
      tagline: "Shared experiences set in Morocco's landscapes.",
      excerpt:
        "Desert, mountains, medina: team activities that genuinely bring people together, tailored to your group.",
      intro: [
        "Good team building creates shared memories and stronger bonds. We design activities suited to the size, profile and goals of your team.",
        "The landscapes around Marrakech — the Agafay desert, the Atlas, the palm grove — lend themselves to powerful experiences that can be part of a seminar.",
      ],
      includes: [
        "Bespoke activity design",
        "Site scouting and selection",
        "Facilitation and supervision",
        "Transport and logistics",
        "Catering",
        "Integration into a seminar",
      ],
      occasions: ["Seminars", "Incentive trips", "Team days", "Onboarding new teams"],
      serviceType: "Team building",
      seo: {
        title: "Team building in Marrakech",
        description:
          "Team activities in the Agafay desert, the Atlas or the medina: Yeaf Events designs your team building in Marrakech and across Morocco.",
      },
    },
  },
  entertainment: {
    fr: {
      title: "Animation artistique",
      label: "Artistes & animation",
      tagline: "DJ, musiciens, danseurs et performances live.",
      excerpt:
        "Des artistes et des performances choisis pour votre public, qui donnent du rythme et de l'émotion à votre événement.",
      intro: [
        "L'animation donne son rythme à un événement. Nous sélectionnons les artistes en fonction de votre public, du lieu et du moment de la soirée.",
        "Musique live, DJ, performances, artistes traditionnels marocains ou spectacles plus contemporains : nous construisons une programmation cohérente avec l'ambiance recherchée.",
      ],
      includes: [
        "Programmation artistique",
        "DJ et musiciens live",
        "Danseurs et performers",
        "Artistes traditionnels marocains",
        "Direction technique des performances",
        "Coordination des passages",
      ],
      occasions: ["Soirées d'entreprise", "Mariages", "Soirées privées", "Lancements", "Festivals privés"],
      serviceType: "Animation et divertissement événementiel",
      seo: {
        title: "Animation d'événement à Marrakech : artistes & DJ",
        description:
          "DJ, musiciens, danseurs, artistes traditionnels : Yeaf Events conçoit l'animation artistique de vos événements à Marrakech et au Maroc.",
      },
    },
    en: {
      title: "Entertainment",
      label: "Entertainment",
      tagline: "DJs, musicians, dancers and live performances.",
      excerpt:
        "Performers chosen for your audience, bringing rhythm and emotion to your event.",
      intro: [
        "Entertainment sets the pace of an event. We select performers based on your audience, the venue and the moment in the evening.",
        "Live music, DJs, performances, traditional Moroccan artists or more contemporary shows: we build a line-up consistent with the atmosphere you want.",
      ],
      includes: [
        "Artistic programming",
        "DJs and live musicians",
        "Dancers and performers",
        "Traditional Moroccan artists",
        "Technical direction of performances",
        "Show running coordination",
      ],
      occasions: ["Corporate evenings", "Weddings", "Private parties", "Launches", "Private festivals"],
      serviceType: "Event entertainment",
      seo: {
        title: "Event entertainment in Marrakech: performers & DJs",
        description:
          "DJs, musicians, dancers, traditional artists: Yeaf Events curates entertainment for your events in Marrakech and across Morocco.",
      },
    },
  },
  production: {
    fr: {
      title: "Production événementielle",
      label: "Production",
      tagline: "Scénographie, technique, lumière et logistique.",
      excerpt:
        "La production technique et scénographique qui transforme un lieu en expérience : scène, son, lumière, décor, logistique.",
      intro: [
        "La production est ce qui transforme une idée en expérience concrète. Scène, son, lumière, vidéo, décor : chaque élément technique est pensé au service de l'émotion.",
        "Nous coordonnons les équipes techniques, les montages et les démontages, dans le respect du lieu et du planning.",
      ],
      includes: [
        "Scénographie et design d'espace",
        "Son, lumière et vidéo",
        "Scènes, structures et mobilier",
        "Plans techniques et implantation",
        "Montage et démontage",
        "Régie générale le jour J",
      ],
      occasions: ["Conventions", "Galas", "Concerts privés", "Lancements", "Mariages"],
      serviceType: "Production événementielle",
      seo: {
        title: "Production événementielle à Marrakech & au Maroc",
        description:
          "Scénographie, son, lumière, scène et logistique : Yeaf Events assure la production technique de vos événements à Marrakech et au Maroc.",
      },
    },
    en: {
      title: "Event production",
      label: "Production",
      tagline: "Set design, technical production, lighting and logistics.",
      excerpt:
        "Technical and scenic production that turns a venue into an experience: stage, sound, lighting, décor and logistics.",
      intro: [
        "Production is what turns an idea into a tangible experience. Stage, sound, lighting, video and décor: every technical element serves the emotion.",
        "We coordinate technical crews, set-up and teardown, with respect for the venue and the schedule.",
      ],
      includes: [
        "Set and space design",
        "Sound, lighting and video",
        "Stages, structures and furniture",
        "Technical plans and layout",
        "Set-up and teardown",
        "Show management on the day",
      ],
      occasions: ["Conventions", "Galas", "Private concerts", "Launches", "Weddings"],
      serviceType: "Event production",
      seo: {
        title: "Event production in Marrakech & Morocco",
        description:
          "Set design, sound, lighting, staging and logistics: Yeaf Events delivers the technical production of your events in Marrakech and Morocco.",
      },
    },
  },
};

export function getServiceContent(key: ServiceKey, locale: Locale): Service {
  const imageId = serviceImages[key];
  return { key, ...content[key][locale], image: imageId ? getImage(imageId, locale) : undefined };
}
