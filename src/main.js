import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'

import axios from 'axios';
axios.defaults.baseURL = 'https://0cc1571a-2243-4c69-977c-1089b23dcaa7-00-1q6dz6lfs5ps9.janeway.replit.dev';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;


//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

// Use the router
app.use(router)

app.use(createPinia())

registerPlugins(app)

app.mount('#app')