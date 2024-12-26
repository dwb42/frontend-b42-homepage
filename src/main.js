import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'

import axios from 'axios';
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