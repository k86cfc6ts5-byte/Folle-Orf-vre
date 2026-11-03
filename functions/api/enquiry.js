const ALLOWED_PRODUCTS = new Set([
  "L’Éclat Orphique",
  "Le Serpent Couronné",
  "La Clef du Temps",
  "L’Astre Noir",
  "La Vigne Éternelle",
  "Le Masque de Nuit",
  "La Flamme Voilée",
  "Le Médaillon des Muses",
  "Multiple creations / General enquiry",
  "Private appointment request"
]);
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
const clean = (value, max) => String(value ?? "").trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max);

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "The enquiry service is not configured yet." }, 503);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return json({ error: "Invalid request format." }, 415);
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 10000) return json({ error: "The submitted enquiry is too large." }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid enquiry." }, 400); }
  if (body.website) return json({ ok: true, reference: "FO-RECEIVED" }); // honeypot
  const name = clean(body.name, 100);
  const email = clean(body.email, 160).toLowerCase();
  const country = clean(body.country, 80);
  const phone = clean(body.phone, 40);
  const product = clean(body.product, 100);
  const message = clean(body.message, 1200);
  if (!name || !country || !body.privacyConsent || !ALLOWED_PRODUCTS.has(product)) return json({ error: "Please complete all required fields and accept the privacy notice." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  const reference = `FO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    await env.DB.prepare(`INSERT INTO enquiries (reference, name, email, country, phone, product, message, privacy_consent, public_name_consent, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 'new', datetime('now'))`)
      .bind(reference, name, email, country, phone, product, message, 0).run();
    return json({ ok: true, reference }, 201);
  } catch (error) {
    return json({ error: "We could not save your enquiry. Please try again shortly." }, 500);
  }
}
