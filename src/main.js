
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Create Pinia instance
const pinia = createPinia()

// Setup axios interceptors
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.defaults.withCredentials = true

const app = createApp(App)

// Use the router and pinia
app.use(router)
app.use(pinia)

// Initialize user store from localStorage
const userStore = pinia.state.value.userStore
if (userStore) {
  userStore.initializeFromLocalStorage()
}

// Register plugins
import { registerPlugins } from '@/plugins'
registerPlugins(app)

app.mount('#app')
