# Architecture

## Frontend
- Next.js App Router
- React and TypeScript
- Tailwind design system
- Responsive marketing and dashboard layouts

## State model
- Organisation-aware data layer stored in browser localStorage for the demo environment
- Top-level workspace state includes organisations, users, properties, CRM records and subscription plans
- Active workspace and active user are derived from current session state

## Security posture
- In the demo environment, workspace selection and access checks are enforced in app logic
- Real production deployment should move to Supabase Auth + Postgres RLS and server-side checks
- Keep credentials out of public client bundles
