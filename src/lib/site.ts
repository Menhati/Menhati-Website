/**
 * Single source of truth for contact details and social links.
 *
 * ⚠️ The WhatsApp number below is still the scaffold PLACEHOLDER.
 * Replace `whatsappNumber` with Menhati's real number before going live —
 * it is used by the floating button, the footer, every scholarship page CTA,
 * and the lead-capture form.
 */

/** International format, digits only, no "+" or spaces. */
export const whatsappNumber = '601156994406';

export const contactEmail = 'info@menhati.com';

export const social = [
  { label: 'واتساب', href: `https://wa.me/${whatsappNumber}` },
  { label: 'تيليجرام', href: 'https://t.me/menhati' },
  { label: 'إنستغرام', href: 'https://instagram.com/menhati' },
  { label: 'فيسبوك', href: 'https://facebook.com/menhati' },
  { label: 'يوتيوب', href: 'https://youtube.com/@menhati' },
];

/** Build a wa.me link with a pre-filled Arabic message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
