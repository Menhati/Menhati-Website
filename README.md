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

## 3. Lead capture (Phase 3)

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

## 4. Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → Pages → Create a project → connect the repo.
3. Build command `npm run build`, output directory `dist`.
4. Add the custom domain `menhati.com` after the first successful deploy.

Every push to `main` (including CMS commits) triggers an automatic rebuild.

## 5. Before going live — checklist

- [ ] **Replace the placeholder WhatsApp number** in `src/lib/site.ts` (`whatsappNumber`). It is
      currently the scaffold value `966500000000` and is used by the floating button, navbar,
      footer, every scholarship CTA and the lead form.
- [ ] Confirm the social links in `src/lib/site.ts` point at the real accounts.
- [ ] Set the real GitHub repo in `public/admin/config.yml` and finish OAuth setup.
- [ ] Add `public/og-default.png` (1200×630) — referenced for social sharing previews.
- [ ] Wire up lead delivery (section 3) so the team gets notified.

## 6. Still to build

- Daily rebuild cron (GitHub Actions) so newly-expired scholarships move to the closed section
  without a manual deploy.
- Per-scholarship OG images (currently one static `/og-default.png`).
- Internal case-tracker for students in progress (a CSV template exists; tool not chosen yet).

## Architecture notes

```
src/
  lib/           site.ts (contact details), flags.ts, scholarship.ts (shared display logic)
  components/    ScholarshipCard, CardCover, LeadForm, CountdownSeal, Navbar, Footer, Logo
  content/       config.ts (schema) + scholarships/*.md (the data)
  pages/         index, quiz, scholarships/index, scholarships/[slug]
functions/api/   lead.ts (Cloudflare Pages Function)
```

- **`src/lib/scholarship.ts`** owns deadline/status/degree wording and GPA normalization. Put shared
  display logic here — these rules previously drifted between pages.
- **`src/lib/site.ts`** is the only place contact details live.
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
