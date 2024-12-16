import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ cho việc lưu JWT tokens (refresh & acess) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request & Response)
 */
// Interceptor Request: Can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  // Kỹ thuật chăn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Interceptor Response: Can thiệp vào giữa những response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // Kỹ thuật chăn spam click
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

  // Kỹ thuật chăn spam click
  interceptorLoadingElements(false)

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (Viết code một lần: Clean Code)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
  if (error.response?.statuss !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})
export default authorizedAxiosInstance