# Architecture

## Public website

Next.js App Router serves the marketing and evaluation pages. React client components handle interactive product previews and example property filters. The public listing catalogue is a static set of labelled example records with local images.

## Agency workspace

Supabase Auth owns accounts and sessions. The dashboard verifies the session and resolves active memberships on the server. Next.js loads agency identity and operational data from PostgreSQL. React uses those results for the workspace UI. Server actions validate and persist edits, and refresh the workspace layout so record views reflect committed data.

## Platform sales inbox

A public Next.js server action validates demo requests and calls a service-role-only function. PostgreSQL applies volume limits and stores contacts and requirements. A server-rendered staff inbox verifies a trusted Auth flag before accessing the database. Review actions persist status, assignment and history in one transaction.

See the [security model](SECURITY_MODEL.md) for permission boundaries and the [transformation report](ENTERPRISE_TRANSFORMATION.md) for evidence and remaining work.
