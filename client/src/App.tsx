import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/common/LoadingScreen';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { checkAuth, fetchOrganization } from './redux/slices/authSlice';

// Auth Pages
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyOtp = React.lazy(() => import('./pages/auth/VerifyOtp'));
const CreateOrganazation = React.lazy(() => import('./pages/auth/CreateOrganazation'));
const PricingPlans = React.lazy(() => import('./pages/pricing/PricingPlans'));

// Dashboard Pages
const AdminDashboard = React.lazy(() => import('./pages/dashboard/AdminDashboard'));
const HRDashboard = React.lazy(() => import('./pages/dashboard/HRDashboard'));
const ManagerDashboard = React.lazy(() => import('./pages/dashboard/ManagerDashboard'));
const EmployeeDashboard = React.lazy(() => import('./pages/dashboard/EmployeeDashboard'));

const Permissions = React.lazy(() => import('./pages/admin/Permissions'));
// const Settings = React.lazy(() => import('./pages/admin/Settings'));
const UserProfile = React.lazy(() => import('./pages/profile/UserProfile'));

// Employee Management
const EmployeeList = React.lazy(() => import('./pages/employees/EmployeeList'));
const AddEmployee = React.lazy(() => import('./pages/employees/AddEmployee'));
const EmployeeProfile = React.lazy(() => import('./pages/employees/EmployeeProfile'));
const EditEmployee = React.lazy(() => import('./pages/employees/EditEmployee'));

// Clients/Leads
const ClientList = React.lazy(() => import('./pages/clients/ClientList'));
const AddClient = React.lazy(() => import('./pages/clients/AddClient'));
const AssignClient = React.lazy(() => import('./pages/clients/AssignClient'));

// leads
const LeadDashboard = React.lazy(() => import('./pages/leads/LeadDashboard'));

// Tasks
const CreateTask = React.lazy(() => import('./pages/tasks/CreateTask'));
const MyTasks = React.lazy(() => import('./pages/tasks/MyTasks'));
const TeamTasks = React.lazy(() => import('./pages/tasks/TeamTasks'));
const TaskBoard = React.lazy(() => import('./pages/tasks/TaskBoard'));

// Attendance
const MarkAttendance = React.lazy(() => import('./pages/attendance/MarkAttendance'));
const AttendanceTable = React.lazy(() => import('./pages/attendance/AttendanceTable'));

// Leave Management
const ApplyLeave = React.lazy(() => import('./pages/leaves/ApplyLeave'));
const LeaveRequests = React.lazy(() => import('./pages/leaves/LeaveRequests'));
const LeaveHistory = React.lazy(() => import('./pages/leaves/LeaveHistory'));

// Salary Management
const GenerateSalary = React.lazy(() => import('./pages/salary/GenerateSalary'));
const SalaryList = React.lazy(() => import('./pages/salary/SalaryList'));
const PayslipDownload = React.lazy(() => import('./pages/salary/PayslipDownload'));

// Assets
const AssignAsset = React.lazy(() => import('./pages/assets/AssignAsset'));
const AssetList = React.lazy(() => import('./pages/assets/AssetList'));
const EmployeeAssets = React.lazy(() => import('./pages/assets/EmployeeAssets'));

// Reports
const ReportsDashboard = React.lazy(() => import('./pages/reports/ReportsDashboard'));
const ExportCSV = React.lazy(() => import('./pages/reports/ExportCSV'));

// Invoice Module
const InvoiceDashboard = React.lazy(() => import('./pages/invoices/InvoiceDashboard'));
const InvoiceList = React.lazy(() => import('./pages/invoices/InvoiceList'));
const CreateInvoice = React.lazy(() => import('./pages/invoices/CreateInvoice'));
const EditInvoice = React.lazy(() => import('./pages/invoices/EditInvoice'));
const InvoiceDetail = React.lazy(() => import('./pages/invoices/InvoiceDetail'));
const InvoiceSettings = React.lazy(() => import('./pages/invoices/InvoiceSettings'));
const InvoiceHistory = React.lazy(() => import('./pages/invoices/InvoiceHistory'));
const OverdueInvoices = React.lazy(() => import('./pages/invoices/OverdueInvoices'));
const SendInvoice = React.lazy(() => import('./pages/invoices/SendInvoice'));
const InvoicePayment = React.lazy(() => import('./pages/invoices/InvoicePayment'));
const ClientInvoices = React.lazy(() => import('./pages/invoices/ClientInvoices'));
const RecurringInvoices = React.lazy(() => import('./pages/invoices/RecurringInvoices'));
const RecurringInvoiceDetail = React.lazy(() => import('./pages/invoices/RecurringInvoiceDetail'));

// Error
const NotFound = React.lazy(() => import('./pages/error/NotFound'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading, isAuthenticated, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Fetch organization when user is authenticated
  useEffect(() => {
    if (user?.organization && isAuthenticated) {
      dispatch(fetchOrganization(user.organization));
    }
  }, [dispatch, user, isAuthenticated]);

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'hr':
        return '/dashboard/hr';
      case 'manager':
        return '/dashboard/manager';
      default:
        return '/dashboard/employee';
    }
  };

  // Role-based access control
  const ProtectedRoute = ({ children, requiredRoles = [] }: { children: JSX.Element; requiredRoles?: string[] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
      return <Navigate to={getDashboardPath()} replace />;
    }

    return children;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <Register />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/create-organization" element={<CreateOrganazation />} />
        </Route>

        <Route path="/pricing-plan" element={<PricingPlans />} />

        {/* Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to={getDashboardPath()} replace />} />
          <Route path="/dashboard" element={<Navigate to={getDashboardPath()} replace />} />

          {/* Role-specific dashboards */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/hr" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/manager" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />

          {/* profile page */}
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/dashboard/permissions" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Permissions />
            </ProtectedRoute>
          } />

          {/* Employee Management */}
          <Route path="/employees" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <EmployeeList />
            </ProtectedRoute>
          } />
          <Route path="/employees/add" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <AddEmployee />
            </ProtectedRoute>
          } />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
          <Route path="/employees/:id/edit" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <EditEmployee />
            </ProtectedRoute>
          } />

          {/* Clients */}
          <Route path="/clients" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <ClientList />
            </ProtectedRoute>
          } />
          <Route path="/clients/add" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <AddClient />
            </ProtectedRoute>
          } />
          <Route path="/clients/assign" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <AssignClient />
            </ProtectedRoute>
          } />

          <Route path="/leads/dashboard" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <LeadDashboard />
            </ProtectedRoute>
          } />

          {/* Tasks */}
          <Route path="/tasks/create" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <CreateTask />
            </ProtectedRoute>
          } />
          <Route path="/tasks/my-tasks" element={<MyTasks />} />
          <Route path="/tasks/team" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <TeamTasks />
            </ProtectedRoute>
          } />
          <Route path="/tasks/board" element={<TaskBoard />} />

          {/* Attendance */}
          <Route path="/attendance/mark" element={<MarkAttendance />} />
          <Route path="/attendance/history" element={<AttendanceTable />} />

          {/* Leave Management */}
          <Route path="/leaves/apply" element={<ApplyLeave />} />
          <Route path="/leaves/requests" element={
            <ProtectedRoute requiredRoles={['admin', 'hr', 'manager']}>
              <LeaveRequests />
            </ProtectedRoute>
          } />
          <Route path="/leaves/history" element={<LeaveHistory />} />

          {/* Salary Management */}
          <Route path="/salary/generate" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <GenerateSalary />
            </ProtectedRoute>
          } />
          <Route path="/salary/list" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <SalaryList />
            </ProtectedRoute>
          } />
          <Route path="/salary/payslip/:id" element={<PayslipDownload />} />

          {/* Assets */}
          <Route path="/assets/assign" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <AssignAsset />
            </ProtectedRoute>
          } />
          <Route path="/assets/list" element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <AssetList />
            </ProtectedRoute>
          } />
          <Route path="/assets/my-assets" element={<EmployeeAssets />} />

          {/* Invoice Routes */}
          <Route path="/invoices" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoiceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/invoices/list" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoiceList />
            </ProtectedRoute>
          } />
          <Route path="/invoices/create" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <CreateInvoice />
            </ProtectedRoute>
          } />
          <Route path="/invoices/:id" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoiceDetail />
            </ProtectedRoute>
          } />
          <Route path="/invoices/:id/edit" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <EditInvoice />
            </ProtectedRoute>
          } />
          <Route path="/invoices/:id/send" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <SendInvoice />
            </ProtectedRoute>
          } />
          <Route path="/invoices/:id/payment" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoicePayment />
            </ProtectedRoute>
          } />
          <Route path="/invoices/settings" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoiceSettings />
            </ProtectedRoute>
          } />
          <Route path="/invoices/history" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <InvoiceHistory />
            </ProtectedRoute>
          } />
          <Route path="/invoices/overdue" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <OverdueInvoices />
            </ProtectedRoute>
          } />
          <Route path="/invoices/recurring" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <RecurringInvoices />
            </ProtectedRoute>
          } />
          <Route path="/invoices/recurring/:id" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <RecurringInvoiceDetail />
            </ProtectedRoute>
          } />
          <Route path="/invoices/client/:clientId" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <ClientInvoices />
            </ProtectedRoute>
          } />

          {/* Reports */}
          <Route path="/reports/dashboard" element={
            <ProtectedRoute requiredRoles={['admin', 'hr', 'manager']}>
              <ReportsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/reports/export" element={
            <ProtectedRoute requiredRoles={['admin', 'hr', 'manager']}>
              <ExportCSV />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;