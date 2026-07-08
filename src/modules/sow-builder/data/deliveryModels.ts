// src/data/deliveryModels.ts

export interface DeliveryModel {
  id: string;
  name: string;
  duration: string;
  effort: string;
  description: string;
  deliverables: string[];
  teamSize: string;
  estimatedCost: string;
}

export const DELIVERY_MODELS_DATA: DeliveryModel[] = [
  {
    id: "tm",
    name: "Time & Materials (T&M)",
    duration: "Flexible Timeline",
    effort: "Variable Effort",
    description: "Best suited for projects with evolving scopes, iterative development, or undefined requirements. You pay for the actual hours worked and resources consumed, allowing for maximum adaptability.",
    deliverables: [
      "Agile Sprints",
      "Hourly/Daily Invoicing",
      "Dynamic Backlog",
      "On-Demand Scaling"
    ],
    teamSize: "Scalable (as needed)",
    estimatedCost: "Blended Hourly Rates"
  },
  {
    id: "fixed-fee",
    name: "Fixed Fee",
    duration: "Defined Timeline",
    effort: "Scope-Bound Effort",
    description: "Ideal for well-defined projects with concrete specifications, strict milestone paths, and explicit requirements. Minimizes financial risk by locking in a pre-agreed total price.",
    deliverables: [
      "Fixed Scope Milestone Path",
      "Pre-defined Deliverables",
      "Predictable Budgeting",
      "Change-Order Framework"
    ],
    teamSize: "Dedicated Core Team",
    estimatedCost: "Flat Project/Phase Fee"
  },
  {
    id: "outcome-based",
    name: "Outcome-Based",
    duration: "Value-Driven Timeline",
    effort: "Performance-Bound Effort",
    description: "Pricing and execution are directly tied to business outcomes, specific KPIs, or quantifiable goals. Shared risk/reward models ensure alignment with long-term strategic success.",
    deliverables: [
      "SLA & KPI Frameworks",
      "Risk-Reward Structure",
      "Value/ROI Tracking",
      "Success Metric Audits"
    ],
    teamSize: "Optimized Core Experts",
    estimatedCost: "Performance / Value Linked"
  }
];