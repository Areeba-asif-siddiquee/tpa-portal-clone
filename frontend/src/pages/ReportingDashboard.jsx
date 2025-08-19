import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiUsers, FiBook, FiTarget, FiTrendingUp, FiDownload, FiFilter, 
  FiCalendar, FiPieChart,FiActivity
} from 'react-icons/fi';

const ReportingDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for charts and analytics
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalCourses: 45,
      activeCourses: 32,
      totalEnrolledMembers: 1247,
      totalRequests: 89
    },
    budgetData: [
      { category: 'Technical Training', percentage: 70, amount: '$140,000' },
      { category: 'Soft Skills', percentage: 35, amount: '$70,000' },
      { category: 'Leadership', percentage: 30, amount: '$60,000' },
      { category: 'Safety Training', percentage: 40, amount: '$80,000' },
      { category: 'Compliance', percentage: 60, amount: '$120,000' }
    ],
    browserData: [
      { name: 'Chrome', percentage: 45, color: '#9333ea' },
      { name: 'Firefox', percentage: 25, color: '#3b82f6' },
      { name: 'Safari', percentage: 15, color: '#f59e0b' },
      { name: 'IE', percentage: 8, color: '#10b981' },
      { name: 'Other', percentage: 7, color: '#ef4444' }
    ],
    departmentProgress: [
      { department: 'Engineering', completed: 85, inProgress: 12, pending: 3 },
      { department: 'Marketing', completed: 92, inProgress: 5, pending: 3 },
      { department: 'Sales', completed: 78, inProgress: 18, pending: 4 },
      { department: 'HR', completed: 95, inProgress: 3, pending: 2 },
      { department: 'Finance', completed: 88, inProgress: 8, pending: 4 }
    ],
    monthlyData: [
      { month: 'Jan', enrollments: 120, completions: 98 },
      { month: 'Feb', enrollments: 150, completions: 142 },
      { month: 'Mar', enrollments: 180, completions: 165 },
      { month: 'Apr', enrollments: 200, completions: 185 },
      { month: 'May', enrollments: 165, completions: 155 },
      { month: 'Jun', enrollments: 190, completions: 175 }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Analytics</h1>
            <p className="text-gray-600">Comprehensive training reports and insights</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FiDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalCourses}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeCourses}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiTarget className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrolled Members</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalEnrolledMembers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalRequests}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiActivity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Budget Infographic */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            {/* <FiBarChart3 className="w-5 h-5" /> */}
            Budget Breakdown
          </h3>
          
          <div className="space-y-4">
            {dashboardData.budgetData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm font-medium text-gray-700">
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Statistics</h3>
          
          <div className="overflow-hidden rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { category: 'Technical', active: 100, total: 120 },
                  { category: 'Leadership', active: 85, total: 100 },
                  { category: 'Safety', active: 95, total: 110 },
                  { category: 'Compliance', active: 78, total: 90 },
                  { category: 'Soft Skills', active: 92, total: 105 }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-cyan-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm text-cyan-600 font-medium">DATA {index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.active}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Browser Usage Pie Chart */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiPieChart className="w-5 h-5" />
            Platform Usage
          </h3>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#e5e7eb" strokeWidth="2"
                />
                {/* Chrome */}
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#9333ea" strokeWidth="2"
                  strokeDasharray="45 100"
                  strokeDashoffset="0"
                />
                {/* Firefox */}
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#3b82f6" strokeWidth="2"
                  strokeDasharray="25 100"
                  strokeDashoffset="-45"
                />
                {/* Safari */}
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#f59e0b" strokeWidth="2"
                  strokeDasharray="15 100"
                  strokeDashoffset="-70"
                />
                {/* IE */}
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#10b981" strokeWidth="2"
                  strokeDasharray="8 100"
                  strokeDashoffset="-85"
                />
                {/* Other */}
                <circle
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke="#ef4444" strokeWidth="2"
                  strokeDasharray="7 100"
                  strokeDashoffset="-93"
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            {dashboardData.browserData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Department Progress</h3>
          
          <div className="space-y-4">
            {dashboardData.departmentProgress.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm text-gray-500">{dept.completed}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${dept.completed}%` }}
                    ></div>
                    <div 
                      className="bg-yellow-500"
                      style={{ width: `${dept.inProgress}%` }}
                    ></div>
                    <div 
                      className="bg-red-500"
                      style={{ width: `${dept.pending}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Completed ({dept.completed}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    In Progress ({dept.inProgress}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Pending ({dept.pending}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5" />
            Monthly Trends
          </h3>
          
          <div className="space-y-4">
            {dashboardData.monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="w-16 text-sm font-medium text-gray-700">{month.month}</div>
                <div className="flex-1 mx-4 relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(month.enrollments / 200) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(month.completions / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-blue-600 font-medium">{month.enrollments}</div>
                  <div className="text-green-600 font-medium">{month.completions}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Enrollments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Completions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Advanced Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">Average Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
            <div className="text-sm text-gray-600">Average Course Rating</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">156h</div>
            <div className="text-sm text-gray-600">Average Training Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;
