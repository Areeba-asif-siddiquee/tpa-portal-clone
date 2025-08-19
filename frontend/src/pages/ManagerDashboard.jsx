import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const ManagerDashboard = () => {
  const { user } = useAuth()

  // Fetch manager dashboard data
  const { data: managerData, isLoading } = useQuery(
    'managerDashboardData',
    async () => {
      const response = await api.get('/users/dashboard')
      return response.data
    },
    {
      enabled: !!user,
    }
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading manager dashboard..." />
  }

  const stats = managerData?.data?.stats || {}
  const teamMembers = managerData?.data?.teamMembers || []
  const pendingApprovals = managerData?.data?.pendingApprovals || []

  // Sample data for charts
  const teamProgressData = [
    { name: 'Week 1', completed: 12, assigned: 20 },
    { name: 'Week 2', completed: 18, assigned: 25 },
    { name: 'Week 3', completed: 22, assigned: 30 },
    { name: 'Week 4', completed: 28, assigned: 32 }
  ]

  const departmentPerformance = [
    { name: 'Excellent', value: 45, color: '#10B981' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Average', value: 15, color: '#F59E0B' },
    { name: 'Needs Improvement', value: 5, color: '#EF4444' }
  ]

  const managerQuickActions = [
    {
      name: 'Team Overview',
      description: 'Monitor team training progress',
      href: '/manager/team',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      stat: teamMembers.length || 0
    },
    {
      name: 'Approve Training',
      description: 'Review and approve training requests',
      href: '/manager/approvals',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      stat: pendingApprovals.length || 0
    },
    {
      name: 'Team Reports',
      description: 'Generate team performance reports',
      href: '/manager/reports',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      stat: null
    },
    {
      name: 'Training Plans',
      description: 'Create and manage training plans',
      href: '/manager/training-plans',
      icon: AcademicCapIcon,
      color: 'bg-orange-500',
      stat: stats.active_plans || 0
    }
  ]

  return (
    <div className="space-y-8">
      {/* Manager Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 shadow rounded-lg">
        <div className="px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">
            Manager Dashboard
          </h1>
          <p className="mt-2 text-green-100">
            Team Manager • {user?.departmentName || 'Department'} • {user?.domainName || 'Training Domain'}
          </p>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Team Size
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.team_size || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.monthly_completions || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Approvals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pending_approvals || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Team Performance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.performance_score || 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Progress Over Time */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Progress Tracking</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="assigned"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Assigned"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Performance Distribution</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {departmentPerformance.map((perf, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: perf.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{perf.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{perf.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manager Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Manager Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managerQuickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </span>
                  </div>
                  {action.stat !== null && (
                    <div className="text-2xl font-bold text-gray-500">
                      {action.stat}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <span className="absolute inset-0" />
                    {action.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Members */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          </div>
          <div className="p-6">
            {teamMembers.length > 0 ? (
              <div className="space-y-4">
                {teamMembers.slice(0, 6).map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.department_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {member.completion_rate || 0}%
                      </p>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/manager/team"
                  className="text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  View all team members →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Team members will appear here once assigned.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
          </div>
          <div className="p-6">
            {pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.slice(0, 5).map((approval, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {approval.course_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Requested by: {approval.user_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(approval.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">
                          Approve
                        </button>
                        <button className="btn btn-sm btn-outline">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  to="/manager/approvals"
                  className="text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  View all approvals →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All training requests are up to date!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
