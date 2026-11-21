# Security model

## Agency workspace

Supabase Auth issues sessions. The application stores them in HTTP-only cookies and uses the Secure attribute on HTTPS deployments. Private requests verify the current user and resolve their active membership on the server. PostgreSQL row-level security limits CRM and inventory access to active members of the records’ organisation. Composite foreign keys prevent associations between records from different organisations.

Workspace administrators can invite agents and change agent access. Invitation acceptance checks the signed-in email, pending status and expiry. Lead reassignment checks the acting administrator and the recipient’s active membership in PostgreSQL as well as in the application workflow. Ordinary agents retain access to shared agency records under the existing membership policies.

## Platform sales inbox

The demo form submits through a validated server action. A honeypot and transactional database caps limit repeated submissions per email and across the inbox. The database serialization keeps concurrent requests within the same cap. The cap applies across all visitors and can delay legitimate requests during a traffic spike.

Both inbox tables enable row-level security and revoke browser-facing database privileges. The server verifies the user's trusted Auth `app_metadata` flag before accessing the inbox with the server-only key. The review function rechecks the staff flag and commits each status, claim or release together with its follow-up history.

## Repository verification and launch dependencies

The local pgTAP suites cover cross-organisation reads and writes, membership and assignment rules, demo table privileges, staff checks and throttling. Browser users and records used in QA are synthetic. Hosted role provisioning, mail delivery, infrastructure-level abuse control, storage policies and backup restoration need separate verification for the selected environment. See [Running PropertyFlow ZM](DEPLOYMENT_GUIDE.md).
