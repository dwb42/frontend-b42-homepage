import { createRouter, createWebHistory } from 'vue-router'

// Import components
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Valuations from '@/views/Valuations.vue'
import ValuationDetail from '@/views/ValuationDetail.vue'
import MagicalLinkVerification from '@/views/MagicLinkVerification.vue'

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
          path: 'login', 
          name: 'Login',
          component: Login,
        },
        {
          path: 'admin',
          name: 'Admin',
          component: Admin,
        },
        {
          path: 'verify',
          name: 'verify',
          component: MagicalLinkVerification,
        },
        {
          path: 'app', // Parent route for the "app" section
          //meta: { requiresAuth: true },
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


// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check if this route (or a parent) has 'requiresAuth'
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Read from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      // Not logged in -> go to /login
      return next({ name: 'Login' })
    }
  }
  next()
})


export default router
