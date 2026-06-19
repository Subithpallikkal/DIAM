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
const ClientDetailPage = lazy(() =>
  import('../pages/clients/ClientDetailPage').then((m) => ({ default: m.ClientDetailPage })),
)
const EngagementsListPage = lazy(() =>
  import('../pages/engagements/EngagementsListPage').then((m) => ({
    default: m.EngagementsListPage,
  })),
)
const EngagementDetailPage = lazy(() =>
  import('../pages/engagements/EngagementDetailPage').then((m) => ({
    default: m.EngagementDetailPage,
  })),
)
const DocumentsPage = lazy(() =>
  import('../pages/documents/DocumentsPage').then((m) => ({ default: m.DocumentsPage })),
)
const RisksPage = lazy(() =>
  import('../pages/risks/RisksPage').then((m) => ({ default: m.RisksPage })),
)
const RiskDetailPage = lazy(() =>
  import('../pages/risks/RiskDetailPage').then((m) => ({ default: m.RiskDetailPage })),
)
const TasksPage = lazy(() =>
  import('../pages/tasks/TasksPage').then((m) => ({ default: m.TasksPage })),
)
const TaskDetailPage = lazy(() =>
  import('../pages/tasks/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage })),
)
const IssuesPage = lazy(() =>
  import('../pages/issues/IssuesPage').then((m) => ({ default: m.IssuesPage })),
)
const IssueDetailPage = lazy(() =>
  import('../pages/issues/IssueDetailPage').then((m) => ({ default: m.IssueDetailPage })),
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
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/engagements" element={<EngagementsListPage />} />
            <Route path="/engagements/:id" element={<EngagementDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/risks/:id" element={<RiskDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
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
