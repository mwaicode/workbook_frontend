// import axios from 'axios'

// const api = axios.create({ baseURL: '/api' })

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const original = err.config
//     if (err.response?.status === 401 && !original._retry) {
//       original._retry = true
//       const refreshToken = localStorage.getItem('refreshToken')
//       if (refreshToken) {
//         try {
//           const { data } = await axios.post('/api/auth/refresh', { refreshToken })
//           localStorage.setItem('accessToken', data.accessToken)
//           original.headers.Authorization = `Bearer ${data.accessToken}`
//           return api(original)
//         } catch {
//           localStorage.removeItem('accessToken')
//           localStorage.removeItem('refreshToken')
//           window.location.href = '/login'
//         }
//       }
//     }
//     return Promise.reject(err)
//   }
// )

// export default api













import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const refreshURL = import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/api/auth/refresh`
            : '/api/auth/refresh'
          const { data } = await axios.post(refreshURL, { refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return api(original)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
