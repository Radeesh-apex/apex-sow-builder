// src/data/commercialModels.ts

export interface CommercialModel {
  id: string;
  name: string;
  duration: string;
  effort: string;
  description: string;
  deliverables: string[];
  teamSize: string;
  estimatedCost: string;
}

export const COMMERCIAL_MODELS_DATA: CommercialModel[] = [
  {
    id: "standard",
    name: "Standard",
    duration: "Project-Bound",
    effort: "Direct Delivery",
    description: "Traditional staffing or fixed deliverables where resources execute directly under standard client or vendor project management framework.",
    deliverables: ["Direct Resource Allocation", "Standard Milestone Reports", "Direct Task Assignment"],
    teamSize: "As per Scope",
    estimatedCost: "Standard Project Rates"
  },
  {
    id: "managed-service",
    name: "Managed Service",
    duration: "Ongoing / SLA Driven",
    effort: "Vendor Managed",
    description: "The vendor assumes operational responsibility for a specific capability or function, delivering against strictly defined Service Level Agreements (SLAs).",
    deliverables: ["SLA Monitoring Reports", "Operational Governance", "Continuous Improvement Plans"],
    teamSize: "Dedicated SLA Team",
    estimatedCost: "Monthly Recurring Fee"
  },
  {
    id: "co-managed",
    name: "Co-Managed",
    duration: "Collaborative Term",
    effort: "Shared Responsibility",
    description: "A collaborative partnership framework where leadership, resource management, and delivery accountability are split transparently between your team and the client.",
    deliverables: ["Joint Governance Model", "Shared Risk Framework", "Cross-Team Synchronizations"],
    teamSize: "Blended Unit",
    estimatedCost: "Shared Resource Split"
  },
  {
    id: "outsourced",
    name: "Outsourced",
    duration: "Turnkey Execution",
    effort: "Full Ownership",
    description: "Complete end-to-end delegation of a business process or complete technical system. The vendor fully owns the strategy, infrastructure, talent, and delivery output.",
    deliverables: ["Turnkey Platform/System", "End-to-End Governance", "Business Outcome Reports"],
    teamSize: "Independent Vendor Unit",
    estimatedCost: "Value / Output-Based Pricing"
  }
];