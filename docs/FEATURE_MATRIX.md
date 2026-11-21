# Enterprise transformation baseline

Baseline on branch `work` at `b2b9e7b`. The working tree was clean. The audit found Next.js 16.4.6 App Router with Cache Components, React 19, TypeScript, Tailwind 4, Supabase Auth and PostgreSQL, and Vitest plus pgTAP. The proxy refreshes sessions, the dashboard verifies users server-side, and workspace policies use active organisation membership. There is no CI configuration in this checkout.

| Capability | Baseline | Evidence or gap |
|---|---|---|
| Homepage, About, Features, Pricing | Implemented | Public pages exist, with conflicting illustrative prices and limited product evaluation |
| Enterprise, SEO routes | Missing | No enterprise page, robots route or sitemap source |
| Demo requests | Prototype-only | Contact form changed client state without writing to a database |
| Discovery and details | Broken in production | The public browser store omits seed listings outside development |
| Registration, verification, login, recovery | Implemented but unverified end to end | Supabase server actions and unit tests exist. Local mail and API are needed for full journeys |
| Workspaces, team and invitations | Implemented but unverified end to end | Active membership, admin and agent roles. Branch management absent |
| Properties and CRM | Partial | Tenant-backed records and mutations. Property photo upload, archive, and richer inventory filtering are missing |
| Leads, tasks, viewings, deals | Implemented but unverified end to end | Server actions, database constraints and RLS exist |
| Dashboard and reporting | Partial | Workspace data is stored in PostgreSQL and summarised client-side. No complete branch or date reporting |
| Private files and CSV imports | Missing | No application workflows or private storage policies |
| Subscriptions and administration | Prototype-only | No billing or enforced entitlements. Admin view relies on an unreachable client role |
| Four existing migrations | Implemented locally | Local PostgreSQL reports all four migration versions |
| Baseline checks | 54 tests passed, lint and TypeScript passed | Production build compiled, then failed prerendering because public app and Supabase variables were absent |

## Implementation checklist

- [x] Audit and baseline checks
- [x] Property examples, pricing accuracy, deployment metadata
- [x] Enterprise request capture and staff follow-up
- [x] Homepage and enterprise evaluation
- [x] Workspace dashboard, property editing, lead assignment and completed-sale reporting
- [x] Final verification and readiness report

See the [enterprise transformation report](ENTERPRISE_TRANSFORMATION.md) for the final status and verification evidence.
