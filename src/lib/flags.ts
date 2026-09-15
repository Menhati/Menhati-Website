import type { Lang } from './i18n';

export const flags: Record<string, string> = {
  ألمانيا: '🇩🇪',
  'المملكة المتحدة': '🇬🇧',
  ماليزيا: '🇲🇾',
  تركيا: '🇹🇷',
  فرنسا: '🇫🇷',
  اليابان: '🇯🇵',
  سويسرا: '🇨🇭',
  'الولايات المتحدة': '🇺🇸',
  كندا: '🇨🇦',
  روسيا: '🇷🇺',
  رومانيا: '🇷🇴',
  هولندا: '🇳🇱',
  هنغاريا: '🇭🇺',
  أيرلندا: '🇮🇪',
  إيطاليا: '🇮🇹',
  إندونيسيا: '🇮🇩',
  قطر: '🇶🇦',
  أستراليا: '🇦🇺',
  بروناي: '🇧🇳',
  فيتنام: '🇻🇳',
  'كوريا الجنوبية': '🇰🇷',
  كازاخستان: '🇰🇿',
  الهند: '🇮🇳',
  العراق: '🇮🇶',
  الصين: '🇨🇳',
  'المملكة العربية السعودية': '🇸🇦',
  السعودية: '🇸🇦',
  الكويت: '🇰🇼',
  نيوزيلندا: '🇳🇿',
  الإمارات: '🇦🇪',
  'الإمارات العربية المتحدة': '🇦🇪',
};

/**
 * English names for the countries used in scholarship entries. Content stores
 * the Arabic name as the canonical value, so this keeps the English site's
 * labels and filters readable without duplicating content.
 *
 * Add a row here whenever a scholarship introduces a new country — an unmapped
 * country falls back to its Arabic name rather than breaking.
 */
export const countryNamesEn: Record<string, string> = {
  ألمانيا: 'Germany',
  'المملكة المتحدة': 'United Kingdom',
  ماليزيا: 'Malaysia',
  تركيا: 'Türkiye',
  فرنسا: 'France',
  اليابان: 'Japan',
  سويسرا: 'Switzerland',
  'الولايات المتحدة': 'United States',
  كندا: 'Canada',
  روسيا: 'Russia',
  رومانيا: 'Romania',
  هولندا: 'Netherlands',
  هنغاريا: 'Hungary',
  أيرلندا: 'Ireland',
  إيطاليا: 'Italy',
  إندونيسيا: 'Indonesia',
  قطر: 'Qatar',
  أستراليا: 'Australia',
  بروناي: 'Brunei',
  فيتنام: 'Vietnam',
  'كوريا الجنوبية': 'South Korea',
  كازاخستان: 'Kazakhstan',
  الهند: 'India',
  العراق: 'Iraq',
  الصين: 'China',
  'المملكة العربية السعودية': 'Saudi Arabia',
  السعودية: 'Saudi Arabia',
  الكويت: 'Kuwait',
  نيوزيلندا: 'New Zealand',
  الإمارات: 'United Arab Emirates',
  'الإمارات العربية المتحدة': 'United Arab Emirates',
  'دول متعددة (وفق معايير البنك الإسلامي للتنمية)': 'Multiple countries (per IsDB criteria)',
};

export function flagFor(country: string): string {
  return flags[country] ?? '🌍';
}

/** Display name for a country in the given language. */
export function countryName(country: string, lang: Lang): string {
  if (lang === 'ar') return country;
  return countryNamesEn[country] ?? country;
}
