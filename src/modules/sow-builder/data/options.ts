// src/modules/sow-builder/data/options.ts
import React from 'react';

// Import all distinct industry icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ComputerIcon from '@mui/icons-material/Computer';

export interface IndustryOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ sx?: any }>;
}

export interface CapabilityOption {
  id: string;
  label: string;
  countLabel?: string;
  associatedIndustries: string[];
  isCustom?: boolean;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: 'healthcare', label: 'Healthcare', icon: LocalHospitalIcon },
  { id: 'financial', label: 'Financial Services', icon: AccountBalanceIcon },
  { id: 'manufacturing', label: 'Manufacturing', icon: PrecisionManufacturingIcon },
  { id: 'retail', label: 'Retail', icon: StorefrontIcon },
  { id: 'public-sector', label: 'Public Sector', icon: AccountBalanceWalletIcon },
  { id: 'energy', label: 'Energy & Utilities', icon: ElectricBoltIcon },
  { id: 'logistics', label: 'Logistics', icon: LocalShippingIcon },
  { id: 'technology', label: 'Technology', icon: ComputerIcon },
];

export const CAPABILITY_OPTIONS: CapabilityOption[] = [
  {
    id: 'managed-support',
    label: 'Managed Support',
    associatedIndustries: ['healthcare', 'financial', 'retail', 'public-sector', 'technology']
  },
  {
    id: 'cloud-managed',
    label: 'Cloud Managed Services',
    associatedIndustries: ['technology', 'financial', 'retail', 'energy', 'public-sector']
  },
  {
    id: 'erp-managed',
    label: 'ERP Managed Services',
    associatedIndustries: ['manufacturing', 'logistics', 'retail']
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    associatedIndustries: ['financial', 'healthcare', 'public-sector', 'technology']
  },
  {
    id: 'data-analytics',
    label: 'Data & Analytics',
    associatedIndustries: ['financial', 'healthcare', 'retail', 'technology', 'manufacturing']
  },
  {
    id: 'digital-transform',
    label: 'Digital Transformation',
    associatedIndustries: ['manufacturing', 'retail', 'financial', 'energy']
  },
  {
    id: 'app-management',
    label: 'Application Management',
    associatedIndustries: ['technology', 'financial', 'healthcare', 'public-sector']
  },
  {
    id: 'workforce-services',
    label: 'Workforce Services',
    associatedIndustries: ['manufacturing', 'logistics', 'public-sector', 'healthcare']
  },
  {
    id: 'custom-capability',
    label: 'Other Capability',
    associatedIndustries: ['healthcare', 'financial', 'manufacturing', 'retail', 'public-sector', 'energy', 'logistics', 'technology'],
    isCustom: true
  },
];