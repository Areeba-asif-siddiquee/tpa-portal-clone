// import { useState, useEffect } from 'react';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   Title, 
//   Tooltip, 
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// } from 'chart.js';
// import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import ReactApexChart from 'react-apexcharts';
// import { courseService } from '../services/courseService';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { 
//   FiBarChart2, 
//   FiTrendingUp, 
//   FiPieChart, 
//   FiUsers, 
//   FiBook, 
//   FiFilter,
//   FiDownload,
//   FiCalendar
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const GraphsDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod] = useState('month');
//   const [selectedDepartment, setSelectedDepartment] = useState('all');
  
//   // Data states
//   const [mostEnrolledData, setMostEnrolledData] = useState([]);
//   const [enrollmentTrends, setEnrollmentTrends] = useState([]);
//   const [departmentStats, setDepartmentStats] = useState([]);
//   const [completionRates, setCompletionRates] = useState([]);
//   const [monthlyTrends, setMonthlyTrends] = useState([]);

//   // Fetch all analytics data
//   useEffect(() => {
//     fetchAllData();
//   }, [period]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [
//         mostEnrolled,
//         trends,
//         deptStats,
//         compRates,
//         monthlyData
//       ] = await Promise.all([
//         courseService.getMostEnrolledCourses(),
//         courseService.getEnrollmentTrends(period, 12),
//         courseService.getDepartmentStats(),
//         courseService.getCompletionRatesByDifficulty(),
//         courseService.getMonthlyTrends()
//       ]);

//       setMostEnrolledData(mostEnrolled.data || []);
//       setEnrollmentTrends(trends.data || []);
//       setDepartmentStats(deptStats.data || []);
//       setCompletionRates(compRates.data || []);
//       setMonthlyTrends(monthlyData.data || []);
//     } catch (error) {
//       console.error('Error fetching analytics data:', error);
//       toast.error('Failed to load analytics data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bar Chart for Most Enrolled Courses
//   const mostEnrolledChartData = {
//     labels: mostEnrolledData.map(item => item.course_name?.substring(0, 20) + '...' || 'Unknown'),
//     datasets: [
//       {
//         label: 'Number of Students Enrolled',
//         data: mostEnrolledData.map(item => item.enrolled_count || 0),
//         backgroundColor: [
//           'rgba(99, 102, 241, 0.8)',
//           'rgba(34, 197, 94, 0.8)',
//           'rgba(251, 191, 36, 0.8)',
//           'rgba(239, 68, 68, 0.8)',
//           'rgba(168, 85, 247, 0.8)',
//           'rgba(20, 184, 166, 0.8)',
//           'rgba(245, 101, 101, 0.8)',
//           'rgba(52, 211, 153, 0.8)',
//           'rgba(251, 146, 60, 0.8)',
//           'rgba(139, 92, 246, 0.8)'
//         ],
//         borderColor: [
//           'rgba(99, 102, 241, 1)',
//           'rgba(34, 197, 94, 1)',
//           'rgba(251, 191, 36, 1)',
//           'rgba(239, 68, 68, 1)',
//           'rgba(168, 85, 247, 1)',
//           'rgba(20, 184, 166, 1)',
//           'rgba(245, 101, 101, 1)',
//           'rgba(52, 211, 153, 1)',
//           'rgba(251, 146, 60, 1)',
//           'rgba(139, 92, 246, 1)'
//         ],
//         borderWidth: 2,
//         borderRadius: 6,
//         borderSkipped: false,
//       }
//     ]
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           padding: 20,
//           usePointStyle: true,
//         }
//       },
//       title: {
//         display: true,
//         text: 'Most Enrolled Courses',
//         font: {
//           size: 16,
//           weight: 'bold'
//         },
//         padding: 20
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleColor: 'white',
//         bodyColor: 'white',
//         borderColor: 'rgba(99, 102, 241, 1)',
//         borderWidth: 1,
//         cornerRadius: 8,
//         displayColors: false,
//         callbacks: {
//           title: function(context) {
//             return mostEnrolledData[context[0].dataIndex]?.course_name || 'Unknown Course';
//           },
//           label: function(context) {
//             return `Students Enrolled: ${context.parsed.y}`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.1)',
//         },
//         ticks: {
//           stepSize: 1
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           maxRotation: 45,
//           minRotation: 0
//         }
//       }
//     }
//   };

//   // ApexCharts configuration for Enrollment Trends
//   const trendsChartOptions = {
//     chart: {
//       type: 'line',
//       height: 350,
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true
//         }
//       },
//       animations: {
//         enabled: true,
//         easing: 'easeinout',
//         speed: 800,
//       }
//     },
//     colors: ['#6366f1', '#10b981', '#f59e0b'],
//     stroke: {
//       curve: 'smooth',
//       width: 3
//     },
//     title: {
//       text: 'Enrollment Trends Over Time',
//       align: 'center',
//       style: {
//         fontSize: '18px',
//         fontWeight: 'bold'
//       }
//     },
//     grid: {
//       borderColor: '#e7e7e7',
//       row: {
//         colors: ['#f3f3f3', 'transparent'],
//         opacity: 0.5
//       }
//     },
//     markers: {
//       size: 6,
//       colors: ['#6366f1', '#10b981', '#f59e0b'],
//       strokeColors: '#fff',
//       strokeWidth: 2,
//       hover: {
//         size: 8
//       }
//     },
//     xaxis: {
//       categories: enrollmentTrends.map(item => item.period_label || item.month || 'N/A'),
//       title: {
//         text: 'Time Period'
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'Number of Students'
//       },
//       min: 0
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right'
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       theme: 'dark'
//     }
//   };

//   const trendsChartSeries = [
//     {
//       name: 'Enrollments',
//       data: enrollmentTrends.map(item => parseInt(item.enrollments) || 0)
//     },
//     {
//       name: 'Completions',
//       data: enrollmentTrends.map(item => parseInt(item.completions) || 0)
//     },
//     {
//       name: 'Average Progress %',
//       data: enrollmentTrends.map(item => Math.round(parseFloat(item.avg_progress) || 0))
//     }
//   ];

//   // Department Statistics Doughnut Chart
//   const deptChartData = {
//     labels: departmentStats.map(item => item.department_name || 'Unknown'),
//     datasets: [
//       {
//         label: 'Total Enrollments',
//         data: departmentStats.map(item => parseInt(item.total_enrollments) || 0),
//         backgroundColor: [
//           'rgba(99, 102, 241, 0.8)',
//           'rgba(34, 197, 94, 0.8)',
//           'rgba(251, 191, 36, 0.8)',
//           'rgba(239, 68, 68, 0.8)',
//           'rgba(168, 85, 247, 0.8)',
//           'rgba(20, 184, 166, 0.8)'
//         ],
//         borderColor: [
//           'rgba(99, 102, 241, 1)',
//           'rgba(34, 197, 94, 1)',
//           'rgba(251, 191, 36, 1)',
//           'rgba(239, 68, 68, 1)',
//           'rgba(168, 85, 247, 1)',
//           'rgba(20, 184, 166, 1)'
//         ],
//         borderWidth: 2,
//         hoverOffset: 10
//       }
//     ]
//   };

//   const deptChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'right',
//         labels: {
//           padding: 20,
//           usePointStyle: true,
//         }
//       },
//       title: {
//         display: true,
//         text: 'Department-wise Enrollments',
//         font: {
//           size: 16,
//           weight: 'bold'
//         },
//         padding: 20
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleColor: 'white',
//         bodyColor: 'white',
//         borderColor: 'rgba(99, 102, 241, 1)',
//         borderWidth: 1,
//         cornerRadius: 8
//       }
//     }
//   };

//   // Completion Rates ApexChart
//   const completionRatesOptions = {
//     chart: {
//       type: 'bar',
//       height: 350,
//       toolbar: {
//         show: true
//       }
//     },
//     colors: ['#10b981'],
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         distributed: true,
//         borderRadius: 4
//       }
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return val + "%"
//       }
//     },
//     title: {
//       text: 'Completion Rates by Difficulty Level',
//       align: 'center',
//       style: {
//         fontSize: '18px',
//         fontWeight: 'bold'
//       }
//     },
//     xaxis: {
//       categories: completionRates.map(item => item.difficulty_level || 'Unknown'),
//       title: {
//         text: 'Completion Rate (%)'
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'Difficulty Level'
//       }
//     }
//   };

//   const completionRatesSeries = [{
//     name: 'Completion Rate',
//     data: completionRates.map(item => parseFloat(item.completion_rate) || 0)
//   }];

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Analytics Dashboard</h1>
//             <p className="text-gray-600">Comprehensive insights into course enrollment trends and statistics</p>
//           </div>
          
//           <div className="flex gap-3">
//             <div className="flex items-center gap-2">
//               <FiCalendar className="w-4 h-4 text-gray-500" />
//               <select
//                 value={period}
//                 onChange={(e) => setPeriod(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="week">Weekly</option>
//                 <option value="month">Monthly</option>
//                 <option value="quarter">Quarterly</option>
//               </select>
//             </div>
            
//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//               <FiDownload className="w-4 h-4" />
//               Export Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Courses</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {departmentStats.reduce((acc, dept) => acc + (parseInt(dept.total_courses) || 0), 0)}
//               </p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <FiBook className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Enrollments</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {departmentStats.reduce((acc, dept) => acc + (parseInt(dept.total_enrollments) || 0), 0)}
//               </p>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <FiUsers className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Avg Completion Rate</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {completionRates.length > 0 ? 
//                   Math.round(completionRates.reduce((acc, rate) => acc + (parseFloat(rate.completion_rate) || 0), 0) / completionRates.length) 
//                   : 0}%
//               </p>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <FiTrendingUp className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Active Departments</p>
//               <p className="text-2xl font-bold text-gray-900">{departmentStats.length}</p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-full">
//               <FiPieChart className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         {/* Bar Chart - Most Enrolled Courses */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <FiBarChart2 className="w-5 h-5 text-blue-600" />
//             <h3 className="text-lg font-bold text-gray-900">Course Enrollment Statistics</h3>
//           </div>
//           <div style={{ height: '400px' }}>
//             {mostEnrolledData.length > 0 ? (
//               <Bar data={mostEnrolledChartData} options={chartOptions} />
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 No enrollment data available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Doughnut Chart - Department Stats */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <FiPieChart className="w-5 h-5 text-green-600" />
//             <h3 className="text-lg font-bold text-gray-900">Department Distribution</h3>
//           </div>
//           <div style={{ height: '400px' }}>
//             {departmentStats.length > 0 ? (
//               <Doughnut data={deptChartData} options={deptChartOptions} />
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 No department data available
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* API Charts Section - ApexCharts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         {/* Enrollment Trends - ApexChart Line Chart */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <FiTrendingUp className="w-5 h-5 text-purple-600" />
//             <h3 className="text-lg font-bold text-gray-900">Enrollment Trends</h3>
//           </div>
//           {enrollmentTrends.length > 0 ? (
//             <ReactApexChart
//               options={trendsChartOptions}
//               series={trendsChartSeries}
//               type="line"
//               height={350}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-80 text-gray-500">
//               No trends data available
//             </div>
//           )}
//         </div>

//         {/* Completion Rates by Difficulty - ApexChart Bar */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <FiBarChart2 className="w-5 h-5 text-orange-600" />
//             <h3 className="text-lg font-bold text-gray-900">Completion Rates</h3>
//           </div>
//           {completionRates.length > 0 ? (
//             <ReactApexChart
//               options={completionRatesOptions}
//               series={completionRatesSeries}
//               type="bar"
//               height={350}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-80 text-gray-500">
//               No completion data available
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Department Statistics Table */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <FiUsers className="w-5 h-5 text-indigo-600" />
//           <h3 className="text-lg font-bold text-gray-900">Department Statistics</h3>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Department
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Total Courses
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Total Enrollments
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Completions
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Avg Progress
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Active Courses
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {departmentStats.map((dept, index) => (
//                 <tr key={index} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
//                     {dept.department_name || 'Unknown'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.total_courses || 0}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.total_enrollments || 0}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.completions || 0}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {Math.round(parseFloat(dept.avg_progress) || 0)}%
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {dept.active_courses || 0}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GraphsDashboard;
