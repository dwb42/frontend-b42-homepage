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

  onMounted(async () => {
    try {
      const token = route.query.token
      // Call backend to verify token, handle redirection
      const response = await axios.get(`${apiBaseURL}/auth/verify?token=${token}`)
      
      console.log('Verification message:', response);
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(response.data.user))


      //temp router.push('/app/valuations')
    } catch (error) {
      console.error(error)
      // Show an error or redirect to a login page
      //temp router.push('/login')
    }
  })

</script>