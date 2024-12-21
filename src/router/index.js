import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import HomeReal from '../views/HomeReal.vue'
import Admin from '../views/Admin.vue'
import Lots from '@/views/Lots.vue'
import LotDetails from '@/views/LotDetails.vue'
import ItemDetails from '@/views/ItemDetails.vue'
import PSA_Collections from '@/views/PSA_Collections.vue'
import PSA_CollectionDetails from '@/views/PSA_CollectionDetails.vue'
import PSA_CardDetail from '@/views/PSA_CardDetail.vue'

import Valuations from '@/views/Valuations.vue'
import ValuationDetail from '@/views/ValuationDetail.vue'


// Routes
  const routes = [
    {
      path: '/',
      component: () => import('../layouts/Default.vue'), // Root layout
      children: [
        {
          path: '', // Default child of "/"
          name: 'Home',
          component: Home,
        },
        {
          path: 'real', // Default child of "/"
          name: 'HomeReal',
          component: HomeReal,
        },
        {
          path: 'admin',
          name: 'Admin',
          component: Admin,
        },
        {
          path: 'lots',
          name: 'Lots',
          component: Lots,
        },
        {
          path: 'lots/:id',
          name: 'LotDetails',
          component: LotDetails,
        },
        {
          path: 'items/:id',
          name: 'ItemDetails',
          component: ItemDetails,
        },
        {
          path: 'psa_collections',
          name: 'PSA_Collections',
          component: PSA_Collections,
        },
        {
          path: 'psa_collections/:id',
          name: 'PSA_CollectionDetails',
          component: PSA_CollectionDetails,
        },
        {
          path: 'psa_cards/:id',
          name: 'PSA_CardDetail',
          component: PSA_CardDetail,
        },
        {
          path: 'app', // Parent route for the "app" section
          //component: () => import('../layouts/Default.vue'), // Sub-layout for the /app section
          children: [
            {
              path: 'valuations', 
              name: 'Valuations',
              component: Valuations,
            },
            {
              path: 'valuation/:id', 
              name: 'ValuationDetail',
              component: ValuationDetail,
            },
          ],
        },
      ],
    },
  ];
 

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
