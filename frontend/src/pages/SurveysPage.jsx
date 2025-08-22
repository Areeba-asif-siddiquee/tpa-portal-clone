import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PlayIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const SurveysPage = () => {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Fetch surveys
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: 'Training Effectiveness Survey',
      description: 'Evaluate the effectiveness of recent training programs',
      status: 'active',
      type: 'feedback',
      responses: 45,
      totalTargets: 100,
      createdDate: '2025-01-15',
      endDate: '2025-02-15',
      creator: 'Admin User'
    },
    {
      id: 2,
      title: 'Workplace Safety Assessment',
      description: 'Monthly safety compliance and awareness survey',
      status: 'draft',
      type: 'assessment',
      responses: 0,
      totalTargets: 150,
      createdDate: '2025-01-18',
      endDate: '2025-02-28',
      creator: 'Safety Manager'
    },
    {
      id: 3,
      title: 'Employee Satisfaction Survey',
      description: 'Quarterly employee satisfaction and engagement survey',
      status: 'completed',
      type: 'feedback',
      responses: 89,
      totalTargets: 89,
      createdDate: '2024-12-01',
      endDate: '2024-12-31',
      creator: 'HR Manager'
    }
  ]);

  // Fetch user's survey responses
  const { data: responsesData } = useQuery(
    'userSurveyResponses',
    async () => {
      const response = await api.get('/surveys/my-responses')
      return response.data
    },
    {
      enabled: !!user,
    }
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading surveys..." />
  }

  // const surveys = surveysData?.data?.surveys || []
  const userResponses = responsesData?.data?.responses || []

  // Get response status for a survey
  const getResponseStatus = (surveyId) => {
    const response = userResponses.find(r => r.survey_id === surveyId)
    return response ? response.completion_status : null
  }

  const handleTakeSurvey = (surveyId) => {
    // Navigate to survey taking page
    window.location.href = `/surveys/${surveyId}/take`
  }

  const getSurveyStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Closed': return 'bg-red-100 text-red-800'
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResponseStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Started': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const canTakeSurvey = (survey) => {
    const responseStatus = getResponseStatus(survey.id)
    const expired = isExpired(survey.end_date)
    
    return survey.status === 'Active' && !expired && (!responseStatus || responseStatus !== 'Completed')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Training Surveys</h1>
          <p className="mt-2 text-gray-600">
            Participate in surveys to help improve training programs and provide feedback
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="input w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Surveys</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                className="input w-full"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Course Feedback">Course Feedback</option>
                <option value="Training Evaluation">Training Evaluation</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Pre-Training">Pre-Training</option>
                <option value="Post-Training">Post-Training</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{surveys.length}</span> surveys found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Surveys
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {surveys.filter(s => s.status === 'Active' && !isExpired(s.end_date)).length}
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
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userResponses.filter(r => r.completion_status === 'Completed').length}
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
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {surveys.filter(s => canTakeSurvey(s) && !getResponseStatus(s.id)).length}
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
                <DocumentTextIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userResponses.filter(r => r.completion_status === 'In Progress' || r.completion_status === 'Started').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surveys List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Surveys</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {surveys.length > 0 ? (
            surveys.map((survey) => {
              const responseStatus = getResponseStatus(survey.id)
              const expired = isExpired(survey.end_date)
              const canTake = canTakeSurvey(survey)
              
              return (
                <div key={survey.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {survey.survey_title}
                        </h4>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSurveyStatusColor(survey.status)}`}>
                          {survey.status}
                        </span>
                        
                        {responseStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResponseStatusColor(responseStatus)}`}>
                            {responseStatus}
                          </span>
                        )}
                        
                        {expired && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {survey.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-6">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(survey.start_date).toLocaleDateString()} - {new Date(survey.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {survey.survey_type && (
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            <span>{survey.survey_type}</span>
                          </div>
                        )}
                        
                        {survey.estimated_duration && (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{survey.estimated_duration} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {canTake ? (
                        <button
                          onClick={() => handleTakeSurvey(survey.id)}
                          className="btn btn-primary flex items-center"
                        >
                          <PlayIcon className="h-4 w-4 mr-2" />
                          {responseStatus === 'In Progress' || responseStatus === 'Started' ? 'Continue' : 'Take Survey'}
                        </button>
                      ) : responseStatus === 'Completed' ? (
                        <Link
                          to={`/surveys/${survey.id}/results`}
                          className="btn btn-outline flex items-center"
                        >
                          <ChartBarIcon className="h-4 w-4 mr-2" />
                          View Results
                        </Link>
                      ) : (
                        <Link
                          to={`/surveys/${survey.id}/details`}
                          className="btn btn-outline flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-12 text-center">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new surveys to participate in.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* My Survey History */}
      {userResponses.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Survey History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {userResponses.slice(0, 5).map((response) => {
              const survey = surveys.find(s => s.id === response.survey_id)
              if (!survey) return null
              
              return (
                <div key={response.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {survey.survey_title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(response.completed_at || response.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResponseStatusColor(response.completion_status)}`}>
                      {response.completion_status}
                    </span>
                    
                    <Link
                      to={`/surveys/${survey.id}/results`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              )
            })}
            
            {userResponses.length > 5 && (
              <div className="p-4 text-center">
                <Link
                  to="/surveys/my-history"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all survey history →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SurveysPage
