// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
// import { useQuery } from 'react-query'
// import api from '../services/authService'
// import LoadingSpinner from '../components/LoadingSpinner'
// import {
//   UserGroupIcon,
//   BookOpenIcon,
//   ClipboardDocumentListIcon,
//   ChartBarIcon,
//   CogIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   ArrowTrendingUpIcon,
//   DocumentChartBarIcon
// } from '@heroicons/react/24/outline'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line
// } from 'recharts'

// const AdminDashboard = () => {
//   const { user } = useAuth()

//   // Fetch admin dashboard data
//   const { data: adminData, isLoading } = useQuery(
//     'adminDashboardData',
//     async () => {
//       const response = await api.get('/admin/dashboard')
//       return response.data
//     },
//     {
//       enabled: !!user,
//     }
//   )

//   if (isLoading) {
//     return <LoadingSpinner text="Loading admin dashboard..." />
//   }

//   const stats = adminData?.data?.stats || {}
//   const chartData = adminData?.data?.chartData || {}
//   const recentActivity = adminData?.data?.recentActivity || []

//   // Sample chart data
//   const enrollmentData = [
//     { month: 'Jan', enrollments: 65, completions: 45 },
//     { month: 'Feb', enrollments: 78, completions: 52 },
//     { month: 'Mar', enrollments: 90, completions: 67 },
//     { month: 'Apr', enrollments: 81, completions: 71 },
//     { month: 'May', enrollments: 95, completions: 78 },
//     { month: 'Jun', enrollments: 87, completions: 82 }
//   ]

//   const departmentData = [
//     { name: 'IT', value: 35, color: '#3B82F6' },
//     { name: 'HR', value: 25, color: '#10B981' },
//     { name: 'Finance', value: 20, color: '#F59E0B' },
//     { name: 'Operations', value: 15, color: '#EF4444' },
//     { name: 'Marketing', value: 5, color: '#8B5CF6' }
//   ]

//   const adminQuickActions = [
//     {
//       name: 'Manage Users',
//       description: 'Add, edit, or deactivate users',
//       href: '/admin/users',
//       icon: UserGroupIcon,
//       color: 'bg-blue-500',
//       stat: stats.total_users || 0
//     },
//     {
//       name: 'Course Management',
//       description: 'Create and manage courses',
//       href: '/admin/courses',
//       icon: BookOpenIcon,
//       color: 'bg-green-500',
//       stat: stats.total_courses || 0
//     },
//     {
//       name: 'Survey Analytics',
//       description: 'View survey responses and insights',
//       href: '/admin/surveys',
//       icon: ClipboardDocumentListIcon,
//       color: 'bg-purple-500',
//       stat: stats.total_surveys || 0
//     },
//     {
//       name: 'System Settings',
//       description: 'Configure system parameters',
//       href: '/admin/settings',
//       icon: CogIcon,
//       color: 'bg-gray-500',
//       stat: null
//     },
//     {
//       name: 'Reports & Analytics',
//       description: 'Comprehensive reporting dashboard',
//       href: '/admin/reports',
//       icon: DocumentChartBarIcon,
//       color: 'bg-orange-500',
//       stat: null
//     },
//     {
//       name: 'Support Tickets',
//       description: 'Manage user support requests',
//       href: '/admin/support',
//       icon: ExclamationTriangleIcon,
//       color: 'bg-red-500',
//       stat: stats.pending_tickets || 0
//     }
//   ]

//   return (
//     <div className="space-y-8">
//       {/* Admin Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow rounded-lg">
//         <div className="px-6 py-8 text-white">
//           <h1 className="text-3xl font-bold">
//             Admin Dashboard
//           </h1>
//           <p className="mt-2 text-blue-100">
//             System Administrator • Complete Access • {user?.departmentName || 'All Departments'}
//           </p>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <UserGroupIcon className="h-6 w-6 text-blue-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Users
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.total_users || 0}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <BookOpenIcon className="h-6 w-6 text-green-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Active Courses
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.active_courses || 0}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Completion Rate
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.completion_rate || 0}%
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Pending Issues
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.pending_tickets || 0}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Enrollment Trends */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Enrollment Trends</h3>
//           </div>
//           <div className="p-6">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={enrollmentData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="enrollments" fill="#3B82F6" name="Enrollments" />
//                 <Bar dataKey="completions" fill="#10B981" name="Completions" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Department Distribution */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Department Distribution</h3>
//           </div>
//           <div className="p-6">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={departmentData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {departmentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="mt-4 grid grid-cols-2 gap-2">
//               {departmentData.map((dept, index) => (
//                 <div key={index} className="flex items-center">
//                   <div
//                     className="w-3 h-3 rounded-full mr-2"
//                     style={{ backgroundColor: dept.color }}
//                   ></div>
//                   <span className="text-sm text-gray-600">{dept.name}: {dept.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Admin Quick Actions */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Admin Quick Actions</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {adminQuickActions.map((action) => (
//               <Link
//                 key={action.name}
//                 to={action.href}
//                 className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:shadow-md transition-all"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
//                       <action.icon className="h-6 w-6" />
//                     </span>
//                   </div>
//                   {action.stat !== null && (
//                     <div className="text-2xl font-bold text-gray-500">
//                       {action.stat}
//                     </div>
//                   )}
//                 </div>
//                 <div className="mt-4">
//                   <h3 className="text-sm font-medium text-gray-900">
//                     <span className="absolute inset-0" />
//                     {action.name}
//                   </h3>
//                   <p className="mt-1 text-xs text-gray-500">
//                     {action.description}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Recent System Activity</h3>
//         </div>
//         <div className="p-6">
//           {recentActivity.length > 0 ? (
//             <div className="space-y-4">
//               {recentActivity.slice(0, 8).map((activity, index) => (
//                 <div key={index} className="flex items-start space-x-3">
//                   <div className="flex-shrink-0">
//                     <CheckCircleIcon className="h-5 w-5 text-green-400" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-medium text-gray-900">
//                       {activity.title}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {activity.description}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       {new Date(activity.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 System activity will appear here as users interact with the platform.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard
