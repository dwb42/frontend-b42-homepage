<template>
  <v-app-bar color="primary" density="compact">
    <!--template v-slot:prepend>
      <v-app-bar-nav-icon @click="openNav = !openNav"></v-app-bar-nav-icon>
      {{openNav}}
  </template-->
    
    <v-app-bar-title class="pl-xs-0 pl-md-4"><router-link :to="{ name: 'Home' }" class="text-decoration-none text-white">saas-valuation.com</router-link></v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-dots-vertical" @click="openSettings = !openSettings"></v-btn>
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

  <v-navigation-drawer permanent location="right" v-if="openSettings">
    <v-list>
      <v-list-item
        lines="two"
       
        subtitle="Logged in"
        :title="JSON.parse(localStorage.getItem('user'))?.email || 'Not logged in'"
      ></v-list-item>
    </v-list>
     <!--prepend-avatar="@/assets/user-icon-nav.png"-->

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item isActive prepend-icon="mdi-format-list-bulleted-square" title="Valuations" :to="{ name: 'Valuations' }">
        </v-list-item> 

      <v-list-item prepend-icon="mdi-logout" title="Log-Out"
        @click="openNav = !openNav"></v-list-item>

      <!--v-list-item prepend-icon="mdi-gavel" title="PSA Auction Data" :to="{ name: 'PSA_Collections' }"
        @click="openNav = !openNav"></v-list-item-->

    </v-list>
  </v-navigation-drawer>

  
</template>


<script setup>
import { ref } from 'vue'

const openNav = ref(false)
const openSettings = ref(false)
</script>  