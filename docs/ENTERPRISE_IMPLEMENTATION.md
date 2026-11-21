# Enterprise implementation checkpoint

## Starting point

The clean `work` branch started at `b2b9e7b`. The project uses Next.js App Router, React, Tailwind, Supabase authentication, PostgreSQL migrations and Vitest. Baseline lint and all 54 tests passed. An unconfigured build compiled and type-checked, then stopped because Supabase and app URL settings were missing.

| Area | Existing implementation | Change in this checkpoint |
| --- | --- | --- |
| Public site | Homepage, marketing pages, pricing examples and contact preview | Interactive portfolio, pipeline, activities and reporting preview, enterprise page, proposed plans, demo intake, sitemap and crawler directives |
| Identity | Supabase verification, recovery, agency membership and team invitations | Dedicated platform sales access via server-verified Auth app metadata and an optional workspace setup checklist |
| Property operations | Agency records protected by workspace RLS | Search by title, location or province, status filtering, property editing with conflict checks, available-property link and explicit missing-photo state |
| CRM and transactions | Supabase contacts, leads, lead interactions, viewings, tasks and sale or rental deals | Dashboard links to existing workflows and manual WhatsApp chat links for stored numbers |
| Reporting | Portfolio counts and agent totals from workspace records | Inclusive Lusaka date controls for events and transaction closing dates |
| Sales intake | Contact UI preview | Validated RPC submission, duplicate suppression, burst limit, staff-only search, status and follow-up history |
| Billing | Illustrative plans | Proposed public pricing and working registration or enquiry links. Billing and entitlements are pending. |

## Design

The public entry points use navy for the introduction, white for the product surface, teal for selected controls and neutral borders for operational tables. Existing Geist typography remains. The tour uses real buttons, a persistent sample data label and semantic tables. Forms have associated labels and status announcements. Reduced-motion preferences disable shared control transitions.

## Database and access

The demo migration creates `demo_requests` and `demo_request_activity`. Public requests reach storage through server-side validation and a service-role RPC. Anonymous and tenant sessions have no direct access to the tables or functions. Staff changes update the request and append history in one database transaction. Sales access is independent of agency membership. See [configuration handoff](CONFIGURATION_HANDOFF.md) for staff setup and launch prerequisites.

## Outstanding scope

- Branch ownership, branch-scoped access, additional organisation roles, approvals and wider operational audit history.
- Private document and photo storage, CSV mapping and import with duplicate review, and deeper organisation setup and migration workflows.
- Expanded lead and deal management, authorised WhatsApp synchronisation, notifications, global search, and broader reporting and exports.
- Demo request assignment, conversion analytics and automated retention.
- Subscription lifecycle, server-enforced entitlements and payment integration.
- Full browser verification for all five acceptance journeys, mobile visual QA and rollout against a configured staging Supabase project.

Avoid applying the migration to production until the target database, staff accounts and retention policy are confirmed. No remote migration or deployment is part of this checkpoint.

## Verification evidence

- ESLint passed. Vitest passed 69 tests across 20 files.
- The production build passed with local placeholder Supabase values for build-time configuration.
- The homepage, enterprise, pricing, demo, sitemap and robots routes returned HTTP 200. An unauthenticated request to the sales inbox redirected to sign-in.
- Rollback-only local PostgreSQL checks verified persistence, duplicate suppression, sales update history and restricted database grants. A two-agency fixture verified that same-agency edits succeed and cross-agency or stale updates affect zero rows.
- The managed Chrome tool failed before opening the local homepage. Screenshots and browser acceptance testing remain outstanding.
