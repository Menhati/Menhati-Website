/**
 * Shared display helpers for scholarship data.
 * Kept in one place so cards, listings, the quiz and detail pages all agree on
 * how a deadline / degree / status is worded — these used to drift apart.
 *
 * Everything user-facing takes a `lang`; Arabic remains the default so existing
 * call sites keep working.
 */

import { defaultLang, type Lang } from './i18n';

export const degreeLabelsByLang: Record<Lang, Record<string, string>> = {
  ar: {
    bachelor: 'بكالوريوس',
    master: 'ماجستير',
    phd: 'دكتوراه',
    diploma: 'دبلوم',
  },
  en: {
    bachelor: "Bachelor's",
    master: "Master's",
    phd: 'PhD',
    diploma: 'Diploma',
  },
};

/** Kept for existing Arabic-only call sites. */
export const degreeLabels = degreeLabelsByLang.ar;

export function degreeLabel(level: string, lang: Lang = defaultLang): string {
  return degreeLabelsByLang[lang][level] ?? level;
}

/**
 * Field categories are stored in Arabic in the content schema (they're a Zod
 * enum), so English is a display-time mapping rather than a second set of values.
 */
export const fieldCategories = [
  'هندسة وتقنية المعلومات',
  'إدارة أعمال واقتصاد',
  'طب وعلوم صحية',
  'علوم طبيعية وتطبيقية',
  'علوم إنسانية واجتماعية',
  'قانون',
  'تربية وتعليم',
  'إعلام واتصال',
  'علوم شرعية ودراسات إسلامية',
  'زراعة وبيئة',
  'جميع التخصصات',
] as const;

export const fieldCategoryEn: Record<string, string> = {
  'هندسة وتقنية المعلومات': 'Engineering & IT',
  'إدارة أعمال واقتصاد': 'Business & Economics',
  'طب وعلوم صحية': 'Medicine & Health Sciences',
  'علوم طبيعية وتطبيقية': 'Natural & Applied Sciences',
  'علوم إنسانية واجتماعية': 'Humanities & Social Sciences',
  قانون: 'Law',
  'تربية وتعليم': 'Education',
  'إعلام واتصال': 'Media & Communication',
  'علوم شرعية ودراسات إسلامية': 'Islamic Studies',
  'زراعة وبيئة': 'Agriculture & Environment',
  'جميع التخصصات': 'All fields',
};

export function fieldCategoryLabel(category: string, lang: Lang = defaultLang): string {
  return lang === 'ar' ? category : (fieldCategoryEn[category] ?? category);
}

export type ScholarshipStatus = 'open' | 'closing' | 'closed';

/** Whole days from now until `deadline`. Negative once the deadline has passed. */
export function daysUntil(deadline: Date, now: number = Date.now()): number {
  return Math.ceil((deadline.valueOf() - now) / 86_400_000);
}

export function statusOf(deadline: Date, now: number = Date.now()): ScholarshipStatus {
  const days = daysUntil(deadline, now);
  if (days < 0) return 'closed';
  if (days <= 14) return 'closing';
  return 'open';
}

export const statusLabelsByLang: Record<Lang, Record<ScholarshipStatus, string>> = {
  ar: {
    open: 'مفتوحة للتقديم',
    closing: 'تغلق قريباً',
    closed: 'مغلقة حالياً',
  },
  en: {
    open: 'Open for applications',
    closing: 'Closing soon',
    closed: 'Currently closed',
  },
};

/** Kept for existing Arabic-only call sites. */
export const statusLabels = statusLabelsByLang.ar;

export function statusLabel(status: ScholarshipStatus, lang: Lang = defaultLang): string {
  return statusLabelsByLang[lang][status];
}

/** ١٥ أكتوبر ٢٠٢٦ in Arabic; 15 October 2026 in English. */
export function formatDeadline(deadline: Date, lang: Lang = defaultLang): string {
  return deadline.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * GPA minimums are published on different scales (4.0, 5.0, or percentage),
 * so everything is normalized to a percentage before any comparison.
 */
export function gpaToPercent(value: number, scale: string): number {
  const max = scale === '100' ? 100 : parseFloat(scale);
  return (value / max) * 100;
}

const digits = (n: number, lang: Lang) =>
  lang === 'ar' ? n.toLocaleString('ar-EG') : n.toLocaleString('en-US');

/**
 * Arabic counted nouns don't work like English: the plural form is only used
 * for 3–10, and 11+ goes back to the singular. "4 منحة" reads as broken Arabic.
 */
export function countScholarships(n: number, lang: Lang = defaultLang): string {
  if (lang === 'en') return n === 1 ? '1 scholarship' : `${n} scholarships`;
  if (n === 1) return 'منحة واحدة';
  if (n === 2) return 'منحتان';
  if (n >= 3 && n <= 10) return `${n} منح`;
  return `${n} منحة`;
}

/** "يوم واحد" / "يومان" / "٥ أيام" / "٨٢ يوم" — Arabic counted-noun rules. */
export function daysLabel(n: number, lang: Lang = defaultLang): string {
  if (lang === 'en') return n === 1 ? '1 day' : `${n} days`;
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومان';
  if (n >= 3 && n <= 10) return `${digits(n, 'ar')} أيام`;
  return `${digits(n, 'ar')} يوم`;
}

/** Short countdown text for the badge shown on each card. */
export function countdownLabel(
  deadline: Date,
  lang: Lang = defaultLang,
  now: number = Date.now()
): string {
  const days = daysUntil(deadline, now);
  if (lang === 'en') {
    if (days < 0) return 'Applications closed';
    if (days === 0) return 'Closes today';
    return `${daysLabel(days, 'en')} left`;
  }
  if (days < 0) return 'انتهى التقديم';
  if (days === 0) return 'ينتهي اليوم';
  return `متبقٍ ${daysLabel(days, 'ar')}`;
}
