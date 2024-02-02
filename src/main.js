import { createApp } from 'vue'
import App from './App.vue'

import router from './router'



//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

// Use the router
app.use(router)


registerPlugins(app)



app.mount('#app')

