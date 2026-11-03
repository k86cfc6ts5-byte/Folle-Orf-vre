// Shared helpers for Razorpay on Cloudflare Pages Functions.
// Uses fetch + Web Crypto (the razorpay npm SDK needs Node and does not run on Workers).

export const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

export const cleanRef = value => String(value ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);

export function hasKeys(env) {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

export class NotReady extends Error {}

export async function getInvoice(env, reference) {
  try {
    return await env.DB.prepare("SELECT * FROM invoices WHERE reference = ?").bind(reference).first();
  } catch (e) {
    throw new NotReady(String(e)); // e.g. invoices table not created yet
  }
}

// Wraps a handler so database/setup failures return a clean JSON 503 instead of a Cloudflare error page.
export const guarded = handler => async ctx => {
  try { return await handler(ctx); }
  catch (e) {
    if (e instanceof NotReady) return json({ error: "The payment service is not configured yet." }, 503);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
};

export async function createRazorpayOrder(env, { amount, currency, receipt, notes }) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount, currency, receipt, notes })
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time comparison so the check does not leak timing information.
export function safeEqual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
