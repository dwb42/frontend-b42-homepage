<template>
  <span class="text-caption"><router-link :to="`/lots/`">Lots</router-link></span>
  <h1 class="text-h4 mb-2"><b>
    {{ lotData.lotname }}</b> 
    &nbsp;
    <v-btn color="primary" size="small" @click="openEditModal">Edit Lot</v-btn>
  </h1>
  <span class="text-body-1 mr-6">status: {{ lotData.status }}</span>
  <span class="text-body-1 mr-6">id: {{ lotData.id }}</span>
  <span class="text-body-1 mr-6">created: {{ formatDateUsingDateFns(lotData.createdAt) }}</span>
  <span class="text-body-1">
    <a :href="lotData.url_to_marketplace" class="v-link" target="_blank">marketplace</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>

  

  <v-dialog v-model="editModal" persistent max-width="600px" @keydown.esc="closeEditModal" @keydown.enter="saveLot">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Lot</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-text-field v-model="editData.lotname" ref="lotnameInput" label="Lot Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
            <v-text-field v-model="editData.url_to_marketplace" label="Marketplace URL" :rules="[v => !!v || 'URL is required']"></v-text-field>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1"  @click="editModal = false">Cancel</v-btn>
        <v-btn color="primary"  @click="saveLot()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  
  <v-row>
    <v-col cols="12" md="6" xl="4">
      <h2 class="text-h5 mt-6 mb-2"><b>Cards in Lot</b></h2>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">id</th>
            <th class="text-left">Collection</th>
            <th class="text-left">#</th>
            <th class="text-left">Player Name</th>
            <th class="text-left">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <router-link :to="`/lots/${item.id}`">{{ item.collection }}</router-link>
            </td> 
            <td>
              {{ item.nr }} 
            </td>
            <td>
              {{ item.name }} 
            </td>
            <td>
              {{ item.grade}}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup>
  import { ref, computed, watchEffect, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns } from '@/utils/index.js';
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;
  
  const thisLotId = ref(route.params.id);
  const lotData = ref({}); 
  const editData = ref({});
  const editModal = ref(false);
  const lotnameInput = ref(null); // ref var to set focus on first field in modal 

  const itemsData = ref({}); 

  
  async function fetchLot(id) {
    
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/' + id) ;
      lotData.value = response.data[0]; // Assuming the API returns the lots data directly
      //console.log(lotData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }

  async function fetchItems(id) {
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/' + id);
    itemsData.value = response.data; // Assuming the API returns the lots data directly
    //console.log('itemsdata ', itemsData.value);
    } catch (error) {
    console.error('Error fetching items:', error);  }
  }
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchLot(thisLotId.value);
    fetchItems(thisLotId.value);
  });
  
  /*const formatDateUsingDateFns = (date) => {
    if (!date) return ''; // Return an empty string if the date is null or undefined
    try {
      return format(new Date(date), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Return empty string on error
    }
  };*/

  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  EDIT LOT 
  function openEditModal() {
    editData.value = { ...lotData.value }; // Clone the current lot data into editData when opening the modal
    editModal.value = true;

    nextTick(() => {
      lotnameInput.value.$el.querySelector('input').focus();
    });
  }
  
  function closeEditModal() {
    editModal.value = false;
  }

  
  async function saveLot() {
    // Make an HTTP PUT request to update the lot in the database using Sequelize
    try {
      lotData.value = { ...editData.value };
      const response = await axios.put(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/${lotData.value.id}`, editData.value);
      //console.log('Lot updated:', response.data);
      
      editModal.value = false;
      // Optionally, fetch the lot again to get the most current data from the server
      // fetchLot(lotData.value.id);
    } catch (error) {
      console.error('Error updating lot:', error);
    }
  }

  

</script>
