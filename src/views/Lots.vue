<template>
  <h1 class="text-h4 mb-6">Lots for purchase</h1>
  
  <v-row>
    <v-col cols="12" md="6" xl="4">
      <v-card variant="tonal" color=#91b2f6 class="pa-3 mb-6">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">id</th>
              <th class="text-left">Name</th>
              <th class="text-left">Number of cards</th>
              <th class="text-left">Value</th>
              <th class="text-left">created at</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lotsData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <router-link :to="`/lots/${item.id}`">{{ item.lotname }}</router-link>
            </td> 
            <td>
              {{ item.street }} 
            </td>
            <td>
              {{ item.street }} 
            </td>
              <td>
                {{ formatDateUsingDateFns(item.createdAt) }}
                <br>  {{ item.createdAt }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  
    <v-col cols="12" md="6" xl="4">
      <v-card variant="elevated" class="pa-3 mb-6">
        <h2 class="text-h5 mb-6">create new lot</h2>
        <v-form @submit.prevent="createLot">
          <v-text-field v-model="lotname" id="lotname" label="Lotname" required hide-details class="mb-6"></v-text-field>
          <!--v-text-field v-model="lastName" id="lastName" label="Nachname" required hide-details class="mb-6"></v-text-field>
          <v-text-field v-model="street" id="street" label="Strasse" required hide-details class="mb-6"></v-text-field>
          <v-text-field v-model="housenr" id="housenr" label="Hausnr." required hide-details class="mb-6"></v-text-field>
          <v-text-field v-model="zipcode" id="zipcode" label="PLZ" required hide-details class="mb-6"></v-text-field>
          <v-text-field v-model="city" id="city" label="Stadt" required hide-details class="mb-6"></v-text-field>
    
          <v-checkbox v-model="dsgvocheck" id="dsgvocheck"
            label="Ich bin einverstanden mit der Datenschutzerklärung"></v-checkbox-->
    

          <v-btn v-if="formStatus !== 'submitted'" color="primary" type="submit">create new lot</v-btn>
          <v-alert @click="formStatus = null" v-if="formStatus == 'submitted'" type="success" variant="tonal"
            title="Danke für Ihre Anfrage"
            text="Wir schicken Ihnen die angeforderten Informationen postwendent zu. "
            style="cursor: pointer;"></v-alert>
        </v-form>
      </v-card>
    
    
      <!-- <v-card v-if="formStatus == 'submitted'" variant="tonal" color=pink class="pa-3 mb-6">
          <h2 class="text-h4 mb-3">Danke f&uuml;r Ihre Anfrage</h2>
          <p class="text-subtitle-2 mb-3">Wir schicken Ihnen gerne unseren Prospekt zu:</p>
          <p class="text-subtitle-2">
            {{ firstName }} {{ lastName }} <br>
            {{ street }} {{ housenr }} <br>
            {{ zipcode }} {{ city }} <br>
          </p>
        </v-card> -->
    </v-col>
  </v-row>
  <br /><br />



</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import axios from 'axios'; 
import { format } from 'date-fns';

const lotsData = ref({}); 
const lotname = ref('');

async function fetchLots() {
  try {
  const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/');
  lotsData.value = response.data; // Assuming the API returns the lots data directly
  console.log(lotsData.value);
  } catch (error) {
  console.error('Error fetching lots:', error);  }
}

async function createLot() {
  try {
  const formData = {
    lotname: lotname.value,
    lastName: lastName.value,
    street: street.value,
    housenr: housenr.value,
    zipcode: zipcode.value,
    city: city.value,
    dsgvocheck: dsgvocheck.value,
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



  
const formatDateUsingDateFns = (date) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
};


</script>
