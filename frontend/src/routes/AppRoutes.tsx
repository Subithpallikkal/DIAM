import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from '../components/common/Loader'
import { AppLayout, ProtectedRoute, PublicRoute, RoleRoute } from '../layouts'

const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('../pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ClientsListPage = lazy(() =>
  import('../pages/clients/ClientsListPage').then((m) => ({ default: m.ClientsListPage })),
)
const EngagementsListPage = lazy(() =>
  import('../pages/engagements/EngagementsListPage').then((m) => ({
    default: m.EngagementsListPage,
  })),
)
const DocumentsPage = lazy(() =>
  import('../pages/documents/DocumentsPage').then((m) => ({ default: m.DocumentsPage })),
)
const RisksPage = lazy(() =>
  import('../pages/risks/RisksPage').then((m) => ({ default: m.RisksPage })),
)
const TasksPage = lazy(() =>
  import('../pages/tasks/TasksPage').then((m) => ({ default: m.TasksPage })),
)
const IssuesPage = lazy(() =>
  import('../pages/issues/IssuesPage').then((m) => ({ default: m.IssuesPage })),
)
const ReportsPage = lazy(() =>
  import('../pages/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)
const UsersListPage = lazy(() =>
  import('../pages/users/UsersListPage').then((m) => ({ default: m.UsersListPage })),
)
const RolePermissionsPage = lazy(() =>
  import('../pages/users/RolePermissionsPage').then((m) => ({ default: m.RolePermissionsPage })),
)

function PageLoader() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Loader />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsListPage />} />
            <Route path="/clients/:id" element={<ClientsListPage />} />
            <Route path="/engagements" element={<EngagementsListPage />} />
            <Route path="/engagements/:id" element={<EngagementsListPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/risks/:id" element={<RisksPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TasksPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/issues/:id" element={<IssuesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route element={<RoleRoute allowed={['ADMIN', 'MANAGER']} />}>
              <Route path="/users" element={<UsersListPage />} />
              <Route path="/role-permissions" element={<RolePermissionsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
