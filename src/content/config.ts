import { defineCollection, z } from 'astro:content';

const scholarships = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    major: z.string(),
    fieldCategories: z.array(
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
    ),
    country: z.string(),
    university: z.string().optional(),
    gpaMin: z.number().optional(),
    // Written by hand as "4.0" but YAML/the CMS may serialize it unquoted as the
    // number 4 — normalize before validating so CMS-authored entries don't fail.
    gpaScale: z
      .preprocess((v) => {
        if (typeof v === 'number') return v === 100 ? '100' : v.toFixed(1);
        return v;
      }, z.enum(['4.0', '5.0', '100']))
      .default('4.0'),
    awardValue: z.string(),
    fundingType: z.enum(['fully-funded', 'partial']),
    degreeLevel: z.enum(['bachelor', 'master', 'phd', 'diploma']),
    deadline: z.date(),
    applyUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageCredit: z.string().optional(),
  }),
});

export const collections = { scholarships };
