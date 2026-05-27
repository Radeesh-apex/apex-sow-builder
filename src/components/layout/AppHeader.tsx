import React from 'react';
import { Box } from '@mui/material';
import {ApexNavBar} from '@apex-ui/components/core-framework/'; // Adjust path based on your directory structure
import logoImg from '@assets/Apex_logo_horizontal_white.png'; // Adjust path to point to your image asset

interface AppHeaderProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
}

export function AppHeader({ onMenuToggle, showMenu = true }: AppHeaderProps) {
  
  // Render the official high-resolution image asset directly
  const corporateBranding = (
    <Box 
      component="img" 
      src={logoImg} 
      alt="Everforth Apex Systems Logo" 
      sx={{ 
        height: { xs: 32, sm: 38 }, // Balanced height profile to match layout proportions
        width: 'auto',
        display: 'block',
        objectFit: 'contain'
      }}
    />
  );

  return (
    <ApexNavBar
      brand="" // Bypasses default text layout rendering
      logo={corporateBranding}
      bgColor="#3b4b61" // Matches the specific corporate slate-blue hex color token
      textColor="#ffffff"
      position="sticky"
      size="medium"
      showMenuIcon={showMenu}
      onMenuClick={onMenuToggle}
      appBarProps={{
        elevation: 0, // Removes default drop shadow lines
        sx: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }
      }}
      toolbarProps={{
        sx: {
          minHeight: '64px !important', // Enforces alignment consistency across views
          px: 2,
        }
      }}
    />
  );
}

export default AppHeader;