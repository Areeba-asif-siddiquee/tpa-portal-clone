// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useQuery } from 'react-query'
// import { courseService } from '../../services/courseService'

// const CourseListPage = () => {
//   const { data, isLoading, error } = useQuery(
//     ['courses'],
//     courseService.getCourses
//   )

//   if (isLoading) return <div>Loading...</div>
//   if (error) return <div>Error loading courses</div>

//   const courses = data?.courses || []

//   return (
//     <div>
//       <h1>Courses</h1>
//       <ul>
//         {courses.map(course => (
//           <li key={course.id}>
//             <Link to={`/courses/${course.id}`}>{course.course_name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default CourseListPage