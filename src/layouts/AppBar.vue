<template>
  <v-app-bar color="primary" density="compact">
    <!--template v-slot:prepend>
      <v-app-bar-nav-icon @click="openNav = !openNav"></v-app-bar-nav-icon>
      {{openNav}}
  </template-->
    
    <v-app-bar-title class="pl-xs-0 pl-md-4"><router-link :to="{ name: 'Home' }" class="text-decoration-none text-white">saas-valuation.com</router-link></v-app-bar-title>

    <template v-slot:append v-if="userStore.user.email">
      <v-btn icon="mdi-dots-vertical" @click="openSettings = !openSettings"></v-btn>
    </template>

    <template v-if="!userStore.user.email"e> 
      <router-link :to="{ name: 'Login' }" class="text-decoration-none text-white mr-6">Login</router-link>
    </template>
  </v-app-bar>


  <v-navigation-drawer permanent v-if="openNav">
    <!-- <v-list>
          <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              title="Sandra Adams"
              subtitle="sandra_a88@gmailcom"
          ></v-list-item>
        </v-list> -->

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <!-- <v-list-item isActive prepend-icon="mdi-home-outline" title="Home" :to="{ name: 'Home' }">
        </v-list-item> -->

      <!--v-list-item prepend-icon="mdi-archive" title="Lots for purchase" :to="{ name: 'Lots' }"
        @click="openNav = !openNav"></v-list-item>

      <v-list-item prepend-icon="mdi-gavel" title="PSA Auction Data" :to="{ name: 'PSA_Collections' }"
        @click="openNav = !openNav"></v-list-item-->
      
    </v-list>
  </v-navigation-drawer>
  
  <v-navigation-drawer permanent location="right" v-if="userStore.user.email && openSettings">
    <v-list>
      <v-list-item
        lines="two"
       
        subtitle="Logged in"
        :title="userStore.user.email"
      ></v-list-item>
    </v-list>
     <!--prepend-avatar="@/assets/user-icon-nav.png"-->

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-format-list-bulleted-square" title="Valuations" :to="{ name: 'Valuations' }">
        </v-list-item> 

      <v-list-item prepend-icon="mdi-logout" title="Log-Out"
        @click="logout()"></v-list-item>

      <!--v-list-item prepend-icon="mdi-gavel" title="PSA Auction Data" :to="{ name: 'PSA_Collections' }"
        @click="openNav = !openNav"></v-list-item-->

    </v-list>
  </v-navigation-drawer>

  
</template>


<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { apiBaseURL } from '@/utils/index.js';
  
  const router = useRouter()
  
  //pinia
  import { useUserStore } from '@/stores/useUserStore.js'
  const userStore = useUserStore()
  
  
  
  
  const openNav = ref(false)
  const openSettings = ref(false)
  
  const user = ref({ id: null, email: '' });
  
  onMounted(() => {
    // If the store is empty but we have localStorage data, rehydrate the store
    if (!userStore.user.email) {
      const userData = localStorage.getItem('user')
      if (userData && userData !== 'undefined') {
        try {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData) {
            userStore.setUserData(parsedUserData);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user'); // Clear invalid data
        }
      }
    }
  })
  
  
  async function logout() {
    try {
      await axios.post(`${apiBaseURL}/auth/logout`, {}, { withCredentials: true })
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('user')
      userStore.clearUserData() // Clear store as well
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

</script>  