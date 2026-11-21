"use client";

import { useState } from "react";
import { Building2, CalendarDays, ChartNoAxesCombined, UsersRound } from "lucide-react";

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

  return (
    <section aria-label="Interactive product preview" className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-[#142A43] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold">Agency workspace</span>
        <span className="rounded bg-teal-50 px-2 py-1 text-xs font-medium text-teal-900">Sample data</span>
      </div>
      <div aria-label="Choose a workflow" role="group" className="grid grid-cols-2 gap-1 border-b border-slate-200 bg-slate-50 p-2 min-[480px]:grid-cols-4">
        {screens.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-700 hover:bg-white aria-pressed:bg-[#142A43] aria-pressed:text-white"
          >
            <Icon size={15} aria-hidden="true" />{label}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-6" aria-live="polite">
        <h2 className="text-lg font-semibold">{screen.title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{screen.description}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs leading-5 sm:text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>{screen.columns.map((column) => <th scope="col" className="p-2.5 font-medium" key={column}>{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {screen.rows.map(([name, detail, status]) => (
                <tr key={name}>
                  <th scope="row" className="p-2.5 font-medium">{name}</th>
                  <td className="p-2.5">{detail}</td>
                  <td className="p-2.5 font-medium text-teal-900">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
