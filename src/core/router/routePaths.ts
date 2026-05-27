export const PATHS = {
  home: '/',
  dashboard: '/dashboard',
  sowList: '/sows',
  sowCreate: '/sows/create',
  sowDetails: '/sows/:id',
  clients: '/clients',
  resources: '/resources',
  pricing: '/pricing',
  approvals: '/approvals',
  settings: '/settings',
  login: '/login',
  notFound: '/404',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
