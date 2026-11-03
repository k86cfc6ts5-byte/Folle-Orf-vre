// GET /api/invoice?ref=FO-INV-0001 — public details a client needs to pay an invoice.
import { json, cleanRef, getInvoice, hasKeys } from "../_lib/razorpay.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "The payment service is not configured yet." }, 503);
  const reference = cleanRef(new URL(request.url).searchParams.get("ref"));
  if (!reference) return json({ error: "Please enter your invoice reference." }, 400);
  const invoice = await getInvoice(env, reference);
  if (!invoice || invoice.status === "cancelled") return json({ error: "We could not find that invoice. Please check the reference." }, 404);
  return json({
    reference: invoice.reference,
    clientName: invoice.client_name,
    description: invoice.description,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    keyId: hasKeys(env) ? env.RAZORPAY_KEY_ID : null // key ID is public by design; the secret never leaves the server
  });
}
