FOLLE ORFÈVRE — STATIC SITE PREVIEW

WHAT IS INCLUDED
- index.html: home, brand positioning and 8-product launch preview
- chronicle.html: fictional Chronicle editorial page
- legal.html: fiction disclosure and enquiry privacy information
- enquire.html: limited-edition enquiry form (no cart, checkout or payment)
- register.html: public register landing page for confirmed buyers who consent to name publication
- functions/api/enquiry.js: Cloudflare Pages Function that stores submissions in D1
- schema.sql: D1 database schema
- styles.css, site.js, config.js
- robots.txt, sitemap.xml, SVG brand marks

IMPORTANT BEFORE PUBLIC LAUNCH
1. Confirm trademark clearance and the right to use FOLLE ORFÈVRE / FOLLE ORFEVRE in relevant markets.
2. Replace YOUR-DOMAIN-HERE in sitemap.xml and robots.txt with the exact production domain.
3. Set window.FOLLE_CONFIG.siteUrl in config.js to the production URL.
4. Change robots meta from noindex,nofollow to index,follow on all pages only after the domain and content are final. Current noindex is intentional to prevent premature indexing.
5. Confirm product designs, dimensions, weights, materials, finish, manufacturing location, hallmarking, packaging, warranties, delivery times, taxes, return policy and actual COGS with suppliers before taking orders.
6. The current first-edition catalogue uses the eight INR prices and edition quantities supplied by the founder. These are proposed retail prices, not a confirmed offer to sell. Validate material specifications, production feasibility, taxes, COGS and margins before accepting orders. Product images are concept renders, not finished-product photographs.
7. Configure the enquiry backend before publishing the form: create a Cloudflare D1 database, execute schema.sql in that database, then add a Pages binding named DB pointing to that D1 database (Workers & Pages → your Pages project → Settings → Bindings → D1 database bindings). Redeploy after adding the binding. The form submits to /api/enquiry and the Pages Function stores enquiries in D1. Test a real submission and verify the row appears in D1 before opening enquiries publicly.
8. Set up a restricted internal process for reviewing enquiries and recording allocation status. Do not expose the D1 database or enquiry records through a public API. No checkout, payment processing, customer accounts or instant reservations are included.
9. Public name publication is optional and separately consented to in the form. Publish only confirmed buyer names for which explicit consent was recorded. Keep the consent record with the enquiry. Update register.html manually after verification; never connect the private enquiry database directly to a public listing.
10. Add a verified privacy contact, legal entity details, data retention period, data processor information and any required jurisdiction-specific privacy disclosures before collecting personal information.
11. Add verified business address, legal entity details, privacy policy, terms and customer support details before opening enquiries. Publish shipping/returns terms before any purchase is accepted.
12. The fictional Chronicle is clearly disclosed. Do not describe the fictional objects as real historical artefacts or imply historical succession.

CLOUDFLARE PAGES — DEPLOY WITH FUNCTIONS + D1
Important: Cloudflare dashboard drag-and-drop deployment does not compile the /functions directory. This package includes a Pages Function for the enquiry endpoint, so deploy with Wrangler CLI or connect the project to Git. The simplest CLI route is:
1. Install Node.js on the deployment computer, then open a terminal in this folder.
2. Run: npx wrangler login
3. Create the D1 database: npx wrangler d1 create folle-orfevre-enquiries
4. Copy the database_id returned by Cloudflare into wrangler.toml, replacing REPLACE_WITH_YOUR_CLOUDFLARE_D1_DATABASE_ID.
5. Run the schema remotely: npx wrangler d1 execute folle-orfevre-enquiries --remote --file=./schema.sql
6. Create the Pages project once: npx wrangler pages project create folle-orfevre
7. Deploy this folder: npx wrangler pages deploy . --project-name folle-orfevre
8. Add the custom domain in Cloudflare Pages after DNS is ready. The wrangler.toml file binds the D1 database as DB.
9. Test /enquire.html and verify a test record in D1 before opening the form publicly.
Alternative: connect the folder to a Git repository and use Cloudflare Pages Git integration; retain the D1 binding in wrangler.toml. Dashboard drag-and-drop alone is not sufficient for the included Pages Function.

SEO / SEARCH CONSOLE CHECKLIST
- Verify the production domain in Google Search Console using the DNS TXT method in Cloudflare DNS.
- Verify the same domain in Bing Webmaster Tools; import the verified Google Search Console property where offered.
- After enabling index,follow and replacing placeholders, submit https://YOUR-DOMAIN/sitemap.xml in both tools.
- Inspect the homepage and product/Chronicle URLs; request indexing after the final content is live.
- Add unique product detail pages once exact specifications are final. Avoid thin duplicate pages.
- Configure GA4 or another analytics tool only after consent/privacy requirements are addressed.

D1 ENQUIRY SETUP
1. In Cloudflare Dashboard, create a D1 database (for example, folle-orfevre-enquiries).
2. Open the D1 Console and run the contents of schema.sql.
3. In the Pages project, add a D1 database binding named DB and select the database.
4. Redeploy the Pages project.
5. Submit a test enquiry and verify it is stored. D1 stores personal information: restrict dashboard access to authorised staff and establish a deletion/retention process.
6. Configure a private operational workflow for contacting applicants and marking allocations confirmed. The starter site deliberately contains no public enquiry-list or admin endpoint.

NOTE
The site has no checkout, cart, payment processing, inventory reservation, or customer account system. Enquiry submission is not a purchase or allocation. The D1-backed form requires the Cloudflare database binding above before it can accept submissions.


EXPANDED SITE BUILD (V2)
- atelier.html: complete visual archive with 37 supplied creative visual assets, excluding phone screenshots and contact-sheet duplicates.
- booking.html: preferred appointment date/time request UI. This is not a live calendar and does not reserve or confirm a slot.
- payment.html: static crypto payment details from founder-provided screenshots, copy-address controls, transaction hash field and local screenshot preview.
- The screenshot file is not uploaded or transmitted in this static build. A secure authenticated upload service and private storage must be configured before accepting proofs.
- Payment screenshots are not proof of settlement. Verify transaction hash, asset, network, amount and confirmations independently.
- Verify wallet addresses character-by-character against the source wallet before publishing. Crypto transfers are irreversible and network mismatches can cause permanent loss.
- BTC: Bitcoin network. ETH and USDT ERC20: Ethereum network. USDT TRC20: TRON network.
- The site remains noindex until legal, privacy, contact, backend and deployment checks are completed.
