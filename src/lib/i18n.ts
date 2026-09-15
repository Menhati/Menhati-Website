/**
 * Bilingual (Arabic / English) support.
 *
 * Arabic is the default and stays at the root (`/`, `/scholarships`, …) so no
 * existing URL changes. English lives under `/en/…`.
 *
 * Components read the language from the URL via `getLangFromUrl(Astro.url)`
 * rather than receiving it as a prop, so nothing has to be threaded through
 * the component tree.
 */

export const defaultLang = 'ar' as const;
export type Lang = 'ar' | 'en';

export const languages: Record<Lang, { label: string; dir: 'rtl' | 'ltr'; htmlLang: string; ogLocale: string }> = {
  ar: { label: 'العربية', dir: 'rtl', htmlLang: 'ar', ogLocale: 'ar_AR' },
  en: { label: 'English', dir: 'ltr', htmlLang: 'en', ogLocale: 'en_US' },
};

/** `/en/scholarships` → 'en'; everything else → 'ar'. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : 'ar';
}

export function dirFor(lang: Lang) {
  return languages[lang].dir;
}

export function isRtl(lang: Lang) {
  return languages[lang].dir === 'rtl';
}

/**
 * Turn a canonical (Arabic) path into the path for `lang`.
 * `localizePath('/scholarships', 'en')` → `/en/scholarships`
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}

/** Strip the `/en` prefix to get back to the canonical path. */
export function canonicalPath(path: string): string {
  const stripped = path.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** The same page in the other language, for the language switcher. */
export function alternatePath(currentPath: string, target: Lang): string {
  return localizePath(canonicalPath(currentPath), target);
}

/** Western digits for English, Arabic-Indic for Arabic. */
export function formatNumber(n: number, lang: Lang): string {
  return lang === 'ar' ? n.toLocaleString('ar-EG') : n.toLocaleString('en-US');
}

// ─────────────────────────────────────────────────────────────────────────────
// UI strings
// ─────────────────────────────────────────────────────────────────────────────

const ar = {
  // Brand / meta
  'site.name': 'منحتي',
  'site.description':
    'منحتي — دليلك الموثوق للمنح الدراسية الممولة حول العالم، مع مساعدة كاملة في التقديم والترجمة المعتمدة.',

  // Nav
  'nav.home': 'الرئيسية',
  'nav.scholarships': 'المنح الدراسية',
  'nav.quiz': 'اعثر على منحتك',
  'nav.how': 'كيف نعمل',
  'nav.whatsapp': 'تواصل عبر واتساب',
  'nav.openMenu': 'فتح القائمة',
  'nav.switchLang': 'English',
  'nav.switchLangAria': 'Switch to English',

  // WhatsApp default messages
  'wa.general': 'مرحباً، أرغب بمعرفة المزيد عن المنح الدراسية المتاحة',
  'wa.apply': 'مرحباً، أرغب بالتقديم على منحة:',

  // Home — hero
  'home.badge': 'دليل عربي موثوق للمنح الدراسية',
  'home.title1': 'منحتك الدراسية',
  'home.title2': 'أقرب مما تتخيل',
  'home.subtitle':
    'ابحث بين منح ممولة حول العالم، جميعها موثّقة من مصادرها الرسمية، مع فريق يرافقك في الملفات والترجمة حتى القبول.',
  'home.searchLabel': 'ابحث عن منحة',
  'home.searchPlaceholder': 'اسم المنحة، الجامعة، أو الدولة…',
  'home.searchButton': 'ابحث',
  'home.popular': 'الأكثر بحثاً:',
  'home.filterFullyFunded': 'ممولة بالكامل',
  'home.filterBachelor': 'بكالوريوس',
  'home.filterMaster': 'ماجستير',
  'home.filterPhd': 'دكتوراه',
  'home.filterOpen': 'مفتوحة الآن',

  // Home — stats
  'home.statTotal': 'منحة موثّقة',
  'home.statOpen': 'مفتوحة الآن',
  'home.statCountries': 'دولة حول العالم',
  'home.statFunded': 'ممولة بالكامل',

  // Home — countries
  'home.byCountry': 'تصفّح حسب الدولة',
  'home.allCountries': 'كل الدول',

  // Home — spotlight
  'home.openNow': 'منح مفتوحة الآن',
  'home.openNowSub': 'مرتّبة حسب الأقرب موعداً — لا تفوّت الفرصة.',
  'home.viewAll': 'عرض الكل',

  // Home — how it works
  'home.howTitle': 'كيف نعمل',
  'home.howSub': 'أربع خطوات من أول رسالة حتى صدور القرار.',
  'home.step1Title': 'استشارة مجانية',
  'home.step1Body': 'نفهم خلفيتك الأكاديمية وأهدافك عبر واتساب.',
  'home.step2Title': 'مطابقة المنح',
  'home.step2Body': 'نرشح لك المنح الأنسب حسب تخصصك ومعدلك ووجهتك.',
  'home.step3Title': 'إعداد الملفات',
  'home.step3Body': 'نكتب خطاب الدافع والسيرة الذاتية ونترجم مستنداتك ترجمة معتمدة.',
  'home.step4Title': 'التقديم والمتابعة',
  'home.step4Body': 'نقدم الطلب ونتابع معك حتى صدور القرار.',

  // Home — trust
  'home.trustTitle': 'لماذا تثق بما تقرأه هنا؟',
  'home.trustSub':
    'أكثر ما يضيّع وقت الطالب هو معلومة قديمة أو موعد خاطئ. لذلك وضعنا قواعد واضحة لكل ما يُنشر في هذا الدليل.',
  'home.trust1Title': 'من المصدر الرسمي فقط',
  'home.trust1Body':
    'كل منحة هنا مأخوذة من الموقع الرسمي للجهة المانحة — وزارة، سفارة، أو الجامعة نفسها. لا ننقل عن مواقع تجميع.',
  'home.trust2Title': 'مواعيد محدّثة ومراجَعة',
  'home.trust2Body': 'نتحقق من كل موعد نهائي قبل نشره، ونصحّح ما ينشر خطأً في مواقع أخرى.',
  'home.trust3Title': 'نعرض المغلقة أيضاً',
  'home.trust3Body':
    'لا نحذف المنح بعد انتهائها. تبقى معروضة بوضوح كي تعرف موعدها المتوقع في الدورة القادمة.',
  'home.trust4Title': 'بدون وعود مبالغ فيها',
  'home.trust4Body':
    'لا ندّعي ضمان القبول ولا ننشر أرقاماً غير حقيقية. نساعدك في الملف، والقرار يبقى للجهة المانحة.',

  // Home — closing CTA
  'home.ctaTitle': 'لست متأكداً أي منحة تناسبك؟',
  'home.ctaBody':
    'أجب عن أربعة أسئلة قصيرة عن تخصصك ومعدلك ووجهتك، وسنعرض لك فوراً المنح التي تنطبق عليك شروطها.',
  'home.ctaPrimary': 'اعثر على منحتك الآن',
  'home.ctaSecondary': 'تصفّح كل المنح',

  // Listing
  'list.title': 'كل المنح الدراسية',
  'list.intro':
    'منحة موثّقة من مصادرها الرسمية، محدّثة باستمرار. استخدم البحث والفلاتر للوصول لما يناسبك، ثم تواصل معنا لنساعدك في التقديم.',
  'list.searchLabel': 'ابحث',
  'list.searchPlaceholder': 'ابحث باسم المنحة أو الجامعة أو الدولة…',
  'list.filterCountry': 'الدولة',
  'list.filterDegree': 'المرحلة الدراسية',
  'list.filterFunding': 'نوع التمويل',
  'list.filterStatus': 'حالة التقديم',
  'list.allCountries': 'كل الدول',
  'list.allDegrees': 'كل المراحل',
  'list.allFunding': 'كل أنواع التمويل',
  'list.allStatus': 'المفتوحة والمغلقة',
  'list.onlyOpen': 'المفتوحة فقط',
  'list.onlyClosing': 'التي تغلق قريباً',
  'list.onlyClosed': 'المغلقة فقط',
  'list.reset': 'إعادة تعيين',
  'list.openSection': 'منح مفتوحة للتقديم',
  'list.closedSection': 'منح مغلقة حالياً',
  'list.closedNote':
    'انتهى موعد التقديم لهذه الدورة، لكن أغلبها يعود سنوياً في نفس الفترة تقريباً — احفظها الآن لتكون جاهزاً للدورة القادمة.',
  'list.emptyTitle': 'لا توجد منح مطابقة',
  'list.emptyBody':
    'جرّب توسيع معايير البحث، أو تواصل معنا مباشرة عبر واتساب وسنبحث لك يدوياً عن الأنسب لحالتك.',
  'list.emptyReset': 'إعادة تعيين البحث',

  // Quiz
  'quiz.badge': 'مطابقة فورية — بدون تسجيل',
  'quiz.title': 'اعثر على منحتك',
  'quiz.subtitle':
    'اختر مرحلتك ومجالك ومعدلك، وسنعرض لك فوراً المنح المفتوحة التي تنطبق عليك شروطها المعلنة.',
  'quiz.degree': 'المرحلة الدراسية',
  'quiz.anyDegree': 'أي مرحلة',
  'quiz.field': 'مجال الدراسة',
  'quiz.anyField': 'كل المجالات',
  'quiz.country': 'الدولة المفضّلة',
  'quiz.anyCountry': 'كل الدول',
  'quiz.gpa': 'معدلك التراكمي',
  'quiz.gpaPlaceholder': 'مثال: 3.2',
  'quiz.gpaScaleAria': 'سلّم المعدل',
  'quiz.scale4': 'من 4.0',
  'quiz.scale5': 'من 5.0',
  'quiz.scale100': 'من 100٪',
  'quiz.submit': 'اعرض المنح المناسبة لي',
  'quiz.results': 'النتائج',
  'quiz.emptyTitle': 'لا توجد منحة مطابقة تماماً',
  'quiz.emptyBody':
    'هذا لا يعني أن الفرص انتهت — كثير من المنح لا تنشر شروط المعدل بدقة، وبعضها يفتح دورات جديدة قريباً. اترك بياناتك أدناه وسنبحث لك يدوياً.',
  'quiz.leadTitle': 'نساعدك في الخطوة التالية',
  'quiz.leadSubtitle':
    'اترك اسمك ورقم واتساب، وسنراجع نتيجتك ونرشّح لك المنح الأنسب ونخبرك بالمستندات المطلوبة لكل منها.',

  // Card
  'card.major': 'التخصص',
  'card.minGpa': 'أقل معدل',
  'card.outOf': 'من',
  'card.details': 'التفاصيل',
  'card.fullyFunded': 'ممولة بالكامل',
  'card.partial': 'تمويل جزئي',

  // Status / countdown
  'status.open': 'مفتوحة للتقديم',
  'status.closing': 'تغلق قريباً',
  'status.closed': 'مغلقة حالياً',
  'countdown.ended': 'انتهى التقديم',
  'countdown.today': 'ينتهي اليوم',
  'countdown.remaining': 'متبقٍ',

  // Detail page
  'detail.back': 'العودة لكل المنح',
  'detail.country': 'الدولة',
  'detail.degree': 'المرحلة الدراسية',
  'detail.major': 'التخصص',
  'detail.award': 'قيمة المنحة',
  'detail.minGpa': 'أقل معدل مطلوب',
  'detail.provider': 'الجهة',
  'detail.deadline': 'الموعد النهائي',
  'detail.closesIn': 'يغلق التقديم بعد',
  'detail.ended': 'انتهى موعد التقديم',
  'detail.consult': 'استشارة مجانية عبر واتساب',
  'detail.consultShort': 'استشارة مجانية',
  'detail.officialSite': 'الموقع الرسمي للمنحة',
  'detail.related': 'منح أخرى قد تناسبك',
  'detail.leadTitle': 'نساعدك في التقديم على هذه المنحة',
  'detail.leadSubtitle':
    'اترك اسمك ورقم واتساب، وسنراجع أهليتك لهذه المنحة تحديداً، ونخبرك بالمستندات المطلوبة وموعد كل خطوة.',
  'detail.arabicOnly': 'تفاصيل هذه المنحة متوفرة حالياً بالعربية فقط.',

  // Lead form
  'lead.title': 'اترك بياناتك ونتواصل معك',
  'lead.subtitle':
    'سنراجع حالتك ونرشّح لك المنح الأنسب، ونخبرك بالمستندات المطلوبة — بدون أي رسوم على الاستشارة الأولى.',
  'lead.name': 'الاسم الكامل',
  'lead.namePlaceholder': 'مثال: أحمد عبدالله',
  'lead.phone': 'رقم واتساب',
  'lead.message': 'ما الذي تبحث عنه؟',
  'lead.optional': '(اختياري)',
  'lead.messagePlaceholder': 'تخصصك، معدلك، والدولة التي تفضلها…',
  'lead.submit': 'أرسل بياناتي',
  'lead.sending': 'جارٍ الإرسال…',
  'lead.privacy': 'لن نشارك بياناتك مع أي جهة خارجية.',
  'lead.errName': 'الرجاء إدخال الاسم الكامل.',
  'lead.errPhone': 'الرجاء إدخال رقم واتساب صحيح.',
  'lead.successTitle': 'وصلتنا بياناتك',
  'lead.successBody': 'سنتواصل معك عبر واتساب قريباً. للتعجيل، يمكنك مراسلتنا مباشرة الآن:',
  'lead.successCta': 'تابع المحادثة على واتساب',
  'lead.waIntro': 'مرحباً، أنا',
  'lead.waAbout': 'بخصوص:',
  'lead.waPhone': 'رقمي:',
  'lead.context': 'عام',

  // Footer
  'footer.tagline':
    'دليلك الموثوق للمنح الدراسية الممولة حول العالم، مع مساعدة كاملة في إعداد الملفات والترجمة المعتمدة.',
  'footer.quickLinks': 'روابط سريعة',
  'footer.follow': 'تابعنا',
  'footer.rights': 'جميع الحقوق محفوظة.',
} as const;

const en: Record<keyof typeof ar, string> = {
  'site.name': 'Menhati',
  'site.description':
    'Menhati — your trusted guide to funded scholarships worldwide, with full support on applications and certified translation.',

  'nav.home': 'Home',
  'nav.scholarships': 'Scholarships',
  'nav.quiz': 'Find your scholarship',
  'nav.how': 'How we work',
  'nav.whatsapp': 'Chat on WhatsApp',
  'nav.openMenu': 'Open menu',
  'nav.switchLang': 'العربية',
  'nav.switchLangAria': 'التبديل إلى العربية',

  'wa.general': "Hello, I'd like to know more about the available scholarships",
  'wa.apply': "Hello, I'd like to apply for this scholarship:",

  'home.badge': 'A trusted guide to scholarships',
  'home.title1': 'Your scholarship is',
  'home.title2': 'closer than you think',
  'home.subtitle':
    'Search funded scholarships worldwide — every one verified against its official source — with a team beside you from paperwork and translation through to acceptance.',
  'home.searchLabel': 'Search for a scholarship',
  'home.searchPlaceholder': 'Scholarship, university, or country…',
  'home.searchButton': 'Search',
  'home.popular': 'Popular:',
  'home.filterFullyFunded': 'Fully funded',
  'home.filterBachelor': "Bachelor's",
  'home.filterMaster': "Master's",
  'home.filterPhd': 'PhD',
  'home.filterOpen': 'Open now',

  'home.statTotal': 'verified scholarships',
  'home.statOpen': 'open now',
  'home.statCountries': 'countries worldwide',
  'home.statFunded': 'fully funded',

  'home.byCountry': 'Browse by country',
  'home.allCountries': 'All countries',

  'home.openNow': 'Open for applications',
  'home.openNowSub': 'Sorted by closing date — don’t miss the deadline.',
  'home.viewAll': 'View all',

  'home.howTitle': 'How we work',
  'home.howSub': 'Four steps, from your first message to the final decision.',
  'home.step1Title': 'Free consultation',
  'home.step1Body': 'We get to know your academic background and goals over WhatsApp.',
  'home.step2Title': 'Scholarship matching',
  'home.step2Body': 'We shortlist the scholarships that fit your field, grades and destination.',
  'home.step3Title': 'Preparing your file',
  'home.step3Body':
    'We write your motivation letter and CV, and produce certified translations of your documents.',
  'home.step4Title': 'Applying and following up',
  'home.step4Body': 'We submit the application and stay with you until the decision arrives.',

  'home.trustTitle': 'Why you can trust what you read here',
  'home.trustSub':
    'Nothing wastes a student’s time like outdated information or a wrong deadline. So we set clear rules for everything published in this directory.',
  'home.trust1Title': 'Official sources only',
  'home.trust1Body':
    'Every scholarship here comes from the provider’s own site — a ministry, an embassy, or the university itself. We never copy from aggregator sites.',
  'home.trust2Title': 'Deadlines checked and updated',
  'home.trust2Body':
    'We verify every deadline before publishing it, and correct the ones other sites get wrong.',
  'home.trust3Title': 'We keep closed ones listed',
  'home.trust3Body':
    'We don’t delete scholarships once they close. They stay clearly marked so you know roughly when the next round opens.',
  'home.trust4Title': 'No inflated promises',
  'home.trust4Body':
    'We never claim guaranteed admission or publish made-up numbers. We help with your file; the decision stays with the provider.',

  'home.ctaTitle': 'Not sure which scholarship fits you?',
  'home.ctaBody':
    'Answer four short questions about your field, grades and destination, and we’ll show you the scholarships whose published criteria you meet.',
  'home.ctaPrimary': 'Find your scholarship',
  'home.ctaSecondary': 'Browse all scholarships',

  'list.title': 'All scholarships',
  'list.intro':
    'verified scholarships from official sources, kept up to date. Use the search and filters to find what fits, then get in touch and we’ll help you apply.',
  'list.searchLabel': 'Search',
  'list.searchPlaceholder': 'Search by scholarship, university or country…',
  'list.filterCountry': 'Country',
  'list.filterDegree': 'Study level',
  'list.filterFunding': 'Funding type',
  'list.filterStatus': 'Application status',
  'list.allCountries': 'All countries',
  'list.allDegrees': 'All levels',
  'list.allFunding': 'All funding types',
  'list.allStatus': 'Open and closed',
  'list.onlyOpen': 'Open only',
  'list.onlyClosing': 'Closing soon',
  'list.onlyClosed': 'Closed only',
  'list.reset': 'Reset',
  'list.openSection': 'Open for applications',
  'list.closedSection': 'Currently closed',
  'list.closedNote':
    'Applications for this round have closed, but most of these reopen around the same time each year — save them now so you’re ready for the next round.',
  'list.emptyTitle': 'No matching scholarships',
  'list.emptyBody':
    'Try widening your search, or message us on WhatsApp and we’ll look manually for what suits your case.',
  'list.emptyReset': 'Reset search',

  'quiz.badge': 'Instant matching — no sign-up',
  'quiz.title': 'Find your scholarship',
  'quiz.subtitle':
    'Pick your study level, field and grades, and we’ll instantly show the open scholarships whose published criteria you meet.',
  'quiz.degree': 'Study level',
  'quiz.anyDegree': 'Any level',
  'quiz.field': 'Field of study',
  'quiz.anyField': 'All fields',
  'quiz.country': 'Preferred country',
  'quiz.anyCountry': 'All countries',
  'quiz.gpa': 'Your GPA',
  'quiz.gpaPlaceholder': 'e.g. 3.2',
  'quiz.gpaScaleAria': 'GPA scale',
  'quiz.scale4': 'out of 4.0',
  'quiz.scale5': 'out of 5.0',
  'quiz.scale100': 'out of 100%',
  'quiz.submit': 'Show my matches',
  'quiz.results': 'Results',
  'quiz.emptyTitle': 'No exact match found',
  'quiz.emptyBody':
    'That doesn’t mean there’s nothing for you — many scholarships don’t publish exact grade requirements, and new rounds open regularly. Leave your details below and we’ll search manually.',
  'quiz.leadTitle': 'We’ll help with the next step',
  'quiz.leadSubtitle':
    'Leave your name and WhatsApp number. We’ll review your results, shortlist the best fits, and tell you exactly which documents each one needs.',

  'card.major': 'Field',
  'card.minGpa': 'Min. GPA',
  'card.outOf': 'of',
  'card.details': 'Details',
  'card.fullyFunded': 'Fully funded',
  'card.partial': 'Partial funding',

  'status.open': 'Open for applications',
  'status.closing': 'Closing soon',
  'status.closed': 'Currently closed',
  'countdown.ended': 'Applications closed',
  'countdown.today': 'Closes today',
  'countdown.remaining': 'left',

  'detail.back': 'Back to all scholarships',
  'detail.country': 'Country',
  'detail.degree': 'Study level',
  'detail.major': 'Field',
  'detail.award': 'What it covers',
  'detail.minGpa': 'Minimum GPA',
  'detail.provider': 'Provider',
  'detail.deadline': 'Deadline',
  'detail.closesIn': 'Applications close in',
  'detail.ended': 'Applications have closed',
  'detail.consult': 'Free consultation on WhatsApp',
  'detail.consultShort': 'Free consultation',
  'detail.officialSite': 'Official scholarship page',
  'detail.related': 'Other scholarships you might like',
  'detail.leadTitle': 'We’ll help you apply for this scholarship',
  'detail.leadSubtitle':
    'Leave your name and WhatsApp number. We’ll check your eligibility for this specific scholarship and tell you which documents you need and when.',
  'detail.arabicOnly': 'Full details for this scholarship are currently available in Arabic only.',

  'lead.title': 'Leave your details and we’ll get in touch',
  'lead.subtitle':
    'We’ll review your case, shortlist the scholarships that fit, and tell you which documents you need — the first consultation is free.',
  'lead.name': 'Full name',
  'lead.namePlaceholder': 'e.g. Ahmed Abdullah',
  'lead.phone': 'WhatsApp number',
  'lead.message': 'What are you looking for?',
  'lead.optional': '(optional)',
  'lead.messagePlaceholder': 'Your field, your grades, and where you’d like to study…',
  'lead.submit': 'Send my details',
  'lead.sending': 'Sending…',
  'lead.privacy': 'We never share your details with third parties.',
  'lead.errName': 'Please enter your full name.',
  'lead.errPhone': 'Please enter a valid WhatsApp number.',
  'lead.successTitle': 'We’ve got your details',
  'lead.successBody':
    'We’ll reach out on WhatsApp shortly. To speed things up, you can message us directly now:',
  'lead.successCta': 'Continue on WhatsApp',
  'lead.waIntro': 'Hello, my name is',
  'lead.waAbout': 'Regarding:',
  'lead.waPhone': 'My number:',
  'lead.context': 'General',

  'footer.tagline':
    'Your trusted guide to funded scholarships worldwide, with full support preparing your file and certified translation.',
  'footer.quickLinks': 'Quick links',
  'footer.follow': 'Follow us',
  'footer.rights': 'All rights reserved.',
};

export const ui = { ar, en } as const;
export type UIKey = keyof typeof ar;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
