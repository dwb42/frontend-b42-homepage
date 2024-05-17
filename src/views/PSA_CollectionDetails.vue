<template>
  <span class="text-caption"><router-link :to="`/psa_collections/`">PSA Collections</router-link></span>
  <h1 class="text-h4 mb-2"><b>
    {{ psa_collectionData.name }}</b> &nbsp;
    <!--v-btn color="primary" size="small" @click="openEditModal">Edit Lot</v-btn-->
  </h1>
  <!--span class="text-body-1 mr-6">status: {{ lotData.status }}</span>
  <span class="text-body-1 mr-6">id: {{ lotData.id }}</span>
  <span class="text-body-1 mr-6">created: {{ formatDateUsingDateFns(lotData.createdAt) }}</span>
  <span class="text-body-1">
    <a :href="lotData.url_to_marketplace" class="v-link" target="_blank">{{ lot_url_to_marketplace_display }}</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>

  <span class="text-body-1 mr-6">Appraised Value: {{ lotData.appraised_value ? usdFormat(Number(lotData.appraised_value)) : 'N/A' }} </span>
  <span class="text-body-1 mr-6">max. Bid: {{ lotData.appraised_value ? usdFormat(Number(lotData.bid_price)) : 'N/A' }}</span-->

  




  
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <h2 class="text-h5 mt-6 mb-2"><b>Cards in PSA Collection</b></h2>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">id</th>
            <th class="text-left">#</th>
            <th class="text-left">Name of Card</th>
            <th class="text-left">Nr Auctions</th>
            <th class="text-left">Avg. Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in psa_cardsData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nr }}</td> 
            <td>
              <router-link :to="`/psa_cards/${item.id}`">{{ item.name }} </router-link>
            </td>
            <td>to do</td>
            <td>to do</td>
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
  
  const thisPSA_CollectionId = ref(route.params.id);
  const psa_collectionData = ref({}); 
  const psa_cardsData = ref({}); 

  
  async function fetchPSA_Collection(id) {
    
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_collections/' + id) ;
      psa_collectionData.value = response.data; // Assuming the API returns the lots data directly
      //console.log(lotData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }

  async function fetchPSA_Cards(id) {
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_cards/collection/' + id);
    psa_cardsData.value = response.data; // Assuming the API returns the lots data directly
    //console.log('itemsdata ', itemsData.value);
    } catch (error) {
    console.error('Error fetching items:', error);  }
  }
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchPSA_Collection(thisPSA_CollectionId.value);
    fetchPSA_Cards(thisPSA_CollectionId.value);
  });
  


  

</script>
