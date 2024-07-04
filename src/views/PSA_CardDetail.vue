<template>
  <span class="text-caption"><router-link :to="`/psa_collections/${ psa_cardData.collectionId }`">PSA Collection</router-link></span>
  <h1 class="text-h4 mb-2"><b>
    {{ psa_cardData.name }}</b> &nbsp;
    <!--v-btn color="primary" size="small" @click="openEditModal">Edit Lot</v-btn-->
  </h1>
  <span class="text-body-1">
    <a :href="psa_cardData.prices_url" class="v-link" target="_blank">{{ psa_cardData.prices_url }}</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>
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
      <h2 class="text-h5 mt-6 mb-2"><b>PSA Auctions for this Card</b></h2>

      <!-- filter options --> 
      <div style="margin-bottom: 1rem;">
        <v-btn v-for="grade in uniqueGrades" :key="grade" @click="toggleGradeFilter(grade)" :color="gradeFilter.includes(grade) ? 'primary' : 'secondary'">
          {{ grade }}
        </v-btn>
        <v-btn @click="clearGradeFilter" color="error">Clear Filter</v-btn>
      </div>



      <v-table>
        <thead>
          <tr>
            <th class="text-left">Auction Date</th>
            <th class="text-left">Grade</th>
            <th class="text-left">Auction House</th>
            <th class="text-right">Auction Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredAuctions" :key="item.id">
            <td>{{ formatDateUsingDateFns (item.date,'noTime')}}</td>
            <td>{{ item.grade_nr }}</td>
            <td>{{ item.house }}</td>
            <td class="text-right">{{ usdFormat(item.price)}}</td>
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
  
  const thisPSA_CardId = ref(route.params.id);
  const psa_cardData = ref({}); 
  const psa_auctionsData = ref([]); 
  const gradeFilter = ref([]);


  
  async function fetchPSA_Card(id) {
    
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_cards/' + id) ;
      psa_cardData.value = response.data; // Assuming the API returns the lots data directly
      //console.log(lotData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }

  async function fetchPSA_Auctions(id) {
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_auctions/card/' + id);
    psa_auctionsData.value = response.data.rows; // Assuming the API returns the lots data directly
    console.log('psa_auctionsData ', psa_auctionsData.value);
    } catch (error) {
    console.error('Error fetching items:', error);  }
  }
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchPSA_Card(thisPSA_CardId.value);
    fetchPSA_Auctions(thisPSA_CardId.value);
  });
  
  function toggleGradeFilter(grade) {
    if (gradeFilter.value.includes(grade)) {
      gradeFilter.value = gradeFilter.value.filter(g => g !== grade);
    } else {
      gradeFilter.value.push(grade);
    }
  }
  function clearGradeFilter() {
    gradeFilter.value = [];
  }

  const uniqueGrades = computed(() => {
    const grades = psa_auctionsData.value.map(item => item.grade_nr);
    return [...new Set(grades)].sort();
  });
  
  const filteredAuctions = computed(() => {
    if (gradeFilter.value.length === 0) {
      return psa_auctionsData.value;
    }
    return psa_auctionsData.value.filter(item => gradeFilter.value.includes(item.grade_nr));
  });

  

</script>
