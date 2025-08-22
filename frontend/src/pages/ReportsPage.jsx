// import React, { useState } from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { useQuery } from 'react-query'
// import api from '../services/authService'
// import LoadingSpinner from '../components/LoadingSpinner'
// import {
//   ChartBarIcon,
//   DocumentArrowDownIcon,
//   CalendarIcon,
//   UserGroupIcon,
//   BookOpenIcon,
//   AcademicCapIcon,
//   TrendingUpIcon,
//   TrendingDownIcon,
//   EyeIcon,
//   PrinterIcon,
//   ShareIcon
// } from '@heroicons/react/24/outline'
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   AreaChart,
//   Area
// } from 'recharts'

// const ReportsPage = () => {
//   const { user } = useAuth()
//   const [selectedReport, setSelectedReport] = useState('overview')
//   const [dateRange, setDateRange] = useState('last-30-days')
//   const [departmentFilter, setDepartmentFilter] = useState('all')

//   // Fetch reports data
//   const { data: reportsData, isLoading } = useQuery(
//     ['reports', selectedReport, dateRange, departmentFilter],
//     async () => {
//       const params = new URLSearchParams({
//         type: selectedReport,
//         dateRange,
//         ...(departmentFilter !== 'all' && { department: departmentFilter })
//       })
      
//       const response = await api.get(`/reports?${params}`)
//       return response.data
//     }
//   )

//   if (isLoading) {
//     return <LoadingSpinner text="Loading reports..." />
//   }

//   const reportData = reportsData?.data || {}

//   // Sample data for charts
//   const enrollmentTrends = [
//     { month: 'Jan', enrollments: 65, completions: 45 },
//     { month: 'Feb', enrollments: 78, completions: 52 },
//     { month: 'Mar', enrollments: 90, completions: 67 },
//     { month: 'Apr', enrollments: 81, completions: 71 },
//     { month: 'May', enrollments: 95, completions: 78 },
//     { month: 'Jun', enrollments: 87, completions: 82 }
//   ]

//   const departmentPerformance = [
//     { name: 'IT', completed: 45, enrolled: 60, rate: 75 },
//     { name: 'HR', completed: 32, enrolled: 40, rate: 80 },
//     { name: 'Finance', completed: 28, enrolled: 35, rate: 80 },
//     { name: 'Operations', completed: 40, enrolled: 55, rate: 73 },
//     { name: 'Marketing', completed: 18, enrolled: 25, rate: 72 }
//   ]

//   const coursePopularity = [
//     { name: 'Safety Training', value: 35, color: '#3B82F6' },
//     { name: 'Leadership Skills', value: 28, color: '#10B981' },
//     { name: 'Technical Skills', value: 20, color: '#F59E0B' },
//     { name: 'Compliance', value: 12, color: '#EF4444' },
//     { name: 'Others', value: 5, color: '#8B5CF6' }
//   ]

//   const progressOverTime = [
//     { week: 'Week 1', progress: 20 },
//     { week: 'Week 2', progress: 35 },
//     { week: 'Week 3', progress: 52 },
//     { week: 'Week 4', progress: 68 },
//     { week: 'Week 5', progress: 78 },
//     { week: 'Week 6', progress: 85 }
//   ]

//   const exportReport = (format) => {
//     // Export functionality
//     console.log(`Exporting report in ${format} format`)
//   }

//   const reportTypes = [
//     { id: 'overview', name: 'Training Overview', icon: ChartBarIcon },
//     { id: 'enrollment', name: 'Enrollment Analytics', icon: UserGroupIcon },
//     { id: 'completion', name: 'Completion Reports', icon: AcademicCapIcon },
//     { id: 'performance', name: 'Performance Analysis', icon: TrendingUpIcon },
//     { id: 'course-analytics', name: 'Course Analytics', icon: BookOpenIcon },
//     { id: 'survey-results', name: 'Survey Results', icon: DocumentArrowDownIcon }
//   ]

//   const renderOverviewReport = () => (
//     <div className="space-y-8">
//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <UserGroupIcon className="h-6 w-6 text-blue-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Enrollments
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     496
//                     <span className="text-sm text-green-600 ml-2">
//                       <TrendingUpIcon className="h-4 w-4 inline" /> +12%
//                     </span>
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
//                 <AcademicCapIcon className="h-6 w-6 text-green-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Completion Rate
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     78.5%
//                     <span className="text-sm text-green-600 ml-2">
//                       <TrendingUpIcon className="h-4 w-4 inline" /> +5.2%
//                     </span>
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
//                 <BookOpenIcon className="h-6 w-6 text-purple-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Active Courses
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     24
//                     <span className="text-sm text-blue-600 ml-2">
//                       <TrendingUpIcon className="h-4 w-4 inline" /> +2
//                     </span>
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
//                 <ChartBarIcon className="h-6 w-6 text-orange-400" />
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Avg. Score
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     85.2
//                     <span className="text-sm text-green-600 ml-2">
//                       <TrendingUpIcon className="h-4 w-4 inline" /> +3.1
//                     </span>
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Enrollment Trends */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Enrollment Trends</h3>
//           </div>
//           <div className="p-6">
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={enrollmentTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="enrollments"
//                   stroke="#3B82F6"
//                   strokeWidth={2}
//                   name="Enrollments"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="completions"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   name="Completions"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Course Popularity */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Course Popularity</h3>
//           </div>
//           <div className="p-6">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={coursePopularity}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {coursePopularity.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Department Performance */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Department Performance</h3>
//         </div>
//         <div className="p-6">
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={departmentPerformance}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="enrolled" fill="#3B82F6" name="Enrolled" />
//               <Bar dataKey="completed" fill="#10B981" name="Completed" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )

//   const renderEnrollmentReport = () => (
//     <div className="space-y-8">
//       {/* Enrollment Analytics */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Enrollment Analytics</h3>
//         </div>
//         <div className="p-6">
//           <ResponsiveContainer width="100%" height={400}>
//             <AreaChart data={enrollmentTrends}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="enrollments"
//                 stackId="1"
//                 stroke="#3B82F6"
//                 fill="#3B82F6"
//                 fillOpacity={0.6}
//                 name="Enrollments"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Enrollment by Department Table */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Enrollment by Department</h3>
//         </div>
//         <div className="overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Department
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Enrolled
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Completed
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Completion Rate
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Trend
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {departmentPerformance.map((dept) => (
//                 <tr key={dept.name}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {dept.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.enrolled}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.completed}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       dept.rate >= 80 ? 'bg-green-100 text-green-800' :
//                       dept.rate >= 70 ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {dept.rate}%
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <TrendingUpIcon className="h-4 w-4 text-green-500" />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Training Reports</h1>
//               <p className="mt-2 text-gray-600">
//                 Comprehensive analytics and insights into training performance
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => exportReport('pdf')}
//                 className="btn btn-outline flex items-center"
//               >
//                 <PrinterIcon className="h-4 w-4 mr-2" />
//                 Print
//               </button>
              
//               <button
//                 onClick={() => exportReport('excel')}
//                 className="btn btn-primary flex items-center"
//               >
//                 <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Report Type
//               </label>
//               <select
//                 className="input w-full"
//                 value={selectedReport}
//                 onChange={(e) => setSelectedReport(e.target.value)}
//               >
//                 {reportTypes.map((type) => (
//                   <option key={type.id} value={type.id}>
//                     {type.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date Range
//               </label>
//               <select
//                 className="input w-full"
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//               >
//                 <option value="last-7-days">Last 7 Days</option>
//                 <option value="last-30-days">Last 30 Days</option>
//                 <option value="last-90-days">Last 90 Days</option>
//                 <option value="last-year">Last Year</option>
//                 <option value="custom">Custom Range</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department
//               </label>
//               <select
//                 className="input w-full"
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//               >
//                 <option value="all">All Departments</option>
//                 <option value="it">IT</option>
//                 <option value="hr">HR</option>
//                 <option value="finance">Finance</option>
//                 <option value="operations">Operations</option>
//                 <option value="marketing">Marketing</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button className="btn btn-outline w-full flex items-center justify-center">
//                 <EyeIcon className="h-4 w-4 mr-2" />
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Content */}
//       <div className="report-content">
//         {selectedReport === 'overview' && renderOverviewReport()}
//         {selectedReport === 'enrollment' && renderEnrollmentReport()}
//         {selectedReport === 'completion' && renderOverviewReport()}
//         {selectedReport === 'performance' && renderOverviewReport()}
//         {selectedReport === 'course-analytics' && renderOverviewReport()}
//         {selectedReport === 'survey-results' && renderOverviewReport()}
//       </div>

//       {/* Quick Report Actions */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <button className="p-4 border border-gray-300 rounded-lg text-left hover:shadow-md transition-shadow">
//               <DocumentArrowDownIcon className="h-6 w-6 text-blue-500 mb-2" />
//               <h4 className="font-medium text-gray-900">Generate Monthly Report</h4>
//               <p className="text-sm text-gray-600">Create comprehensive monthly training summary</p>
//             </button>
            
//             <button className="p-4 border border-gray-300 rounded-lg text-left hover:shadow-md transition-shadow">
//               <ShareIcon className="h-6 w-6 text-green-500 mb-2" />
//               <h4 className="font-medium text-gray-900">Share Dashboard</h4>
//               <p className="text-sm text-gray-600">Share live dashboard with stakeholders</p>
//             </button>
            
//             <button className="p-4 border border-gray-300 rounded-lg text-left hover:shadow-md transition-shadow">
//               <CalendarIcon className="h-6 w-6 text-purple-500 mb-2" />
//               <h4 className="font-medium text-gray-900">Schedule Report</h4>
//               <p className="text-sm text-gray-600">Set up automated report delivery</p>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ReportsPage
