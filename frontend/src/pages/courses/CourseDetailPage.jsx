import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../../contexts/AuthContext'
import { courseService } from '../../services/courseService'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'
import {
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const CourseDetailPage = () => {
  const { id } = useParams()
  const { user, hasRole } = useAuth()

  // Fetch course details
  const { data: courseData, isLoading, refetch } = useQuery(
    ['course', id],
    () => courseService.getCourse(id),
    {
      enabled: !!id,
    }
  )

  const course = courseData?.data?.course
  const enrollmentStatus = courseData?.data?.enrollmentStatus

  // Handle course enrollment
  const handleEnroll = async () => {
    try {
      await courseService.enrollInCourse(id)
      toast.success('Successfully enrolled in course!')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    }
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

  const getEnrollmentStatusBadge = (status) => {
    const statusMap = {
      'Not Started': 'badge-secondary',
      'In Progress': 'badge-warning',
      'Completed': 'badge-success',
      'Cancelled': 'badge-danger'
    }
    return statusMap[status] || 'badge-secondary'
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading course details..." />
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400" />
        <h3 className="mt-2 text-sm font-medium text-secondary-900">Course not found</h3>
        <p className="mt-1 text-sm text-secondary-500">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/courses"
          className="mt-6 btn btn-primary inline-flex items-center"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-secondary-500">
        <Link to="/courses" className="hover:text-secondary-700">Courses</Link>
        <span>/</span>
        <span className="text-secondary-900">{course.course_name}</span>
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-secondary-900">
                  {course.course_name}
                </h1>
                <span className={`badge text-sm ${getStatusBadge(course.status)}`}>
                  {course.status}
                </span>
                {enrollmentStatus && (
                  <span className={`badge text-sm ${getEnrollmentStatusBadge(enrollmentStatus.completion_status)}`}>
                    {enrollmentStatus.completion_status}
                  </span>
                )}
              </div>
              {course.course_code && (
                <p className="text-lg text-secondary-600 mt-2">
                  Course Code: {course.course_code}
                </p>
              )}
              <p className="text-secondary-700 mt-4 text-lg leading-relaxed">
                {course.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            {!enrollmentStatus ? (
              (course.status === 'Published' || course.status === 'Active') ? (
                <button
                  onClick={handleEnroll}
                  className="btn btn-primary btn-lg"
                >
                  Enroll in Course
                </button>
              ) : (
                <button
                  disabled
                  className="btn btn-secondary btn-lg opacity-50 cursor-not-allowed"
                >
                  Not Available for Enrollment
                </button>
              )
            ) : (
              <div className="flex space-x-3">
                {enrollmentStatus.completion_status === 'Completed' ? (
                  <button className="btn btn-success btn-lg">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    View Certificate
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg">
                    <PlayIcon className="h-5 w-5 mr-2" />
                    {enrollmentStatus.completion_status === 'Not Started' ? 'Start Course' : 'Continue Course'}
                  </button>
                )}
                <Link to="/courses" className="btn btn-outline btn-lg">
                  Browse More Courses
                </Link>
              </div>
            )}
            
            {hasRole(['Admin', 'SystemAdmin', 'Manager']) && (
              <Link
                to={`/admin/courses/${course.id}/edit`}
                className="btn btn-outline btn-lg"
              >
                Edit Course
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar (if enrolled) */}
          {enrollmentStatus && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-secondary-900 mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Progress</span>
                  <span className="font-medium">{enrollmentStatus.progress_percentage}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${enrollmentStatus.progress_percentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-500">Enrolled:</span>
                    <p className="font-medium">{new Date(enrollmentStatus.enrollment_date).toLocaleDateString()}</p>
                  </div>
                  {enrollmentStatus.final_score && (
                    <div>
                      <span className="text-secondary-500">Score:</span>
                      <p className="font-medium">{enrollmentStatus.final_score}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {course.learning_objectives && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-secondary-900 mb-4">Learning Objectives</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-secondary-700 whitespace-pre-line">
                  {course.learning_objectives}
                </p>
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-secondary-900 mb-4">Prerequisites</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-secondary-700 whitespace-pre-line">
                  {course.prerequisites}
                </p>
              </div>
            </div>
          )}

          {/* Course Materials */}
          {course.course_materials && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-secondary-900 mb-4">Course Materials</h2>
              <div className="space-y-3">
                {JSON.parse(course.course_materials || '[]').map((material, index) => (
                  <div key={index} className="flex items-center p-3 border border-secondary-200 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-secondary-400 mr-3" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-secondary-900">{material.name || `Material ${index + 1}`}</h3>
                      <p className="text-xs text-secondary-500">{material.type || 'Document'}</p>
                    </div>
                    <button className="btn btn-sm btn-outline">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-secondary-900 mb-4">Course Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Duration</p>
                  <p className="text-sm text-secondary-600">
                    {course.duration_hours ? `${course.duration_hours} hours` : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Difficulty</p>
                  <p className="text-sm text-secondary-600">{course.difficulty_level || 'Beginner'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Enrollment</p>
                  <p className="text-sm text-secondary-600">
                    {course.total_enrollments || 0} students
                    {course.max_participants && ` (${course.max_participants} max)`}
                  </p>
                </div>
              </div>

              {course.delivery_method && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Delivery</p>
                    <p className="text-sm text-secondary-600">{course.delivery_method}</p>
                  </div>
                </div>
              )}

              {course.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Location</p>
                    <p className="text-sm text-secondary-600">{course.location}</p>
                  </div>
                </div>
              )}

              {(course.schedule_start || course.schedule_end) && (
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Schedule</p>
                    <p className="text-sm text-secondary-600">
                      {course.schedule_start && new Date(course.schedule_start).toLocaleDateString()}
                      {course.schedule_end && ` - ${new Date(course.schedule_end).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructor */}
          {course.instructor_name && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-secondary-900 mb-4">Instructor</h2>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {course.instructor_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">{course.instructor_name}</p>
                  {course.instructor_email && (
                    <p className="text-sm text-secondary-500">{course.instructor_email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Department & Domain */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-secondary-900 mb-4">Category</h2>
            <div className="space-y-3">
              {course.department_name && (
                <div>
                  <p className="text-sm font-medium text-secondary-900">Department</p>
                  <p className="text-sm text-secondary-600">{course.department_name}</p>
                </div>
              )}
              {course.domain_name && (
                <div>
                  <p className="text-sm font-medium text-secondary-900">Training Domain</p>
                  <p className="text-sm text-secondary-600">{course.domain_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
