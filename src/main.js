import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import axios from 'axios'; 
// The base URL should be your BACKEND's domain
//axios.defaults.baseURL = 'https://0cc1571a-2243-4c69-977c-1089b23dcaa7-00-1q6dz6lfs5ps9.janeway.replit.dev'
// Enable sending cookies with every request
axios.defaults.withCredentials = true


//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

// Use the router
app.use(router)

registerPlugins(app)

app.mount('#app')