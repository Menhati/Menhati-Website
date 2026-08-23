/**
 * POST /api/lead — receives a lead from the site's contact/quiz forms.
 *
 * Runs as a Cloudflare Pages Function (production, or `npx wrangler pages dev`).
 * It does NOT run under plain `astro dev` — there the form falls back to a
 * WhatsApp handoff, so leads are never lost during local development.
 *
 * Every delivery channel is optional and independently configured, so the
 * endpoint keeps working as you add them:
 *
 *   D1 binding   LEADS_DB        → stores the lead in a `leads` table (see schema.sql)
 *   env var      RESEND_API_KEY  → emails the team via Resend
 *   env var      LEAD_TO_EMAIL   → recipient (defaults to info@menhati.com)
 *   env var      LEAD_FROM_EMAIL → verified sender address in Resend
 *
 * With nothing configured it still returns 200, so the visitor never hits an
 * error — the browser then hands them to WhatsApp, which is the real safety net.
 *
 * Setup steps are in README.md → "التقاط بيانات المهتمين (Leads)".
 */

// Minimal local types so this file needs no @cloudflare/workers-types dependency.
interface D1Result {
  success: boolean;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  LEADS_DB?: D1Database;
  RESEND_API_KEY?: string;
  LEAD_TO_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

interface LeadPayload {
  name?: string;
  phone?: string;
  message?: string;
  context?: string;
  page?: string;
  website?: string; // honeypot
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}

export async function onRequestPost({ request, env }: EventContext): Promise<Response> {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // Honeypot — accept silently so bots don't learn they were caught.
  if (clean(payload.website, 100)) return json({ ok: true });

  const name = clean(payload.name, 120);
  const phone = clean(payload.phone, 40);
  const message = clean(payload.message, 2000);
  const context = clean(payload.context, 200);
  const page = clean(payload.page, 200);

  if (!name || phone.replace(/\D/g, '').length < 8) {
    return json({ ok: false, error: 'validation' }, 400);
  }

  const receivedAt = new Date().toISOString();
  const country = request.headers.get('CF-IPCountry') ?? '';
  const problems: string[] = [];

  // 1) Persist ------------------------------------------------------------
  if (env.LEADS_DB) {
    try {
      await env.LEADS_DB.prepare(
        `INSERT INTO leads (name, phone, message, context, page, country, received_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(name, phone, message, context, page, country, receivedAt)
        .run();
    } catch (err) {
      problems.push(`d1: ${(err as Error).message}`);
    }
  }

  // 2) Notify the team ----------------------------------------------------
  if (env.RESEND_API_KEY) {
    const to = env.LEAD_TO_EMAIL || 'info@menhati.com';
    const from = env.LEAD_FROM_EMAIL || 'leads@menhati.com';
    const rows: [string, string][] = [
      ['الاسم', name],
      ['واتساب', phone],
      ['بخصوص', context || '—'],
      ['الرسالة', message || '—'],
      ['الصفحة', page || '—'],
      ['الدولة (تقديرية)', country || '—'],
      ['التاريخ', receivedAt],
    ];

    const html =
      `<div dir="rtl" style="font-family:system-ui,sans-serif;line-height:1.9">` +
      `<h2 style="margin:0 0 12px">طلب جديد من موقع منحتي</h2>` +
      `<table cellpadding="6" style="border-collapse:collapse">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="color:#64748b;white-space:nowrap">${k}</td>` +
            `<td><strong>${escapeHtml(v)}</strong></td></tr>`
        )
        .join('') +
      `</table>` +
      `<p style="margin-top:16px">` +
      `<a href="https://wa.me/${phone.replace(/\D/g, '')}" ` +
      `style="background:#3E7A5C;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">` +
      `مراسلة ${escapeHtml(name)} على واتساب</a></p></div>`;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `منحتي <${from}>`,
          to: [to],
          reply_to: to,
          subject: `طلب جديد من ${name}${context && context !== 'عام' ? ` — ${context}` : ''}`,
          html,
        }),
      });
      if (!res.ok) problems.push(`resend: ${res.status} ${await res.text()}`);
    } catch (err) {
      problems.push(`resend: ${(err as Error).message}`);
    }
  }

  if (problems.length) {
    // Logged for the operator (Cloudflare dashboard → Functions → Logs).
    // The visitor still gets a success response plus the WhatsApp handoff, so a
    // misconfigured backend never costs a lead.
    console.error('[lead] delivery problems:', problems.join(' | '), `name=${name} phone=${phone}`);
  }

  return json({ ok: true });
}

/** Anything that isn't POST gets a clear answer instead of a confusing 404. */
export async function onRequestGet(): Promise<Response> {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
