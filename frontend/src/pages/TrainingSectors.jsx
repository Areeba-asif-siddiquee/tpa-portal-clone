import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUsers, FiBook, FiTarget, FiSettings, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const TrainingSectors = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState([
    {
      id: 1,
      name: 'Technical Skills',
      description: 'Programming, software development, and technical competencies',
      courses: 12,
      assignedEmployees: 45,
      completionRate: 78,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Soft Skills',
      description: 'Communication, leadership, and interpersonal skills',
      courses: 8,
      assignedEmployees: 67,
      completionRate: 85,
      color: 'green'
    },
    {
      id: 3,
      name: 'Leadership',
      description: 'Management and leadership development programs',
      courses: 6,
      assignedEmployees: 23,
      completionRate: 92,
      color: 'purple'
    },
    {
      id: 4,
      name: 'Safety Training',
      description: 'Workplace safety and compliance training',
      courses: 15,
      assignedEmployees: 89,
      completionRate: 95,
      color: 'red'
    },
    {
      id: 5,
      name: 'Compliance',
      description: 'Regulatory compliance and legal requirements',
      courses: 10,
      assignedEmployees: 34,
      completionRate: 88,
      color: 'yellow'
    }
  ]);
  
  const [selectedSector, setSelectedSector] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Mock employee data
    setEmployees([
      { id: 1, name: 'John Smith', department: 'Engineering', role: 'Developer' },
      { id: 2, name: 'Sarah Johnson', department: 'Marketing', role: 'Manager' },
      { id: 3, name: 'Mike Davis', department: 'Sales', role: 'Representative' },
      { id: 4, name: 'Lisa Wilson', department: 'HR', role: 'Specialist' },
      { id: 5, name: 'Tom Brown', department: 'Finance', role: 'Analyst' }
    ]);
  }, []);

  const openAssignModal = (sector) => {
    setSelectedSector(sector);
    setShowAssignModal(true);
  };

  const handleAssignEmployees = () => {
    // Handle assignment logic here
    console.log('Assigning employees:', selectedEmployees, 'to sector:', selectedSector);
    setShowAssignModal(false);
    setSelectedEmployees([]);
    setSelectedSector(null);
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-50'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        hover: 'hover:bg-green-50'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-50'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        hover: 'hover:bg-red-50'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-50'
      }
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Sectors</h1>
        <p className="text-gray-600">Manage training domains and assign employees to specific sectors</p>
      </div>

      {/* Action Bar */}
      {(user.role === 'admin' || user.role === 'manager') && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus />
            Add New Sector
          </button>
        </div>
      )}

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`bg-white rounded-lg shadow-md border-l-4 ${getColorClasses(sector.color, 'border')} overflow-hidden`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getColorClasses(sector.color, 'bg')}`}>
                  <FiBook className={`w-6 h-6 ${getColorClasses(sector.color, 'text')}`} />
                </div>
                {(user.role === 'admin' || user.role === 'manager') && (
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-500 hover:text-blue-600">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-600">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{sector.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{sector.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Courses</span>
                  <span className="font-medium">{sector.courses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Assigned Employees</span>
                  <span className="font-medium">{sector.assignedEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Completion Rate</span>
                  <span className="font-medium">{sector.completionRate}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs text-gray-500">{sector.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getColorClasses(sector.color, 'bg').replace('100', '600')}`}
                    style={{ width: `${sector.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => openAssignModal(sector)}
                  className={`flex-1 px-3 py-2 text-sm border rounded-md ${getColorClasses(sector.color, 'border')} ${getColorClasses(sector.color, 'text')} ${getColorClasses(sector.color, 'hover')}`}
                >
                  <FiUsers className="w-4 h-4 inline mr-2" />
                  Assign Employees
                </button>
                <button className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <FiSettings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Performance Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sector Performance Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiBook className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sectors.reduce((sum, sector) => sum + sector.courses, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiUsers className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-green-600">
                  {sectors.reduce((sum, sector) => sum + sector.assignedEmployees, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiTarget className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(sectors.reduce((sum, sector) => sum + sector.completionRate, 0) / sectors.length)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiSettings className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Sectors</p>
                <p className="text-2xl font-bold text-yellow-600">{sectors.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Assign Employees to {selectedSector?.name}
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Select employees to assign to this training sector:
              </p>
              
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">
                        {employee.department} - {employee.role}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployees([]);
                  setSelectedSector(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignEmployees}
                disabled={selectedEmployees.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign ({selectedEmployees.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Sector Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Training Sector</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter sector name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter sector description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Theme
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Sector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSectors;
