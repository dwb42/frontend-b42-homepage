<template>
  <v-container>  
    <span class="text-caption"><router-link :to="`/app/valuations/`">Valuations</router-link></span>
    <h1 class="text-h4 mb-2"><b>
      {{ valuationData.company_name }}</b> &nbsp;
    </h1>
    <span class="text-body-1 mr-6">{{ valuationData.company_url }}</span>

    <div class="mt-6"></div>
    
    <v-card variant="elevated" class="pa-3 mb-6">
      <h2 class="text-h5 mb-2">General Info</h2>
      <v-form @submit.prevent="">
        <v-text-field v-model="valuationData.company_name" id="company_name" label="Company Name" required hide-details class="mb-6"></v-text-field>
        <v-text-field v-model="valuationData.company_url" id="company_url" label="Company Website" required hide-details class="mb-6"></v-text-field>
        <v-text-field v-model="valuationData.operational_since" id="operational_since" label="Operational since" required hide-details class="mb-6"></v-text-field>
        <v-text-field v-model="valuationData.number_of_employees" id="number_of_employees" label="Number of employees (incl. active founders)" required hide-details class="mb-6"></v-text-field>
      </v-form>
    </v-card>

    <v-card variant="elevated" class="pa-3 mb-6">
      <h2 class="text-h5 mb-2">Revenue</h2>

      <v-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-right">2021</th>
            <th class="text-right">2022</th>
            <th class="text-right">2023</th>
            <th class="text-right">2024</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Revenue</td>
            <!--td class="text-right">{{ valuationData?.valuation_financials?.[2021]?.total_revenue || '' }}</td--> 
            <td class="text-right" @click="startEditing('total_revenue', 2021)">
              <div v-if="isEditing('total_revenue', 2021)">
                <input 
                  v-model="editValue"
                  @keyup.enter="saveEdit('total_revenue', 2021)"
                  @blur="saveEdit('total_revenue', 2021)"
                  ref="editInput"
                  style="width: 100%; text-align: right;"
                />
              </div>
              <div v-else>
                {{ valuationData?.valuation_financials?.[2021]?.total_revenue || '' }}
              </div>
            </td>

            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
          </tr>
          <tr>
            <td>Recurring Revenue</td>
            <td class="text-right">{{ valuationData?.valuation_financials?.[2021]?.recurring_revenue || '' }}</td> 
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
          </tr>
        </tbody>
      </v-table>
      
    
    </v-card>
  
  </v-container>  
</template>

<script setup>
  import { reactive, ref, computed, watchEffect, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat, apiBaseURL } from '@/utils/index.js';
  import debounce from 'debounce';
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //lot vars
  const thisValuationId = ref(route.params.id);
  const valuationData = reactive({
    
  }); 

  //edit valuation financial cell
  const editingCell = ref(null);
  const editValue = ref(null);
  const editInput = ref(null); 

  

  function startEditing(field, year) {
    editingCell.value = `${field}_${year}`;
    editValue.value = valuationData.valuation_financials[year][field];

    nextTick(() => {
      if (editInput.value) {
        editInput.value.focus();
      }
    });
  }
  
  function isEditing(field, year) {
    return editingCell.value === `${field}_${year}`;
  }

  function saveEdit(field, year) {
    if (editingCell.value === `${field}_${year}`) {
      updateValuationFinancial(field, editValue.value, year);
    }
  }
  
  
  //get one valuation 
  async function fetchValuation(id) {
    try {
      const response = await axios.get(`${apiBaseURL}/valuations/` + id) ;
      Object.assign(valuationData, response.data[0]); // Assuming the API returns the lots data directly
      console.log('valuations data '. valuationData);

      // Assuming the API returns the data directly as response.data[0]
      const fetchedData = response.data[0];

      // Transform valuation_financials array into an object keyed by time_period
      if (fetchedData.valuation_financials) {
        fetchedData.valuation_financials = fetchedData.valuation_financials.reduce((acc, item) => {
          acc[item.time_period] = item;
          return acc;
        }, {});
      }

      // Assign the transformed data to valuationData
      Object.assign(valuationData, fetchedData);

      console.log('Transformed valuations data:', valuationData);
      //console.log(valuationData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }


  //save valuation data to db
  async function saveValuation() {
    // Make an HTTP PUT request to update the lot in the database using Sequelize
    try {
      console.log('val data ',valuationData)
      const response = await axios.put(`${apiBaseURL}/valuations/` + thisValuationId.value, valuationData);
      console.log('valuation updated:', response);

    } catch (error) {
      console.error('Error updating valuation in db:', error);
    }
  }


  async function updateValuationFinancial(field, value, timePeriod) {
    try {
      const response = await axios.put(`${apiBaseURL}/valuations/financials/${thisValuationId.value}/${timePeriod}`, {

        [field]: value
      });

      // Update local data
      valuationData.valuation_financials[timePeriod][field] = value;
      editingCell.value = null;

      console.log('Valuation financial updated:', response);
    } catch (error) {
      console.error('Error updating valuation financial:', error);
    }
  }

  onMounted(() => {
    //console.log('thisValuationId: ', thisValuationId.value)
    fetchValuation(thisValuationId.value);
  });


  const saveData = debounce((data) => {
      saveValuation(data);
  }, 500);
  
  watch(
    () => ({ ...valuationData }),
    (newValues) => {
      saveData(newValues);
    },
    { deep: true }
  );
  
</script>
