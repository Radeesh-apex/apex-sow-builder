import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Typography, Avatar, IconButton, Tooltip,
  Menu, MenuItem, Divider, useMediaQuery
} from '@mui/material'
import type { Theme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { NAV_ITEMS } from '@core/router/navConfig'
import { PATHS } from '@core/router/routePaths'
import { useAppTheme } from '@core/theme'
import { useAuth } from '@core/auth'
import { ApexSidebar } from './AppSidebar'

import logoImg from '@assets/Apex_logo_horizontal_white.png'

const DRAWER_W = 248

export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { activeTheme, setTheme } = useAppTheme()
  const { user, logout } = useAuth()
  const isMobile = useMediaQuery((t: Theme) => t.breakpoints.down('md'))

  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)

  const profileData = {
    name: user?.name ?? 'Alex Morgan',
    initials: user?.initials ?? 'AM',
    role: 'Sales Director'
  }

  const pageTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/sows': 'SOW List',
    '/clients': 'Clients',
    '/resources': 'Resources',
    '/pricing': 'Pricing',
    '/approvals': 'Approvals',
    '/settings': 'Settings',
  }
  const title = pageTitle[pathname] ?? 'SOW Builder'

  const handleNavItemClick = (path: string) => {
    navigate(path)
    if (isMobile) setDrawerOpen(false)
  }

  const handleThemeToggle = () => {
    setTheme(activeTheme === 'dark' ? 'corporateBlue' : 'dark')
  }

  const layoutLogo = (
    <Box
      component="img"
      src={logoImg}
      alt="Everforth Apex Systems"
      sx={{
        height: 34,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
      }}
    />
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      <ApexSidebar 
        width={DRAWER_W}
        open={drawerOpen}
        isMobile={isMobile}
        onClose={() => setDrawerOpen(false)}
        navItems={NAV_ITEMS}
        currentPath={pathname}
        onNavItemClick={handleNavItemClick}
        logo={layoutLogo}
      />

      <Box
        sx={{
          flexGrow: 1,
          ml: (!isMobile && drawerOpen) ? `${DRAWER_W}px` : 0,
          transition: 'margin 0.2s ease',
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top Header Bar Layout */}
        <Box
          sx={{
            height: 64,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            px: 3,
            gap: 2,
            bgcolor: '#3b4b61', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <IconButton size="small" onClick={() => setDrawerOpen(p => !p)} sx={{ color: '#ffffff' }}>
            <MenuIcon fontSize="small" />
          </IconButton>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1, color: '#ffffff' }}>
            {title}
          </Typography>

          {/* Action Header Menu Items */}
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: '#ffffff' }}>
              <Box sx={{ position: 'relative' }}>
                <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
                <Box sx={{
                  position: 'absolute', top: -2, right: -2,
                  width: 8, height: 8, borderRadius: '50%',
                  bgcolor: '#ef4444', border: '2px solid #3b4b61',
                }} />
              </Box>
            </IconButton>
          </Tooltip>

          {/* Instant Theme Toggle Button */}
          <Tooltip title={activeTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton size="small" sx={{ color: '#ffffff' }} onClick={handleThemeToggle}>
              {activeTheme === 'dark' ? (
                <LightModeIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{ 
              width: 32, 
              height: 32, 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              bgcolor: '#ffffff', 
              color: '#3b4b61',   
              cursor: 'pointer' 
            }}
            onClick={(e) => setUserAnchor(e.currentTarget)}
          >
            {profileData.initials}
          </Avatar>
        </Box>

        {/* Dynamic Inner Outlet Wrapper */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>

      {/* User Actions Dropdown Overlay Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={() => setUserAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 200, mt: 0.5, borderRadius: 1.5, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={700} color="text.primary">{profileData.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email ?? 'alex@company.com'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { logout(); setUserAnchor(null); navigate(PATHS.login) }} sx={{ py: 1, gap: 1.5, fontSize: 14 }}>
          <LogoutIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          Sign out
        </MenuItem>
      </Menu>
    </Box>
  )
}