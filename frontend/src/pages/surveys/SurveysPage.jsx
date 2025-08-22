import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FiPlus, FiEdit, FiTrash2, FiEye, FiUsers, FiClock,
  FiSend, FiPause, FiPlay, FiSettings, FiDownload, FiFilter
} from 'react-icons/fi';


const SurveysPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
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
  const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDistributeModal, setShowDistributeModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
  
    const [newSurvey, setNewSurvey] = useState({
      title: '',
      description: '',
      type: 'feedback',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: '',
          options: ['', '', '', ''],
          required: true
        }
      ]
    });
  
    useEffect(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, []);
  
    const getStatusColor = (status) => {
      const colors = {
        active: 'bg-green-100 text-green-800',
        draft: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-gray-100 text-gray-800',
        paused: 'bg-red-100 text-red-800'
      };
      return colors[status] || colors.draft;
    };
  
    const getStatusIcon = (status) => {
      const icons = {
        active: <FiPlay className="w-4 h-4" />,
        draft: <FiEdit className="w-4 h-4" />,
        // completed: <FiBarChart3 className="w-4 h-4" />,
        paused: <FiPause className="w-4 h-4" />
      };
      return icons[status] || icons.draft;
    };
  
    const handleCreateSurvey = () => {
      const survey = {
        id: Date.now(),
        ...newSurvey,
        status: 'draft',
        responses: 0,
        totalTargets: 0,
        createdDate: new Date().toISOString().split('T')[0],
        creator: user.firstName + ' ' + user.lastName
      };
      
      setSurveys([...surveys, survey]);
      setShowCreateModal(false);
      setNewSurvey({
        title: '',
        description: '',
        type: 'feedback',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            required: true
          }
        ]
      });
    };
  
    const handleStatusChange = (surveyId, newStatus) => {
      setSurveys(surveys.map(survey => 
        survey.id === surveyId ? { ...survey, status: newStatus } : survey
      ));
    };
  
    const handleDeleteSurvey = (surveyId) => {
      if (window.confirm('Are you sure you want to delete this survey?')) {
        setSurveys(surveys.filter(survey => survey.id !== surveyId));
      }
    };
  
    const addQuestion = () => {
      const newQuestion = {
        id: Date.now(),
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        required: true
      };
      setNewSurvey({
        ...newSurvey,
        questions: [...newSurvey.questions, newQuestion]
      });
    };
  
    const updateQuestion = (questionId, field, value) => {
      setNewSurvey({
        ...newSurvey,
        questions: newSurvey.questions.map(q => 
          q.id === questionId ? { ...q, [field]: value } : q
        )
      });
    };
  
    const removeQuestion = (questionId) => {
      if (newSurvey.questions.length > 1) {
        setNewSurvey({
          ...newSurvey,
          questions: newSurvey.questions.filter(q => q.id !== questionId)
        });
      }
    };

    if (loading) return <LoadingSpinner/>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Surveys</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Complete training surveys and provide feedback
        </p>
      </div>
      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(survey.status)}`}>
                  {getStatusIcon(survey.status)}
                  {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {setSelectedSurvey(survey); setShowViewModal(true);}}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="View Survey"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  {(user.role === 'admin' || user.role === 'manager') && (
                    <>
                      <button
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="Edit Survey"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurvey(survey.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Delete Survey"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{survey.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">{survey.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Responses:</span>
                  <span className="font-medium">{survey.responses}/{survey.totalTargets}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">End Date:</span>
                  <span className="font-medium">{new Date(survey.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Response Rate</span>
                  <span className="text-xs text-gray-500">
                    {survey.totalTargets > 0 ? Math.round((survey.responses / survey.totalTargets) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: survey.totalTargets > 0 ? `${(survey.responses / survey.totalTargets) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {survey.status === 'draft' && (
                  <button
                    onClick={() => {setSelectedSurvey(survey); setShowDistributeModal(true);}}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <FiSend className="w-4 h-4 inline mr-1" />
                    Distribute
                  </button>
                )}
                
                {survey.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(survey.id, 'paused')}
                    className="flex-1 px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    <FiPause className="w-4 h-4 inline mr-1" />
                    Pause
                  </button>
                )}
                
                {survey.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(survey.id, 'active')}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <FiPlay className="w-4 h-4 inline mr-1" />
                    Resume
                  </button>
                )}
                
                {survey.responses > 0 && (
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    {/* <FiBarChart3 className="w-4 h-4 inline mr-1" /> */}
                    Results
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SurveysPage
