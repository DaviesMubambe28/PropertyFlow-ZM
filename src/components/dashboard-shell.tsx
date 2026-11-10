"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  Briefcase,
  ContactRound,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useAppContext } from "@/components/app-provider";
import { getUserOrganizations } from "@/lib/tenant";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/contacts", label: "Contacts", icon: ContactRound },
  { href: "/dashboard/pipeline", label: "Pipeline", icon: FolderKanban },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: Briefcase },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, activeOrg, signOut, state, switchOrganization } = useAppContext();

  const userOrganizations = currentUser
    ? currentUser.role === "super_admin"
      ? state.organizations
      : getUserOrganizations(state, currentUser.id)
    : [];
  const visibleNavItems = navItems.filter((item) => {
    if (item.href === "/dashboard/admin") return currentUser?.role === "super_admin";
    if (item.href === "/dashboard/pipeline" || item.href === "/dashboard/reports") {
      return currentUser?.role !== "landlord";
    }
    if (item.href === "/dashboard/subscriptions") {
      return currentUser?.role === "owner"
        || currentUser?.role === "staff"
        || currentUser?.role === "super_admin"
        || (currentUser?.role === "agent" && activeOrg?.type === "independent_agent");
    }
    return true;
  });
  const activeNavItem = visibleNavItems.find((item) => item.href === pathname);

  if (!currentUser || !activeOrg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6">
        <div className="max-w-md rounded-3xl border border-[#E5EAF0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#17212F]">Access restricted</h1>
          <p className="mt-3 text-[#667085]">Sign in to access your workspace.</p>
          <Link href="/login" className="brand-button-primary mt-6 inline-flex rounded-full px-4 py-2 text-sm font-medium text-white">
            Continue to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-[#E5EAF0] bg-[#0B192A] p-6 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142A43] text-white ring-1 ring-white/10">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold">PropertyFlow ZM</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Active organisation</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">{activeOrg.name}</p>
              <p className="text-xs text-slate-300">{activeOrg.type}</p>
            </div>
            <UserCog className="h-4 w-4 text-slate-300" />
          </div>
          {userOrganizations.length > 1 ? (
            <select
              aria-label="Switch organization"
              className="mt-3 w-full rounded-lg border border-white/10 bg-[#142A43] px-2 py-2 text-sm text-white"
              value={activeOrg.id}
              onChange={(event) => switchOrganization(event.target.value)}
            >
              {userOrganizations.map((organization) => (
                <option key={organization.id} value={organization.id} className="bg-[#142A43] text-white">
                  {organization.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-3 rounded-lg border border-white/10 bg-[#142A43]/70 px-2 py-2 text-xs text-slate-200">
              {currentUser.role === "super_admin" ? "All workspaces" : "Your workspace"}
            </p>
          )}
        </div>

        <nav className="mt-8 space-y-2">
          {visibleNavItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-[#142A43] text-white ring-1 ring-white/10" : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="mt-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-[#E5EAF0] bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#667085]">
                {activeNavItem?.label ?? "Workspace"} <span className="px-1 text-[#C2CBD4]">/</span> {currentUser.role.replace("_", " ")}
              </p>
              <h1 className="mt-1 text-xl font-semibold text-[#17212F] sm:text-2xl">{activeOrg.name}</h1>
            </div>
            <div className="max-w-[45%] truncate rounded-full bg-[#0B192A] px-3 py-2 text-xs font-medium text-white shadow-sm sm:max-w-none sm:text-sm">
              {currentUser.fullName}
            </div>
          </div>
          <nav aria-label="Workspace navigation" className="mt-4 flex min-w-0 max-w-full gap-1 overflow-x-auto pb-0.5 lg:hidden">
            {visibleNavItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium ${
                    isActive ? "bg-[#142A43] text-white" : "text-[#526174] hover:bg-[#F1F5F8]"
                  }`}
                >
                  <ItemIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-3 text-[11px] leading-4 text-[#667085]">
            Demo workspace · Records are stored unencrypted in this browser only
          </p>
        </header>

        <div className="min-w-0 p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
