import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Tooltip } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
// Import navConfig and routePaths DIRECTLY — never import from core/router barrel (AppRoutes is there)
import { NAV_ITEMS } from '@core/router/navConfig'

interface AppSidebarProps {
  open: boolean
  width: number
}

export function AppSidebar({ open, width }: AppSidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List sx={{ pt: 1 }}>
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          const selected = pathname === path
          return (
            <Tooltip key={path} title={!open ? label : ''} placement="right">
              <ListItemButton
                selected={selected}
                onClick={() => navigate(path)}
                sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: selected ? 'primary.main' : 'inherit' }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>
    </Drawer>
  )
}
