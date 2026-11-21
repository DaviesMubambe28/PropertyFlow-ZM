# Enterprise implementation checkpoint

Work began on a clean tree at `ff3909f`, which already included the cobalt redesign, agency workflows, and the demo intake and staff inbox. This implementation uses Next.js 16.4.6, React 19.3, Supabase, and PostgreSQL.

## Visual and workflow changes

- The enterprise page links to a guided evaluation and to the demo form. The home tour now covers the overview, properties, contacts, pipeline, activities, deals, and reports. Its sample follow-up is isolated from agency data.
- The workspace portfolio provides a publish and withdraw control for owners. The public directory reads only published listings and supports the existing filters. Detail pages resolve the public ID on the server, so links do not depend on browser storage. Missing and failed photos have a fallback. Unpublished and invalid IDs show the application’s not-found page.
- The dashboard billing screen links to the same proposed plans used by the public site. It shows no synthetic subscription or conflicting prices.
- The demo intake returns a failure message when the anti-spam field rejects the request. The existing storage, database-backed deduplication, and sales staff inbox are reused.

## Database and security

Apply `20261122120000_public_property_listings.sql` in a configured local or staging environment before testing publication. It creates a public snapshot table, a chronological index, a read-only policy, an administrator-only mutation, and a trigger that withdraws listings when their public fields change or the property becomes unavailable. The publish operation locks the source record and verifies the version reviewed by the owner. Workspace owner contacts, assignments, and notes are excluded. Administrators should review the selected description, location and photo before publication. Public links are disabled immediately when withdrawn on the database side.

## Implementation files

The directory and detail routes are under `src/app/properties/`. The snapshot reader is in `src/lib/public-listing-data.ts`. The workspace control and server action are in `src/components/publication-controls.tsx` and `src/actions/publication.ts`. Database regression coverage lives in `supabase/tests/public_property_listings.test.sql`.

## Readiness and remaining work

- **Completed and verified in PostgreSQL** — explicit publishing, anonymous snapshot reads, denial across agency roles, stale approval protection, and withdrawal after edits and sales.
- **Implemented** — property photo fallbacks, server-backed detail routing, seven-module sample tour, enterprise evaluation copy, consistent pricing links and truthful demo rejection feedback.
- **Partially completed** — public photo display supports one reviewed HTTPS image. Private photo and document uploads and multi-photo galleries remain open. Public search and filtering cover the newest 100 published properties.
- **Not started in this checkpoint** — branch management and roles, CSV imports, expanded team/viewing workflows, subscription entitlements, reporting exports and broader enterprise workflow changes.
- **Requires a configured environment** — real email delivery, full signed-in browser journeys, live demo persistence, hosted migration rollout and production verification.

Local development testing can proceed. Internal testing requires applying the migration on the intended test database and signing in with test agency accounts. Controlled pilot and production readiness have not been established.

## Verification evidence

- `npm run lint` and `git diff --check` passed.
- `npm run test:run` passed 71 tests across 21 files.
- `npm run build` passed with local placeholder Supabase configuration.
- PostgreSQL passed 17 workspace identity checks, 21 operational checks, and 13 new publication checks. The migration and test fixtures ran inside a rolled-back transaction.
- Chromium at desktop and mobile widths displayed the enterprise and contact pages, completed the isolated sample follow-up, and showed the public directory outage and invalid listing states. Desktop and mobile enterprise screenshots were captured during verification.
- A working Supabase HTTP API was unavailable for this run. The browser checks did not exercise signed-in publishing or live demo submission.
