# Configuration handoff

## Required environment values for production
- NEXT_PUBLIC_APP_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- APP_CURRENCY
- APP_TIMEZONE

## Development defaults
- Timezone: Africa/Lusaka
- Currency: ZMW
- Billing mode: simulated only
- External notifications: disabled until provider approval

## Public demo requests

Apply `20261121120000_demo_requests.sql` to the intended Supabase environment before enabling demo intake. The application uses the existing server-only service-role key for the submission and staff inbox. Existing workspace roles do not grant access to sales enquiries.

Use your server-side Supabase admin process to set boolean `propertyflow_sales_staff: true` in the Auth app metadata of each approved platform sales account. Sales staff sign in at `/login?next=%2Fstaff%2Fdemo-requests`. Review the inbox as part of the usual sales workflow. Set the metadata flag to false to revoke access. Enquiry assignment, notification delivery and automatic retention are pending. Establish a retention period and review the privacy disclosure before using the form in production.

## Verification and invitation email

For local development use the app origin in `.env.local` and open the app on that same hostname. The local Supabase setup permits the Auth callback for verification and recovery and enables email confirmation. Read local messages in Mailpit on port 54324.

For hosted testing, configure the actual site origin and allow its `/auth/callback` URL with the `next` parameter in Supabase Auth. Install the contents of `supabase/templates/invite.html` as the hosted Invite user template. Use the template with the app-generated invitation redirect URL. Verify the complete email, account bootstrap, team invitation and password recovery flows with the staging SMTP provider before a pilot.
