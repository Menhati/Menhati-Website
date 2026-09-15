# منحتي — Menhati

Arabic-first (RTL) scholarship directory. Astro + Tailwind, deployed on Cloudflare Pages for $0
hosting. Content is managed through Decap CMS (git-based, no database).

## 1. Local setup

```bash
npm install
npm run dev
```

Open http://localhost:4321 (or the port printed in the terminal).

## 2. Adding a scholarship

**Option A — through the CMS (for non-technical team members).**
Go to `/admin` and fill out the form. Every field has an Arabic hint explaining what to put in it.

To try the CMS locally without any GitHub setup, run these in two terminals:

```bash
npm run dev
```

```bash
npx decap-server
```

Then open http://localhost:4321/admin/index.html — edits are written straight to the files in
`src/content/scholarships/`.

To make `/admin` work on the live site you still need to:

1. Push this repo to GitHub.
2. Replace `your-org/menhati` in `public/admin/config.yml` with the real repo path.
3. Set up OAuth so `/admin` can commit on the team's behalf — see
   [Decap's GitHub backend docs](https://decapcms.org/docs/github-backend/).

**Option B — by hand.** Copy any file in `src/content/scholarships/`, rename it, and edit the
frontmatter. Astro validates it against `src/content/config.ts` on build, so a missing or
misspelled field fails loudly instead of silently rendering wrong.

### Content rules (important)

- **Only publish what an official source confirms** — a ministry, embassy, or the university's own
  site. Never take a deadline from a scholarship aggregator/blog; several have been caught with
  dates that were a full year stale.
- **Never delete a scholarship when its deadline passes.** It moves automatically into
  "منح مغلقة حالياً" and stays useful — most of these programs reopen annually.
- **`gpaScale` must match the scale the number was published on** (4.0 / 5.0 / 100). The eligibility
  quiz normalizes to a percentage before comparing, so a wrong scale silently mismatches students.
- **Only use images you're licensed to reuse**, and always fill in `imageCredit` — attribution is a
  legal condition of the CC licences the current photos use. If no licensed real photo exists,
  leave `image` empty: the card falls back to a designed country cover, which is honest. Never
  substitute a stock or AI image of a different campus.

## 3. Languages (Arabic + English)

Arabic is the default and stays at the root (`/`, `/scholarships/chevening-master-uk`).
English lives under `/en/…`. A language switcher sits in the navbar and mobile menu, and keeps you
on the same page — including any active filters.

**Interface text** lives in `src/lib/i18n.ts`, one flat key map per language. TypeScript enforces
that English covers every key Arabic has, so a missing translation is a build error, not a blank
string on the live site. Components read the language from the URL via `getLangFromUrl(Astro.url)`,
so nothing is passed down as a prop.

**Scholarship content** works differently — and the important part is what a translation *doesn't*
contain:

```
src/content/scholarships/
  chevening-master-uk.md        ← Arabic: the source of truth, all fields
  en/
    chevening-master-uk.md      ← English: only the words
```

An English file carries just `title`, `major`, `awardValue`, optionally `university` /
`imageCredit`, and the markdown body. **Deadline, country, funding type, study level, GPA, image
and apply URL are inherited from the Arabic entry** (`src/lib/content.ts`). Duplicating a deadline
across two files is how a directory like this ends up publishing a stale date in one language —
here it's structurally impossible.

Link the two with `translationKey`, which must match the Arabic file's name. That key is also the
URL slug, so both languages share one address.

**Until a scholarship is translated**, the English site falls back to the Arabic entry. Structural
fields (country, level, funding, dates, counts) still render in English because those come from
display mappings, and the page shows a short note that the written details are Arabic-only. The
English site is therefore complete from day one and improves as translations land.

To add a translation: `/admin` → «الترجمات الإنجليزية», or drop a file in
`src/content/scholarships/en/` copying the shape of `chevening-master-uk.md`.

New country? Add its English name to `countryNamesEn` in `src/lib/flags.ts` (an unmapped country
falls back to its Arabic name rather than breaking).

## 4. Lead capture (Phase 3)

Forms on the quiz and each scholarship page POST to `/api/lead`, implemented as a Cloudflare Pages
Function in `functions/api/lead.ts`.

It degrades gracefully by design — **every delivery channel is optional**:

| What you configure | Effect |
| --- | --- |
| nothing | Form still "succeeds" and hands the visitor to WhatsApp with a pre-filled message |
| D1 binding `LEADS_DB` | Lead is stored in a `leads` table |
| env `RESEND_API_KEY` | Team gets an email per lead |

So a lead is never lost, even before the backend is wired up.

**To store leads in D1:**

```bash
npx wrangler d1 create menhati-leads
npx wrangler d1 execute menhati-leads --remote --file=./schema.sql
```

Then in Cloudflare Pages → Settings → Functions → D1 bindings, bind it as `LEADS_DB`.

**To get lead emails:** create a [Resend](https://resend.com) API key, verify your sending domain,
then add these environment variables in Cloudflare Pages → Settings → Environment variables:

- `RESEND_API_KEY`
- `LEAD_TO_EMAIL` (defaults to `info@menhati.com`)
- `LEAD_FROM_EMAIL` (must be on your verified domain)

> Note: Pages Functions don't run under `npm run dev`. To test the endpoint locally use
> `npx wrangler pages dev -- npm run dev`.

## 5. Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → Pages → Create a project → connect the repo.
3. Build command `npm run build`, output directory `dist`.
4. Add the custom domain `menhati.com` after the first successful deploy.

Every push to `main` (including CMS commits) triggers an automatic rebuild.

## 6. Before going live — checklist

- [x] ~~Replace the placeholder WhatsApp number~~ — `src/lib/site.ts` now holds the real number
      (`601156994406`), used by the floating button, navbar, footer, every scholarship CTA and the
      lead form.
- [ ] Confirm the social links in `src/lib/site.ts` point at the real accounts (still the
      scaffold `t.me/menhati`, `instagram.com/menhati`, … handles).
- [ ] Set the real GitHub repo in `public/admin/config.yml` and finish OAuth setup.
- [ ] Add `public/og-default.png` (1200×630) — referenced for social sharing previews.
- [ ] Wire up lead delivery (section 4) so the team gets notified.
- [ ] Translate the remaining scholarships into English (section 3) — 1 of 33 done.

## 7. Still to build

- Daily rebuild cron (GitHub Actions) so newly-expired scholarships move to the closed section
  without a manual deploy.
- Per-scholarship OG images (currently one static `/og-default.png`).
- Internal case-tracker for students in progress (a CSV template exists; tool not chosen yet).

## Architecture notes

```
src/
  lib/             i18n.ts (UI strings + locale helpers), content.ts (language-aware
                   collection access + translation merging), site.ts (contact details),
                   flags.ts (flags + English country names), scholarship.ts (display logic)
  components/      ScholarshipCard, CardCover, LeadForm, LanguageSwitcher, Navbar, Footer, Logo
    pages/         HomePage, ScholarshipsPage, QuizPage, ScholarshipDetail — the real page
                   bodies; both language routes render these
  content/         config.ts (schema) + scholarships/*.md (Arabic) + scholarships/en/*.md
  pages/           thin route files only:
                     index, quiz, scholarships/index, scholarships/[slug]
                     en/… — same four, rendering the same page components
functions/api/     lead.ts (Cloudflare Pages Function)
```

- **`src/lib/scholarship.ts`** owns deadline/status/degree wording and GPA normalization, in both
  languages. Put shared display logic here — these rules previously drifted between pages.
- **`src/lib/site.ts`** is the only place contact details live.
- **Page bodies live in `src/components/pages/`**, not in `src/pages/`. The files under
  `src/pages/` are three-line route stubs. This is what lets `/` and `/en/…` share one
  implementation instead of two copies drifting apart.
- **Arabic counted nouns aren't English plurals** — the plural form only applies to 3–10, and 11+
  reverts to the singular ("4 منح" but "11 منحة"). `countScholarships()` / `daysLabel()` handle
  this; don't interpolate a bare number next to a noun.
- **`.mh-prose` styles live in `global.css`**, not in a page `<style>` block, so a page rewrite
  can't silently leave markdown content unstyled (this already happened once).
- **Keep the Tailwind colour scales complete** in `tailwind.config.mjs`. A missing step (e.g.
  `navy-300`) fails *silently* in class attributes and only errors inside `@apply`, which produces
  confusing half-broken styling.

## Design tokens

- Colors: `navy` (brand), `gold` (accent — seals, badges, CTAs), `live`/`closing` (status),
  `paper`/`ink`. Defined in `tailwind.config.mjs`.
- Type: Tajawal (display/headings), Cairo (body), via Google Fonts in `Layout.astro`.
- Arabic needs more leading than Latin — base `line-height` is 1.9 in `global.css`. Keep it.
- Signature element: the countdown "seal" badge (`CountdownSeal.astro`), a circular gold-ringed
  badge echoing the certified/official feel of the brand.
