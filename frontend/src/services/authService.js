export const authService = {
  async login(credentials) {

    return { success: false, error: "Backend login disabled" };
  },
  async register(userData) {
    return { success: false, error: "Registration disabled" };
  },
  async logout() {
    return { success: true };
  },
  async verifyToken() {
    return { success: true };
  },
  async getProfile() {
    return { success: false, error: "Not implemented" };
  },
  async forgotPassword(email) {
    return { success: false, error: "Not implemented" };
  },
  async resetPassword(token, newPassword) {
    return { success: false, error: "Not implemented" };
  },
};

export default authService;



// import axios from 'axios'

// // Create axios instance
// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('token')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// export const authService = {
//   // Login user
//   async login(credentials) {
//     const response = await api.post('/auth/login', credentials)
//     return response.data
//   },

//   // Register user
//   async register(userData) {
//     const response = await api.post('/auth/register', userData)
//     return response.data
//   },

//   // Logout user
//   async logout() {
//     const response = await api.post('/auth/logout')
//     return response.data
//   },

//   // Verify token
//   async verifyToken() {
//     const response = await api.get('/auth/verify')
//     return response.data
//   },

//   // Get current user profile
//   async getProfile() {
//     const response = await api.get('/auth/profile')
//     return response.data
//   },

//   // Request password reset
//   async forgotPassword(email) {
//     const response = await api.post('/auth/forgot-password', { email })
//     return response.data
//   },

//   // Reset password
//   async resetPassword(token, newPassword) {
//     const response = await api.post('/auth/reset-password', { token, newPassword })
//     return response.data
//   }
// }


