// import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { courseService } from '../services/courseService';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';

// const CourseManagement = () => {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterSector, setFilterSector] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     level: '',
//     training_sector_id: '',
//     status: 'active'
//   });

//   const trainingSectors = [
//     { id: 1, name: 'Technical Skills' },
//     { id: 2, name: 'Soft Skills' },
//     { id: 3, name: 'Leadership' },
//     { id: 4, name: 'Safety Training' },
//     { id: 5, name: 'Compliance' }
//   ];

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await courseService.getAllCourses();
//       setCourses(response.data);
//     } catch (err) {
//       setError('Failed to fetch courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCourse = async (e) => {
//     e.preventDefault();
//     try {
//       await courseService.createCourse(formData);
//       setShowCreateModal(false);
//       resetForm();
//       fetchCourses();
//     } catch (err) {
//       setError('Failed to create course');
//     }
//   };

//   const handleEditCourse = async (e) => {
//     e.preventDefault();
//     try {
//       await courseService.updateCourse(selectedCourse.id, formData);
//       setShowEditModal(false);
//       resetForm();
//       setSelectedCourse(null);
//       fetchCourses();
//     } catch (err) {
//       setError('Failed to update course');
//     }
//   };

//   const handleDeleteCourse = async (courseId) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       try {
//         await courseService.deleteCourse(courseId);
//         fetchCourses();
//       } catch (err) {
//         setError('Failed to delete course');
//       }
//     }
//   };

//   const openEditModal = (course) => {
//     setSelectedCourse(course);
//     setFormData({
//       title: course.title,
//       description: course.description,
//       duration: course.duration,
//       level: course.level,
//       training_sector_id: course.training_sector_id,
//       status: course.status
//     });
//     setShowEditModal(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       duration: '',
//       level: '',
//       training_sector_id: '',
//       status: 'active'
//     });
//   };

//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
//     const matchesSector = filterSector === 'all' || course.training_sector_id.toString() === filterSector;
//     return matchesSearch && matchesStatus && matchesSector;
//   });

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
//         <p className="text-gray-600">Manage and organize training courses</p>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <div className="flex-1 relative">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             <FiFilter />
//             Filters
//           </button>
//           {(user.role === 'admin' || user.role === 'manager') && (
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               <FiPlus />
//               Add Course
//             </button>
//           )}
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="draft">Draft</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Training Sector</label>
//               <select
//                 value={filterSector}
//                 onChange={(e) => setFilterSector(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Sectors</option>
//                 {trainingSectors.map(sector => (
//                   <option key={sector.id} value={sector.id}>{sector.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
//           {error}
//         </div>
//       )}

//       {/* Courses Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCourses.map((course) => (
//                 <tr key={course.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
//                       <p className="text-sm text-gray-500 truncate max-w-xs">{course.description}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{course.duration}</td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       course.level === 'beginner' ? 'bg-green-100 text-green-800' :
//                       course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {course.level}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       course.status === 'active' ? 'bg-green-100 text-green-800' :
//                       course.status === 'inactive' ? 'bg-red-100 text-red-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {course.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{course.enrollment_count || 0}</td>
//                   <td className="px-6 py-4 text-sm font-medium">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => window.location.href = `/courses/${course.id}`}
//                         className="text-blue-600 hover:text-blue-900"
//                         title="View Details"
//                       >
//                         <FiEye className="w-4 h-4" />
//                       </button>
//                       {(user.role === 'admin' || user.role === 'manager') && (
//                         <>
//                           <button
//                             onClick={() => openEditModal(course)}
//                             className="text-indigo-600 hover:text-indigo-900"
//                             title="Edit Course"
//                           >
//                             <FiEdit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteCourse(course.id)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete Course"
//                           >
//                             <FiTrash2 className="w-4 h-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Create Course Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-xl font-bold mb-4">Create New Course</h2>
//             <form onSubmit={handleCreateCourse}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.duration}
//                     onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                     placeholder="e.g., 2 hours, 1 week"
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//                   <select
//                     required
//                     value={formData.level}
//                     onChange={(e) => setFormData({...formData, level: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Level</option>
//                     <option value="beginner">Beginner</option>
//                     <option value="intermediate">Intermediate</option>
//                     <option value="advanced">Advanced</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Training Sector</label>
//                   <select
//                     required
//                     value={formData.training_sector_id}
//                     onChange={(e) => setFormData({...formData, training_sector_id: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Sector</option>
//                     {trainingSectors.map(sector => (
//                       <option key={sector.id} value={sector.id}>{sector.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {setShowCreateModal(false); resetForm();}}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Create Course
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Course Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-xl font-bold mb-4">Edit Course</h2>
//             <form onSubmit={handleEditCourse}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.duration}
//                     onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//                   <select
//                     required
//                     value={formData.level}
//                     onChange={(e) => setFormData({...formData, level: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="beginner">Beginner</option>
//                     <option value="intermediate">Intermediate</option>
//                     <option value="advanced">Advanced</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Training Sector</label>
//                   <select
//                     required
//                     value={formData.training_sector_id}
//                     onChange={(e) => setFormData({...formData, training_sector_id: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {trainingSectors.map(sector => (
//                       <option key={sector.id} value={sector.id}>{sector.name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData({...formData, status: e.target.value})}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="draft">Draft</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {setShowEditModal(false); resetForm(); setSelectedCourse(null);}}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Update Course
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseManagement;
