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
  // Type signature allowing direct component storage
  icon: React.ComponentType<{ sx?: any }>;
}

export interface CapabilityOption {
  id: string;
  label: string;
  countLabel?: string;
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
  { id: 'managed-support', label: 'Managed Support', countLabel: '12 SOWs' },
  { id: 'cloud-managed', label: 'Cloud Managed Services' },
  { id: 'erp-managed', label: 'ERP Managed Services' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'data-analytics', label: 'Data & Analytics' },
  { id: 'digital-transform', label: 'Digital Transformation' },
  { id: 'app-management', label: 'Application Management' },
  { id: 'workforce-services', label: 'Workforce Services' },
];