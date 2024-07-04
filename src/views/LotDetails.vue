<template>
  <span class="text-caption"><router-link :to="`/lots/`">Lots</router-link></span>
  <h1 class="text-h4 mb-2"><b>
    {{ lotData.lotname }}</b> &nbsp;
    <v-btn color="primary" size="small" @click="openEditModal">Edit Lot</v-btn>
  </h1>
  <span class="text-body-1 mr-6">status: {{ lotData.status }}</span>
  <span class="text-body-1 mr-6">id: {{ lotData.id }}</span>
  <span class="text-body-1 mr-6">created: {{ formatDateUsingDateFns(lotData.createdAt) }}</span>
  <span class="text-body-1">
    <a :href="lotData.url_to_marketplace" class="v-link" target="_blank">{{ lot_url_to_marketplace_display }}</a>
    <v-icon icon="mdi-open-in-new" class="ml-1" size="smaller"></v-icon>
  </span><br>

  <span class="text-body-1 mr-6">Appraised Value: {{ lotData.appraised_value ? usdFormat(Number(lotData.appraised_value)) : 'N/A' }} </span>
  <span class="text-body-1 mr-6">max. Bid: {{ lotData.appraised_value ? usdFormat(Number(lotData.bid_price)) : 'N/A' }}</span>


  

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
            <v-text-field v-model="editData.appraised_value" label="Lot Appraisal Value" type="number"></v-text-field> <!-- New Field -->
            <v-text-field v-model="editData.bid_price" label="Bid Price" type="number"></v-text-field> <!-- New Field -->
            <v-textarea v-model="editData.marketplace_description" label="Marketplace Description (used to auto-add Cards)"></v-textarea>
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
  </v-dialog>


  
  <v-row>
    <v-col cols="12" md="12" xl="12">
      <h2 class="text-h5 mt-6 mb-2">
        <b>Cards in Lot</b> &nbsp;
        <v-btn color="primary" size="small" @click="openAddItemModal">Add Card</v-btn>
      </h2>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">id</th>
            <th class="text-left">Collection</th>
            <th class="text-left">#</th>
            <th class="text-left">Player Name</th>
            <th class="text-left">Grade Raw</th>
            <th class="text-left">Grade Numerical</th>
            <th class="text-left">PSA Card</th>
            <th class="text-left">Nr Auctions</th>
            <th class="text-left">Avg. Price</th>
            <th class="text-right">Valuation</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.collection }}</td> 
            <td>{{ item.number }} </td>
            <td>
              <router-link :to="`/items/${item.id}`">{{ item.name }} </router-link>
            </td>
            <td>{{ item.grade_raw}}</td>
            <td>{{ item.grade_numerical}}</td>
            <td>
              <div v-if="item.psa_card">
                <router-link :to="`/psa_cards/${item.psa_card ? item.psa_card.id : '-'}`">{{ item.psa_card ? item.psa_card.name : '-' }}</router-link><br>
                {{ item.psa_card ? item.psa_card.psa_collection.name : '' }} :: 
                #{{ item.psa_card ? item.psa_card.card_nr : '' }}
              </div>
            </td>
            <td>to do</td>
            <td>to do</td>
            <td class="text-right">
              <div v-if="editingItemId === item.id">
                <v-text-field
                  v-model="newValuation"
                  @keyup.enter="saveNewValuation(item)"
                  @blur="cancelEdit"
                ></v-text-field>
              </div>
              <div v-else @click="editValuation(item)">
                {{ item.valuation ? `${usdFormat(item.valuation)}` : '-' }}
              </div>
            </td>            
            <td>
              <v-icon small @click="openEditItemModal(item)">mdi-pencil</v-icon>
              <span class="mr-2">&nbsp;</span>
              <v-icon small @click="openDeleteItemModal(item)">mdi-trash-can</v-icon>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="9" style="text-align: right;"><b>Total Valuation</b></td>
            <td style="text-align: right;">{{ usdFormat(totalValuation) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </v-table>
    </v-col>
  </v-row>

  
  <div class="text-body-1 mt-12">{{ lotData.marketplace_description }}</div>
  <div class=mt-3>  </div>
  <v-btn color="primary" size="small" @click="openBatchAddCardModal">Auto Add Cards based on Marketplace Description</v-btn>

  <!-- Item Modal -->
  <v-dialog v-model="addItemModal" persistent max-width="600px" @keydown.esc="closeAddItemModal" @keydown.enter="createItem">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Card</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-tabs v-model="activeTab">
            <v-tab>PSA Select</v-tab>
            <v-tab>Manual Enter</v-tab>
          </v-tabs>
          <div class="py-3" />
          <v-form ref="form">
            <v-tab-item v-if="activeTab === 0">
              <v-autocomplete
                v-model="selectedPsaCollectionId"
                :items="psaCollections"
                item-title="name"
                item-value="id"
                label="PSA Collection"
                @change="fetchPsaCards"
                :rules="[v => !!v || 'PSA Collection is required']"
              ></v-autocomplete>
              <v-autocomplete
                v-model="newItemData.psa_cardId"
                :items="psaCards"
                item-title="card_nr_name"
                item-value="id"
                label="PSA Cards"
                :disabled="!selectedPsaCollectionId"
                :rules="[v => !!v || 'PSA Card is required']"
              ></v-autocomplete>
            </v-tab-item>
            <v-tab-item v-else>
              <v-text-field v-model="newItemData.collection" label="Collection Name"> </v-text-field>
              <v-text-field v-model="newItemData.number" label="Card #" type="number"></v-text-field>
              <v-text-field v-model="newItemData.name" label="Card Name"></v-text-field>
            </v-tab-item>

            <v-text-field v-model="newItemData.grade_numerical" label="Grade Numerical"></v-text-field>
            
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1"  @click="closeAddItemModal">Cancel</v-btn>
        <v-btn color="primary"  @click="createItem()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Item Modal -->

  <!-- Edit Item Modal -->
  <v-dialog v-model="editItemModal" persistent max-width="600px" @keydown.esc="closeEditItemModal" @keydown.enter="updateItem">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Card</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-text-field v-model="editItemData.collection" label="Collection Name" :rules="[v => !!v || 'Collection Name is required']"></v-text-field>
            <v-text-field v-model="editItemData.number" label="Card #" type="text" :rules="[v => !!v || 'Card # is required']"></v-text-field>
            <v-text-field v-model="editItemData.name" label="Card Name" :rules="[v => !!v || 'Card Name is required']"></v-text-field>
            <v-text-field v-model="editItemData.grade_raw" label="Grade Raw" :rules="[v => !!v || 'Grade is required']"></v-text-field>
            <v-text-field v-model="editItemData.grade_numerical" label="Grade Numerical" :rules="[v => !!v || 'Grade is required']"></v-text-field>
            <!--v-text-field v-model="editItemData.psa_cardId" label="PSA Card"></v-text-field--> 
            <!-- HERENOW -->
            <v-autocomplete
              v-model="selectedPsaCollectionId"
              :items="psaCollections"
              item-title="name"
              item-value="id"
              label="PSA Collection"
              @change="fetchPsaCards"
              :rules="[v => !!v || 'PSA Collection is required']"
            ></v-autocomplete>
            <v-autocomplete
              v-model="editItemData.psa_cardId"
              :items="psaCards"
              item-title="card_nr_name"
              item-value="id"
              label="PSA Cards"
              :disabled="!selectedPsaCollectionId"
              :rules="[v => !!v || 'PSA Card is required']"
            ></v-autocomplete>

          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="closeEditItemModal">Cancel</v-btn>
        <v-btn color="primary" @click="updateItem()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Edit Item Modal -->

  <!-- Delete Item Confirmation Modal -->
  <v-dialog v-model="deleteItemModal" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Confirm Delete</span>
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this item? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="closeDeleteItemModal">Cancel</v-btn>
        <v-btn color="red" @click="deleteItem">Delete this item</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
   <!-- Delete Item Confirmation Modal -->

  <!-- BATCH ADD CARDS MODAL -->
  <v-dialog v-model="batchAddCardModal" persistent max-width="auto" @keydown.esc="closeBatchAddCardModal">
    <v-card>
      <v-card-title>
        <span class="text-h5">Auto Add Cards based on Marketplace Description</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="batchAddForm">
            <!--v-textarea v-model="lotData.marketplace_description" label="Marketplace Description"></v-textarea-->
            <v-textarea 
              v-if="!batchPromptApiResponse"
              v-model="batchPrompt" label="Prompt" auto-grow>
              </v-textarea>
          </v-form>
          <div v-if="batchPromptLoading">
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
          <div v-if="batchPromptApiResponse">
            <!--pre>{{ batchPromptApiResponse }}</pre-->
            
            <v-form ref="batchAddForm">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Collection</th>
                    <th class="text-left">#</th>
                    <th class="text-left">Player Name</th>
                    <th class="text-left">Grade Raw</th>
                    <th class="text-left">Grade Numberical</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(card, index) in batchPromptApiResponse" :key="index">
                    <td>
                      <v-text-field v-model="batchAddFormData[index].collection" label="Collection" outlined></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="batchAddFormData[index].number" label="Number" outlined></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="batchAddFormData[index].name" label="Player Name" outlined></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="batchAddFormData[index].grade_raw" label="Grade Raw" outlined></v-text-field>
                      <span style="display:none">{{ batchAddFormData[index].lotId = thisLotId }} </span>
                    </td>
                    <td>
                      <v-text-field v-model="batchAddFormData[index].grade_numerical" label="Grade Numerical" outlined></v-text-field>
                    </td>

                    
                    
                  </tr>
                </tbody>
              </v-table>
            </v-form>  
            
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveBatchItems">Save Items to Database</v-btn>
        <v-btn color="grey" @click="closeBatchAddCardModal">Cancel</v-btn>
        <v-btn color="primary" @click="sendToChatGPT">Send to ChatGPT</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- BATCH ADD CARDS MODAL -->
</template>

<script setup>
  import { ref, computed, watchEffect, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat } from '@/utils/index.js';
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //lot vars
  const thisLotId = ref(route.params.id);
  const lotData = ref({}); 
  const editData = ref({});
  const editModal = ref(false);
  const lotnameInput = ref(null); // ref var to set focus on first field in modal 
  const lot_url_to_marketplace_display = ref()

  //item vars
  const itemsData = ref([]); 

  const addItemModal = ref(false);
  const activeTab = ref(0);
  const newItemData = ref({
    collection: '',
    number: 0,
    name: '',
    grade_raw: '', 
    grade_numerical: '', 
    psa_cardId: ''
  });

  const editItemModal = ref(false);
  const editItemData = ref({
    id: null,
    collection: '',
    number: 0,
    name: '',
    grade_raw: '',
    grade_numerical: '', 
    psa_cardId: '', 
    psa_card_name: '', 
    psa_card_nr: '', 
    psa_card_collectionId: '', 
    psa_collection_name: ''
  });

  //edit item valuation 
  const editingItemId = ref(null);
  const newValuation = ref("");
  const editValuation = (item) => {
    editingItemId.value = item.id;
    newValuation.value = item.valuation || "";
  };
  const cancelEdit = () => {
    editingItemId.value = null;
  };

  //compute total valuation of items
  const totalValuation = computed(() => {
    return itemsData.value.reduce((total, item) => {
      return total + (item.valuation ? parseFloat(item.valuation) : 0);
    }, 0);
  });

  //watch for changes in totalValuation and save new valuation to db
  watch(totalValuation, (newVal) => {
    lotData.value.appraised_value = newVal;
    saveLotValuation(newVal);
  });
  

  const deleteItemModal = ref(false);
  const itemToDelete = ref(null);

  // New state variables for the Batch Add Card Modal
  const batchAddCardModal = ref(false);
  const batchPrompt = ref("");
  const batchPromptApiResponse = ref(null); 
  const batchPromptLoading = ref(false); 
  const batchAddFormData = ref([]);
  
  watchEffect(() => {
    if (batchPromptApiResponse.value) {
      batchAddFormData.value = batchPromptApiResponse.value.map(card => ({
        collection: card.collection,
        number: card.number, //.replace("#", "")
        name: card.name,
        grade_raw: card.grade
      }));
    }
  });

  //psa_collection and psa_card autocomplete vars
  const psaCollections = ref([]);
  const selectedPsaCollectionId = ref(null);
  const selectedPsaCollectionName = ref(null);
  const psaCards = ref([]);
  const selectedPsaCard = ref(null);
  
  
  /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
  /// GET LOT AND ITEMS DATA
  
  //get one lot 
  async function fetchLot(id) {
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/' + id) ;
      lotData.value = response.data[0]; // Assuming the API returns the lots data directly
      lot_url_to_marketplace_display.value = truncateString(response.data[0].url_to_marketplace, 25);
      //console.log(lotData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }

  //get all items 
  async function fetchItems(id) {
    try {
    const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/lot/' + id);
    //itemsData.value = response.data; // Assuming the API returns the lots data directly
    let items = response.data;
    // Fetch corresponding psa_card data for each item
    const psaCardPromises = items.map(async (item) => {
      if (item.psa_cardId) {
        const psaCardResponse = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_cards/' + item.psa_cardId);
        item.psa_card = psaCardResponse.data;
      } else {
        item.psa_card = null;
      }
      return item;
    });
    itemsData.value = await Promise.all(psaCardPromises);

    // Sort items by collection and then by number
    items.sort((a, b) => {
      if (a.collection !== b.collection) {
        return a.collection.localeCompare(b.collection);
      } else {
        return a.number - b.number;
      }
    });
    itemsData.value = items;
      
    console.log('itemsdata ', itemsData.value);
    } catch (error) {
    console.error('Error fetching items:', error);  }
  }
  
  onMounted(() => {
    //console.log('thisLotId: ', thisLotId.value)
    fetchLot(thisLotId.value);
    fetchItems(thisLotId.value);
    fetchPsaCollections();
  });
  

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


  const saveLotValuation = async (newValuation) => {
    try {
      // Update lotData with new valuation
      lotData.value.appraised_value = newValuation;
      // Make an HTTP PUT request to update the lot in the database
      const response = await axios.put(
        `https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/lots/${lotData.value.id}`,
        { appraised_value: newValuation }
      );
      console.log("Lot valuation updated:", response.data);
    } catch (error) {
      console.error("Error updating lot valuation:", error);
    }
  };
  ///  EDIT LOT 
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///

  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  ADD ITEM 
  function openAddItemModal() {
    newItemData.value = {
      collection: '',
      number: 0,
      name: '',
      grade_raw: '',
      grade_numerical: '', 
      psa_cardId: 0,
    };

    addItemModal.value = true;
  }
  
  function closeAddItemModal() {
    addItemModal.value = false;
  }
  
  async function createItem() {
    try {
      console.log('new item data ', newItemData.value)
      const response = await axios.post(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items`, {
        ...newItemData.value,
        lotId: thisLotId.value
      });
      itemsData.value.push(response.data);
      fetchItems(thisLotId.value);
      addItemModal.value = false;
    } catch (error) {
      console.error('Error adding card:', error);
    }
  }
  ///  ADD ITEM
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///


  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  EDIT ITEM 
  async function openEditItemModal(item) {
    editItemData.value = { ...item };
    console.log('edit item psa card id ', editItemData.value.psa_cardId);
    // Only execute the axios.get request if editItemData.value.psa_cardId is set
    if (editItemData.value.psa_cardId) {
      const id = editItemData.value.psa_cardId;
      try {
        const response = await axios.get(
          'https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_cards/' + id
        );
        let psa_card_Data = response.data;
        console.log('psa card data: ', psa_card_Data);
        // Update specific values in editItemData
        editItemData.value.psa_card_name = psa_card_Data.name;
        editItemData.value.psa_card_nr = psa_card_Data.card_nr;
        editItemData.value.psa_card_collectionId = psa_card_Data.collectionId;
        editItemData.value.psa_collection_name = psa_card_Data.psa_collection.name;
      } catch (error) {
        console.error('Error fetching psa card data during item edit:', error);
      }
    }
    editItemModal.value = true;
  }


  function closeEditItemModal() {
    editItemModal.value = false;
    editItemData.value = {};
  }
  
  async function updateItem() {
    try {
      console.log ('edit item data ', editItemData.value);
      
      const response = await axios.put(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/${editItemData.value.id}`, editItemData.value);

      // Find the index of the item to be updated
      const index = itemsData.value.findIndex(
        (item) => item.id === editItemData.value.id
      );
      console.log(index);

      // Item found, replace with updated data
      if (index !== -1) {
        console.log("Item updated:", response.data[1]);
        itemsData.value.splice(index, 1, response.data[1]);
      }

      fetchItems(thisLotId.value);
      editItemModal.value = false;
      editItemData.value = {};
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }
  ///   EDIT ITEM 
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///

  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  EDIT ITEM VALUATION
  const saveNewValuation = async (item) => {
    try {
      const updatedItem = { ...item, valuation: newValuation.value };
      //console.log('updatedItem ', updatedItem);

      const response = await axios.put(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/${item.id}`, updatedItem);

      // Update local itemsData
      const index = itemsData.value.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        itemsData.value[index].valuation = newValuation.value;
      }
      // Reset the editing state
      editingItemId.value = null;
    } catch (error) {
      console.error("Error updating valuation:", error);
    }
  };
  ///  EDIT ITEM VALUATION
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  
  
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  DELETE ITEM 
  function openDeleteItemModal(item) {
    itemToDelete.value = item;
    deleteItemModal.value = true;
  }
  function closeDeleteItemModal() {
    deleteItemModal.value = false;
  }
  async function deleteItem() {
    try {
      await axios.delete(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/${itemToDelete.value.id}`);
      itemsData.value = itemsData.value.filter(item => item.id !== itemToDelete.value.id);
      deleteItemModal.value = false;
      itemToDelete.value = null;
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  ///   DELETE ITEM 
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///


  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  BATCH CARD ADD
  // Function to open the Batch Add Card Modal
  function openBatchAddCardModal() {
    batchPrompt.value = `
This text contains information about Baseball trading cards:  

${lotData.value.marketplace_description}

Based on the content of this text, can you create a json-object where each record has the following attributes:

collection, number, name, grade

When you are not certain about a certain value, please indicate by adding "[uncertain]" next to the value. Dont add any other text or formatting.

The format of the returned json-object should be a simple array without a name that can be interpreted by javascript.`;
    batchAddCardModal.value = true;
  }
  // Function to close the Batch Add Card Modal
  function closeBatchAddCardModal() {
    batchAddCardModal.value = false;
  }
  // Function to send the prompt to ChatGPT API
  async function sendToChatGPT() {
    try {
      batchPromptLoading.value = true;
      const response = await axios.post('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/inferences/get-gpt4-inference', {
        prompt: batchPrompt.value
      });

        let data = response.data;
      
      console.log('data 444: ',data);
      // Check if the data is already an array
      if (!Array.isArray(data)) {
        try {
          // Attempt to parse the data as JSON
          data = data.replace('```json', '');
          data = data.replace('```', '');
          data = JSON.parse(data);
          // Ensure the parsed data is an array
          if (!Array.isArray(data)) {
            throw new Error("Parsed data is not an array");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Handle the case where data cannot be parsed as JSON array
          // For example: display an error message or perform other fallback logic
          batchPromptApiResponse.value = []; // Optionally, set to an empty array
          batchPromptLoading.value = false;
          return;
        }
      }

      
      batchPromptApiResponse.value = response.data; 
      batchPromptLoading.value = false;
      console.log('AI Response:', response.data);
      //batchAddCardModal.value = false;
    } catch (error) {
      console.error('Error sending data to ChatGPT:', error);
    }
  }

  async function saveBatchItems() {
    try {
      console.log('batchAddFormData: ', batchAddFormData.value)
      await axios.post(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/items/bulk`, {
        items: batchAddFormData.value,
      });
      // Reload items data after saving
      fetchItems(thisLotId.value);
      batchAddCardModal.value = false;
    } catch (error) {
      console.error('Error saving batch items:', error);
    }
  }
  
  ///  BATCH CARD ADD
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///

  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  ///  PSA COLLECTION and CARD autocomplete and match
  // Fetch all PSA Collections
  const fetchPsaCollections = async () => {
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_collections/');
      psaCollections.value = response.data;
      //console.log('PSA Collections:', psaCollections.value);
    } catch (error) {
      console.error('Error fetching PSA collections:', error);
    }
  };

  // Fetch ONE PSA Collection
  const fetchPSA_Collection = async (id) => {
    try {
      const response = await axios.get('https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_collections/' + id);
      console.log('PSA Collection Name:', response.data.name)
      selectedPsaCollectionName.value = response.data.name; // Assuming the API returns the collection data directly
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  }
  
  // Fetch PSA Cards for selected collection
  const fetchPsaCards = async (collectionId) => {
    if (!collectionId) return;

    console.log('collectionId wi fetchPsaCards: ', collectionId);
    
    try {
      const response = await axios.get(`https://5ba3ca6b-a813-4e07-89f3-afccbf84b282-00-38uju9xxxdxfz.riker.replit.dev/psa_cards/collection/${collectionId}`);
      //psaCards.value = response.data;
      psaCards.value = response.data.map(card => ({
        ...card,
        card_nr_name: `${card.card_nr} :: ${card.name}`,
        id: card.id
      }));
      console.log('PSA Cards in Collection:', psaCards.value);
    } catch (error) {
      console.error('Error fetching PSA cards:', error);
    }
  };
  
  // Watch for changes in selected PSA collection to fetch corresponding cards
  watch(selectedPsaCollectionId, (newVal) => {
    if (newVal) {
      fetchPSA_Collection(newVal);
      fetchPsaCards(newVal);
    } else {
      psaCards.value = [];
    }
  });


  /*
  const fetchPsaCardsForNewItem = async (collectionId) => {
    if (!collectionId) return;
    try {
      const response = await axios.get(`https://your-api-endpoint/psa_cards/collection/${collectionId}`);
      psaCards.value = response.data.map(card => ({
        ...card,
        card_nr_name: `${card.card_nr} :: ${card.name}`
      }));
    } catch (error) {
      console.error('Error fetching PSA cards:', error);
      psaCards.value = [];
    }
  };
  */

  
  // Watch for changes in psa_cardId to autofill newItemData fields
  watch(() => newItemData.value.psa_cardId, (newVal) => {
    console.log('newVal: ', newVal);
    console.log('selectedPsaCollectionId: ', selectedPsaCollectionId.value);
    
    if (newVal) {
      const selectedCard = psaCards.value.find(card => card.id === newVal);
      if (selectedCard) {
        newItemData.value.collection = selectedPsaCollectionName.value;
        newItemData.value.number = selectedCard.card_nr;
        newItemData.value.name = selectedCard.name;
      }
    }
  });

  

  
  ///  PSA COLLECTION and CARD autocomplete and match
  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
  
</script>
