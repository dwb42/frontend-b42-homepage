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
        <v-text-field 
          v-model="valuationData.company_url" 
          id="company_url" 
          label="Company Website" 
          required
          :rules="[urlRules]"
          placeholder="www.example.com"
          @blur="formatURL"
          hide-details="auto"
          class="mb-6"
        ></v-text-field>
        <v-text-field v-model="valuationData.operational_since" id="operational_since" label="Operational since" required hide-details class="mb-6"></v-text-field>
        <v-text-field v-model="valuationData.number_of_employees" id="number_of_employees" label="Number of employees (incl. active founders)" required hide-details class="mb-6"></v-text-field>
      </v-form>
    </v-card>

    <v-card variant="elevated" class="pa-3 mb-6">
      <h2 class="text-h5 mb-2">Financials</h2>

      <!--v-table>
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
      </v-table-->

      <v-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <template v-for="year in years" :key="year">
              <th class="text-right">{{ year }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefinitionsFinancialInputs" :key="row.field">
            <td>{{ row.label }}</td>
            <template v-for="year in years" :key="year">
              <td class="text-right" @click="startEditing(row.field, year)">
                <div v-if="isEditing(row.field, year)">
                  <input 
                    v-model="editValue"
                    @keyup.enter="saveEdit(row.field, year)"
                    @blur="saveEdit(row.field, year)"
                    :ref="el => setInputRef(el, row.field, year)"
                    style="width: 80px; text-align: right;"
                    autocomplete="off"
                    type="text"
                  />
                </div>
                <div v-else>
                  <template v-if="valuationData?.valuation_financials?.[year]?.[row.field]">
                    {{ usdFormat(valuationData.valuation_financials[year][row.field]) }}
                  </template>
                  <template v-else>
                    <span style="background-color: #fffbe6;font-size: 0.8em;color:red">add data</span>
                  </template>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card variant="elevated" class="pa-3 mb-6">
      <h2 class="text-h5 mb-2">Calculated KPIs</h2>
      <v-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <template v-for="year in years" :key="year">
              <th class="text-right">{{ year }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefinitionsKPIOutputs" :key="row.field">
            <td>{{ row.label }}</td>
            <template v-for="year in years" :key="year">
              <td class="text-right" @click="startEditing(row.field, year)">
                <div v-if="isEditing(row.field, year)">
                  <input 
                    v-model="editValue"
                    @keyup.enter="saveEdit(row.field, year)"
                    @blur="saveEdit(row.field, year)"
                    :ref="el => setInputRef(el, row.field, year)"
                    style="width: 80px; text-align: right;"
                    autocomplete="off"
                    type="text"
                  />
                </div>
                <div v-else>
                  <template v-if="valuationData?.valuation_financials?.[year]?.[row.field]">
                    {{ usdFormat(valuationData.valuation_financials[year][row.field]) }}
                  </template>
                  <template v-else>
                    <span style="background-color: #fffbe6;font-size: 0.8em;color:red">add data</span>
                  </template>
                </div>
              </td>
            </template>
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

  //valuation vars
  const thisValuationId = ref(route.params.id);
  const valuationData = reactive({}); 

  //edit valuation financial cell
  const editingCell = ref(null);
  const editValue = ref(null);
  const editInput = ref({}); 

  
  //compute properties for dynamic table
  const years = computed(() => {
    if (!valuationData.valuation_financials) return [];
    return Object.keys(valuationData.valuation_financials).sort();
  });
  
  const rowDefinitionsFinancialInputs = computed(() => [
    // Revenue metrics
    { label: 'Total Revenue', field: 'total_revenue' },
    { label: 'Recurring Revenue', field: 'recurring_revenue' },

    // Cost metrics
    { label: 'Total Costs', field: 'total_costs' },
    { label: 'Costs of Goods Sold', field: 'costs_of_goods_sold' },
    { label: 'Costs of Customer Acquisition', field: 'costs_of_customer_acquisition' },
    { label: 'Costs of Research and Development', field: 'costs_of_r_and_d' },
    { label: 'Costs of General Administration', field: 'costs_of_general_administration' },

    // Customer metrics
    { label: 'Number of Customers at End of Period', field: 'number_of_customers_end_of_period' },
    { label: 'Customers Won in Period', field: 'customer_won_in_period' },
    { label: 'Customers Lost in Period', field: 'comsteroms_lost_in_period' },

  ]);

  const rowDefinitionsKPIOutputs = computed(() => [
    { label: 'Recurring Revenue Ratio', field: 'calc_recurring_revenue_ratio' },
    { label: 'Year-over-Year Revenue Growth', field: 'calc_yoy_revenue_growth' },
    { label: 'Gross Margin', field: 'calc_gross_margin' },
    { label: 'EBITDA Margin', field: 'calc_ebitda_margin' },
    { label: 'Average Revenue per Customer', field: 'calc_average_revenue_per_customer' },
    { label: 'Customer Logo Churn', field: 'calc_customer_logo_churn' },
    { label: 'LTV to CAC Ratio', field: 'calc_ltv_to_cac' }
  ]);

  
  function setInputRef(el, field, year) {
    if (!editInput.value) editInput.value = {};
    const key = `${field}_${year}`;
    editInput.value[key] = el;
  }

  
  function startEditing(field, year) {
    editingCell.value = `${field}_${year}`;
    editValue.value = valuationData.valuation_financials[year]?.[field] || '';

    // Use nextTick to ensure DOM is updated
    nextTick(() => {
      const key = `${field}_${year}`;
      if (editInput.value[key]) {
        editInput.value[key].focus();
        editInput.value[key].select(); // This will also select the text if there's any
      }
    });
  }

  
  function isEditing(field, year) {
    return editingCell.value === `${field}_${year}`;
  }

  function saveEdit(field, year) {
    if (editingCell.value === `${field}_${year}`) {
      const value = Number(editValue.value);
      if (isNaN(value)) {
        console.error('Invalid number input');
        return;
      }
      updateValuationFinancial(field, value, year);
    }
    editingCell.value = null;
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



// url rules to format url nicely
  function urlRules(value) {
    if (!value) return 'URL is required'
    if (!isValidURL(value)) return 'Please enter a valid URL'
    return true
  }
  function isValidURL(url) {
    try {
      new URL(url)
      return true
    } catch {
      try {
        new URL('https://' + url)
        return true
      } catch {
        return false
      }
    }
  }
  function formatURL() {
    if (!valuationData.company_url) return

    let url = valuationData.company_url.trim()

    // If URL doesn't start with protocol, add https://
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    // Update the URL if it's valid
    try {
      new URL(url)
      valuationData.company_url = url
    } catch {
      // Invalid URL, leave as is for now
    }
  }
</script>

