import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider} from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'
// import AdminDashboard from './pages/admin/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import CoursesPage from './pages/courses/CoursesPage'
// import CourseDetailPage from './pages/courses/CourseDetailPage'
import SurveysPage from './pages/surveys/SurveysPage'
import SurveyManagement from './pages/SurveyManagement'
// import TrainingPage from './pages/training/TrainingPage'
import TrainingSectors from './pages/TrainingSectors'
// import ReportsPage from './pages/reports/ReportsPage'
import ReportingDashboard from './pages/ReportingDashboard'
// import GraphsDashboard from './pages/GraphsDashboard'
// import SupportPage from './pages/support/SupportPage'
import SupportSystem from './pages/SupportSystem'
import ProfilePage from './pages/ProfilePage'
// import UserManagement from './pages/admin/UserManagement'
// import CourseManagement from './pages/CourseManagement'
import AddNewCourse from './pages/admin/addNewCourse'
import FillNewForm from './pages/courses/FillNewForm'

const PrivateRoute = ({children, role}) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}


// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" />
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission => 
      hasPermission(permission)
    )
    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" />
    }
  }

  return children
}


const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Role-Specific Dashboards (from your first App) */}
      {/* <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoute role="employee">
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/manager-dashboard"
        element={
          <PrivateRoute role="manager">
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />

      {/* Protected Nested Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<EmployeeDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Courses */}
                <Route path="/courses" element={<CoursesPage />} />
                {/* <Route path="/courses/:id" element={<CourseDetailPage />} /> */}
                <Route path="/courses/new" element={<AddNewCourse />} />
                <Route path="/courses/fill-new" element={<FillNewForm />} />


                {/* Surveys */}
                <Route path="/surveys" element={<SurveysPage />} />

                {/* Training */}
                {/* <Route path="/training" element={<TrainingPage />} /> */}
                <Route path="/training-sectors" element={<TrainingSectors />} />

                {/* Reports & Analytics */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requiredRoles={['Manager', 'Admin', 'SystemAdmin']}>
                      <ReportingDashboard />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <GraphsDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/graphs"
                  element={
                    <ProtectedRoute requiredRoles={['Manager', 'Admin', 'SystemAdmin']}>
                      <GraphsDashboard />
                    </ProtectedRoute>
                  }
                /> */}

                {/* Support */}
                <Route path="/support" element={<SupportSystem />} />

                {/* Admin Area */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRoles={['Admin', 'SystemAdmin']}>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        {/* <Route path="/users" element={<UserManagement />} /> */}
                        {/* <Route path="/courses" element={<CourseManagement />} /> */}
                        <Route path="/surveys" element={<SurveyManagement />} />
                        <Route path="/courses/new" element={<AddNewCourse />} />
                        <Route path="/courses/fill-new" element={<FillNewForm />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* Default Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                 
                <Route
                  path="/unauthorized"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Access Denied</h1>
                        <p className="text-secondary-600 mb-4">You don't have permission to access this page.</p>
                        <button
                          onClick={() => window.history.back()}
                          className="btn btn-primary"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  }
                />

                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Page Not Found</h1>
                        <p className="text-secondary-600 mb-4">The page you're looking for doesn't exist.</p>
                        <button
                          onClick={() => (window.location.href = '/dashboard')}
                          className="btn btn-primary"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <React.Fragment>
        <AppContent />
      </React.Fragment>
    </AuthProvider>
  );
}

// function App() {
//   return (
//     <AuthProvider>
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/admin-dashboard" element={
//           <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
//         } />
//         <Route path="/employee-dashboard" element={
//           <PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>
//         } />
//         <Route path="/manager-dashboard" element={
//           <PrivateRoute role="manager"><EmployeeDashboard /></PrivateRoute>
//         } />
//         {/* You can add a generic dashboard or a not found page here */}
//         <Route path="*" element={<Navigate to="/login"/>} />
//       </Routes>
//     </Router>
//     </AuthProvider>
//   )
// }
// Public Route Component (redirect if already authenticated)


// function App() {
//   const { loading } = useAuth()

//   if (loading) {
//     return <LoadingSpinner />
//   }

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route 
//         path="/login" 
//         element={
//           <PublicRoute>
//             <LoginPage />
//           </PublicRoute>
//         } 
//       />
//       <Route 
//         path="/register" 
//         element={
//           <PublicRoute>
//             <RegisterPage />
//           </PublicRoute>
//         } 
//       />
//       <Route 
//         path="/forgot-password" 
//         element={
//           <PublicRoute>
//             <ForgotPasswordPage />
//           </PublicRoute>
//         } 
//       />
//       <Route 
//         path="/reset-password" 
//         element={
//           <PublicRoute>
//             <ResetPasswordPage />
//           </PublicRoute>
//         } 
//       />

//       {/* Protected Routes */}
//       <Route 
//         path="/*" 
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Routes>
//                 <Route path="/dashboard" element={<DashboardPage />} />
//                 <Route path="/profile" element={<ProfilePage />} />
                
//                 {/* Course Routes */}
//                 <Route path="/courses" element={<CoursesPage />} />
//                 <Route path="/courses/:id" element={<CourseDetailPage />} />
                
//                 {/* Survey Routes */}
//                 <Route path="/surveys" element={<SurveysPage />} />
                
//                 {/* Training Routes */}
//                 <Route path="/training" element={<TrainingPage />} />
//                 <Route path="/training-sectors" element={<TrainingSectors />} />
                
//                 {/* Reports Routes */}
//                 <Route 
//                   path="/reports" 
//                   element={
//                     <ProtectedRoute requiredRoles={['Manager', 'Admin', 'SystemAdmin']}>
//                       <ReportsPage />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/analytics" 
//                   element={
//                     <ProtectedRoute requiredRoles={['Manager', 'Admin', 'SystemAdmin']}>
//                       <ReportingDashboard />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                
//                 {/* Support Routes */}
//                 <Route path="/support" element={<SupportSystem />} />
                
//                 {/* Admin Routes */}
//                 <Route 
//                   path="/admin/*" 
//                   element={
//                     <ProtectedRoute requiredRoles={['Admin', 'SystemAdmin']}>
//                       <Routes>
//                         <Route path="/" element={<AdminDashboard />} />
//                         <Route path="/users" element={<UserManagement />} />
//                         <Route path="/courses" element={<CourseManagement />} />
//                         <Route path="/surveys" element={<SurveyManagement />} />
//                       </Routes>
//                     </ProtectedRoute>
//                   } 
//                 />
                
//                 {/* Default redirects */}
//                 <Route path="/" element={<Navigate to="/dashboard" />} />
//                 <Route path="/unauthorized" element={
//                   <div className="min-h-screen flex items-center justify-center bg-secondary-50">
//                     <div className="text-center">
//                       <h1 className="text-2xl font-bold text-secondary-900 mb-4">Access Denied</h1>
//                       <p className="text-secondary-600 mb-4">You don't have permission to access this page.</p>
//                       <button 
//                         onClick={() => window.history.back()} 
//                         className="btn btn-primary"
//                       >
//                         Go Back
//                       </button>
//                     </div>
//                   </div>
//                 } />
//                 <Route path="*" element={
//                   <div className="min-h-screen flex items-center justify-center bg-secondary-50">
//                     <div className="text-center">
//                       <h1 className="text-2xl font-bold text-secondary-900 mb-4">Page Not Found</h1>
//                       <p className="text-secondary-600 mb-4">The page you're looking for doesn't exist.</p>
//                       <button 
//                         onClick={() => window.location.href = '/dashboard'} 
//                         className="btn btn-primary"
//                       >
//                         Go to Dashboard
//                       </button>
//                     </div>
//                   </div>
//                 } />
//               </Routes>
//             </Layout>
//           </ProtectedRoute>
//         } 
//       />
//     </Routes>
//   )
// }

// export default App






