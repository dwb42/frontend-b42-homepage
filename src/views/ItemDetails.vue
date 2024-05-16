<template>
  <span class="text-caption"><router-link :to="`/lots/${ itemData.lotId }`">Lot</router-link></span>
  <h1 class="text-h4 mb-2"><b>
    {{ itemData.collection }} - #{{ itemData.nr }} {{ itemData.name }}</b> &nbsp;
    <v-btn color="primary" size="small" @click="openEditModal">Edit Card</v-btn>
  </h1>
  <span class="text-body-1 mr-6">grade: {{ itemData.grade }}</span>
  <!--<span class="text-body-1 mr-6">id: {{ lotData.id }}</span>
  <span class="text-body-1 mr-6">created: {{ formatDateUsingDateFns(lotData.createdAt) }}</span>
  <span class="text-body-1">
    <a :href="lotData.url_to_marketplace" class="v-link" target="_blank">{{ lot_url_to_marketplace_display }}</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>

  <span class="text-body-1 mr-6">Appraised Value: {{ lotData.appraised_value ? usdFormat(Number(lotData.appraised_value)) : 'N/A' }} </span>
  <span class="text-body-1 mr-6">max. Bid: {{ lotData.appraised_value ? usdFormat(Number(lotData.bid_price)) : 'N/A' }}</span>

  

    <!--v-dialog v-model="editModal" persistent max-width="600px" @keydown.esc="closeEditModal" @keydown.enter="saveLot">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Lot</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-text-field v-model="editData.lotname" ref="lotnameInput" label="Lot Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
            <v-text-field v-model="editData.url_to_marketplace" label="Marketplace URL" :rules="[v => !!v || 'URL is required']"></v-text-field>
            <v-text-field v-model="editData.appraised_value" label="Lot Appraisal Value" type="number"></v-text-field> >
            <v-text-field v-model="editData.bid_price" label="Bid Price" type="number"></v-text-field> 
            <v-textarea v-model="editData.comment" label="Comment"></v-textarea>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1"  @click="editModal = false">Cancel</v-btn>
        <v-btn color="primary"  @click="saveLot()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog-->


  
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <h2 class="text-h5 mt-6 mb-2"><b>Auctions for this Card</b></h2>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Collection</th>
            <th class="text-left">#</th>
            <th class="text-left">Player Name</th>
            <th class="text-left">Grade</th>
            <th class="text-left">Auction Date</th>
            <th class="text-right">Auction Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in auctionsData" :key="item.id">
            <td>{{ item.collection_name }}</td>
            <td>{{ item.card_nr }}</td> 
            <td>{{ item.card_name }} </td>
            <td>
              <!--router-link :to="`/lots/${item.id}`">{{ item.name }} </router-link-->
              {{ item.auction_grade_nr }}
            </td>
            <td>{{ formatDateUsingDateFns (item.auction_date,'noTime')}}</td>
            <td class="text-right">{{ usdFormat(item.auction_price)}}</td>
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
  
  const thisItemId = ref(route.params.id);
  
  const itemData = ref({}); 
  const editData = ref({});
  const editModal = ref(false);
  //const itemnameInput = ref(null); // ref var to set focus on first field in modal 
  //const lot_url_to_marketplace_display = ref()

  const auctionsData = ref({}); 

  
  async function fetchItem(id) {
    
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/' + id) ;
      itemData.value = response.data[0]; // Assuming the API returns the lots data directly
      console.log(itemData.value);
      await fetchAuctions(); // fetch auctions once data for item has been retrieved
      } catch (error) {
      console.error('Error fetching item:', error);  }
    }

  
  async function fetchAuctions() {
    console.log('Fetching auctions for:', itemData.value.collection, itemData.value.nr);
    if (!itemData.value.collection || !itemData.value.nr) {
      console.error('Error: collection or card_nr is not defined.');
      return;
    }
    try {
      const searchData = {
        collection: itemData.value.collection,
          card_nr: itemData.value.nr,
      };
      const response = await axios.post('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/auctions/search', searchData);
      auctionsData.value = response.data; 
      console.log('Auctions Data:', auctionsData.value);
    } catch (error) {
      console.error('Error fetching auctions:', error);  
    }
  }
  
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchItem(thisItemId.value);
    
  });
  

  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  EDIT LOT 
  function openEditModal() {
    editData.value = { ...lotData.value }; // Clone the current lot data into editData when opening the modal
    editModal.value = true;

    nextTick(() => {
      itemnameInput.value.$el.querySelector('input').focus();
    });
  }
  
  function closeEditModal() {
    editModal.value = false;
  }

  /*
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
  */

  

</script>
