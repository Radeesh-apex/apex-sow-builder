// src/modules/dashboard/data/mockData.ts

export interface SOWRecord {
  id: string;
  title: string;
  client: string;
  industry: string;
  progress: number;
  status: 'Draft' | 'In Review' | 'Completed' | 'Approved' | 'Rejected';
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  industry: string;
  timesUsed: number;
}

export interface DashboardStats {
  totalSOWs: number;
  activeSOWs: number;
  approved: number;
  rejected: number;
}

// ── 1. Statistics for your 3 KPI Cards ───────────────────────────────────────
export const MOCK_STATS: DashboardStats = {
  totalSOWs: 35,
  activeSOWs: 12,
  approved: 32,
  rejected: 3,
};

// ── 2. My SOWs List Data ─────────────────────────────────────────────────────
export const MOCK_SOWS: SOWRecord[] = [
  { 
    id: '1', 
    title: 'Managed Support Services', 
    client: 'Acme Corporation', 
    industry: 'Healthcare', 
    progress: 65, 
    status: 'Draft' 
  },
  { 
    id: '2', 
    title: 'Cloud Migration – T&M', 
    client: 'TechCo Industries', 
    industry: 'Financial Services', 
    progress: 88, 
    status: 'In Review' 
  },
  { 
    id: '3', 
    title: 'Cybersecurity SOC', 
    client: 'City of Springfield', 
    industry: 'Public Sector', 
    progress: 40, 
    status: 'Rejected' 
  },
  { 
    id: '4', 
    title: 'ERP Managed Services', 
    client: 'Global Manufacturing Ltd', 
    industry: 'Manufacturing', 
    progress: 100, 
    status: 'Approved' 
  },
  { 
    id: '5', 
    title: 'Digital Transformation', 
    client: 'RetailFirst Corp', 
    industry: 'Retail', 
    progress: 72, 
    status: 'In Review' 
  },
];

// ── 3. Recent Activity Stream ────────────────────────────────────────────────
export const MOCK_ACTIVITIES: ActivityItem[] = [
  { 
    id: '1', 
    user: 'Sarah Chen', 
    action: 'created SOW for Acme Corporation', 
    time: '2h ago' 
  },
  { 
    id: '2', 
    user: 'Marcus Rivera', 
    action: 'updated pricing for TechCo Industries', 
    time: '4h ago' 
  },
  { 
    id: '3', 
    user: 'Priya Nair', 
    action: 'submitted Springfield SOW for approval', 
    time: '6h ago' 
  },
  { 
    id: '4', 
    user: 'David Kim', 
    action: 'commented on Global Manufacturing SOW', 
    time: '1d ago' 
  },
  { 
    id: '5', 
    user: 'Emma Johnson', 
    action: 'marked ERP Services SOW as approved', 
    time: '2d ago' 
  },
];

// ── 4. Recent Templates Data ─────────────────────────────────────────────────
export const MOCK_TEMPLATES: TemplateItem[] = [
  { 
    id: '1', 
    name: 'Service Desk — Fully Outsourced — Fixed Fee', 
    category: 'Managed Support', 
    industry: 'Healthcare', 
    timesUsed: 14 
  },
  { 
    id: '2', 
    name: 'Cloud Migration — T&M', 
    category: 'Cloud Managed', 
    industry: 'Financial Services', 
    timesUsed: 8 
  },
  { 
    id: '3', 
    name: 'ERP Managed Services — Co-Managed', 
    category: 'ERP Managed', 
    industry: 'Manufacturing', 
    timesUsed: 6 
  },
  { 
    id: '4', 
    name: 'Cybersecurity SOC — Outcome-Based', 
    category: 'Cybersecurity', 
    industry: 'Public Sector', 
    timesUsed: 5 
  },
];