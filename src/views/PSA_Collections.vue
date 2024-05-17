<template>
  <h1 class="text-h4 mb-2"><b>PSA Collections</b></h1>
 
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <v-table>
        <thead>
          <tr>
            <!--th class="text-left">id</th-->
            <th class="text-left">Name</th>
            <th class="text-left">Nr Players</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in psa_collectionsData" :key="item.id">
            <!--td>{{ item.id }}</td-->
            <td>
              <router-link :to="`/psa_collections/${item.id}`">{{ item.name }} </router-link>
            </td> 
            <td></td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup>
  import { ref, computed, watchEffect, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat } from '@/utils/index.js';
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  const psa_collectionsData = ref({}); 

  


  async function fetchCollections(id) {
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_collections/');
    psa_collectionsData.value = response.data; // Assuming the API returns the lots data directly
    //console.log('itemsdata ', psa_collectionsData.value);
    } catch (error) {
    console.error('Error fetching items:', error);  }
  }
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchCollections();
  });
 
</script>
