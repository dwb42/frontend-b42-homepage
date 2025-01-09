import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'

import axios from 'axios';
axios.defaults.withCredentials = true;

// Add axios interceptors
// Request interceptor for JWT token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor for 401 handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('isLoggedIn')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)


//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

// Use the router
app.use(router)

app.use(createPinia())

registerPlugins(app)

app.mount('#app')