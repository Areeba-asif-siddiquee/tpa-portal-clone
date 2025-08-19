import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const { user } = useAuth()

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    'dashboardData',
    async () => {
      const response = await api.get('/users/dashboard')
      return response.data
    },
    {
      enabled: !!user,
    }
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const stats = dashboardData?.data?.stats || {}
  const enrolledCourses = dashboardData?.data?.enrolledCourses || []
  const pendingSurveys = dashboardData?.data?.pendingSurveys || []
  const notifications = dashboardData?.data?.notifications || []

  const quickAccessItems = [
    {
      name: 'Browse Courses',
      description: 'Explore available training courses',
      href: '/courses',
      icon: BookOpenIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Take Surveys',
      description: 'Complete pending surveys',
      href: '/surveys',
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Training Sectors',
      description: 'Access domain-specific training',
      href: '/training',
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'View Reports',
      description: 'Access your training reports',
      href: '/reports',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ]

  // Filter quick access based on user role
  const filteredQuickAccess = quickAccessItems.filter(item => {
    if (item.href === '/reports') {
      return ['Manager', 'Admin', 'SystemAdmin'].includes(user?.roleName)
    }
    return true
  })

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-secondary-600">
            {user?.roleName} • {user?.departmentName || 'No Department'} • {user?.domainName || 'No Domain'}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-secondary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-500 truncate">
                    Total Enrolled
                  </dt>
                  <dd className="text-lg font-medium text-secondary-900">
                    {stats.total_enrolled || 0}
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
                <AcademicCapIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-secondary-900">
                    {stats.completed || 0}
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
                <ChartBarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-secondary-900">
                    {stats.in_progress || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Access */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-medium text-secondary-900">Quick Access</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {filteredQuickAccess.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-secondary-200 hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${item.color} text-white`}>
                      <item.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-secondary-900">
                      <span className="absolute inset-0" />
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-secondary-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-medium text-secondary-900">Recent Notifications</h2>
          </div>
          <div className="p-6">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-5 w-5 text-secondary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-secondary-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-secondary-400 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary-500">No recent notifications</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Courses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-medium text-secondary-900">My Courses</h2>
          </div>
          <div className="p-6">
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-secondary-900">
                        {course.course_name}
                      </h3>
                      <span className={`badge ${
                        course.completion_status === 'Completed' ? 'badge-success' :
                        course.completion_status === 'In Progress' ? 'badge-warning' :
                        'badge-secondary'
                      }`}>
                        {course.completion_status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      Progress: {course.progress_percentage}%
                    </p>
                    <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <Link
                  to="/courses"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all courses →
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No courses enrolled</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  Get started by browsing available courses.
                </p>
                <div className="mt-6">
                  <Link
                    to="/courses"
                    className="btn btn-primary"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pending Surveys */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-medium text-secondary-900">Pending Surveys</h2>
          </div>
          <div className="p-6">
            {pendingSurveys.length > 0 ? (
              <div className="space-y-4">
                {pendingSurveys.map((survey) => (
                  <div key={survey.id} className="border border-secondary-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-secondary-900">
                      {survey.survey_title}
                    </h3>
                    <p className="text-xs text-secondary-500 mt-1">
                      Due: {new Date(survey.end_date).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <Link
                        to={`/surveys/${survey.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        Complete Survey
                      </Link>
                    </div>
                  </div>
                ))}
                <Link
                  to="/surveys"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all surveys →
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No pending surveys</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  You're all caught up with surveys!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
