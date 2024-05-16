import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import Lots from '@/views/Lots.vue'
import LotDetails from '@/views/LotDetails.vue'
import ItemDetails from '@/views/ItemDetails.vue'

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
        path: '/lots',
        name: 'Lots',
        component: Lots,
      },  
      {
        path: '/lots/:id',
        name: 'LotDetails',
        component: LotDetails,
      },  
      {
        path: '/items/:id',
        name: 'ItemDetails',
        component: ItemDetails,
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
