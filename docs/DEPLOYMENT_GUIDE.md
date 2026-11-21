# Running PropertyFlow ZM

## Local development

1. Run `npm ci` and `npx supabase start` with Docker available.
2. Copy `.env.example` to `.env.local`. Fill in the local Supabase API URL, publishable key and service role key from `npx supabase status`. Use the browser's exact origin for `NEXT_PUBLIC_APP_URL`.
3. Run `npm run dev`. Open `/register` and confirm the account through the local Mailpit inbox. Run `npx supabase test db` to exercise the migration and access policies.
4. For a production-mode check, run `npm run build` followed by `npm start`. The build needs the public URL and publishable key. The demo inbox, demo writes and invitation email calls also require the server-only service role key.

## Hosted environment

- Build with the approved public HTTPS origin and the intended Supabase project. The sitemap and robots policy derive from `NEXT_PUBLIC_APP_URL`.
- Apply the reviewed migrations to the approved environment. The demo-request migration adds its private tables and service-role functions. The lead-assignment migration adds its database permission trigger.
- Enable verified email and configure a real SMTP provider and sender. Allowlist the exact HTTPS origin for `/auth/callback` and the `/invitations/<id>/verify` route pattern. Use the Supabase invite template that links to `{{ .ConfirmationURL }}`. The email opens the app’s invite verification page.
- Provision demo coordinators through Supabase's trusted Auth Admin API with the Boolean `enterprise_demo_staff: true` in `app_metadata`. The private inbox is at `/staff/demo-requests`. Invite coordinators individually and revoke the metadata flag on departure.
- Keep the service role key in the server secret store. Configure the approved backup schedule and verify restoration before using customer data.

## Data protection review

Review the scope of controller and processor registration and the platform's role in agency data and inbound sales requests. Confirm lawful grounds, applicable notices, retention and deletion procedures, data-subject request handling, breach response, and permitted storage and transfers for the selected hosting, email, backup and monitoring providers. The Data Protection Commissioner publishes registration and transfer guidance. [Zambia Data Protection Act, 2021](https://www.parliament.gov.zm/node/8853) · [Data Protection Commission registration guidance](https://www.dataprotection.gov.zm/registration/) · [Transfer authorisation information](https://registration.dataprotection.gov.zm/)

## Browser test

Install Chromium with `npx playwright install chromium` or set `CHROMIUM_PATH` to a local Chromium binary. Start a disposable local Supabase instance with email confirmation enabled and start the app on the same origin used in `NEXT_PUBLIC_APP_URL`. Pass the local environment variables to `npm run test:browser`. Set `MAILPIT_URL` for a non-default inbox port, and set `BROWSER_SCREENSHOT_DIR` to save screenshots. The browser test creates synthetic users and records and accepts only loopback origins.
