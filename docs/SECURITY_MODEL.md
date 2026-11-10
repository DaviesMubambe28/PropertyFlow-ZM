# Security model

## Current demo posture
- Passwords are stored in local demo data for development convenience and not suitable for production
- Workspace access is enforced by checking the active organisation in the app state
- Cross-tenant data access is prevented by filtering records to the active org

## Production safeguards to apply next
- Supabase Auth for authentication and session handling
- PostgreSQL row level security for tenant isolation
- Server-side permission checks before writes
- Secure file upload policies and MIME validation
- Rate limits for sensitive actions and audit logs for administrative functions
