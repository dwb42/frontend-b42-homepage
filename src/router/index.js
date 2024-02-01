import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import Search from '@/views/Search.vue'
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
        path: '/search',
        name: 'Search',
        component: Search,
      },             
    ],
  },
  {
    path: '/testform01',
    name: 'testform01',
    component: Testform01,
  },   

]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
