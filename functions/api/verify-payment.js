// POST /api/verify-payment — checks Razorpay's signature and only then marks the invoice paid.
import { json, cleanRef, getInvoice, hasKeys, hmacSha256Hex, safeEqual } from "../_lib/razorpay.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB || !hasKeys(env)) return json({ error: "The payment service is not configured yet." }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const reference = cleanRef(body.invoice);
  const orderId = String(body.razorpay_order_id ?? "");
  const paymentId = String(body.razorpay_payment_id ?? "");
  const signature = String(body.razorpay_signature ?? "");
  if (!reference || !orderId || !paymentId || !signature) return json({ error: "Missing payment details." }, 400);

  const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
  if (!safeEqual(expected, signature)) return json({ error: "Payment verification failed." }, 400);

  const invoice = await getInvoice(env, reference);
  if (!invoice || invoice.razorpay_order_id !== orderId) return json({ error: "Payment does not match this invoice." }, 400);

  if (invoice.status !== "paid") {
    await env.DB.prepare("UPDATE invoices SET status = 'paid', razorpay_payment_id = ?, paid_at = datetime('now') WHERE reference = ? AND razorpay_order_id = ?")
      .bind(paymentId, reference, orderId).run();
  }
  return json({ ok: true, reference, payment_id: paymentId });
}
