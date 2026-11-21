# Enterprise agency workflows

This continuation builds on the local public-listings changes and the cobalt redesign at `ff3909f`. It extends the existing Next.js, React, Tailwind, Supabase and PostgreSQL application.

## Changes

| Workflow | Implementation |
| --- | --- |
| Portfolio | Public publication with an explicit administrator review, server-backed listing IDs and missing-photo fallback. The internal portfolio supports sorting and archiving. Archived records remain available through the status filter. |
| Branches | Administrators create branches, assign staff and appoint one manager per branch. Properties can be assigned to a branch or shared across the agency. Linked leads, deals, viewings, tasks and lead history follow the property’s access rules. Existing contacts and unlinked records remain agency-wide. |
| Staff | Agency administrators can change active member roles and reassign properties, leads, tasks, viewings and deals. Reassignment checks active agency membership and branch access. Lead reassignment records an interaction. |
| Access history | Agency administrators can review up to 100 recent role changes, branch access grants/removals and property branch changes. The last-administrator guard prevents removal and serializes competing changes. |
| CSV import | Administrators can download templates, map columns, inspect preview rows, review row errors and confirm batches of up to 100 properties or contacts. Properties enter as drafts. Duplicate records are skipped and existing data is retained. |
| Private property files | Staff with property access can upload PDF, JPEG, PNG or WebP files up to 750 KiB and request authenticated downloads. The bucket is private. Download links expire after 60 seconds. |
| CRM and activities | Search covers the active agency’s properties, contacts and leads. Contacts show preferences and linked leads. Lead views support search, board and table layouts. Viewing dates use Lusaka time, appointments can be rescheduled, and open tasks show an overdue indicator. Stage and status forms report errors. |
| Deals and reports | Duplicate completion for the same lead, property and transaction type is rejected. The report uses a date range and current branch assignment, and exports aggregate counts and ZMW completed sale value to CSV. It excludes rental amounts from sale value. |
| Authentication | Email confirmation and recovery use the configured app origin. Invitation links open the existing agency invitation after verification. Workspace sessions use HTTP-only cookies with SameSite=Lax and the Secure flag on HTTPS. |
| Commercial pages | The enterprise tour and evaluation workflow retain labelled sample data. Pricing retains K150, K350 and an enterprise quotation. Demo requests support evaluation, pilot, won and lost stages and retain staff follow-up history. |

## Migrations and access

The additive migrations under `supabase/migrations/` cover public listings, CSV imports, branch RLS, private storage, demo sales stages, access history, work reassignment, archived-property status and deal history. No hosted database was modified. SQL tests validate anonymous, staff, administrator and cross-agency access against database policies directly.

The new storage path uses the same property policies as the workspace. Files remain private and separate from public listing photos. File signature validation checks the expected header; it does not establish malware-free content. A controlled pilot needs a decision on scanning, retention and deletion procedures.

For review under [Zambia’s Data Protection Act, 2021](https://www.parliament.gov.zm/node/8853), confirm the lawful basis for client and prospect data, privacy notices, retention and deletion, handling of data-subject requests, incident response, vendor responsibilities and cross-border hosting arrangements with qualified local counsel. This checkpoint provides no compliance certification.

## Remaining coverage and release status

Development and isolated internal testing are supported. Before a controlled pilot, repeat email and account recovery with staging SMTP, define storage retention and operational monitoring, and confirm a staged rollout. Production readiness has not been established.

Branch management currently grants property-linked access and reports to branch members. Broader delegated manager permissions, branch-specific contact ownership, full workflow history for tasks and deals, multi-image public galleries, additional CSV record types, live notifications, commercial terms and billing still need work. The current upload limit and report/portfolio queries should be validated against representative data volumes.

## Verification evidence

- `npm run lint`, `npx tsc --noEmit`, `git diff --check` and `npm run build` passed. The production build used the isolated local Supabase configuration.
- Vitest passed 75 tests across 23 files. `npx supabase test db` passed 84 assertions across six files. `npm audit --omit=dev` reported zero known production dependency vulnerabilities at test time.
- Chromium with isolated Supabase and Mailpit verified account confirmation, workspace bootstrap, agent invitation acceptance, mobile sign-out, password recovery and HTTP-only cookies. Invitation verification used the token from the captured local message with the application's template callback structure.
- Signed-in browser checks verified CSV preview and persistence, branch creation and property assignment, branch reports and CSV download, explicit publishing and the public missing-photo state, private file upload and signed download, demo persistence and Pilot-stage updates, contact/lead creation, lead-stage changes, Lusaka-time viewing rescheduling, and deal completion with automatic unpublishing.
- A second isolated agency could not read the private property. Database suites also verified branch visibility, protected file access, last-administrator safeguards, assignment history, access history restrictions, and duplicate-deal protection.
- Chromium captures showed the branch administration desktop screen and public listing detail on mobile using synthetic records.

Production DNS and deployment, hosted SMTP and templates, staging load tests, full accessibility conformance, data retention, and legal sign-off remain outside this local verification.
