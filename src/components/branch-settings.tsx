"use client";

import { useActionState, type ReactNode } from "react";
import { manageBranch } from "@/actions/branches";

type Branch = { id: string; name: string; city: string };
type Member = { branch_id: string; user_id: string; role: string };
type Staff = { id: string; name: string };
type Property = { id: string; title: string; branch_id: string | null; status: string };

const field = "mt-1 w-full rounded-lg border border-line bg-canvas p-2";
const card = "space-y-4 rounded-lg border border-line bg-white p-5";

function BranchForm({ operation, organizationId, submit, children }: {
  operation: string; organizationId: string; submit: string; children: ReactNode;
}) {
  const [message, action, pending] = useActionState(manageBranch, "");
  return (
    <form action={action} className={card}>
      <input type="hidden" name="operation" value={operation} />
      <input type="hidden" name="organizationId" value={organizationId} />
      {children}
      <button type="submit" disabled={pending} className="brand-button-primary min-h-11 rounded-lg px-4 text-sm font-semibold disabled:opacity-60">
        {pending ? "Saving…" : submit}
      </button>
      {message && <p role="status" className="text-sm text-quiet">{message}</p>}
    </form>
  );
}

export function BranchSettings({ organizationId, branches, memberships, staff, properties }: {
  organizationId: string; branches: Branch[]; memberships: Member[]; staff: Staff[]; properties: Property[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-deep">Agency branches</h2>
        <p className="mt-2 text-sm text-quiet">Branch properties and linked activity are visible to branch members and agency administrators. Unassigned records remain shared across the agency.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <BranchForm organizationId={organizationId} operation="create" submit="Create branch">
          <h3 className="font-semibold">New branch</h3>
          <label className="block text-sm">Branch name<input name="name" className={field} required minLength={2} maxLength={120} /></label>
          <label className="block text-sm">City<input name="city" className={field} maxLength={120} /></label>
        </BranchForm>
        {branches.length > 0 && (
          <>
            <BranchForm organizationId={organizationId} operation="member" submit="Save membership">
              <h3 className="font-semibold">Branch membership</h3>
              <label className="block text-sm">Branch<select name="branchId" required className={field}>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
              <label className="block text-sm">Staff member<select name="userId" required className={field}>{staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              <label className="block text-sm">Change<select name="role" className={field}><option value="member">Branch member</option><option value="manager">Branch manager</option><option value="remove">Remove from branch</option></select></label>
            </BranchForm>
            {!!properties.length && (
              <BranchForm organizationId={organizationId} operation="property" submit="Assign property">
                <h3 className="font-semibold">Property assignment</h3>
                <label className="block text-sm">Property<select name="propertyId" required className={field}>
                  {properties.map((property) => <option key={property.id} value={property.id}>{property.title} · {branches.find((branch) => branch.id === property.branch_id)?.name ?? "Agency-wide"}</option>)}
                </select></label>
                <label className="block text-sm">New branch<select name="branchId" className={field} defaultValue="choose">
                  <option value="choose" disabled>Select a branch</option>
                  <option value="">Agency-wide</option>
                  {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                </select></label>
              </BranchForm>
            )}
          </>
        )}
      </div>
      <section className={card}>
        <h3 className="font-semibold">Branch portfolio</h3>
        {branches.length === 0 && <p className="text-sm text-quiet">No branches yet.</p>}
        <ul className="divide-y divide-line">
          {branches.map((branch) => {
            const portfolio = properties.filter((property) => property.branch_id === branch.id);
            const people = memberships.filter((member) => member.branch_id === branch.id)
              .flatMap((member) => staff.filter((person) => person.id === member.user_id).map((person) => ({ ...person, role: member.role })));
            return (
              <li key={branch.id} className="py-3">
                <p className="font-semibold">{branch.name}{branch.city && ` · ${branch.city}`}</p>
                <p className="mt-1 text-sm text-quiet">{portfolio.length} {portfolio.length === 1 ? "property" : "properties"} · {portfolio.filter((property) => property.status === "available").length} available</p>
                <p className="mt-1 text-sm text-quiet">{people.length ? people.map((person) => person.role === "manager" ? `${person.name} (manager)` : person.name).join(", ") : "No active branch members"}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
