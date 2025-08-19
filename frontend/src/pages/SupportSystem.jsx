import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiPlus, FiMessageSquare, FiUser, FiClock, FiCheckCircle, 
  FiAlertCircle, FiSearch, FiFilter, FiSend, FiPaperclip,
  FiBook, FiHelpCircle, FiPhone, FiMail, FiUsers, FiSettings
} from 'react-icons/fi';

const SupportSystem = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock support data
  const [supportData, setSupportData] = useState({
    tickets: [
      {
        id: 'T001',
        title: 'Unable to access course materials',
        description: 'I cannot download the PDF materials for React Advanced course',
        category: 'technical',
        priority: 'medium',
        status: 'open',
        createdBy: 'John Doe',
        assignedTo: 'Sarah Wilson',
        createdAt: '2025-01-15',
        updatedAt: '2025-01-16',
        replies: 3
      },
      {
        id: 'T002',
        title: 'Course completion certificate not generated',
        description: 'Completed JavaScript Fundamentals but certificate is not available',
        category: 'certificate',
        priority: 'high',
        status: 'in_progress',
        createdBy: 'Alice Johnson',
        assignedTo: 'Mike Davis',
        createdAt: '2025-01-14',
        updatedAt: '2025-01-18',
        replies: 5
      },
      {
        id: 'T003',
        title: 'Request for additional training resources',
        description: 'Need more practice exercises for Node.js course',
        category: 'content',
        priority: 'low',
        status: 'resolved',
        createdBy: 'Bob Smith',
        assignedTo: 'Lisa Brown',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-12',
        replies: 2
      }
    ],
    faqs: [
      {
        id: 1,
        question: 'How do I enroll in a course?',
        answer: 'To enroll in a course, navigate to the Courses page, find your desired course, and click the "Enroll" button. You will be automatically enrolled if the course is available.',
        category: 'enrollment',
        votes: 45
      },
      {
        id: 2,
        question: 'How can I track my progress?',
        answer: 'Your progress is automatically tracked as you complete course modules. You can view your progress on the course detail page or in your dashboard.',
        category: 'progress',
        votes: 32
      },
      {
        id: 3,
        question: 'How do I get my completion certificate?',
        answer: 'Once you complete a course with 80% or higher score, your certificate will be automatically generated and available in your profile under "Certificates".',
        category: 'certificates',
        votes: 28
      }
    ],
    feedback: [
      {
        id: 1,
        type: 'suggestion',
        title: 'Add mobile app for training',
        description: 'Would be great to have a mobile app for on-the-go learning',
        author: 'Emma Wilson',
        date: '2025-01-15',
        status: 'under_review',
        votes: 12
      },
      {
        id: 2,
        type: 'bug_report',
        title: 'Video player not working on Safari',
        description: 'Course videos fail to load on Safari browser',
        author: 'David Chen',
        date: '2025-01-14',
        status: 'in_progress',
        votes: 8
      }
    ]
  });

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium'
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateTicket = () => {
    const ticket = {
      id: `T${String(supportData.tickets.length + 1).padStart(3, '0')}`,
      ...newTicket,
      status: 'open',
      createdBy: user.firstName + ' ' + user.lastName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      replies: 0
    };

    setSupportData({
      ...supportData,
      tickets: [ticket, ...supportData.tickets]
    });

    setNewTicket({
      title: '',
      description: '',
      category: 'technical',
      priority: 'medium'
    });
    setShowCreateTicket(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const filteredTickets = supportData.tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Get help, submit feedback, and find answers to common questions</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'tickets', name: 'Support Tickets', icon: FiMessageSquare },
              { id: 'faq', name: 'FAQ', icon: FiHelpCircle },
              { id: 'feedback', name: 'Feedback', icon: FiUsers },
              { id: 'contact', name: 'Contact', icon: FiPhone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Tickets Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <button
                onClick={() => setShowCreateTicket(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus />
                New Ticket
              </button>
            </div>
          </div>

          {/* Tickets List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        <span>{ticket.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{ticket.createdAt}</span>
                      </div>
                      {ticket.replies > 0 && (
                        <div className="flex items-center gap-1">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>{ticket.replies} replies</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="ml-4 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {supportData.faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{faq.votes} helpful</span>
                  </div>
                </div>
                <p className="text-gray-600">{faq.answer}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${{
                    enrollment: 'bg-blue-100 text-blue-800',
                    progress: 'bg-green-100 text-green-800',
                    certificates: 'bg-purple-100 text-purple-800'
                  }[faq.category]}`}>
                    {faq.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Community Feedback</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <FiPlus />
                Submit Feedback
              </button>
            </div>
            
            <div className="space-y-4">
              {supportData.feedback.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">by {item.author} on {item.date}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${{
                      suggestion: 'bg-blue-100 text-blue-800',
                      bug_report: 'bg-red-100 text-red-800',
                      under_review: 'bg-yellow-100 text-yellow-800',
                      in_progress: 'bg-purple-100 text-purple-800'
                    }[item.type] || 'bg-gray-100 text-gray-800'}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>{item.votes} votes</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${{
                      under_review: 'bg-yellow-100 text-yellow-800',
                      in_progress: 'bg-blue-100 text-blue-800',
                      completed: 'bg-green-100 text-green-800'
                    }[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-5PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <FiMail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-gray-600">support@trainingportal.com</p>
                  <p className="text-sm text-gray-500">24/7 response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FiBook className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Documentation</p>
                  <p className="text-gray-600">Help Center & Guides</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    Browse Documentation →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Contact Form</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your inquiry"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Technical Issue</option>
                  <option>Course Content</option>
                  <option>Billing</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiSend className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="content">Course Content</option>
                  <option value="certificate">Certificates</option>
                  <option value="billing">Billing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the issue..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateTicket(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicket.title || !newTicket.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportSystem;
