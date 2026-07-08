import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@components/layout'
import { PageLoader, ErrorBoundary } from '@components/feedback'
import { PATHS } from './routePaths'
import  DashboardPage  from '@/modules/dashboard/pages/DashboardPage'

const HomePage = lazy(() => import('@modules/home/pages/HomePage'))
const NewSowPage =lazy(()=>import('@modules/sow-builder/pages/NewSowPage'))
const ServicesPage = lazy(() => import('@modules/services/pages/ServicesPage'))
const ContactPage = lazy(() => import('@modules/contact/pages/ContactPage'))
const RegistrationPage = lazy(() => import('@modules/registration/pages/RegistrationPage'))
const LoginPage = lazy(() => import('@modules/login/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@modules/errors/NotFoundPage'))

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to={PATHS.dashboard} replace />} />
              <Route path={PATHS.dashboard}  element={<DashboardPage/>} />
              <Route path={PATHS.sowCreate} element={<NewSowPage/>}/>
              {/* Placeholder routes — pages wired in next sprint */}
              <Route path={PATHS.sowList}    element={<HomePage />} />
              <Route path={PATHS.clients}    element={<div />} />
              <Route path={PATHS.resources}  element={<div />} />
              <Route path={PATHS.pricing}    element={<ContactPage/>} />
              <Route path={PATHS.approvals}  element={<div />} />
              <Route path={PATHS.settings}   element={<div />} />
              <Route path={PATHS.notFound}   element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
