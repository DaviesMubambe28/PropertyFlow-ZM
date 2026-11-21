"use client";

import { useState } from "react";
import { Building2, CalendarDays, ChartNoAxesCombined, ContactRound, LayoutDashboard, Handshake, UsersRound } from "lucide-react";

const screens = [
  {
    label: "Portfolio", icon: Building2, title: "Property portfolio",
    description: "Track availability, pricing and the agent responsible for each property.",
    columns: ["Property", "Asking price", "Status"],
    rows: [
      ["Three-bedroom house, Kabulonga", "K1,850,000", "Available"],
      ["Two-bedroom flat, Roma", "K9,500 / month", "Under offer"],
      ["Commercial plot, Ndola", "K720,000", "Available"],
    ],
  },
  {
    label: "Overview", icon: LayoutDashboard, title: "Agency overview",
    description: "See the portfolio and the next actions waiting for your team.",
    columns: ["Area", "Sample total", "Next step"],
    rows: [
      ["Available properties", "2", "Review listing details"],
      ["Scheduled viewings", "1", "Confirm the appointment"],
      ["Pending follow-ups", "1", "Call about Roma lease"],
    ],
  },
  {
    label: "Contacts", icon: ContactRound, title: "Customer CRM",
    description: "Bring customer requirements and enquiry history together.",
    columns: ["Sample contact", "Looking for", "Preferred location"],
    rows: [
      ["Nandi K.", "Three-bedroom house", "Kabulonga"],
      ["Mwaka Z.", "Two-bedroom rental", "Roma"],
      ["Chanda P.", "Commercial plot", "Ndola"],
    ],
  },
  {
    label: "Pipeline", icon: UsersRound, title: "Lead pipeline",
    description: "Link enquiries to properties and keep a record of each conversation.",
    columns: ["Enquiry", "Source", "Stage"],
    rows: [
      ["Kabulonga house enquiry", "WhatsApp", "New"],
      ["Roma flat enquiry", "Referral", "Viewing"],
      ["Ndola commercial enquiry", "Phone", "Negotiating"],
    ],
  },
  {
    label: "Activities", icon: CalendarDays, title: "Viewings and follow-ups",
    description: "Schedule an appointment, assign the next step and record the outcome.",
    columns: ["Activity", "Due", "Status"],
    rows: [
      ["Kabulonga property viewing", "Tuesday, 10:30", "Scheduled"],
      ["Call about Roma lease", "Wednesday", "Pending"],
      ["Share Ndola property details", "Thursday", "Completed"],
    ],
  },
  {
    label: "Deals", icon: Handshake, title: "Agency deals",
    description: "Follow sale and rental transactions through to completion.",
    columns: ["Transaction", "Amount", "Status"],
    rows: [
      ["Roma flat lease", "K9,500 / month", "Open"],
      ["Ndola commercial sale", "K690,000", "Open"],
    ],
  },
  {
    label: "Reports", icon: ChartNoAxesCombined, title: "Agency reporting",
    description: "Review property availability, operational activity and completed transactions from workspace records.",
    columns: ["Record", "Period", "Example total"],
    rows: [
      ["Available properties", "Current", "2"],
      ["Scheduled viewings", "This week", "1"],
      ["Completed deals", "This month", "0"],
    ],
  },
];

export function ProductTour() {
  const [selected, setSelected] = useState(0);
  const screen = screens[selected];
  const [followUpComplete, setFollowUpComplete] = useState(false);

  return (
    <section aria-label="Interactive product preview" className="min-w-0 overflow-hidden rounded-lg border border-line bg-white text-deep">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold">Agency workspace</span>
        <span className="rounded bg-tint px-2 py-1 text-xs font-medium text-deep">Sample data</span>
      </div>
      <div aria-label="Choose a workflow" role="group" className="grid grid-cols-2 gap-1 border-b border-line bg-tint p-2 sm:grid-cols-4 xl:grid-cols-7">
        {screens.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium text-ink hover:bg-white aria-pressed:bg-brand aria-pressed:text-white"
          >
            <Icon size={15} aria-hidden="true" />{label}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-6" aria-live="polite">
        <h2 className="text-lg font-semibold">{screen.title}</h2>
        <p className="mt-1 text-sm leading-6 text-quiet">{screen.description}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs leading-5 sm:text-sm">
            <thead className="bg-tint text-quiet">
              <tr>{screen.columns.map((column) => <th scope="col" className="p-2.5 font-medium" key={column}>{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {screen.rows.map(([name, detail, status]) => (
                <tr key={name}>
                  <th scope="row" className="p-2.5 font-medium">{name}</th>
                  <td className="p-2.5">{detail}</td>
                  <td className="p-2.5 font-medium text-deep">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {screen.label === "Pipeline" && (
          <aside className="mt-5 grid gap-3 rounded-lg border border-line bg-canvas p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-sm font-semibold">Kabulonga house enquiry</h3>
              <p className="mt-1 text-sm text-quiet">Nandi K. enquired by WhatsApp. Agent Leya added a note and scheduled a call for Tuesday.</p>
              <p className="mt-2 text-sm font-medium" role="status">{followUpComplete ? "Sample follow-up completed" : "Next action: call to confirm viewing availability"}</p>
            </div>
            <button type="button" onClick={() => setFollowUpComplete(!followUpComplete)} className="brand-button-secondary min-h-11 self-center rounded-lg px-3 text-sm font-semibold">
              {followUpComplete ? "Reset sample follow-up" : "Complete sample follow-up"}
            </button>
          </aside>
        )}
      </div>
    </section>
  );
}
