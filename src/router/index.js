import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import DataCollectionForm from '@/views/DataCollectionForm.vue'
import Testform01 from '@/views/Testform01.vue'

// Routes
const routes = [
  {
    path: '/',
    component: () => import('../layouts/Default.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },    
      {
        path: '/datacollectionform',
        name: 'DataCollectionForm',
        component: DataCollectionForm,
      },             
      {
        path: '/testform01',
        name: 'TestForm01',
        component: Testform01,
      },  
    ],
  },
 

]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
