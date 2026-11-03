# Folle Orfèvre

Website for Folle Orfèvre — Maison d'Objets Rares. Static site on Cloudflare Pages with one Pages Function (`functions/api/enquiry.js`) that stores enquiries in Cloudflare D1.

## Deploy
1. Create the D1 database and apply the schema: `wrangler d1 execute folle-orfevre-enquiries --remote --file=schema.sql`
2. Bind it to the Pages project as `DB` (already set in `wrangler.toml`).
3. Deploy: `wrangler pages deploy .`

## Read enquiries
`wrangler d1 execute folle-orfevre-enquiries --remote --command "SELECT product, COUNT(*) FROM enquiries GROUP BY product ORDER BY 2 DESC"`
