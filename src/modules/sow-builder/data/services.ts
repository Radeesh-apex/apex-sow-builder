export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  effort: string;
  deliverables: string[];
  teamSize: number;
  estimatedCost?: number;
}

export const SERVICES_DATA: Service[] = [
  {
    id: 'svc-001',
    name: 'Discovery & Assessment',
    description: 'Comprehensive assessment of current systems, infrastructure, and business requirements.',
    duration: '4 weeks',
    effort: '200 hours',
    deliverables: [
      'Current State Analysis Report',
      'Gap Analysis Document',
      'Recommendations Report',
      'Architecture Diagrams'
    ],
    teamSize: 3,
    estimatedCost: 25000
  },
  {
    id: 'svc-002',
    name: 'Solution Design & Planning',
    description: 'Detailed solution architecture and implementation roadmap tailored to business needs.',
    duration: '3 weeks',
    effort: '150 hours',
    deliverables: [
      'Solution Architecture Document',
      'Implementation Roadmap',
      'Risk Assessment & Mitigation Plan',
      'Resource Plan'
    ],
    teamSize: 4,
    estimatedCost: 30000
  },
  {
    id: 'svc-003',
    name: 'Implementation & Deployment',
    description: 'End-to-end implementation including configuration, customization, and deployment.',
    duration: '8 weeks',
    effort: '500 hours',
    deliverables: [
      'Configured & Tested Environment',
      'Data Migration Report',
      'System Documentation',
      'Deployment Checklist'
    ],
    teamSize: 6,
    estimatedCost: 75000
  },
  {
    id: 'svc-004',
    name: 'Testing & Quality Assurance',
    description: 'Comprehensive testing including functional, performance, and user acceptance testing.',
    duration: '4 weeks',
    effort: '280 hours',
    deliverables: [
      'Test Plan & Cases',
      'Test Execution Report',
      'Defect Log & Resolution',
      'UAT Sign-off'
    ],
    teamSize: 4,
    estimatedCost: 35000
  },
  {
    id: 'svc-005',
    name: 'Training & Knowledge Transfer',
    description: 'Comprehensive training program and documentation to empower your team.',
    duration: '2 weeks',
    effort: '120 hours',
    deliverables: [
      'Training Materials',
      'Video Tutorials',
      'User Guides & Documentation',
      'Training Attendance Records'
    ],
    teamSize: 2,
    estimatedCost: 15000
  },
  {
    id: 'svc-006',
    name: 'Post-Implementation Support',
    description: 'Dedicated support during production stabilization and optimization phase.',
    duration: '4 weeks',
    effort: '160 hours',
    deliverables: [
      'Performance Optimization Report',
      'Support Ticket Log',
      'Lessons Learned Document',
      'Handover Report'
    ],
    teamSize: 3,
    estimatedCost: 20000
  }
];
