<template>
  <v-container>  
    <template v-if="valuationsData.length > 0">
      <h1 class="text-h4 mb-2"><b>Valuations</b></h1>
    </template>

    <v-row>
      <template v-if="valuationsData.length > 0">
        <v-col cols="12" md="12" xl="12">
          <v-card variant="tonal" color=#91b2f6 class="pa-3 mb-6">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">id</th>
                  <th class="text-left" style="min-width: 200px;">Company Name</th>
                  <th class="text-left">Company URL</th>
                  <th class="text-left">Valuation Method</th>
                  <th class="text-left">Multiple</th>
                  <th class="text-left">Valued at</th>
                  <th class="text-left">Created</th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="valuation in valuationsData" :key="valuation.id">
                  <td>{{ valuation.id }}</td>
                  <td><router-link :to="`/app/valuation/${valuation.id}`"><b>{{ valuation.company_name }}</b></router-link></td> 
                  <td><a :href="valuation.company_url" target="_blank">{{ valuation.company_url }}</a></td> 
                  <td>{{ valuation.state_of_business === 'laterStage' ? 'EBITDA' : 'ARR' }}</td>
                  <td>{{ valuation.valuation_general_outputs?.[0] ? 
                      (valuation.state_of_business === 'laterStage' ? 
                       multipleImpactPercent(valuation.valuation_general_outputs[0].ebitda_final_multiple) : 
                       multipleImpactPercent(valuation.valuation_general_outputs[0].arr_final_multiple)) : '-' }}</td>
                  <td>{{ valuation.valuation_general_outputs?.[0] ? 
                      usdFormat(valuation.state_of_business === 'laterStage' ? 
                        valuation.valuation_general_outputs[0].ebitda_final_valuation : 
                        valuation.valuation_general_outputs[0].arr_final_valuation) : '-' }}</td>
                  <td>{{ formatDateUsingDateFns(valuation.createdAt) }}</td>
                  <td>
                    <v-icon @click="deleteValuation(valuation.id)" style="cursor: pointer;color:gray">
                     mdi-trash-can-outline
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>  
        
        </v-col>
      </template>

      <v-col cols="12" md="8" xl="4">
        <v-card variant="elevated" class="pa-3 mb-6">
          <h2 class="text-h5 mb-6"><b>create new SaaS business valuation</b></h2>
          <v-form @submit.prevent="createValuation">
            <v-text-field v-model="company_name" id="company_name" label="Company Name" required hide-details class="mb-6"></v-text-field>
            <v-text-field 
              v-model="company_url" 
              id="company_url" 
              label="Company Website" 
              required
              :rules="[value => urlRules(value)]"
              placeholder="www.example.com"
              @blur="formatCompanyURL"
              hide-details="auto" 
              class="mb-6"
            ></v-text-field>
            <v-btn color="primary" type="submit">create new valuation</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import axios from 'axios'; 
import { formatDateUsingDateFns, usdFormat, apiBaseURL, checkValidPastYear } from '@/utils/index.js';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore.js';
import { urlRules, formatURL } from '@/utils/url_formatting.js';

const router = useRouter();
const userStore = useUserStore();
const valuationsData = ref([]);


const company_name = ref('');
const company_url = ref('');

const multipleImpactPercent = (val) => {
  if (val == null) return 'N/A';
  // e.g., "1.20x"
  return `${val.toFixed(2)}x`;
};

function formatCompanyURL() {
  company_url.value = formatURL(company_url.value);
}

async function fetchValuations() {
  try {
  //axios.defaults.withCredentials = true;
  const response = await axios.get(`${apiBaseURL}/valuations/`, {
                                    withCredentials: true,
                                    headers: {
                                      'Content-Type': 'application/json'
                                    }
                                  });
  valuationsData.value = response.data.valuations; 
  console.log('Valuations', valuationsData.value);
  } catch (error) {
  console.error('Error fetching valuations:', error);  }
}

import confetti from 'canvas-confetti';

async function createValuation() {
  try {
    const formData = {
      company_name: company_name.value, 
      company_url: company_url.value
    };
    const response = await axios.post(`${apiBaseURL}/valuations/`, formData);
    console.log('Valuation created:', response.data);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    router.push(`/app/valuation/${response.data.id}`);

  } catch (error) {
    console.error('Error creating new valuation:', error);
  }
}

async function deleteValuation(id) {
  try {
    if (confirm('Are you sure you want to delete this valuation?')) {
      console.log('Deleting valuation with ID:', id);
      await axios.delete(`${apiBaseURL}/valuations/${id}`);
      console.log('Valuation deleted');
      await fetchValuations();
    }
  } catch (error) {
    console.error('Error deleting valuation:', error);
  }
}

  onMounted(() => {
    fetchValuations();
  });
</script>