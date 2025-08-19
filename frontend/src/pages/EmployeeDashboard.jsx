import React from 'react'

const EmployeeDashboard = () => (
  <div style={{border: "2px solid #2e58cc", borderRadius: "5px"}}>
    <header style={{background: "#4661e3", color: "#fff", padding: "20px 0", textAlign: "center", fontSize:"1.6rem", fontWeight: "bold"}}>
      <span style={{float:"left",marginLeft:"16px"}}>LOGO</span>
      EMPLOYEE TRAINING PORTAL
      <span style={{float:"right",marginRight:"18px",fontWeight:400}}>LOGOUT</span>
    </header>
    <div style={{display:"flex"}}>
      <nav style={{width: "340px", borderRight: "1px solid #444", padding:"32px 0", background:"#fff"}}>
        <div style={{padding:"18px 32px",fontWeight:"bold",fontSize:"1.3rem"}}>
          Welcome to your dashboard,<br />
          <span style={{fontWeight:400}}>Areeba Siddiquee.</span>
        </div>
        <button style={{marginTop: "45px",width: "70%",marginLeft:"10%",padding:"15px",background:"linear-gradient(90deg, #fdc7e9, #fffcb9)",borderRadius:"20px",border:"1px solid #ccc",fontWeight:"bold",fontSize:"1rem"}}>Fill New Form +</button>
      </nav>
      <main style={{flex:1,padding:"16px"}}>
        <div style={{display:"flex",gap:"20px",marginBottom:"16px"}}>
          <div style={{flex:0.9,minWidth:"320px",background:"#fafbff",borderRadius:"10px",padding:"16px"}}>
            <h3 style={{fontWeight:700,marginBottom:"6px"}}>New Updates <span style={{fontWeight:400, fontSize:"1rem"}}>View Details</span></h3>
            <div style={{background:"#e3e9fa",marginBottom:"8px",borderRadius:"6px",padding:"8px"}}>
              <div>Revision in PNG retail price w.e.f 9th April 2023</div>
              <div style={{fontSize:"0.96rem"}}>Date : 12-04-2023</div>
            </div>
            <div style={{background:"#e3e9fa",marginBottom:"8px",borderRadius:"6px",padding:"8px"}}>
              <div>Revision in CNG retail price w.e.f 9th April 2023</div>
              <div style={{fontSize:"0.96rem"}}>Date : 12-04-2023</div>
            </div>
          </div>
          <div style={{background:"#fafbff",flex:1.2,borderRadius:"10px",padding:"16px"}}>
            <div>
              <div>Budget Infographic</div>
              <div style={{width:"96%",height:"98px",background:"#eee",borderRadius:"8px",marginTop:"8px"}}></div>
            </div>
          </div>
        </div>
        {/* KPIs */}
        <div style={{display:"flex",gap:"24px",marginBottom:"20px",marginTop:"18px"}}>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Requests</div>
          <div style={{border:"3px solid #ffd400",background:"linear-gradient(90deg, #fdc7e9, #fffcb9)",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Enrolled Members</div>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Active Courses</div>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Courses</div>
        </div>
        {/* Example Table */}
        <div style={{marginTop:"28px",background:"#e3e9fa",borderRadius:"10px",padding:"12px 24px"}}>
          <span style={{fontWeight:700,fontSize:"1.15rem"}}>JAN - MAY PROCEDURE SUMMARY</span>
          <table style={{width:"100%",marginTop:"8px",background:"#fafbff",borderRadius:"7px",overflow:"hidden"}}>
            <thead>
              <tr style={{background:"#b7d2ff"}}>
                <th>Department</th><th>January</th><th>February</th><th>March</th><th>April</th><th>May</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frontend Dev</td><td>12</td><td>15</td><td>18</td><td>20</td><td>22</td><td>87</td>
              </tr>
              <tr>
                <td>Backend Dev</td><td>8</td><td>12</td><td>14</td><td>16</td><td>18</td><td>68</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
)
export default EmployeeDashboard




// import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { 
//   FiUser, FiBookOpen, FiBell, FiCalendar, FiClock, FiTrendingUp,
//   FiCheckCircle, FiPlayCircle, FiFileText, FiAward
// } from 'react-icons/fi';

// const EmployeeDashboard = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);

//   // Mock employee data
//   const [employeeData, setEmployeeData] = useState({
//     profile: {
//       name: 'Areeba Siddiquee',
//       department: 'Engineering',
//       position: 'Software Developer',
//       joinDate: '2023-01-15'
//     },
//     overview: {
//       totalRequests: 12,
//       activeCourses: 8,
//       totalCourses: 15,
//       totalEnrolledMembers: 245
//     },
//     budgetProgress: [
//       { category: 'Frontend', percentage: 70, color: '#9333ea' },
//       { category: 'Backend', percentage: 35, color: '#ec4899' },
//       { category: 'DevOps', percentage: 30, color: '#3b82f6' },
//       { category: 'Database', percentage: 40, color: '#10b981' },
//       { category: 'Testing', percentage: 60, color: '#f59e0b' }
//     ],
//     recentUpdates: [
//       {
//         id: 1,
//         title: 'Revision in PNG retail price w.e.f 9th April 2023',
//         date: '12-04-2023',
//         type: 'price_update'
//       },
//       {
//         id: 2,
//         title: 'New React 18 Features Training Available',
//         date: '11-04-2023',
//         type: 'training_update'
//       },
//       {
//         id: 3,
//         title: 'Quarterly Performance Review Scheduled',
//         date: '10-04-2023',
//         type: 'review'
//       }
//     ],
//     monthlyProgress: [
//       { department: 'Frontend Development', jan: 12, feb: 15, mar: 18, apr: 20, may: 22, total: 87 },
//       { department: 'Backend Development', jan: 8, feb: 12, mar: 14, apr: 16, may: 18, total: 68 },
//       { department: 'Database Management', jan: 5, feb: 8, mar: 10, apr: 12, may: 15, total: 50 },
//       { department: 'API Development', jan: 3, feb: 5, mar: 8, apr: 10, may: 12, total: 38 },
//       { department: 'Testing & QA', jan: 6, feb: 9, mar: 11, apr: 13, may: 16, total: 55 }
//     ],
//     enrolledCourses: [
//       { id: 1, title: 'Advanced React Concepts', progress: 85, status: 'in_progress' },
//       { id: 2, title: 'Node.js Fundamentals', progress: 100, status: 'completed' },
//       { id: 3, title: 'Database Design', progress: 45, status: 'in_progress' },
//       { id: 4, title: 'API Security', progress: 20, status: 'in_progress' }
//     ]
//   });

//   useEffect(() => {
//     // Simulate loading
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const getProgressColor = (progress) => {
//     if (progress >= 80) return 'bg-green-500';
//     if (progress >= 60) return 'bg-blue-500';
//     if (progress >= 40) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//         <div className="px-6 py-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold">EMPLOYEE TRAINING PORTAL</h1>
//             </div>
//             <div className="text-right">
//               <button className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100">
//                 LOGOUT
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Welcome Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiUser className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-2">
//                   Welcome to your dashboard,
//                 </h2>
//                 <p className="text-xl font-bold text-indigo-600 mb-4">
//                   {employeeData.profile.name}
//                 </p>
//                 <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all">
//                   Fill New Form
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* New Updates */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <FiBell className="w-5 h-5" />
//                 New Updates
//               </h3>
//               <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                 View Details
//               </button>
//             </div>
            
//             <div className="space-y-3">
//               {employeeData.recentUpdates.map((update) => (
//                 <div key={update.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
//                   <h4 className="text-sm font-medium text-gray-900 mb-1">
//                     {update.title}
//                   </h4>
//                   <p className="text-xs text-gray-600">Date: {update.date}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Budget Infographic */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">BUDGET INFOGRAPHIC</h3>
            
//             <div className="space-y-3">
//               {employeeData.budgetProgress.map((item, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">{item.category}</span>
//                     <span className="font-medium">{item.percentage}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="h-2 rounded-full"
//                       style={{ 
//                         width: `${item.percentage}%`,
//                         backgroundColor: item.color 
//                       }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//               <FiFileText className="w-8 h-8 text-gray-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{employeeData.overview.totalRequests}</p>
//             <p className="text-sm text-gray-600">Total Requests</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 relative">
//               <FiBookOpen className="w-8 h-8 text-yellow-600" />
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{employeeData.overview.totalEnrolledMembers}</p>
//             <p className="text-sm text-gray-600">Total Enrolled Members</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//               <FiPlayCircle className="w-8 h-8 text-gray-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{employeeData.overview.activeCourses}</p>
//             <p className="text-sm text-gray-600">Active Courses</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//               <FiAward className="w-8 h-8 text-gray-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{employeeData.overview.totalCourses}</p>
//             <p className="text-sm text-gray-600">Total Courses</p>
//           </div>
//         </div>

//         {/* Monthly Progress Table */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Training Progress</h3>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Department</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">January</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">February</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">March</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">April</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">May</th>
//                   <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employeeData.monthlyProgress.map((row, index) => (
//                   <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
//                     <td className="py-3 px-4 text-sm text-gray-900 font-medium">{row.department}</td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
//                         row.jan >= 15 ? 'bg-green-500' : row.jan >= 10 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}>
//                         {row.jan}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
//                         row.feb >= 15 ? 'bg-green-500' : row.feb >= 10 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}>
//                         {row.feb}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
//                         row.mar >= 15 ? 'bg-green-500' : row.mar >= 10 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}>
//                         {row.mar}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
//                         row.apr >= 15 ? 'bg-green-500' : row.apr >= 10 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}>
//                         {row.apr}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
//                         row.may >= 15 ? 'bg-green-500' : row.may >= 10 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}>
//                         {row.may}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <div className={`inline-block px-3 py-1 rounded text-white text-sm font-bold ${
//                         row.total >= 70 ? 'bg-purple-500' : row.total >= 50 ? 'bg-blue-500' : 'bg-gray-500'
//                       }`}>
//                         {row.total}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Current Enrollments */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">My Current Enrollments</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {employeeData.enrolledCourses.map((course) => (
//               <div key={course.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     course.status === 'completed' ? 'bg-green-100 text-green-800' :
//                     course.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {course.status.replace('_', ' ')}
//                   </span>
//                 </div>
                
//                 <div className="mb-2">
//                   <div className="flex justify-between text-sm text-gray-600 mb-1">
//                     <span>Progress</span>
//                     <span>{course.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
//                       style={{ width: `${course.progress}%` }}
//                     ></div>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-2 mt-3">
//                   <button className="flex-1 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
//                     Continue
//                   </button>
//                   {course.status === 'completed' && (
//                     <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
//                       Certificate
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;
