# Folle Orfèvre

Website for Folle Orfèvre — Maison d'Objets Rares. Static site on Cloudflare Pages with one Pages Function (`functions/api/enquiry.js`) that stores enquiries in Cloudflare D1.

## Deploy
1. Create the D1 database and apply the schema: `wrangler d1 execute folle-orfevre-enquiries --remote --file=schema.sql`
2. Bind it to the Pages project as `DB` (already set in `wrangler.toml`).
3. Deploy: `wrangler pages deploy .`

## Read enquiries
`wrangler d1 execute folle-orfevre-enquiries --remote --command "SELECT product, COUNT(*) FROM enquiries GROUP BY product ORDER BY 2 DESC"`

## Payments (Razorpay Standard Checkout)
Clients pay invoices you issue; the amount always comes from the `invoices` table, never from the browser.

- `functions/api/invoice.js` — GET invoice details by reference
- `functions/api/create-order.js` — POST, creates a Razorpay order for the invoice amount
- `functions/api/verify-payment.js` — POST, checks the HMAC-SHA256 signature, then marks the invoice paid
- `pay.html` — client page: `/pay.html?invoice=FO-INV-0001`

### Keys
Never commit keys. Locally they live in `.dev.vars` (gitignored). On Cloudflare:
```
npx wrangler pages secret put RAZORPAY_KEY_ID --project-name folle-orfevre
npx wrangler pages secret put RAZORPAY_KEY_SECRET --project-name folle-orfevre
```

### Issue an invoice (amount in paise: ₹98,000 = 9800000)
```
npx wrangler d1 execute folle-orfevre-enquiries --remote --command "INSERT INTO invoices (reference, client_name, description, amount, currency) VALUES ('FO-INV-0001', 'Client Name', 'Deposit — L''Astre Noir', 9800000, 'INR')"
```

### Check payments
```
npx wrangler d1 execute folle-orfevre-enquiries --remote --command "SELECT reference, amount, status, razorpay_payment_id, paid_at FROM invoices ORDER BY id DESC"
```
