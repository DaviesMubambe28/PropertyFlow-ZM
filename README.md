# PropertyFlow ZM

PropertyFlow ZM is a multi-tenant property operations system for Zambian real-estate agencies. It gives agency owners and agents one authenticated workspace for properties, landlords, customers, leads, interactions, viewings, follow-up tasks, sales and rental transactions, team invitations, and operational reports.

## What is included

- Email/password registration, login, password recovery, and protected dashboard routes
- Agency onboarding, settings, active memberships, roles, and secure agent invitations
- Tenant-isolated PostgreSQL data with Supabase Row Level Security
- Property inventory with owner details, assignment, availability, and sale/rental status
- Customer records, lead pipeline, and customer interaction history
- Viewing scheduling, outcomes, and feedback
- Follow-up tasks linked to customers and properties
- Sales and rental transactions that automatically mark completed properties sold or rented
- Agency and per-agent operational reporting with completed-sale date filters
- Enterprise product preview, demo requests, and a private staff follow-up inbox
- Server-side validation, secure response headers, and automated application/database tests

The MVP deliberately does not include a public marketplace, customer accounts, payment collection, government verification, legal document transfer, or automated WhatsApp/AI workflows.

## Requirements

- Node.js 22 or newer
- npm
- Docker, when using Supabase locally
- A Supabase project for a hosted deployment

## Local setup

```bash
npm ci
cp .env.example .env.local
npx supabase start
npm run dev
```

After `npx supabase start`, copy the local publishable/anon key and service-role key into `.env.local`. Open the exact origin configured in `NEXT_PUBLIC_APP_URL`. Local authentication emails can be viewed in Mailpit at `http://127.0.0.1:54324`.

Required environment variables:

```dotenv
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it through a `NEXT_PUBLIC_` variable or commit it to source control.

## Hosted deployment

1. Create a Supabase project and link the repository with `npx supabase link --project-ref <project-ref>`.
2. Apply all migrations with `npx supabase db push`.
3. In Supabase Auth, set the Site URL to the production application URL and allow `/auth/callback` and `/reset-password` redirects.
4. Configure SMTP in Supabase Auth. See the [deployment guide](docs/DEPLOYMENT_GUIDE.md) for callback and demo inbox setup.
5. Add the four environment variables above to the hosting provider, using the hosted Supabase URL and keys.
6. Build with `npm run build`, then deploy the Next.js application.

The application needs a user-owned hosted Supabase project and SMTP configuration for real production accounts and email delivery. The repository contains no external account credentials.

## Quality checks

```bash
npm run test:run
npm run lint
npx tsc --noEmit
npx supabase test db
npm run build
```

Database migrations and pgTAP tests are in `supabase/migrations` and `supabase/tests`. The security model is deny-by-default: authenticated users can only access records belonging to organizations where they have an active membership.
