"use client";

import { useState } from "react";
import { Activity, Building2, ChartNoAxesColumnIncreasing, Columns3, LayoutDashboard, Users } from "lucide-react";

const views = [
  { title: "Overview", icon: LayoutDashboard, heading: "Agency overview", description: "Track the workload across your agency.", columns: ["Worklist", "Assigned to", "Status"], rows: [["Kabulonga family home", "Chanda M.", "Available"], ["Confirm Leopards Hill viewing", "Mwansa K.", "Due today"], ["Chilenje apartment enquiry", "Chanda M.", "Negotiating"]] },
  { title: "Properties", icon: Building2, heading: "Property inventory", description: "Find listings by location, property type and availability.", columns: ["Listing", "Location", "Status"], rows: [["Kabulonga family home", "Lusaka", "Available"], ["Leopards Hill office", "Lusaka", "Reserved"], ["Chilenje apartment", "Lusaka", "Under offer"]] },
  { title: "Leads", icon: Users, heading: "Lead ownership", description: "Keep enquiries with their assigned agent and follow-up history.", columns: ["Enquiry", "Assigned to", "Stage"], rows: [["Kabulonga family home", "Chanda M.", "New"], ["Leopards Hill office", "Mwansa K.", "Viewing"], ["Chilenje apartment", "Chanda M.", "Negotiating"]] },
  { title: "Pipeline", icon: Columns3, heading: "Sales pipeline", description: "Follow progress from enquiry through negotiation and closing.", columns: ["Deal", "Type", "Stage"], rows: [["Kabulonga family home", "Sale", "New"], ["Leopards Hill office", "Rental", "Viewing"], ["Chilenje apartment", "Rental", "Negotiating"]] },
  { title: "Activities", icon: Activity, heading: "Viewings and follow-ups", description: "Know what is due and capture viewing outcomes.", columns: ["Activity", "Assigned to", "Status"], rows: [["Confirm Leopards Hill viewing", "Mwansa K.", "Due today"], ["Call Kabulonga buyer", "Chanda M.", "Pending"], ["Record Chilenje feedback", "Chanda M.", "Completed"]] },
  { title: "Reports", icon: ChartNoAxesColumnIncreasing, heading: "Operational reports", description: "Review inventory, lead progress and completed transactions.", columns: ["Area", "Metric", "Sample"], rows: [["Portfolio", "Available listings", "12"], ["Sales", "Active leads", "8"], ["Activity", "Pending tasks", "4"]] },
];

const stages = [{ label: "New", amount: 3 }, { label: "Contacted", amount: 2 }, { label: "Viewing", amount: 1 }, { label: "Negotiating", amount: 2 }];

export function ProductTour() {
  const [index, setIndex] = useState(0);
  const view = views[index];

  return (
    <section id="product-tour" aria-label="Interactive product preview" className="overflow-hidden rounded-2xl border border-[#cddbe3] bg-white text-forest shadow-[0_24px_80px_#03142440]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-[#f5f8fa] px-4 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-xs font-semibold sm:text-sm"><Building2 size={16} aria-hidden="true" className="text-teal-700" /> PropertyFlow Workspace</p>
        <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-forest">Sample data</span>
      </div>
      <div className="grid lg:grid-cols-[158px_minmax(0,1fr)]">
        <div role="group" aria-label="Preview views" className="flex flex-wrap gap-1 border-b border-line bg-[#f5f8fa] p-2 lg:block lg:space-y-1 lg:border-r lg:border-b-0 lg:p-3">
          {views.map(({ title, icon: Icon }, item) => (
            <button type="button" key={title} onClick={() => setIndex(item)} aria-pressed={index === item} className="flex min-h-10 items-center gap-2 rounded-md px-2.5 text-xs font-medium text-ink hover:bg-slate-200 aria-pressed:bg-[#deeeef] aria-pressed:text-[#06585c] lg:w-full">
              <Icon size={15} aria-hidden="true" />{title}
            </button>
          ))}
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div aria-live="polite">
            <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">{view.heading}</h2>
            <p className="mt-1 text-xs text-muted-ink sm:text-sm">{view.description}</p>
          </div>
          {index === 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.1fr]">
              <dl className="grid grid-cols-2 gap-2">
                {[["Active properties", 12], ["Open leads", 8], ["Open deals", 3], ["Follow-ups due", 4]].map(([label, number]) => (
                  <div key={label} className="rounded-lg border border-line p-2 sm:p-3">
                    <dt className="text-[11px] font-medium text-muted-ink">{label}</dt>
                    <dd className="mt-0.5 text-xl font-semibold tabular-nums">{number}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-lg border border-line p-3">
                <h3 className="text-xs font-semibold">Open leads by stage</h3>
                <ul className="mt-2 space-y-1.5">
                  {stages.map(({ label, amount }) => <li key={label} className="grid grid-cols-[68px_1fr_12px] items-center gap-2 text-[10px] text-ink">
                    {label}<div className="h-1.5 rounded-full bg-soft"><div aria-hidden="true" className="h-full rounded-full bg-[#087f85]" style={{ width: `${amount / 3 * 100}%` }} /></div><span>{amount}</span>
                  </li>)}
                </ul>
              </div>
            </div>
          )}
          <table className="mt-4 w-full table-fixed text-left text-[11px] sm:text-xs">
            <caption className="sr-only">{view.heading} sample records</caption>
            <thead className="border-y border-line bg-canvas text-muted-ink"><tr>{view.columns.map((label, col) => <th key={label} scope="col" className={col === 0 ? "w-[49%] p-2 font-semibold" : "p-2 font-semibold"}>{label}</th>)}</tr></thead>
            <tbody>{view.rows.map(([name, owner, status]) => (
              <tr key={name} className="border-b border-line"><th scope="row" className="break-words p-2 font-medium">{name}</th><td className="break-words p-2 text-muted-ink">{owner}</td><td className="break-words p-2 font-medium text-pine">{status}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
