import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Lots from '@/views/Lots.vue'
import LotDetails from '@/views/LotDetails.vue'
import ItemDetails from '@/views/ItemDetails.vue'
import PSA_Collections from '@/views/PSA_Collections.vue'
import PSA_CollectionDetails from '@/views/PSA_CollectionDetails.vue'
import PSA_CardDetail from '@/views/PSA_CardDetail.vue'


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
        path: '/admin',
        name: 'Admin',
        component: Admin,
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
      {
        path: '/psa_collections',
        name: 'PSA_Collections',
        component: PSA_Collections,
      },  
      {
        path: '/psa_collections/:id',
        name: 'PSA_CollectionDetails',
        component: PSA_CollectionDetails,
      },  
      {
        path: '/psa_cards/:id',
        name: 'PSA_CardDetail',
        component: PSA_CardDetail,
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
