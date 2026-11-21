import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

function localOrigin(value) {
  const url = new URL(value);
  assert(["127.0.0.1", "localhost", "[::1]"].includes(url.hostname), "Use a loopback URL for synthetic browser testing.");
  return url.origin;
}

const base = localOrigin(process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000");
const api = localOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321");
const mail = localOrigin(process.env.MAILPIT_URL ?? "http://127.0.0.1:54324");
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
assert(service, "Set the local-only Supabase service role key before running browser tests.");
const stamp = Date.now();
const owner = `owner-${stamp}@example.com`;
const staff = `staff-${stamp}@example.com`;
const password = "QaWorkspace!2345";
const screenshotDir = process.env.BROWSER_SCREENSHOT_DIR;
const errors = [];
const route = (path) => new URL(path, base).href;

async function login(page, email, next, secret = password) {
  await page.goto(route(`/login?next=${encodeURIComponent(next)}`));
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(route(next), { timeout: 10000 });
}

async function mailLink(email, prefix) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const { messages } = await (await fetch(`${mail}/api/v1/messages`)).json();
    const message = messages.find((item) => item.To.some((to) => to.Address === email) && prefix.test(item.Subject));
    if (message) {
      const contents = await (await fetch(`${mail}/api/v1/message/${message.ID}`)).json();
      const link = contents.HTML.match(/href="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
      assert(link, "expected verification link in synthetic mail");
      localOrigin(link);
      return link;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Mail did not arrive for ${prefix.source}`);
}

(async () => {
  if (screenshotDir) mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(10000);
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.getByRole("heading", { name: "Agency overview", exact: true }).waitFor();
    await page.getByRole("button", { name: "Reports", exact: true }).click();
    await page.getByRole("heading", { name: "Operational reports", exact: true }).waitFor();
    await page.getByRole("button", { name: "Overview", exact: true }).click();
    if (screenshotDir) await page.screenshot({ path: join(screenshotDir, "homepage-desktop.png") });
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1, hasTouch: true });
    await mobile.goto(route("/enterprise"));
    await mobile.getByRole("heading", { name: "See how your agency operates across every deal." }).waitFor();
    assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile horizontal overflow");
    if (screenshotDir) await mobile.screenshot({ path: join(screenshotDir, "enterprise-mobile.png"), fullPage: true });
    await mobile.getByRole("button", { name: "Open menu" }).click();
    assert(await mobile.getByRole("navigation", { name: "Mobile navigation" }).isVisible());
    await page.goto(route("/properties"));
    assert.equal(await page.getByRole("article").count(), 3);
    await page.getByRole("link", { name: "View example listing: Mapepe Family House" }).click();
    await page.getByRole("heading", { name: "Mapepe Family House" }).waitFor();
    await page.waitForFunction(() => document.querySelector("main img")?.naturalWidth > 0);
    if (screenshotDir) await page.screenshot({ path: join(screenshotDir, "property-desktop.png") });
    const missing = await page.goto(route("/properties/unknown"));
    await page.getByRole("heading", { name: "Page unavailable" }).waitFor();
    assert.equal(missing.status(), 404);
    console.log("PASS public tour, mobile navigation, local imagery, and unknown property (HTTP 404)");

    await page.goto(route("/enterprise"));
    await page.getByRole("link", { name: "Request an enterprise demo" }).click();
    await page.getByLabel("Full name").fill("Synthetic Prospect");
    await page.getByLabel("Company", { exact: true }).fill(`Browser Agency ${stamp}`);
    await page.getByLabel("Business email").fill(`prospect-${stamp}@example.com`);
    await page.getByLabel("Team size").selectOption("6–20");
    await page.locator("main").getByRole("button", { name: "Request a demo" }).click();
    await page.getByRole("heading", { name: "Demo request received" }).waitFor({ timeout: 10000 });

    const create = await fetch(`${api}/auth/v1/admin/users`, {
      method: "POST", headers: { apikey: service, authorization: `Bearer ${service}`, "content-type": "application/json" },
      body: JSON.stringify({ email: staff, password, email_confirm: true, app_metadata: { enterprise_demo_staff: true } }),
    });
    assert(create.ok, "synthetic staff creation must succeed");
    await login(page, staff, "/staff/demo-requests");
    const request = page.getByRole("article").filter({ hasText: `Browser Agency ${stamp}` });
    await request.getByLabel("Status").selectOption("contacted");
    await request.getByLabel("Assignment").selectOption("self");
    await request.getByLabel("Follow-up note").fill("Synthetic follow-up note");
    await request.getByRole("button", { name: "Save follow-up" }).click();
    await request.getByText("Follow-up saved.").waitFor();
    await page.reload();
    await request.getByText("Assigned to you").waitFor();
    await request.getByText("Follow-up history").click();
    await request.getByText("Synthetic follow-up note").waitFor();
    console.log("PASS public submission, staff login, assignment, follow-up, and persisted history");

    const agency = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    agency.setDefaultTimeout(10000);
    agency.on("pageerror", (error) => errors.push(error.message));
    await agency.goto(route("/register"));
    await agency.getByLabel("Full name").fill("Synthetic Owner");
    await agency.getByLabel("Agency name").fill("QA Agency");
    await agency.getByLabel("Agency email").fill(owner);
    await agency.getByLabel("Email address").fill(owner);
    await agency.getByLabel("Password", { exact: true }).fill(password);
    await agency.getByLabel("Confirm password", { exact: true }).fill(password);
    await agency.locator("main form button[type=submit]").click();
    const confirmation = await mailLink(owner, /^Confirm/);
    await agency.goto(confirmation);
    await agency.waitForURL(route("/dashboard"), { timeout: 10000 });
    await agency.getByRole("heading", { name: "QA Agency", exact: true }).waitFor();
    console.log("PASS agency registration, email verification, workspace creation, and dashboard");

    if (screenshotDir) await agency.screenshot({ path: join(screenshotDir, "dashboard-desktop.png") });
    await agency.getByRole("link", { name: "Add a property" }).click();
    await agency.getByLabel("Property title").fill("QA Kabulonga Home");
    await agency.getByLabel("Property type").fill("House");
    await agency.getByLabel("Price (ZMW)").fill("850000");
    await agency.getByLabel("Location", { exact: true }).fill("Lusaka");
    await agency.getByRole("button", { name: "Save property" }).click();
    await agency.getByRole("link", { name: "Edit QA Kabulonga Home" }).waitFor();
    await agency.getByRole("link", { name: "Edit QA Kabulonga Home" }).click();
    await agency.getByRole("heading", { name: "Edit property", exact: true }).waitFor();
    await agency.getByLabel("Property title").fill("QA Updated Home");
    await agency.getByRole("button", { name: "Save property" }).click();
    await agency.getByText("Property updated.").waitFor();
    await agency.getByLabel("Search portfolio").fill("Updated");
    await agency.getByRole("link", { name: "Edit QA Updated Home" }).waitFor();
    await agency.goto(route("/dashboard"));
    await agency.getByRole("link", { name: /Available listings.*1/ }).click();
    await agency.getByRole("heading", { name: "Available properties" }).waitFor();
    await agency.getByRole("link", { name: "Edit QA Updated Home" }).waitFor();
    const denied = await agency.goto(route("/staff/demo-requests"));
    await agency.getByRole("heading", { name: "Page unavailable" }).waitFor();
    console.log("PASS property creation, editing, search, filtered metric, and workspace-member staff denial (HTTP " + denied.status() + ")");

    const agentEmail = `agent-${stamp}@example.com`;
    await agency.goto(route("/dashboard/settings/team"));
    await agency.getByLabel("Agent email").fill(agentEmail);
    await agency.getByRole("button", { name: "Create invitation" }).click();
    await agency.getByText("Invitation created. It expires in seven days.").waitFor();
    const agent = await browser.newPage();
    agent.setDefaultTimeout(10000);
    await agent.goto(await mailLink(agentEmail, /invited/i));
    await agent.getByRole("button", { name: "Accept invitation" }).click();
    await agent.waitForURL(route("/dashboard"), { timeout: 10000 });
    await agent.getByRole("heading", { name: "QA Agency", exact: true }).waitFor();
    await agent.goto(route("/dashboard/settings/team"));
    await agent.getByText("Only an agency administrator can manage the team.").waitFor();
    console.log("PASS team invitation email, token verification, acceptance and agent permissions");

    await agency.goto(route("/dashboard/contacts"));
    await agency.getByLabel("Full name").fill("QA Buyer");
    await agency.getByLabel("Email", { exact: true }).fill(`buyer-${stamp}@example.com`);
    await agency.getByLabel("Phone", { exact: true }).fill("+260 977 123456");
    await agency.getByRole("button", { name: "Add contact" }).click();
    await agency.getByText("QA Buyer", { exact: true }).waitFor();
    await agency.goto(route("/dashboard/pipeline"));
    await agency.getByLabel("Lead title").fill("QA Sale enquiry");
    await agency.locator("#lead-form select[name=contactId]").selectOption({ label: "QA Buyer" });
    await agency.locator("#lead-form select[name=propertyId]").selectOption({ label: "QA Updated Home" });
    await agency.getByLabel("Estimated value (ZMW)").fill("850000");
    await agency.getByRole("button", { name: "Add lead" }).click();
    await agency.getByLabel("Stage for QA Sale enquiry").waitFor();
    await agency.getByText("Assign lead", { exact: true }).click();
    await agency.getByLabel("Team member").selectOption({ label: `agent-${stamp}` });
    await agency.getByRole("button", { name: "Save assignment" }).click();
    await agency.getByText(`Assigned to agent-${stamp}`).waitFor();
    await agency.getByLabel("Stage for QA Sale enquiry").selectOption("contacted");
    await agency.getByText(`Assigned to agent-${stamp}`).waitFor();
    await agency.locator("#lead-form ~ div form:has(button:text-is('Record interaction')) select[name=leadId]").selectOption({ label: "QA Sale enquiry" });
    await agency.getByLabel("Summary").fill("QA call confirmed a viewing.");
    await agency.getByRole("button", { name: "Record interaction" }).click();
    await agency.getByText("QA call confirmed a viewing.").waitFor();
    await agency.goto(route("/dashboard/activities"));
    await agency.getByLabel("Title", { exact: true }).fill("QA Follow-up");
    await agency.locator('input[name="dueAt"]').fill("2026-12-01T10:30");
    await agency.getByRole("button", { name: "Create task", exact: true }).click();
    await agency.getByText("QA Follow-up", { exact: true }).waitFor();
    const dealForm = agency.locator("form").filter({ has: agency.getByRole("heading", { name: "Create deal", exact: true }) });
    await dealForm.locator("select[name=leadId]").selectOption({ label: "QA Sale enquiry" });
    await dealForm.locator("select[name=propertyId]").selectOption({ label: "QA Updated Home" });
    await dealForm.getByLabel("Client name").fill("QA Sale");
    await dealForm.getByLabel("Agreed amount (ZMW)").fill("800000");
    await dealForm.getByLabel("Closing date").fill("2026-12-01");
    await dealForm.getByRole("button", { name: "Create deal" }).click();
    await agency.getByLabel("Status for QA Sale").selectOption("completed");
    await agency.getByText("Deal created.").waitFor();
    await agency.goto(route("/dashboard/reports"));
    await agency.getByRole("heading", { name: "Operational reports" }).waitFor();
    const reportTotal = agency.getByText("Completed sale value (ZMW)", { exact: true }).locator("..");
    await reportTotal.getByText(/800,000/).waitFor();
    await agency.getByLabel("Deal completion from").fill("2026-12-01");
    await agency.getByLabel("Through").fill("2026-12-01");
    await reportTotal.getByText(/800,000/).waitFor();
    await agency.getByLabel("Deal completion from").fill("2026-12-02");
    await agency.getByLabel("Through").fill("2026-12-05");
    await reportTotal.getByText(/^(?:ZMW|K)\s*0$/).waitFor();
    await agency.getByLabel("Deal completion from").fill("2026-12-01");
    await agency.getByLabel("Through").fill("2026-11-01");
    await agency.getByText("Choose an end date on or after the start date.").waitFor();
    console.log("PASS contact, lead, assignment, stage, interaction, follow-up and deal reporting with date filters");
    if (screenshotDir) {
      await agency.goto(route("/dashboard"));
      await agency.getByText("QA Follow-up", { exact: true }).waitFor();
      await agency.screenshot({ path: join(screenshotDir, "dashboard-desktop.png") });
    }

    const recovery = await browser.newPage();
    recovery.setDefaultTimeout(10000);
    await recovery.goto(route("/forgot-password"));
    await recovery.getByLabel("Email address").fill(owner);
    await recovery.getByRole("button", { name: "Send reset link" }).click();
    const resetLink = await mailLink(owner, /^Reset/);
    await recovery.goto(resetLink);
    await recovery.getByLabel("New password", { exact: true }).fill("QaWorkspace!6789");
    await recovery.getByLabel("Confirm new password", { exact: true }).fill("QaWorkspace!6789");
    await recovery.locator("main form button").last().click();
    await recovery.getByText("Your password has been updated.").waitFor();
    await login(recovery, owner, "/dashboard", "QaWorkspace!6789");
    console.log("PASS password reset email, update, and sign-in with replacement password");
    assert.deepEqual(errors, [], "Unexpected browser runtime errors");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
