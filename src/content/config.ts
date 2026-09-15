import { defineCollection, z } from 'astro:content';

/**
 * Fields that must be filled in on an Arabic entry. English translations
 * inherit them from their Arabic counterpart (see src/lib/content.ts), so a
 * deadline or funding change only ever has to be made in one place.
 */
const STRUCTURAL = ['fieldCategories', 'country', 'fundingType', 'degreeLevel', 'deadline'] as const;

const scholarships = defineCollection({
  type: 'content',
  schema: z
    .object({
      /**
       * Arabic entries live at the collection root and need no `lang`.
       * English translations live in `en/` and set `lang: "en"` plus a
       * `translationKey` matching the Arabic file's name, which pairs the two
       * together and keeps both languages on the same URL slug.
       */
      lang: z.enum(['ar', 'en']).default('ar'),
      translationKey: z.string().optional(),

      // ── Translatable ──────────────────────────────────────────────────
      title: z.string(),
      major: z.string(),
      awardValue: z.string(),
      university: z.string().optional(),
      imageCredit: z.string().optional(),

      // ── Structural: required on Arabic, inherited by English ──────────
      fieldCategories: z
        .array(
          z.enum([
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
          ])
        )
        .optional(),
      country: z.string().optional(),
      fundingType: z.enum(['fully-funded', 'partial']).optional(),
      degreeLevel: z.enum(['bachelor', 'master', 'phd', 'diploma']).optional(),
      deadline: z.date().optional(),

      gpaMin: z.number().optional(),
      // Written by hand as "4.0" but YAML/the CMS may serialize it unquoted as
      // the number 4 — normalize before validating so CMS entries don't fail.
      gpaScale: z
        .preprocess((v) => {
          if (typeof v === 'number') return v === 100 ? '100' : v.toFixed(1);
          return v;
        }, z.enum(['4.0', '5.0', '100']))
        .optional(),
      applyUrl: z.string().url().optional(),
      featured: z.boolean().optional(),
      image: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      // Arabic is the source of truth, so it must be complete.
      if (val.lang !== 'ar') return;
      for (const field of STRUCTURAL) {
        if (val[field] == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `"${field}" is required on Arabic entries (English translations inherit it).`,
          });
        }
      }
    }),
});

export const collections = { scholarships };
