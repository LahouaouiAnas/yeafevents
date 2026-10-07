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

Les variables Cloudinary de `.env.example` peuvent rester vides tant que ce service n'est pas branché.
Après toute modification d'une variable `NEXT_PUBLIC_*`, relancer un build.

## Sanity (CMS)

Les **réalisations**, **articles de blog** et **témoignages** viennent de Sanity (projet `m721osum`,
dataset `production`, public en lecture). Le reste du contenu est dans `src/content/`.

- **Studio** : `/studio` sur le site (ex. `https://yeafevents.com/studio`), connexion avec un compte Sanity.
  Schémas : `src/sanity/schemaTypes/`, configuration : `sanity.config.ts`.
- **Langues** : chaque champ traduisible a une valeur FR et EN. Un document n'existe dans une langue
  qu'une fois son titre et son adresse remplis dans cette langue.
- **Mise à jour** : un webhook Sanity appelle `/api/revalidate` à chaque publication ; la page est à jour
  dès la visite suivante. Sans webhook, le contenu se rafraîchit au plus tard après une heure.
- **Réglages sur sanity.io/manage** (projet `m721osum` → API) :
  - *CORS origins* : ajouter `https://yeafevents.com` (et `http://localhost:3000` en local), **Allow credentials** coché.
  - *Webhooks* : URL `https://yeafevents.com/api/revalidate`, dataset `production`, déclencheurs
    Create / Update / Delete, filtre `_type in ["project", "post", "testimonial"]`, projection `{_type}`,
    méthode POST, *Secret* = la valeur de `SANITY_REVALIDATE_SECRET`.

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
