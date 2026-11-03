// POST /api/create-order { invoice } — creates a Razorpay order for the invoice's server-side amount.
import { json, cleanRef, getInvoice, hasKeys, createRazorpayOrder } from "../_lib/razorpay.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB || !hasKeys(env)) return json({ error: "The payment service is not configured yet." }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const reference = cleanRef(body.invoice);
  if (!reference) return json({ error: "Missing invoice reference." }, 400);

  const invoice = await getInvoice(env, reference);
  if (!invoice || invoice.status === "cancelled") return json({ error: "Invoice not found." }, 404);
  if (invoice.status === "paid") return json({ error: "This invoice has already been paid." }, 409);
  if (!Number.isInteger(invoice.amount) || invoice.amount < 100) return json({ error: "Invoice amount is below the minimum." }, 400);

  let result;
  try {
    result = await createRazorpayOrder(env, {
      amount: invoice.amount,
      currency: invoice.currency,
      receipt: invoice.reference,
      notes: { invoice: invoice.reference }
    });
  } catch {
    return json({ error: "Could not reach the payment provider. Please try again." }, 502);
  }
  if (result.status === 401) return json({ error: "Payment provider authentication failed." }, 401);
  if (!result.ok || !result.data.id) return json({ error: "The payment could not be started. Please try again." }, 500);

  await env.DB.prepare("UPDATE invoices SET razorpay_order_id = ? WHERE reference = ? AND status = 'issued'")
    .bind(result.data.id, invoice.reference).run();

  return json({ order_id: result.data.id, amount: result.data.amount, currency: result.data.currency });
}
