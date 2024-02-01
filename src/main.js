import { createApp } from 'vue'
import App from './App.vue'

import router from './router'



//import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)


// Use the router
app.use(router)

app.mount('#app')
