# Deployment

This repository is connected to the Cloudflare Pages project `folle-orfevre` on the `main` branch.

The site is a static HTML/CSS website with a Cloudflare Pages Function at `functions/api/enquiry.js`. The function requires the D1 binding named `DB`, connected to the `folle-orfevre-enquiries` database.

Before opening enquiries publicly, verify a test submission is stored in D1, complete the privacy/legal particulars, confirm product specifications and pricing, and configure the production domain. The site intentionally uses noindex until its final domain and launch content are confirmed.