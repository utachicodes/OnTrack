# OnTrack

> Tâches, examens, sessions de focus et tuteur IA pour préparer le BAC français avec sérénité.

Edité par Utachi Industries. Live: <https://ontrack.utachiindustries.space>

![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-Proprietary-ee705f)
![PWA](https://img.shields.io/badge/PWA-installable-5fb87e)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## Sommaire

1. [Fonctionnalités](#fonctionnalités)
2. [Stack technique](#stack-technique)
3. [Démarrage rapide](#démarrage-rapide)
4. [Variables d'environnement](#variables-denvironnement)
5. [Base de données](#base-de-données)
6. [Curriculum officiel](#curriculum-officiel)
7. [API](#api)
8. [PWA et notifications push](#pwa-et-notifications-push)
9. [Design system](#design-system)
10. [Déploiement](#déploiement)
11. [Tests et vérification](#tests-et-vérification)
12. [Sécurité](#sécurité)
13. [Dépendances](#dépendances)
14. [Arborescence](#arborescence)
15. [Dépannage](#dépannage)
16. [Crédits](#crédits)

---

## Fonctionnalités

- **Authentification** par email + mot de passe via Better Auth (cookie sécurisé, sessions 7 jours)
- **Tableau de bord** unifié : tâches en cours, prochain examen, sessions de la semaine, tuteur IA en colonne latérale
- **Tâches** avec sujet, priorité, durée estimée, échéance, complétion en un clic
- **Examens** avec compte à rebours, barre de progression de préparation
- **Focus** : minuterie Pomoro de 25 minutes, persistence dans la base, notification système à la fin
- **Apprendre** : 4 pistes (Code, Python, Physique, Maths) avec leçons, simulateurs Canvas, quiz
- **Flashcards** : répétition espacée SM-2, decks auto-amorcés par chapitre, ajout libre
- **Examen blanc** : générateur chronométré, correction automatique avec explications
- **Quotas** : score minimum de 80% pour valider une leçon (gating strict)
- **Planning** : timeline combinant tâches et examens
- **Habitudes** et **Objectifs** : checklists locales (localStorage)
- **Bibliothèque** : import de documents PDF/TXT/MD stockés en base
- **Tuteur IA** : appel direct à Google Gemini 2.5 Flash avec contexte matière
- **PWA installable** : manifeste, service worker, prompt d'installation in-app
- **Notifications push** : opt-in via Web Push API, endpoint backend `/api/push/subscribe`
- **Mobile-first** : sidebar coulissant, layout adaptatif
- **Mode sombre** opt-in via Réglages (clair par défaut)
- **Multilingue** : interface 100% en français

---

## Stack technique

| Couche | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 |
| Langage | TypeScript 5.7 |
| Styling | Tailwind CSS 4 + CSS global (`app/globals.css`) |
| Base de données | PostgreSQL via Neon (HTTPS) |
| ORM | Drizzle ORM |
| Auth | Better Auth (cookie sessions, rate limiting intégré) |
| AI | Google Gemini 2.5 Flash via Vercel AI SDK |
| Push | Web Push API + VAPID |
| Icônes | Lucide (stroke 1.7) via wrapper `components/icons.tsx` |
| Marque | Logo PNG Utachi Industries (`public/logo.png`) |
| Déploiement | Vercel (production) |

Pas de Tailwind UI, pas de Material, pas de shadcn. Le design est entièrement maison, défini dans `app/globals.css`.

---

## Démarrage rapide

### Pré-requis

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Une base PostgreSQL (locale ou Neon)

### Installation

```bash
pnpm install
cp .env.example .env.local
# Remplir DATABASE_URL + BETTER_AUTH_SECRET + GOOGLE_GENERATIVE_AI_API_KEY
pnpm dev
```

Ouvrir <http://localhost:3000>

### Migrations base de données

Les migrations sont des fichiers SQL idempotents dans `drizzle/` :

```bash
# Appliquer manuellement sur la base Neon :
psql $DATABASE_URL -f drizzle/0001_user_preferences.sql
psql $DATABASE_URL -f drizzle/0002_lesson_progress.sql
psql $DATABASE_URL -f drizzle/0003_flashcards_mock_exams.sql
```

Ou via le runner MCP Neon :

```
mcp__neon_run_sql --sql "$(cat drizzle/0001_user_preferences.sql)" --projectId green-tooth-70140031
```

### Build production

```bash
pnpm build
pnpm start
```

---

## Variables d'environnement

| Variable | Description | Requis |
| --- | --- | --- |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL | oui |
| `BETTER_AUTH_SECRET` | Secret de session ≥ 32 caractères (générer avec `openssl rand -base64 32`) | oui |
| `BETTER_AUTH_URL` | URL publique (auto-détectée sur Vercel) | non |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Clé Gemini 2.5 Flash (https://aistudio.google.com/apikey) | oui pour le tuteur IA |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clé publique VAPID pour Web Push | oui pour les notifications push |
| `VAPID_PRIVATE_KEY` | Clé privée VAPID (côté serveur uniquement) | oui pour les notifications push |

Exemple complet dans `.env.example`.

---

## Base de données

Toutes les tables vivent dans le schéma `public`. Elles sont créées idempotemment par les fichiers `drizzle/*.sql`.

| Table | Description |
| --- | --- |
| `user` | Comptes (Better Auth) |
| `session` | Sessions actives |
| `account` | Comptes OAuth (Better Auth) |
| `verification` | Tokens de vérification email |
| `user_preferences` | Thème + couleur d'accent par utilisateur |
| `tasks` | Tâches utilisateur |
| `exams` | Examens BAC avec date et progression |
| `focus_sessions` | Historique Pomodoro (durée, status, interruptions) |
| `notification_preferences` | Préférences de notifs par utilisateur |
| `push_subscriptions` | Endpoints Web Push par utilisateur/appareil |
| `learning_documents` | Documents importés (bytes en base) |
| `ai_conversations` | Historique des conversations tuteur (placeholder) |
| `lesson_progress` | Leçons complétées (avec score 0-100 et XP) |
| `user_xp` | Cumul XP et niveau courant |
| `flashcard_decks` | Decks de flashcards par utilisateur |
| `flashcards` | Cartes individuelles avec champs SM-2 |
| `mock_exams` | Examens blancs générés |
| `mock_exam_responses` | Réponses par question |

### Schéma des tables clés

```sql
CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  chapter_id TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  chapter_id TEXT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  -- SM-2
  ease INTEGER NOT NULL DEFAULT 250,        -- *100 (250 = 2.5)
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  due_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT flashcards_user_front_uq UNIQUE (user_id, front)
);
```

---

## Curriculum officiel

Le programme embarqué reflète le **Bulletin Officiel n°8 du 25 juillet 2019** (réforme du BAC général) et ses mises à jour BO 2024.

| Piste | Matière | Chapitres | Coefficient |
| --- | --- | --- | --- |
| `maths` | Mathématiques (spécialité) | 15 | 16 |
| `physique` | Physique-Chimie (spécialité) | 16 | 16 |
| `svt` | SVT (spécialité) | 12 | 16 |
| `philo` | Philosophie (tronc commun) | 17 notions | 8 |
| `francais` | Français (épreuves anticipées) | 6 (4 objets d'étude) | 10 |
| `histoire` | Histoire-Géographie (tronc commun) | 6 | 6 |
| `ses` | Sciences Économiques et Sociales | 12 | 16 |
| `nsi` | Numérique et Sciences Informatiques | 18 | 16 |

- **Source** : `lib/bac-curriculum.ts`
- **Questions** : `lib/bac-questions.ts` — 191 questions BAC-style avec réponses et explications
- **Flashcards seed** : `lib/seed-flashcards.ts` — pré-rempli par chapitre, auto-amorcé au premier accès

### Algorithme SM-2

Implémenté dans `lib/sm2.ts`. Une carte progresse via 4 notes :
- `again` (≤1 min) — oubli total, reset des repetitions
- `hard` (~10 min) — correct avec difficulté, ease -0.15
- `good` (~1 jour) — correct après hésitation
- `easy` (~4 jours) — rappel parfait, ease +0.15

---

## API

| Route | Méthode | Description |
| --- | --- | --- |
| `/api/auth/[...all]` | GET, POST | Better Auth (sign-in, sign-up, sign-out, session) |
| `/api/ai/tutor` | POST | Question au tuteur IA, renvoie une réponse Gemini |
| `/api/learn` | GET, POST | GET = état utilisateur (XP, level, badges). POST = compléter une leçon, score ≥ 80% requis |
| `/api/flashcards` | GET, POST, PATCH, DELETE | Decks, ajout, review (SM-2), suppression |
| `/api/examen-blanc` | GET, POST, PATCH, DELETE | Historique, génération chronométrée, soumission + correction |
| `/api/documents/upload` | POST, GET, DELETE | Upload PDF/TXT/MD (4 Mo max) |
| `/api/documents/file?id=...` | GET | Téléchargement d'un document |
| `/api/push/subscribe` | POST, DELETE | Abonnement Web Push |

### Exemple : complétion de leçon

```bash
curl -X POST /api/learn \
  -H "Content-Type: application/json" \
  -d '{ "lessonId": "code-hello", "score": 85 }'

# 200 OK
{ "passed": true, "xpAwarded": 92, "totalXp": 92, "level": 2 }

# 400 si score < 80
{ "passed": false, "score": 65, "threshold": 80, "message": "Score 65% insuffisant. ..." }
```

---

## PWA et notifications push

- **Manifeste** : `public/manifest.webmanifest` — nom, icônes, shortcuts (Démarrer focus, Apprendre)
- **Service worker** : `public/sw.js` — stratégie stale-while-revalidate pour assets, network-first pour HTML, cache offline fallback
- **Install prompt** : `components/pwa-bootstrap.tsx` capture l'événement `beforeinstallprompt` et expose un bouton flottant
- **Push** : `/api/push/subscribe` enregistre l'endpoint Web Push du navigateur (nécessite VAPID). Le service worker affiche les notifications push reçues et ouvre l'URL au clic.

Configuration VAPID :

```bash
# Générer une paire de clés (une seule fois)
npx web-push generate-vapid-keys
# Mettre NEXT_PUBLIC_VAPID_PUBLIC_KEY et VAPID_PRIVATE_KEY dans .env.local
```

---

## Design system

### Couleurs

| Token | Valeur | Usage |
| --- | --- | --- |
| `--primary` | `#ee705f` | Action, focus, surbrillance (Utachi coral) |
| `--primary-soft` | `#fcdcd5` | Fond des éléments primary |
| `--background` | `#f5f6f8` | Fond principal (light) |
| `--foreground` | `#252938` | Texte principal |
| `--muted` | `#f0f1f4` | Éléments secondaires |
| `--muted-foreground` | `#7d8291` | Texte secondaire |
| `--border` | `#e8e9ee` | Bordures |

En mode sombre (opt-in), ces variables sont réécrites dans `html[data-theme="dark"]`.

### Polices

- **Sans** : Plus Jakarta Sans (variable Next.js `--font-jakarta`)
- **Mono** : Space Mono (labels et chiffres tabulaires)
- **Serif** : Instrument Serif (titres éditoriaux)

### Iconographie

Toutes les icônes proviennent de **Lucide** via le wrapper `components/icons.tsx`. Stroke width 1.7 pour les icônes de nav, 1.6 pour les icônes de formulaire.

Pas d'emoji, pas de formes "dessinées à la main". Le logo de marque est l'image PNG Utachi Industries (`public/logo.png`).

---

## Déploiement

### Vercel (recommandé)

```bash
vercel link
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel deploy --prod
```

L'URL de production est aliasée sur `fatima.utachiindustries.space`.

### Build local

```bash
pnpm build
node .next/standalone/server.js
```

---

## Tests et vérification

### Smoke test (à exécuter après chaque déploiement)

```bash
BASE="https://fatima.utachiindustries.space"
echo "--- landing"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/"
echo "--- sign-in"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/sign-in"
echo "--- legal"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/legal"
echo "--- manifest"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/manifest.webmanifest"
echo "--- sw.js"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/sw.js"
echo "--- /api/learn (401 attendu)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "$BASE/api/learn"
```

Résultats attendus : `200, 200, 200, 200, 200, 401`.

### TypeScript

```bash
pnpm build   # Skipping validation of types est désactivé par défaut
```

### Tests unitaires (TODO)

Pas de tests unitaires aujourd'hui. Ajouter Vitest + Testing Library pour les composants critiques (lesson gating, SM-2, score calculation).

---

## Sécurité

- **CSP** strict via `next.config.mjs` : pas d'`unsafe-inline` pour scripts (sauf pour Next.js), `connect-src` whitelisté pour Google, jsdelivr (Pyodide) et Vercel
- **Headers** : X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy durcie, HSTS preload
- **Rate limiting Better Auth** : sign-in 10/60s, sign-up 5/60s, forgot-password 5/60s
- **Quotas** : mots de passe ≥ 8 caractères, tâches title ≤ 160 chars, flashcards ≤ 240/800 chars, documents ≤ 4 Mo, MIME limités à PDF/TXT/MD
- **Validation** : toutes les entrées utilisateur passent par des server actions ou des routes avec validation Zod-like
- **Hydratation** : tous les composants client qui dépendent de `Date.now()` ou `new Date()` reçoivent `nowMs` du serveur et ne calculent la locale string qu'après `useEffect`

---

## Dépendances

| Package | Usage |
| --- | --- |
| `next` 16 | Framework |
| `react`, `react-dom` 19 | UI runtime |
| `typescript` 5.7 | Types |
| `tailwindcss` 4 + `@tailwindcss/postcss` | CSS utilitaire |
| `drizzle-orm` + `drizzle-kit` | ORM + migrations |
| `pg` | Driver PostgreSQL |
| `better-auth` | Auth + sessions |
| `@ai-sdk/google` + `ai` | LLM SDK |
| `lucide-react` | Icônes (wrap par `components/icons.tsx`) |
| `clsx` + `tailwind-merge` | Utilitaires de classes |
| `@vercel/analytics` | Métriques anonymes en production |
| `web-push` | Envoi des notifications push serveur |
| `tw-animate-css` | Animations utilitaires |

---

## Arborescence

```
bacapp/
├── app/
│   ├── actions/                 # Server actions
│   │   ├── seed.ts              # Seed starter content + reset theme
│   │   ├── tasks.ts             # CRUD tâches
│   │   ├── exams.ts             # CRUD examens
│   │   ├── focus.ts             # Sessions Pomodoro
│   │   └── preferences.ts       # Thème + accent
│   ├── api/
│   │   ├── ai/tutor/route.ts    # POST tuteur IA
│   │   ├── auth/[...all]/       # Better Auth
│   │   ├── documents/           # Upload + read
│   │   ├── examen-blanc/        # Mock exam generator + grader
│   │   ├── flashcards/          # SM-2 spaced repetition
│   │   ├── learn/               # Lesson progress + XP
│   │   └── push/subscribe/      # Web Push
│   ├── dashboard/page.tsx       # Server-rendered dashboard
│   ├── examen-blanc/page.tsx    # Mock exam runner
│   ├── flashcards/page.tsx      # SM-2 review UI
│   ├── learn/                   # Hub + lesson pages
│   ├── legal/page.tsx           # Mentions, conditions, privacy
│   ├── settings/page.tsx        # Theme + accent picker
│   ├── sign-in/, sign-up/       # Auth pages (editorial split layout)
│   ├── globals.css              # Single source of truth for styles
│   └── layout.tsx               # Root layout (font, html, theme)
├── components/
│   ├── icons.tsx                # Lucide wrapper
│   ├── brand-mark.tsx           # Utachi logo
│   ├── pwa-bootstrap.tsx        # Install banner + SW registration
│   ├── theme-init.tsx           # Hydrates theme from server
│   ├── ai-tutor-panel.tsx       # In-place tutor UI
│   ├── pomodoro.tsx             # 25-min timer with persistence
│   ├── dashboard-client.tsx    # Main workspace
│   ├── auth-form.tsx            # Sign-in / sign-up form
│   ├── settings-form.tsx        # Theme + accent form
│   └── learn/                   # Lesson UI components
│       ├── learn-client.tsx     # Track list + lesson drawer
│       ├── lesson-drawer.tsx    # Step-by-step lesson with quiz
│       ├── lesson-widget.tsx    # Dispatches python|sim widget
│       ├── python-runner.tsx    # Pyodide-based runner
│       ├── sims.tsx             # 6 canvas sims (projectile, pendule, ...)
│       ├── flashcards-client.tsx # Flashcard review UI
│       └── examen-blanc-client.tsx # Mock exam runner
├── lib/
│   ├── auth.ts                  # Better Auth setup
│   ├── auth-client.ts           # React client for auth
│   ├── db/
│   │   ├── index.ts             # Pool + drizzle instance
│   │   └── schema.ts            # All table definitions
│   ├── curriculum.ts            # Code/Python mini-track
│   ├── bac-curriculum.ts        # Official BAC program
│   ├── bac-questions.ts         # 191 BAC-style questions
│   ├── seed-flashcards.ts       # Auto-seed flashcard decks
│   ├── sm2.ts                   # SM-2 spaced repetition
│   └── utils.ts                  # cn() helper
├── drizzle/
│   ├── 0001_user_preferences.sql
│   ├── 0002_lesson_progress.sql
│   └── 0003_flashcards_mock_exams.sql
├── public/
│   ├── logo.png                 # Utachi Industries brand mark
│   ├── manifest.webmanifest
│   └── sw.js                    # Service worker
├── .env.example
├── drizzle.config.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts           # (via @tailwindcss/postcss)
└── tsconfig.json
```

---

## Dépannage

**Le dashboard reste vide après seed.**
→ Vérifier que `seedStarterContent` s'exécute (cookie session valide, userId non null). Regarder `app/actions/seed.ts`.

**Le thème reste sombre.**
→ Vider le cache navigateur. `data-theme="light"` est forcé par défaut dans `app/layout.tsx`. Si une préférence utilisateur enregistrée est `'dark'`, elle est honorée et écrasée par `seedStarterContent` à chaque visite du dashboard.

**Le service worker ne s'installe pas.**
→ Vérifier que `/sw.js` répond en 200 (caché par CDN). `components/pwa-bootstrap.tsx` enregistre en SW une seule fois.

**Les notifications push ne fonctionnent pas.**
→ Clé VAPID publique non définie → `applicationServerKey` vide → `subscribe()` rejette. Générer la paire et la poser dans l'env.

**Texte français qui apparaît comme □□□ (tofu).**
→ Le Next.js font variable `--font-jakarta` n'est pas résolu. Vérifier `app/layout.tsx` ligne `className={\`${jakarta.variable} ...\`}` et `app/globals.css` `@theme inline { --font-sans: var(--font-jakarta), ... }`.

**L'app ne build pas.**
→ `pnpm build` est en mode strict. Vérifier que tous les composants ont des `useState` déclarés avant d'être utilisés.

---

## Crédits

- **Design** : Utachi Industries × OnTrack
- **Curriculum BAC** : programme officiel de l'Éducation nationale (BO 2019 + 2024)
- **Icônes** : Lucide (https://lucide.dev)
- **Police** : Plus Jakarta Sans, Space Mono, Instrument Serif (Google Fonts)
- **Tuteur IA** : Google Gemini 2.5 Flash
- **Hébergement** : Vercel + Neon

---

© Utachi Industries — Tous droits réservés. OnTrack est un produit propriétaire.
