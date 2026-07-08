import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface NavItem {
  path: string
  label: string
  group?: string
  badge?: number | string
  Icon: React.ComponentType<{ sx?: object; fontSize?: 'small' | 'medium' }>
}

interface ApexSidebarProps {
  width: number
  open: boolean
  isMobile: boolean
  onClose: () => void
  navItems: NavItem[]
  currentPath: string
  onNavItemClick: (path: string) => void
  logo: React.ReactNode
}

export function ApexSidebar({
  width,
  open,
  isMobile,
  onClose,
  navItems,
  currentPath,
  onNavItemClick,
  logo,
}: ApexSidebarProps) {

  const sidebarContent = (
    <Box
      sx={{
        width: width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper', 
        color: 'text.primary',
      }}
    >
      {/* Brand Header Unit */}
      <Box
        sx={{
          px: 2.5,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#3b4b61', 
          flexShrink: 0,
        }}
      >
        {logo}
        {isMobile && (
          <IconButton size="small" onClick={onClose} sx={{ color: '#ffffff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Nav Items Container */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 1 }}>
        {navItems.map((item, idx) => {
          const active = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))
          const prevGroup = idx > 0 ? navItems[idx - 1].group : undefined
          const showGroup = item.group && item.group !== prevGroup

          return (
            <Box key={item.path}>
              {showGroup && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    px: 1.5,
                    pt: 1.5,
                    pb: 0.5,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {item.group}
                </Typography>
              )}
              <ListItemButton
                selected={active}
                onClick={() => onNavItemClick(item.path)}
                sx={{
                  borderRadius: '0 20px 20px 0',
                  mr: 1,
                  mb: 0.5,
                  px: 2,
                  py: 1.2,
                  position: 'relative',
                  color: 'text.secondary', 
                  '& .MuiListItemIcon-root': { 
                    color: 'text.secondary',
                    transition: 'all 0.2s ease'
                  },
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(59, 75, 97, 0.08)', 
                    color: '#3b4b61',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': { color: '#3b4b61' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: '#3b4b61',
                      borderRadius: '0 4px 4px 0'
                    },
                    '&:hover': { 
                      bgcolor: 'rgba(59, 75, 97, 0.14)',
                      color: '#3b4b61',
                      '& .MuiListItemIcon-root': { color: '#3b4b61' }
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <item.Icon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ 
                    fontSize: 14, 
                    fontWeight: active ? 600 : 500,
                    letterSpacing: '0.01em'
                  }}
                />
                {item.badge !== undefined && (
                  <Box
                    sx={{
                      px: 0.8,
                      height: 18,
                      borderRadius: 10,
                      bgcolor: active ? '#3b4b61' : 'action.selected', 
                      color: active ? '#ffffff' : 'text.primary',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </Box>
          )
        })}
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{ paper: { sx: { width: width, border: 'none' } } }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  return (
    <Box
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        borderRight: open ? '1px solid' : 'none',
        borderColor: 'divider',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1200,
      }}
    >
      {sidebarContent}
    </Box>
  )
}