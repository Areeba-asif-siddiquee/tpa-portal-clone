import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiPlus, FiEdit, FiTrash2, FiEye, FiUsers, FiClock,
  FiSend, FiPause, FiPlay, FiSettings, FiDownload, FiFilter
} from 'react-icons/fi';

const SurveyManagement = () => {
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

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || survey.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Management</h1>
        <p className="text-gray-600">Create, distribute, and analyze surveys and assessments</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiEye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {(user.role === 'admin' || user.role === 'manager') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiPlus />
              Create Survey
            </button>
          )}
        </div>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
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

      {/* Create Survey Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Create New Survey</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Survey Title
                    </label>
                    <input
                      type="text"
                      value={newSurvey.title}
                      onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter survey title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Survey Type
                    </label>
                    <select
                      value={newSurvey.type}
                      onChange={(e) => setNewSurvey({...newSurvey, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="feedback">Feedback</option>
                      <option value="assessment">Assessment</option>
                      <option value="evaluation">Evaluation</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newSurvey.description}
                    onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter survey description"
                  />
                </div>

                {/* Questions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                    <button
                      onClick={addQuestion}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newSurvey.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Question {index + 1}
                          </h4>
                          {newSurvey.questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Enter your question"
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="text">Text Response</option>
                              <option value="rating">Rating Scale</option>
                              <option value="yes-no">Yes/No</option>
                            </select>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                                className="mr-2"
                              />
                              Required
                            </label>
                          </div>

                          {question.type === 'multiple-choice' && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Options:</label>
                              {question.options.map((option, optionIndex) => (
                                <input
                                  key={optionIndex}
                                  type="text"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(question.id, 'options', newOptions);
                                  }}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSurvey}
                disabled={!newSurvey.title || !newSurvey.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Distribute Modal */}
      {showDistributeModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Distribute Survey</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Employees</option>
                  <option>Department Specific</option>
                  <option>Role Specific</option>
                  <option>Custom List</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Send reminder notifications
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDistributeModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedSurvey.id, 'active');
                  setShowDistributeModal(false);
                  setSelectedSurvey(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Distribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Survey Modal */}
      {showViewModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">{selectedSurvey.title}</h2>
              <p className="text-gray-600 mt-1">{selectedSurvey.description}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(selectedSurvey.status)}`}>
                    {getStatusIcon(selectedSurvey.status)}
                    {selectedSurvey.status.charAt(0).toUpperCase() + selectedSurvey.status.slice(1)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="ml-2 capitalize">{selectedSurvey.type}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Responses:</span>
                  <span className="ml-2">{selectedSurvey.responses}/{selectedSurvey.totalTargets}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">End Date:</span>
                  <span className="ml-2">{new Date(selectedSurvey.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedSurvey.responses > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
                  <div className="text-sm text-gray-600">
                    Response Rate: {Math.round((selectedSurvey.responses / selectedSurvey.totalTargets) * 100)}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              {selectedSurvey.responses > 0 && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <FiDownload className="w-4 h-4 inline mr-1" />
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement;
