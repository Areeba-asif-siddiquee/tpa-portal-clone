// import api from './authService'

export const courseService = {
  // Get all courses with filtering and pagination
  async getCourses(params = {}) {
    const response = await api.get('/courses', { params })
    return response.data
  },

  // Alias for getCourses to match CourseManagement expectations
  async getAllCourses(params = {}) {
    const response = await api.get('/courses', { params })
    return {
      data: response.data.data?.courses || response.data.courses || response.data,
      pagination: response.data.data?.pagination || response.data.pagination
    }
  },

  // Get single course by ID with enrollment status
  async getCourse(id) {
    const response = await api.get(`/courses/${id}`)
    return response
  },

  // Create new course
  async createCourse(courseData) {
    const response = await api.post('/courses', courseData)
    return response.data
  },

  // Update course
  async updateCourse(id, courseData) {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  },

  // Delete course
  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },

  // Enroll in course
  async enrollInCourse(id) {
    const response = await api.post(`/courses/${id}/enroll`)
    return response.data
  },

  // Get departments
  async getDepartments() {
    const response = await api.get('/courses/departments')
    return response.data
  },

  // Get training domains
  async getTrainingDomains() {
    const response = await api.get('/courses/domains')
    return response.data
  },

  // Unenroll from course
  async unenrollFromCourse(id) {
    const response = await api.delete(`/courses/${id}/enroll`)
    return response.data
  },

  // Get user's enrollment progress
  async getEnrollmentProgress(id) {
    const response = await api.get(`/courses/${id}/progress`)
    return response.data
  },

  // Update course progress
  async updateProgress(id, progressData) {
    const response = await api.put(`/courses/${id}/progress`, progressData)
    return response.data
  },

  // Get my enrollments
  async getMyEnrollments(params = {}) {
    const response = await api.get('/courses/my-enrollments', { params })
    return response.data
  },

  // Download course material
  async downloadMaterial(courseId, materialId) {
    const response = await api.get(`/courses/${courseId}/materials/${materialId}/download`, {
      responseType: 'blob'
    })
    return response
  }
}
