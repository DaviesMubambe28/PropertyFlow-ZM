# Deployment guide

## Local development
1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open the app at http://localhost:3000
4. Use the seeded credentials to sign in and review the workspace flows

## Production readiness
- move the local data store to Supabase/Postgres
- add real auth and RLS policies
- configure env variables and hosting provider
- verify billing, storage and backup policies before release
