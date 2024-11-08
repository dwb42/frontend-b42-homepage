<template>
  <h1 class="text-h4 mb-6">Lots for purchase</h1>
  
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <v-card variant="tonal" color=#91b2f6 class="pa-3 mb-6">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">id</th>
              <th class="text-left">Name</th>
              <th class="text-left">Number of cards</th>
              <th class="text-left">Value</th>
              <th class="text-left">Bid Price</th>
              <th class="text-left">created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lotsData" :key="item.id">
              <td>{{ item.id }}</td>
              <td><router-link :to="`/lots/${item.id}`">{{ item.lotname }}</router-link></td> 
              <td></td>
              <td>{{ usdFormat(item.appraised_value) }}</td>
              <td>{{ usdFormat(item.bid_price) }}</td>
              <td>{{ formatDateUsingDateFns(item.createdAt) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  
    <v-col cols="12" md="8" xl="4">
      <v-card variant="elevated" class="pa-3 mb-6">
        <h2 class="text-h5 mb-6">create new lot</h2>
        <v-form @submit.prevent="createLot">
          <v-text-field v-model="lotname" id="lotname" label="Lotname" required hide-details class="mb-6"></v-text-field>
          <v-btn color="primary" type="submit">create new lot</v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat } from '@/utils/index.js';

const lotsData = ref({}); 
const lotname = ref('');

async function fetchLots() {
  try {
  const response = await axios.get('https://0cc1571a-2243-4c69-977c-1089b23dcaa7-00-1q6dz6lfs5ps9.janeway.replit.dev/lots/');
  lotsData.value = response.data; // Assuming the API returns the lots data directly
  console.log(lotsData.value);
  } catch (error) {
  console.error('Error fetching lots:', error);  }
}

async function createLot() {
  try {
  const formData = {
    lotname: lotname.value
  };
  const response = await axios.post('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/', formData);
  console.log('Lot created:', response.data);

  await fetchLots();
    
  } catch (error) {
  console.error('Error creating lot:', error);
  }
}

  onMounted(() => {
    fetchLots();
  });
</script>
