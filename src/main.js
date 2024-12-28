import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'

import axios from 'axios';
axios.defaults.withCredentials = true;

// Add axios interceptor for JWT token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})


//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

// Use the router
app.use(router)

app.use(createPinia())

registerPlugins(app)

app.mount('#app')