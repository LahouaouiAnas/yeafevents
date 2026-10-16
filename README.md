# Yeaf Events — site officiel

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4. SEO-first, FR/EN, déployé comme application Node.js (Hostinger).

## Commandes

```bash
npm install
cp .env.example .env.local   # puis compléter
npm run dev                  # http://localhost:3000
npm run dev:lan              # idem, accessible depuis un téléphone du même Wi-Fi
npm run check                # lint + typecheck + build
npm run build && npm start   # production (Node.js)
```

## Déploiement (Hostinger — Node.js Web App, depuis GitHub)

| Réglage | Valeur |
|---|---|
| Node.js | 22.x (voir `.nvmrc` ; minimum 20.9) |
| Install | `npm ci` (ou `npm install`) |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Port | fourni par Hostinger via `PORT` (lu automatiquement par `next start`) |

Variables d'environnement à définir **avant le build** (les `NEXT_PUBLIC_*` sont intégrées au build) :

| Variable | Production |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL du domaine, sans `/` final (ex. `https://www.mondomaine.com`) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` uniquement en production (sinon `noindex` + `Disallow: /`) |

| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `m721osum` (vide = build sans Sanity) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_REVALIDATE_SECRET` | secret partagé avec le webhook Sanity (voir ci-dessous) |
| `SANITY_API_WRITE_TOKEN` | jeton Sanity « Editor » : enregistre les demandes de devis et lit le contenu du dataset privé |
| `SMTP_USER` / `SMTP_PASSWORD` | boîte mail d'envoi du formulaire (`contact@yeafevents.com`, serveur `smtp.hostinger.com:465`) |

Les variables Cloudinary de `.env.example` peuvent rester vides tant que ce service n'est pas branché.
Après toute modification d'une variable `NEXT_PUBLIC_*`, relancer un build.

## Sanity (CMS)

Les **réalisations**, **articles de blog** et **témoignages** viennent de Sanity (projet `m721osum`,
dataset `production`, public en lecture). Le reste du contenu est dans `src/content/`.

- **Studio** : `/studio` sur le site (ex. `https://yeafevents.com/studio`), connexion avec un compte Sanity.
  Schémas : `src/sanity/schemaTypes/`, configuration : `sanity.config.ts`.
- **Types d'événement** : les 5 pages (mariages, soirées privées…) sont modifiables dans le Studio
  (textes, listes, photos, galerie, textes Google). Les documents ont un ID fixe (`category.<clé>`) et
  sont créés par le site au démarrage (`src/instrumentation.ts` → `src/lib/cms/seed.ts`) à partir du
  contenu livré dans `src/content/categories.ts`, sans jamais écraser une modification. Un champ vidé
  reprend le texte d'origine. L'adresse des pages et les vidéos restent dans le code.
- **Page d'accueil** : document unique `homePage` (titres, textes, photos du diaporama, « Quelques
  moments », étapes, appel final, textes Google), créé au démarrage depuis le contenu livré
  (`src/i18n/dictionaries`, `src/content/media.ts`). Les photos du diaporama restent vides : une photo
  choisie remplace la photo et la vidéo de sa diapositive. Un champ vide reprend le texte d'origine.
- **Formules & prix** : premier onglet de chaque type d'événement. Cases « Masquer la section
  formules sur cette page » et « Afficher les prix sur le site » (décochée par défaut : aucun prix
  n'est affiché ni même envoyé à la page), et choix de la présentation : formules côte à côte avec
  bouton « Choisir cette formule », ou prestations (cartes courtes sans bouton, pour festivals et
  séminaires). Par formule : « Masquer cette formule », titre, nombre d'invités (minimum / maximum),
  description courte, prix de départ en €, £ et/ou MAD, « Afficher sans prix (sur devis) », « la
  plus demandée », liste « Ce qui est inclus », options et conditions.
  `src/content/pricing-drafts.ts` reprend les guides de l'agence (mariages, soirées privées,
  anniversaires, festivals, séminaires) ; il est importé une seule fois si l'onglet n'a jamais été
  rempli, et remplace une seule fois les premières formules provisoires restées intactes. Une
  formule n'apparaît qu'avec un prix ou « Afficher sans prix » : aucun prix n'est inventé.
  Les formules s'affichent sur la page du type d'événement et sur la page Formules (`/fr/formules`,
  `/en/packages`) ; avec les prix affichés, les cartes de l'accueil indiquent aussi « dès … ».
- **Sections du site** (document fixe `siteSettings`) : une case par section à afficher ou masquer
  (accueil, pages d'événement, page Formules, bouton WhatsApp, FAQ du contact). La liste et les
  valeurs par défaut sont dans `src/lib/content/sections.ts` ; le document est créé au démarrage.
- **Meta Pixel** (Sections du site → onglet « Publicité (Meta Pixel) ») : case « Activer » et ID du
  pixel. Activé, un bandeau cookies s'affiche ; le pixel (`src/lib/tracking/meta.ts`) n'est chargé
  qu'après « Accepter », et le lien « Gérer les cookies » du pied de page permet de changer d'avis.
  Événements : `PageView`, `ViewContent` (pages d'événement), `ChoosePackage` (bouton d'une
  formule), `Lead` (demande de devis envoyée), `Contact` (clic WhatsApp, téléphone, email).
  Page Confidentialité : `/fr/confidentialite`, `/en/privacy`.
- **Premiers articles de blog** : `src/content/blog-drafts.ts` est importé une seule fois dans Sanity
  sous forme de **brouillons** (à relire et publier dans le Studio). Les articles déjà importés sont
  notés dans le document `seed.state` : un brouillon supprimé ne revient pas.
- **Langues** : chaque champ traduisible a une valeur FR et EN. Un document n'existe dans une langue
  qu'une fois son titre et son adresse remplis dans cette langue.
- **Mise à jour** : un webhook Sanity appelle `/api/revalidate` à chaque publication ; la page est à jour
  dès la visite suivante. Sans webhook, le contenu se rafraîchit au plus tard après une heure.
- **Réglages sur sanity.io/manage** (projet `m721osum` → API) :
  - *CORS origins* : ajouter `https://yeafevents.com` (et `http://localhost:3000` en local), **Allow credentials** coché.
  - *Webhooks* : URL `https://yeafevents.com/api/revalidate`, dataset `production`, déclencheurs
    Create / Update / Delete, filtre `_type in ["project", "post", "testimonial", "eventCategory", "homePage", "siteSettings"]`, projection `{_type}`,
    méthode POST, *Secret* = la valeur de `SANITY_REVALIDATE_SECRET`.

## Demandes de devis

Le formulaire de contact (`src/components/sections/EventComposer.tsx`, une question par étape) appelle une Server Action
(`src/lib/quote/`) : validation côté serveur, pièges à spam (champ caché, envoi trop rapide),
5 envois par heure et par IP, puis :

- **email** à `contact@yeafevents.com` (répondre = répondre au client) + email de confirmation au client ;
- **document Sanity** « Demande de devis » (statut, notes internes) si `SANITY_API_WRITE_TOKEN` est défini.

La demande est acceptée si au moins un des deux canaux fonctionne ; sinon le visiteur est invité
à appeler ou écrire sur WhatsApp. **Le dataset Sanity doit être privé** (sanity.io/manage → Datasets),
car les demandes contiennent des données personnelles.

Coordonnées affichées (pied de page, page contact, bouton WhatsApp, JSON-LD) : `src/config/site.ts`.

## Architecture

```
src/
  app/
    [lang]/                  # root layout localisé (html lang, Header, Footer, JSON-LD global)
      page.tsx               # accueil (hero carrousel)
      [category]/            # univers : /fr/mariages, /en/weddings, /fr/seminaires…
      agence-evenementielle-marrakech/ | event-agency-marrakech/   # un dossier par slug localisé
      agence-evenementielle-maroc/     | event-agency-morocco/
      a-propos/ | about/
      realisations/[slug] | projects/[slug]
      services/[slug]  blog/[slug]  contact/
    og/[lang]/route.tsx      # image Open Graph par défaut
    sitemap.ts  robots.ts  global-not-found.tsx  icon.svg
  proxy.ts                   # "/" → /fr ou /en selon Accept-Language
  i18n/                      # locales, dictionnaires FR/EN
  lib/routes.ts              # SOURCE UNIQUE des URLs (liens, canonical, hreflang, sitemap)
  lib/seo/                   # buildMetadata() + builders JSON-LD
  lib/content/               # modèle de contenu + accès aux données
  lib/cms/                   # client Sanity, requêtes GROQ, conversion vers le modèle de contenu
  sanity/schemaTypes/        # types de documents du Studio (réalisation, article, témoignage)
  app/studio/                # Sanity Studio embarqué (/studio)
  app/api/revalidate/        # webhook Sanity → revalidation
  lib/quote/                 # formulaire de devis : validation, anti-spam, envoi email / Sanity
  content/                   # univers, services, réalisations, hero, registre des médias
  config/site.ts             # infos entreprise (contact, adresse, réseaux) → JSON-LD
  views/                     # une vue par page, partagée entre dossiers FR/EN
  components/{layout,sections,media,ui,seo}
public/
  media/                     # photos et vidéos affichées (chemins centralisés dans src/content/media.ts)
  about/                     # documents de référence : jamais affichés, exclus par robots.txt
```

### Ajouter une page ville (ex. Casablanca)

Uniquement quand un contenu unique existe :
1. ajouter la clé dans `staticRoutes` (`src/lib/routes.ts`) ;
2. créer `src/app/[lang]/agence-evenementielle-casablanca/` et `event-agency-casablanca/` (copier le modèle Marrakech) ;
3. ajouter la clé au sitemap (`src/app/sitemap.ts`) et un lien depuis la page Maroc.

## Indexation

`NEXT_PUBLIC_ALLOW_INDEXING=true` **uniquement en production**. Sinon : `noindex` sur toutes les pages et `Disallow: /`.
Le Blog reste en `noindex` (et hors sitemap) tant qu'il est vide.
