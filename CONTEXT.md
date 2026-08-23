# Menhati — project context for Claude Code

Read this first. It's the full context from the planning conversation that led to this scaffold,
written so you don't need to re-ask the team anything already decided below.

## Who's asking

Ubakel — a small AI automation agency. Two people use this workspace: obai and Al-Aqel. Menhati is
a business the user and friends started — not a client project.

## What Menhati actually is (the business, not just the website)

A small team applies to scholarships on behalf of students: they prepare documents, translate them,
and write SOPs and CVs. They recently bought an official translation stamp/certification and are
adding a formal translation service line. They already run active channels on WhatsApp, Telegram,
Facebook, Instagram, and YouTube, but have no structured funnel from "follower" to "paying client."
They are new to the market and explicitly want to come across as professional, organized, honest,
and highly trusted — trust is the main competitive lever since they're not established yet.

Non-website priorities the team also discussed (not yet built, may come up again):
- An internal case-tracker: student → target scholarship(s) → documents needed/received →
  translation status → SOP/CV drafting stage → deadline → status. Currently informal (WhatsApp
  threads), causing organizational strain as client count grows.
- A weekly (not daily) scholarship-research cadence, ideally with team members each owning a region
  (e.g. MENA/Gulf-funded, EU/Erasmus-style, US/Fulbright-style) to avoid burnout from ad-hoc search.
- Trust-building beyond the site: published case studies, a written service agreement/pricing
  structure before taking payment, and visibly displaying the translation stamp as a badge.
- AI integration for the website itself was explicitly raised and then explicitly cancelled by the
  user mid-conversation — don't reintroduce AI-on-the-website scope unless the user brings it up
  again. (AI-assisted internal drafting tools for SOPs/CVs/translation were discussed as a strong
  future fit *for Ubakel's own service offering*, separate from the public site — also not started.)

## Website goal

menhati.com: an Arabic-first (RTL) scholarship directory and educational consultancy site, built for
$0 hosting, that converts social traffic into WhatsApp leads via an eligibility quiz and a clean
listings/detail experience.

## Infrastructure already in place (outside this repo)

- Domain `menhati.com` on Cloudflare, hosting will be Cloudflare Pages.
- Zoho Mail (free tier) with SPF/DKIM/DMARC already configured.
- CMS choice: Decap CMS (git-based, no external DB) over Sanity, specifically to keep hosting at a
  true $0 — this was a deliberate tradeoff discussion, not a default pick.

## Design decisions (already made — don't re-derive from scratch)

- Colors: deep navy as the dominant brand color, gold used sparingly as an accent (badges, seals,
  deadlines) — deliberately avoiding the generic "warm cream + terracotta" AI-generated-design look.
- Type: Tajawal for display/headings, Cairo for body — both loaded via Google Fonts.
- Signature element: a circular "seal" badge (`CountdownSeal.astro`) showing days-to-deadline,
  styled like a wax seal with a gold ring. This deliberately echoes the team's real translation
  stamp — it's the one visual idea meant to be memorable, so keep it consistent if you extend the
  design rather than introducing a second competing motif.

## What's built in this scaffold (Phase 1, done)

Astro + Tailwind project, RTL throughout, homepage, scholarship listing (with a working client-side
country filter), dynamic scholarship detail pages via a typed content collection, Decap CMS config
with Arabic field labels, Navbar/Footer/WhatsApp floating button, one sample scholarship entry.
Full technical setup steps are in `README.md`.

Note: this scaffold was hand-written in a sandbox with no network access, so `npm install` has never
actually been run against it yet — treat first boot as the first real test of the code, not as
already-verified.

## Roadmap — where to pick up

**Phase 2 — Core pages and content** (mostly done by this scaffold; remaining: populate more real
scholarships, stand up the internal case-tracker as a separate deliverable — ask the user whether
they want that as a spreadsheet, Notion, or something else before building it)

**Phase 3 — Interactive features (next up, most likely starting point):**
- Build `/quiz` — currently only linked from nav/homepage, not built. Eligibility matcher should be
  simple rule-based filtering (major, GPA, country, degree level) against the scholarships content
  collection — explicitly NOT an AI-powered matcher, that was a deliberate choice to keep it fast,
  free, and predictable. Only reconsider AI here later, if filter results get too large to be useful.
- Countdown/auto-expiration: the seal badge already counts down client-side; still need to filter
  fully-expired scholarships out of listings at build time.
- Quiz lead capture: a Cloudflare Pages Function that takes quiz answers + contact info, emails the
  team via Zoho, and optionally logs to Cloudflare D1 so leads feed the future case-tracker instead
  of getting lost.

**Phase 4 — Trust and launch prep:** case studies, "how it works" transparency page, written
pricing/service agreement.

Note: the official translation stamp must NOT appear anywhere on the site, visually or as a claim
("ختم رسمي" wording) — this was explicitly rejected by the user on 2026-07-24 ("it has nothing to
do there"), reversing the earlier plan to show it as a trust badge. The homepage hero badge and the
footer badge that referenced it have been removed. Don't reintroduce it unless the user brings it
up again. The `CountdownSeal.astro` deadline-countdown badge is unrelated (shows days-to-deadline,
not the stamp) and was left in place.

**Phase 5 — Go live and ops:** point the domain live, GitHub Actions daily cron to trigger a
Cloudflare Pages rebuild (so expired listings drop off without a manual deploy), then the weekly
scholarship-sourcing cadence described above.

## Working style notes

The user prefers being walked through phases with a clear "what's next" rather than everything at
once, and reacts well to concrete artifacts over abstract discussion — lean toward writing real code
you'll only revise, over lengthy proposals.
