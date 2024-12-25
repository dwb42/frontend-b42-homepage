<template>
  <v-container>  
    <h1 class="text-h4 mb-6">Valuations</h1>
    
    <v-row>
      <v-col cols="12" md="12" xl="12">
        <v-card variant="tonal" color=#91b2f6 class="pa-3 mb-6">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">id</th>
                <th class="text-left">Company Name</th>
                <th class="text-left">Company URL</th>
                <th class="text-left">Valuation Method</th>
                <th class="text-left">Multiple</th>
                <th class="text-left">Valued at</th>
                <th class="text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="valuation in valuationsData" :key="valuation.id">
                <td>{{ valuation.id }}</td>
                <td><router-link :to="`/app/valuation/${valuation.id}`">{{ valuation.company_name }}</router-link></td> 
                <td><a :href="valuation.company_url" target="_blank">{{ valuation.company_url }}</a></td> 
                <td></td>
                <!--td>{{ usdFormat(valuation.appraised_value) }}</td>
                <td>{{ usdFormat(valuation.bid_price) }}</td>
                <td>{{ formatDateUsingDateFns(valuation.createdAt) }}</td-->
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    
      <v-col cols="12" md="8" xl="4">
        <v-card variant="elevated" class="pa-3 mb-6">
          <h2 class="text-h5 mb-6">create new valuation</h2>
          <v-form @submit.prevent="createValuation">
            <v-text-field v-model="company_name" id="company_name" label="Company Name" required hide-details class="mb-6"></v-text-field>
            <v-text-field v-model="company_url" id="company_url" label="Company Website" required hide-details class="mb-6"></v-text-field>
            <v-btn color="primary" type="submit">create new valuation</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  <v-btn color="primary" class="mt-4" @click="testSession">test session</v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore.js';

const router = useRouter();
const userStore = useUserStore();
const valuationsData = ref({});

async function testSession() {
  try {
    const token = '1d4938bef91f603364076810e8fd20cf8ef36c43ea747516632f9b3a2462c98e'
    // Call backend to verify token, handle redirection
    //axios.defaults.withCredentials = true;
    const response = await axios.get(`${apiBaseURL}/auth/verify?token=${token}`, { withCredentials: true })
    
    console.log('Verification message:', response);
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Update the store
    userStore.setUserData(response.data.user)
    router.push('/app/valuations')
  } catch (error) {
    console.error(error)
    // Show an error or redirect to a login page
    //temp router.push('/login')
  }
} 
const company_name = ref('');
const company_url = ref('');

async function fetchValuations() {
  try {
    const response = await axios.get(`${apiBaseURL}/valuations/`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': true
      }
    });
    valuationsData.value = response.data;
    console.log('Response:', response);
  } catch (error) {
    console.error('Error fetching valuations:', error);
  }
}

async function createValuation() {
  try {
  const formData = {
    company_name: company_name.value, 
    company_url: company_url.value
  };
  const response = await axios.post(`${apiBaseURL}/valuations/`, formData);
  console.log('Valuation created:', response.data);

  await fetchValuations();
    
  } catch (error) {
  console.error('Error creating new valuation:', error);
  }
}

  onMounted(() => {
    fetchValuations();
  });
</script>
