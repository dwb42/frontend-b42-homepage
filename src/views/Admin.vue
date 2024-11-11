<template>
  <h1 class="text-h4 mb-6">Admin</h1>
  
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <h2 class="text-h6 mb-6">Emails from Demand Test 2024-11-10+</h2>
      <v-card variant="tonal" color=#91b2f6 class="pa-3 mb-6">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Email</th>
              <th class="text-left">created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="email in emailsData" :key="email.id">
              <td>{{ email.email }}</td>
              <td>{{ formatDateUsingDateFns(email.createdAt) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL } from '@/utils/index.js';

const emailsData = ref({}); 


async function fetchEmails() {
  try {
  //console.log(apiURL)
  const response = await axios.get(apiBaseURL + '/emails/');
    //const response = await axios.get('https://0cc1571a-2243-4c69-977c-1089b23dcaa7-00-1q6dz6lfs5ps9.janeway.replit.dev/emails/');
  emailsData.value = response.data; // Assuming the API returns the lots data directly
  //console.log(emailsData.value);
  } catch (error) {
  console.error('Error fetching lots:', error);  }
}



  onMounted(() => {
    fetchEmails();
  });
</script>
