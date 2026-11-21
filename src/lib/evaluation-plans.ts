export const evaluationPlans = [
  { name: "Starter", monthly: 150, audience: "Independent real estate professionals" },
  { name: "Business", monthly: 350, audience: "Agencies coordinating multiple agents" },
  { name: "Enterprise", monthly: null, audience: "Agencies evaluating team rollout and operational requirements" },
] as const;

export const evaluationCapabilities = [
  "Property inventory",
  "Contacts and lead pipeline",
  "Viewings and follow-up tasks",
  "Deal tracking and workspace reports",
] as const;
