
<template>
  <div>Verifying...</div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  import { apiBaseURL } from '@/utils/index.js';

  const router = useRouter()
  const route = useRoute()

  //pinia
  import { useUserStore } from '@/stores/useUserStore.js'
  const userStore = useUserStore()

  onMounted(async () => {
    try {
      const token = route.query.token
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${apiBaseURL}/auth/verify`, {
        params: { token },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Verification message:', response);
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Save JWT token to both localStorage and store
      userStore.setToken(response.data.token)
      
      // Update the store with user data
      userStore.setUserData(response.data.user)
      router.push('/app/valuations')
    } catch (error) {
      console.error(error)
      router.push('/login')
    }
  })
</script>
