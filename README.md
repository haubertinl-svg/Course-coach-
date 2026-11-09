# Course Coach — Phase 1

*Your Personal AI Running Coach* — PWA personnelle de coaching running (iPhone d'abord).

**Phase 1 = interface et architecture uniquement.** Aucune donnée n'est réelle, aucune IA, aucune connexion sportive.

## Installation et lancement

Prérequis : Node.js 18 ou plus récent (https://nodejs.org).

```bash
cd course-coach
npm install
npm run dev
```

L'app s'ouvre sur `http://localhost:5173`. Avec `--host`, Vite affiche aussi une adresse réseau
(ex. `http://192.168.1.20:5173`) : ouvre-la dans Safari sur ton iPhone (même Wi-Fi que l'ordinateur) pour voir l'interface mobile.

Vérifier le build de production :

```bash
npm run build      # tsc + vite build -> dossier dist/
npm run preview    # sert dist/ pour tester le service worker
```

> Le build n'a **pas** pu être exécuté dans l'environnement où le code a été écrit (installation npm bloquée).
> Si `npm run build` signale une erreur de type, renvoie-moi le message : je corrige avant la Phase 2.

## Installer sur l'iPhone (écran d'accueil)

Le service worker (hors ligne) et l'installation propre exigent **HTTPS**, donc un déploiement :

1. Déploie `dist/` sur Cloudflare Pages (gratuit) :
   - dépôt GitHub -> Cloudflare Pages -> « Create project »
   - Build command : `npm run build` — Output directory : `dist`
   - ou : `npx wrangler pages deploy dist`
2. Ouvre l'URL `https://…pages.dev` **dans Safari** sur l'iPhone.
3. Bouton Partager -> « Sur l'écran d'accueil ».

Le fichier `public/_redirects` gère la navigation (rechargement d'une page interne).

## Ce qui fonctionne réellement (Phase 1)

| Élément | État |
|---|---|
| Navigation basse à 5 onglets, routes, fiche activité `/activites/:id` | Opérationnel |
| Calendrier Programme : vues semaine et mois, navigation, détail des séances (échauffement / corps / retour au calme) | Opérationnel (sur données fictives) |
| Activités : liste, fiche détaillée, graphiques d'allure et de FC (Recharts), splits, tracé GPS stylisé | Opérationnel (sur données fictives) |
| Comparaison de deux activités | Opérationnel (sur données fictives) |
| Affichage des données absentes (« — », jamais inventées) | Opérationnel |
| Design system (dark, verre dépoli, menthe/orange), animations, safe areas iPhone | Opérationnel |
| Manifeste PWA, icônes, service worker (app shell en cache) | Écrit, **non testé sur appareil** ; le cache hors ligne ne se remplit qu'après une première visite en production |
| Champs du Profil | Saisie possible, **non enregistrée** (perdue au rechargement) |

## Maquettes et fonctions simulées (à ne pas prendre pour du réel)

| Élément | Réalité |
|---|---|
| Toutes les données (séances, activités, objectifs, forme, récupération, recommandations) | **Fictives**, générées dans `src/data/mock.ts`, signalées par le badge « DONNÉES FICTIVES » |
| Bouton « IMPORTER MA COURSE » | **N'importe rien** : ouvre une fenêtre qui annonce la Phase 5 |
| Coach IA | **Maquette** : conversation écrite à la main, saisie désactivée, aucune IA branchée |
| Analyse après course | **Absente** (message d'attente affiché) |
| Statuts reportée/annulée, objectifs, adaptation du planning | **Affichage seulement**, non modifiables |
| Base de données, connexion, export/suppression des données | **Absents** (Phase 2) |
| Moteur d'entraînement, génération de séances | **Absent** (Phase 3) |
| Notifications | **Absentes** (Phase 6) |
| Strava, Apple Santé, Raccourcis iOS, FIT/GPX/TCX | **Absents** (Phase 5) |

## Arborescence

```
course-coach/
├─ index.html                 meta iOS, manifeste, polices
├─ package.json · vite.config.ts · tsconfig.json
├─ tailwind.config.js · postcss.config.js
├─ public/
│  ├─ manifest.webmanifest · sw.js · _redirects
│  └─ icons/                  icon.svg + PNG (192, 512, maskable, apple-touch)
├─ scripts/make-icons.mjs     régénère les PNG (npm run icons)
└─ src/
   ├─ main.tsx · App.tsx · index.css
   ├─ types.ts                Activity, TrainingSession, Goal…
   ├─ data/mock.ts            DONNÉES FICTIVES
   ├─ lib/date.ts · format.ts
   ├─ components/             BottomNav, Icon, ui (Ring, Stat…), RouteMap
   └─ pages/                  Home, Program, Activities, ActivityDetail, Coach, Profile
```

## Choix techniques

- React 18 + TypeScript + Vite + Tailwind 3, react-router, Recharts. Aucun service payant.
- Service worker écrit à la main (aucun plugin) : navigation réseau d'abord, statiques cache d'abord.
- Types : toute mesure absente vaut `null` (`Activity`), pour ne jamais inventer une donnée.
- Prévu ensuite : Supabase (RLS), Cloudflare Workers pour les secrets et l'IA, Gemini seulement si le quota gratuit convient.

## Prochaine étape

Phase 2 : profil sportif, objectifs, base Supabase, connexion personnelle. En attente de ta validation.
