# Deployment guide

## Local development

1. Start Supabase locally with `npx supabase start`.
2. Copy `.env.example` to `.env.local` and use the URL and keys from `npx supabase status`.
3. Run `npm ci` and `npm run dev`.
4. Use the same app origin as `NEXT_PUBLIC_APP_URL`. With the default local ports, open the app at `http://localhost:3000` and the test mail inbox at `http://localhost:54324`.
5. Register a test agency, follow the verification message and open the agency workspace.

## Staging

Use a dedicated Supabase project and Next.js host with HTTPS. Confirm the target before applying migrations. Configure the hosted Auth site origin, allowed callback URLs, SMTP and the invitation template. The service-role key is server-only. Verify onboarding, cross-agency access restrictions, branch rules, private file downloads and demo handoff using test records.

See [configuration handoff](CONFIGURATION_HANDOFF.md) for application settings and [enterprise agency workflows](ENTERPRISE_AGENCY_WORKFLOWS.md) for known limitations and verification evidence.

## Production release

Confirm data retention, storage review, monitoring, backups and recovery procedures before a pilot. Obtain authorisation for migration and deployment to the intended production environment.
