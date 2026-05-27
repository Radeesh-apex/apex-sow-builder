import type { SvgIconComponent } from '@mui/icons-material'
import DashboardOutlinedIcon      from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon    from '@mui/icons-material/DescriptionOutlined'
import PeopleOutlinedIcon         from '@mui/icons-material/PeopleOutlined'
import GroupsOutlinedIcon         from '@mui/icons-material/GroupsOutlined'
import AttachMoneyOutlinedIcon    from '@mui/icons-material/AttachMoneyOutlined'
import CheckCircleOutlinedIcon    from '@mui/icons-material/CheckCircleOutlined'
import SettingsOutlinedIcon       from '@mui/icons-material/SettingsOutlined'
import { PATHS } from './routePaths'

export interface NavItem {
  label: string
  path: string
  Icon: SvgIconComponent
  group?: string
  badge?: number
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: PATHS.dashboard,  Icon: DashboardOutlinedIcon },
  { label: 'SOW List',  path: PATHS.sowList,     Icon: DescriptionOutlinedIcon },
  // { label: 'Clients',   path: PATHS.clients,     Icon: PeopleOutlinedIcon,      group: 'Management' },
  // { label: 'Resources', path: PATHS.resources,   Icon: GroupsOutlinedIcon },
  { label: 'Pricing',   path: PATHS.pricing,     Icon: AttachMoneyOutlinedIcon },
  { label: 'Approvals', path: PATHS.approvals,   Icon: CheckCircleOutlinedIcon, badge: 5 },
  { label: 'Settings',  path: PATHS.settings,    Icon: SettingsOutlinedIcon,    group: 'System' },
]
