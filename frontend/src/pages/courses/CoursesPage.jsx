import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../../contexts/AuthContext'
import { courseService } from '../../services/courseService'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const CoursesPage = () => {
  const { user, hasRole } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 12

  // Fetch courses
  const { data: coursesData, isLoading, refetch } = useQuery(
    ['courses', {
      search: searchTerm,
      status: statusFilter,
      department: departmentFilter,
      domain: domainFilter,
      sortBy,
      sortOrder,
      page: currentPage,
      limit
    }],
    () => courseService.getCourses({
      search: searchTerm,
      status: statusFilter,
      department: departmentFilter,
      domain: domainFilter,
      sortBy,
      sortOrder,
      page: currentPage,
      limit
    }),
    {
      keepPreviousData: true,
    }
  )

  const courses = coursesData?.data?.courses || []
  const pagination = coursesData?.data?.pagination || {}

  // Handle course enrollment
  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId)
      toast.success('Successfully enrolled in course!')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setDepartmentFilter('')
    setDomainFilter('')
    setCurrentPage(1)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusMap = {
      'Published': 'badge-success',
      'Active': 'badge-primary',
      'Draft': 'badge-secondary',
      'Completed': 'badge-secondary',
      'Cancelled': 'badge-danger'
    }
    return statusMap[status] || 'badge-secondary'
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading courses..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Courses</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Explore and enroll in training courses
          </p>
        </div>
        {hasRole(['Admin', 'SystemAdmin', 'Manager']) && (
          <Link
            to="/admin/courses/new"
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Course
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              className="form-input"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
            >
              <option value="created_at-DESC">Newest First</option>
              <option value="created_at-ASC">Oldest First</option>
              <option value="course_name-ASC">Name A-Z</option>
              <option value="course_name-DESC">Name Z-A</option>
              <option value="duration_hours-ASC">Shortest First</option>
              <option value="duration_hours-DESC">Longest First</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter || departmentFilter || domainFilter) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-secondary-600">
              {pagination.total || 0} courses found
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-secondary-900 truncate">
                      {course.course_name}
                    </h3>
                    <span className={`badge ${getStatusBadge(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  {course.course_code && (
                    <p className="text-sm text-secondary-500 mt-1">
                      {course.course_code}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-secondary-600 line-clamp-3">
                {course.description || 'No description available'}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-secondary-500">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {course.duration_hours ? `${course.duration_hours} hours` : 'Duration not set'}
                </div>
                <div className="flex items-center text-sm text-secondary-500">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {course.difficulty_level || 'Beginner'}
                </div>
                <div className="flex items-center text-sm text-secondary-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {course.total_enrollments || 0} enrolled
                  {course.max_participants && ` / ${course.max_participants} max`}
                </div>
                {course.domain_name && (
                  <div className="flex items-center text-sm text-secondary-500">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    {course.domain_name}
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/courses/${course.id}`}
                  className="btn btn-outline flex-1 text-center"
                >
                  View Details
                </Link>
                {course.status === 'Published' || course.status === 'Active' ? (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="btn btn-primary flex-1"
                  >
                    Enroll
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-secondary flex-1 opacity-50 cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900">
              {searchTerm || statusFilter ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="mt-1 text-sm text-secondary-500">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for new courses.'}
            </p>
            {(searchTerm || statusFilter) && (
              <button
                onClick={resetFilters}
                className="mt-6 btn btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="btn btn-outline ml-3"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-secondary-700">
                Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> courses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2)
                  if (page > pagination.totalPages) return null
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
