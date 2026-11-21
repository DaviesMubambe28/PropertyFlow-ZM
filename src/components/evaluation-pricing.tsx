import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { evaluationCapabilities, evaluationPlans } from "@/lib/evaluation-plans";

export function EvaluationPricing() {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-6 text-muted-ink">Starter and Business prices are indicative. Request a demo to confirm availability, any limits and a written quote.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {evaluationPlans.map((plan) => (
          <article key={plan.name} className="flex flex-col rounded-xl border border-line bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-4 flex flex-wrap items-baseline gap-1.5"><span className="text-3xl font-semibold tracking-tight">{plan.monthly === null ? "Custom quote" : `K${plan.monthly}`}</span>{plan.monthly !== null && <span className="text-sm text-muted-ink">/ month</span>}</p>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-ink">{plan.audience}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-teal-100 bg-soft p-5">
        <h3 className="font-semibold">Workflows you can evaluate</h3>
        <ul className="mt-3 grid gap-2 text-sm text-teal-950 sm:grid-cols-2">
          {evaluationCapabilities.map((capability) => <li key={capability} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{capability}</li>)}
        </ul>
      </div>
      <Link href="/contact" className="brand-button-primary mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold">Discuss plans and pricing <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  );
}
