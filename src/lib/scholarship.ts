/**
 * Shared display helpers for scholarship data.
 * Kept in one place so cards, listings, the quiz and detail pages all agree on
 * how a deadline / degree / status is worded — these used to drift apart.
 */

export const degreeLabels: Record<string, string> = {
  bachelor: 'بكالوريوس',
  master: 'ماجستير',
  phd: 'دكتوراه',
  diploma: 'دبلوم',
};

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

export const statusLabels: Record<ScholarshipStatus, string> = {
  open: 'مفتوحة للتقديم',
  closing: 'تغلق قريباً',
  closed: 'مغلقة حالياً',
};

/** Arabic-Indic formatted date, e.g. ١٥ أكتوبر ٢٠٢٦ */
export function formatDeadline(deadline: Date): string {
  return deadline.toLocaleDateString('ar-EG', {
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

/**
 * Arabic counted nouns don't work like English: the plural form is only used
 * for 3–10, and 11+ goes back to the singular. "4 منحة" reads as broken Arabic.
 */
export function countScholarships(n: number): string {
  if (n === 1) return 'منحة واحدة';
  if (n === 2) return 'منحتان';
  if (n >= 3 && n <= 10) return `${n} منح`;
  return `${n} منحة`;
}

/** Arabic-Indic digits, matching the ar-EG dates used elsewhere. */
const ar = (n: number) => n.toLocaleString('ar-EG');

/** "يوم واحد" / "يومان" / "٥ أيام" / "٨٢ يوم" — Arabic counted-noun rules. */
export function daysLabel(n: number): string {
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومان';
  if (n >= 3 && n <= 10) return `${ar(n)} أيام`;
  return `${ar(n)} يوم`;
}

/** Short countdown text for the badge shown on each card. */
export function countdownLabel(deadline: Date, now: number = Date.now()): string {
  const days = daysUntil(deadline, now);
  if (days < 0) return 'انتهى التقديم';
  if (days === 0) return 'ينتهي اليوم';
  return `متبقٍ ${daysLabel(days)}`;
}
