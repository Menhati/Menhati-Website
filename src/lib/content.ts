/**
 * Language-aware access to the scholarships collection.
 *
 * Arabic entries sit at the collection root (`chevening-master-uk.md`) and are
 * the source of truth. English translations sit in `en/` with `lang: "en"` and
 * a `translationKey` pointing back at the Arabic file name.
 *
 * A translation only needs to carry the *words* — title, field, what it covers,
 * provider, and the markdown body. Everything structural (deadline, country,
 * funding type, study level, GPA, image, apply URL) is inherited from the Arabic
 * entry, so a deadline correction is made once and applies to both languages.
 * Duplicating deadlines across languages is exactly how a site like this ends up
 * publishing a stale date in one of them.
 *
 * Both languages share the same URL slug (the translation key), so the language
 * switcher can stay on the same scholarship.
 *
 * Until a translation exists, the English site falls back to the Arabic entry;
 * structural data still renders in English because those are display mappings,
 * and the page says the written details are Arabic-only.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from './i18n';
import { localizePath } from './i18n';

export type Scholarship = CollectionEntry<'scholarships'>;

/** Structural fields resolved to their required form after merging. */
export interface ResolvedScholarship {
  title: string;
  major: string;
  awardValue: string;
  university?: string;
  imageCredit?: string;
  fieldCategories: string[];
  country: string;
  fundingType: 'fully-funded' | 'partial';
  degreeLevel: 'bachelor' | 'master' | 'phd' | 'diploma';
  deadline: Date;
  gpaMin?: number;
  gpaScale: '4.0' | '5.0' | '100';
  applyUrl?: string;
  featured: boolean;
  image?: string;
}

export interface ScholarshipView {
  key: string;
  /** False when this is an Arabic entry shown on the English site. */
  translated: boolean;
  data: ResolvedScholarship;
  /** The entry whose markdown body should be rendered. */
  entry: Scholarship;
}

/** Stable identifier shared by an entry and its translations. */
export function scholarshipKey(entry: Scholarship): string {
  return entry.data.translationKey ?? entry.slug.replace(/^en\//, '');
}

/** URL for a scholarship in the given language. */
export function scholarshipPath(key: string, lang: Lang): string {
  return localizePath(`/scholarships/${key}`, lang);
}

/** Merge a translation's words over the Arabic entry's structure. */
function resolve(base: Scholarship, overlay?: Scholarship): ResolvedScholarship {
  const b = base.data;
  const o = overlay?.data;

  // Only take a translated value when it's actually present — a half-filled
  // translation should fall back field by field, not blank the page.
  const pick = <T>(translated: T | undefined, original: T): T =>
    translated === undefined || translated === '' ? original : translated;

  return {
    title: pick(o?.title, b.title),
    major: pick(o?.major, b.major),
    awardValue: pick(o?.awardValue, b.awardValue),
    university: pick(o?.university, b.university),
    imageCredit: pick(o?.imageCredit, b.imageCredit),
    // Structural values always come from the Arabic entry unless a translation
    // deliberately overrides them (rare, but supported).
    fieldCategories: (o?.fieldCategories ?? b.fieldCategories ?? []) as string[],
    country: (o?.country ?? b.country)!,
    fundingType: (o?.fundingType ?? b.fundingType)!,
    degreeLevel: (o?.degreeLevel ?? b.degreeLevel)!,
    deadline: (o?.deadline ?? b.deadline)!,
    gpaMin: o?.gpaMin ?? b.gpaMin,
    gpaScale: (o?.gpaScale ?? b.gpaScale ?? '4.0') as '4.0' | '5.0' | '100',
    applyUrl: o?.applyUrl ?? b.applyUrl,
    featured: o?.featured ?? b.featured ?? false,
    image: o?.image ?? b.image,
  };
}

/**
 * Every scholarship to show for `lang`, one per key, with translations merged
 * over their Arabic source.
 */
export async function getScholarshipsFor(lang: Lang): Promise<ScholarshipView[]> {
  const all = await getCollection('scholarships');

  const arabic = new Map<string, Scholarship>();
  for (const e of all) if (e.data.lang === defaultLang) arabic.set(scholarshipKey(e), e);

  const translations = new Map<string, Scholarship>();
  if (lang !== defaultLang) {
    for (const e of all) if (e.data.lang === lang) translations.set(scholarshipKey(e), e);
  }

  const views: ScholarshipView[] = [];
  for (const [key, base] of arabic) {
    const overlay = translations.get(key);
    views.push({
      key,
      translated: Boolean(overlay),
      data: resolve(base, overlay),
      entry: overlay ?? base,
    });
  }

  // A translation with no Arabic counterpart shouldn't silently disappear.
  for (const [key, entry] of translations) {
    if (arabic.has(key)) continue;
    views.push({ key, translated: true, data: resolve(entry), entry });
  }

  return views;
}

/** Single scholarship by key, or undefined. */
export async function getScholarshipByKey(
  key: string,
  lang: Lang
): Promise<ScholarshipView | undefined> {
  const all = await getScholarshipsFor(lang);
  return all.find((v) => v.key === key);
}
