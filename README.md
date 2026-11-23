<div align="center">

<img src="public/media/logo/logo_yeaf_side.png" alt="Yeaf Events" width="320">

### Agence événementielle · Marrakech & Maroc

[yeafevents.com](https://yeafevents.com) · [Studio](https://yeafevents.com/studio)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=sanity&logoColor=white)
![Hostinger](https://img.shields.io/badge/Hostinger-673DE6?style=flat-square&logo=hostinger&logoColor=white)
![FR · EN](https://img.shields.io/badge/FR_·_EN-D0A046?style=flat-square)

</div>

---

## ⚡ Démarrer

```bash
npm install
cp .env.example .env.local   # puis compléter
npm run dev                  # http://localhost:3000  (dev:lan = accessible depuis un téléphone)
npm run check                # lint + typecheck + build
```

## 🚀 Déploiement — Hostinger (Node.js, depuis GitHub `main`)

Node 22 · build `npm run build` · start `npm run start` · port fourni par Hostinger.

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL du site, sans `/` final |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` en production uniquement |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` | `m721osum` · `production` |
| `SANITY_API_WRITE_TOKEN` | jeton « Editor » : lit le contenu, enregistre les demandes de devis |
| `SANITY_REVALIDATE_SECRET` | secret partagé avec le webhook Sanity |
| `SMTP_USER` · `SMTP_PASSWORD` | boîte d'envoi `contact@yeafevents.com` (`smtp.hostinger.com:465`) |

> [!IMPORTANT]
> Les variables `NEXT_PUBLIC_*` sont intégrées au build : après les avoir modifiées, relancer un build.

## 🎛️ Gérer le site — `/studio`

Le Studio s'ouvre sur un **tableau de bord** : nouvelles demandes, état des sections, Meta Pixel et formules.

| | Dans le Studio | Ce qu'on y contrôle |
|---|---|---|
| 📥 | **Demandes de devis** | demandes du formulaire, statut, notes |
| ⚙️ | **Réglages du site** | afficher / masquer chaque section · Meta Pixel (case + ID) |
| 🏠 | **Page d'accueil** | titres, textes, photos, appel final |
| 🎉 | **Types d'événement et formules** | textes, photos, formules (invités, inclus, options), prix affichés ou non |
| 📸 | **Réalisations · Blog · Témoignages** | contenus publiés |

Chaque modification apparaît sur le site après **Publier**. Un champ vidé reprend le texte d'origine ; aucun prix n'est inventé (une formule n'apparaît qu'avec un prix ou « Afficher sans prix »).

<details>
<summary><b>Réglages sanity.io/manage</b> (projet <code>m721osum</code> → API)</summary>

- **CORS origins** : `https://yeafevents.com` (et `http://localhost:3000`), *Allow credentials* coché.
- **Webhook** : `https://yeafevents.com/api/revalidate`, dataset `production`, Create / Update / Delete, méthode POST,
  projection `{_type}`, *Secret* = `SANITY_REVALIDATE_SECRET`, filtre :
  `_type in ["project", "post", "testimonial", "eventCategory", "homePage", "siteSettings"]`
- **Dataset privé** : les demandes de devis contiennent des données personnelles.

Sans webhook, le contenu se met à jour au plus tard après une heure.
</details>

## ✉️ Demandes de devis

Formulaire en 6 étapes (`EventComposer`) → validation et anti-spam côté serveur (`src/lib/quote/`) → **email** à l'agence + confirmation au client, et **document Sanity**. Le bouton « Choisir cette formule » préremplit le type et la formule.

## 📈 Meta Pixel

Activé depuis le Studio. Chargé **uniquement après accord** dans le bandeau cookies (lien « Gérer les cookies » en pied de page).
Événements : `PageView` · `ViewContent` · `ChoosePackage` · `Lead` · `Contact`. Page Confidentialité : `/fr/confidentialite`.

## 🗂️ Structure

```
src/
  app/[lang]/        pages FR/EN (un dossier par adresse localisée)
  app/studio/        Studio Sanity embarqué
  views/             une vue par page
  components/        layout · sections · ui · tracking
  lib/routes.ts      source unique des URLs (liens, hreflang, sitemap)
  lib/cms/           client Sanity, requêtes, import initial (seed.ts)
  content/           contenu livré : types d'événement, formules, médias
  sanity/            schémas et tableau de bord du Studio
  i18n/              dictionnaires FR / EN
  config/site.ts     coordonnées (contact, WhatsApp, réseaux)
```

> [!NOTE]
> Indexation : `NEXT_PUBLIC_ALLOW_INDEXING=true` seulement en production ; sinon `noindex` partout. Le blog reste hors sitemap tant qu'il est vide.

<div align="center">
<sub>© Yeaf Events · Marrakech, Maroc</sub>
</div>
