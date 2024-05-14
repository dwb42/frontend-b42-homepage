import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import DataCollectionForm from '@/views/DataCollectionForm.vue'
import Lots from '@/views/Lots.vue'
import LotDetails from '@/views/LotDetails.vue'

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
        path: '/lots/:id',
        name: 'LotDetails',
        component: LotDetails,
      },  
      {
        path: '/lots',
        name: 'Lots',
        component: Lots,
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
