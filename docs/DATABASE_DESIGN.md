# Database design

The project uses a workspace-first data model with these core entities:
- organizations
- users
- properties
- contacts
- leads
- viewings
- tasks
- deals
- subscription plans

For a production implementation, this model should map onto PostgreSQL and Supabase tables with UUIDs, indexes and RLS policies. The current implementation uses a local demo store that mirrors the same shape so the workflow remains testable in a local app environment.

## Important constraints
- Each record belongs to a tenant organisation
- Lead and property actions must respect the active workspace
- Financial values should be stored in integer minor units or a decimal-safe format in production
- All data mutation paths should preserve an audit trail
