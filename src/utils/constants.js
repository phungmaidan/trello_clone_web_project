let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:5000'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-ikuu.onrender.com'
}
//export const API_ROOT = 'http://localhost:5000'
export const API_ROOT = apiRoot