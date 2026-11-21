# PropertyFlow ZM enterprise transformation

21 November 2026 · `feat/enterprise-transformation` · baseline `b2b9e7b`

## Product and interface

The existing Next.js and Supabase application now has a responsive homepage, Enterprise and Solutions pages, a six-view interactive tour labelled as sample data, consistent indicative pricing, and an enterprise demo form. Features describes the current workspace capabilities. The dashboard uses persisted records for inventory, lead, deal and task counts and links to their filtered views.

Workspace users can search and edit property records. Agency administrators can assign leads to active team members. Reports filter completed transactions by date and show sale amounts separately from rental transactions. Viewings and task forms interpret local times as Africa/Lusaka.

## Database and security

| Migration | Change |
|---|---|
| `20261121143000_enterprise_demo_requests.sql` | Private request and history tables, service-role-only submit and review functions, transactional abuse caps, verified staff role checks |
| `20261121150000_lead_assignment.sql` | Trigger limiting reassignment to active administrators and active recipients in the same workspace |

The demo form reports success after persistence. Sales staff can claim a request, change its status, add follow-up notes and review its history. The browser-facing Supabase roles cannot read the inbox. The existing organisation RLS remains in place. The app uses HTTP-only Supabase cookies and sets Secure on HTTPS. Hosted configuration and the qualified review items under Zambia's Data Protection Act are in [the deployment guide](DEPLOYMENT_GUIDE.md).

## Screenshot issues and fixes

| Issue in the brief | Outcome |
|---|---|
| Basic public site and thin Enterprise content | Redesigned entry points and interactive sample tour |
| Inconsistent plans | One source for indicative K150 and K350 amounts and custom enterprise quotes |
| Contact form preview only | Real database submission and platform staff follow-up |
| Blank listing imagery and missing detail | Local images for all three illustrative listings, production-stable detail paths, and HTTP 404 for an unknown listing |
| Development indicator and runtime failures | Disabled the indicator and fixed invalid Next.js server-action exports and auth callback origin handling |
| Localhost metadata | Approved HTTPS origin drives discovery routes. Local builds suppress indexing. Private routes send noindex |
| Enterprise credibility | Described current capabilities and access controls. Used only labelled sample data |

Property photos are illustrative and use local copies of the existing [house](https://images.unsplash.com/photo-1512917774080-9991f1c4c750), [office](https://images.unsplash.com/photo-1497366754035-f200968a6e72), and [apartment](https://images.unsplash.com/photo-1502672260266-1c1ef2d93688) images.

## Important changes

- Public website and tour in `src/app/` and `src/components/product-tour.tsx`
- Demo capture and inbox in `src/actions/demo.ts` and `src/app/staff/demo-requests/`
- Workspace actions and views in `src/actions/operations.ts` and `src/app/dashboard/`
- Session and invitation flow in `src/lib/supabase/server.ts`, `src/proxy.ts`, `src/actions/team.ts`, and `src/app/invitations/`
- Migration and permission tests in `supabase/`, with the Chromium journeys in `scripts/enterprise-smoke.mjs`

## Test evidence

The baseline passed 54 Vitest tests, lint and TypeScript. The initial production build stopped during prerendering because the public app and Supabase environment variables were absent. The configured production build compiled and rendered against the isolated local stack.

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit --incremental false` | Pass |
| `npm run build` | Pass with local Supabase and app configuration |
| `npm run test:run` | 70 assertions passed across 18 files |
| `npx supabase test db` | 57 assertions passed across three files |
| `npm run test:browser` | Passed all seven scenario groups against localhost with synthetic data |
| `npm audit --omit=dev` | Registry reported zero production dependency advisories at time of check |

The Chromium suite verified public navigation and listing images, the demo request and staff review, email-verified agency registration, property create and edit, invitation acceptance, administrator lead assignment and CRM follow-up, completed-sale reporting, and password recovery. The property journey uses existing example imagery and private inventory editing. Photo uploads are still pending. Database tests verify two-organisation isolation and denied writes.

An unthrottled local Chromium run measured homepage, enterprise, and listing LCP between 212 and 408 ms at widths of 390 and 1440 pixels. All six runs had CLS of 0 and no horizontal overflow. These are local measurements. Field LCP, INP and full WCAG conformance remain unverified.

## Screenshots

- [Homepage on desktop](screenshots/homepage-desktop.png)
- [Enterprise page on mobile](screenshots/enterprise-mobile.png)
- [Example listing detail on desktop](screenshots/property-desktop.png)
- [Synthetic agency dashboard on desktop](screenshots/dashboard-desktop.png)

## Remaining work and readiness

| Status | Scope |
|---|---|
| Completed and locally verified | Public evaluation site, combined pricing catalogue, example property discovery, demo request and follow-up, server-mode builds and existing tenant database boundaries |
| Implemented with hosted verification pending | Hosted Auth and email delivery, staff provisioning, authorised migrations and public domain metadata |
| Partial | Inventory editing supports links to photos. Reports support date-filtered summaries over the workspace rows returned by the Supabase API, subject to its configured row limit. Existing administrator and agent roles share records inside the agency. |
| Blocked on deployment decisions | Hosting, approved data location, email sender, backup and restoration evidence, legal review, real-world performance monitoring and approved billing terms |
| Future work | Branch-level permissions and reports, assigned-record-only visibility, private uploads, staged CSV imports and exports, live public inventory, payments and billing entitlements, and full platform operations administration |

**Development-ready and suitable for internal evaluation with synthetic data.** A controlled customer pilot requires the hosted verification and operational safeguards listed above.
