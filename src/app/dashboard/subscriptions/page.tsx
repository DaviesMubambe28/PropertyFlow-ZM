import { DashboardShell } from "@/components/dashboard-shell";
import { EvaluationPricing } from "@/components/evaluation-pricing";

export default function SubscriptionsPage() {
  return (
    <DashboardShell>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Workspace plans</h2>
      <EvaluationPricing />
    </DashboardShell>
  );
}
