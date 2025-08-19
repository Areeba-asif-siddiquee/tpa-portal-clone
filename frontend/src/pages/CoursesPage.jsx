import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const CoursesPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Fetch courses
  const { data: coursesData, isLoading } = useQuery(
    'courses',
    async () => {
      const response = await api.get('/courses')
      return response.data
    }
  )

  // Fetch user enrollments
  const { data: enrollmentsData } = useQuery(
    'userEnrollments',
    async () => {
      const response = await api.get('/courses/my-enrollments')
      return response.data
    },
    {
      enabled: !!user,
    }
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading courses..." />
  }

  const courses = coursesData?.data?.courses || []
  const categories = coursesData?.data?.categories || []
  const enrollments = enrollmentsData?.data?.enrollments || []

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category_id === parseInt(selectedCategory)
    const matchesLevel = selectedLevel === 'all' || course.difficulty_level === selectedLevel
    
    let matchesStatus = true
    if (selectedStatus !== 'all') {
      const enrollment = enrollments.find(e => e.course_id === course.id)
      if (selectedStatus === 'enrolled') {
        matchesStatus = !!enrollment
      } else if (selectedStatus === 'completed') {
        matchesStatus = enrollment?.completion_status === 'Completed'
      } else if (selectedStatus === 'in-progress') {
        matchesStatus = enrollment?.completion_status === 'In Progress'
      } else if (selectedStatus === 'available') {
        matchesStatus = !enrollment
      }
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`)
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Enrollment failed:', error)
    }
  }

  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment ? enrollment.completion_status : null
  }

  const getProgressPercentage = (courseId) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment ? enrollment.progress_percentage || 0 : 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Training Courses</h1>
          <p className="mt-2 text-gray-600">
            Explore and enroll in available training courses to enhance your skills
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              className="input"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Status Filter */}
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="available">Available</option>
              <option value="enrolled">Enrolled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Courses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courses.length}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    My Enrollments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.length}
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
                <CheckCircleIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.filter(e => e.completion_status === 'Completed').length}
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
                <ClockIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.filter(e => e.completion_status === 'In Progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const enrollmentStatus = getEnrollmentStatus(course.id)
          const progressPercentage = getProgressPercentage(course.id)
          
          return (
            <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              {/* Course Image/Header */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpenIcon className="h-12 w-12 text-white" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty_level}
                  </span>
                  
                  {enrollmentStatus && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollmentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                      enrollmentStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {enrollmentStatus}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {course.course_name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.course_description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{course.estimated_duration || 'Self-paced'}</span>
                  
                  <UserIcon className="h-4 w-4 ml-4 mr-1" />
                  <span>{course.enrolled_count || 0} enrolled</span>
                </div>
                
                {enrollmentStatus && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {enrollmentStatus ? (
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn btn-primary flex items-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      {enrollmentStatus === 'Completed' ? 'Review' : 'Continue'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="btn btn-outline flex items-center"
                    >
                      <BookOpenIcon className="h-4 w-4 mr-2" />
                      Enroll Now
                    </button>
                  )}
                  
                  <Link
                    to={`/courses/${course.id}/details`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
