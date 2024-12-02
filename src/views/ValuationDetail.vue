<template>
  <v-container>  
    <span class="text-caption"><router-link :to="`/app/valuations/`">Valuations</router-link></span>
    <h1 class="text-h4 mb-0"><b>
      {{ valuationData.company_name }}</b> &nbsp;
    </h1>
    <a :href="valuationData.company_url" target="_blank" class="text-body-1 mr-6">{{ valuationData.company_url }}</a>

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
      <!--h2 class="text-h5 mb-2">Your Financial KPIs</h2-->
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <h2 class="text-h5 mb-2"><b>Your Yearly Performance</b></h2>
            </th>
            <template v-for="year in years" :key="year">
              <th class="text-right">{{ year }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefinitionsFinancialInputs" :key="row.field">
            <td>{{ row.label }}</td>
            <template v-for="year in years" :key="year">
              <td class="text-right">
                <input
                  :value="displayedFinancialValue(year, row.field)"
                  @focus="onFocus(year, row.field)"
                  @blur="onBlur(year, row.field)"
                  @input="updateFinancialValue(year, row.field, $event.target.value)"
                  :class="['input_data', {'missing-data': isMissingValue(year, row.field)}]"
                  
                  autocomplete="off"
                  type="text"
                />

              </td>
            </template>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card variant="elevated" class="pa-3 mb-6">
      <!--h2 class="text-h5 mb-2">Calculated KPIs</h2-->
      <v-table>
        <thead>
          <tr>
            <th class="text-left"><h2 class="text-h5 mb-2"><b>Calculated Yearly KPIs</b></h2></th>
            <template v-for="year in years" :key="year">
              <th class="text-right">{{ year }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefinitionsKPIOutputs" :key="row.field">
            <td>{{ row.label }}</td>
            <template v-for="year in years" :key="year">
              <td class="text-right">
                <template v-if="valuationKPIs[year] && valuationKPIs[year][row.field] != null">
                  <!-- Display dash for first year -->
                  <template v-if="valuationKPIs[year][row.field] === '-'">
                    -
                  </template>
                  <!-- Check if KPI value is a number -->
                  <template v-else-if="typeof valuationKPIs[year][row.field] === 'number'">
                    {{ formatKPIValue(row.field, valuationKPIs[year][row.field]) }}
                  </template>
                  <!-- If KPI value is an object with missing data -->
                  <template v-else-if="valuationKPIs[year][row.field].missingData">
                    <span style="color: red;">
                      Missing data: <br>{{ valuationKPIs[year][row.field].missingData.join(', ') }}
                    </span>
                  </template>
                </template>
                <template v-else>
                  <span style="color: red;">No data</span>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </v-table>

    </v-card>


      <v-card variant="elevated" class="pa-3 mb-6">
        <!--h2 class="text-h5 mb-2">Calculated KPIs</h2-->
        <v-table>
          <thead>
            <tr>
              <th class="text-left"><h2 class="text-h5 mb-2"><b>Analysis of your KPIs</b></h2></th>
              <th class="text-right"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td valign="top">Recurring Revenue Ratio</td>
              <td>
                Your Recurring Revenue Ratio for 2024 is 93,63%. <br>

                This is an excellent value for a SaaS company and an investor might reward it with a slight boost to your valuation. <br>
                
                {{ recurringRevenueTrend }}    <br>
                <v-dialog v-model="isDialogVisible" max-width="800">
                  <template #activator="{ props }">
                    <a href="#" v-bind="props" @click.prevent="isDialogVisible = true">learn more...</a>
                  </template>

                  <!-- Include the dialog content component -->
                  <RecurringRevenueDialog :onClose="closeDialog" />
                </v-dialog>
              </td>
            </tr>
          </tbody>
        </v-table>

      </v-card>
    
    
    <v-card variant="elevated" class="pa-3 mb-6">
      <!--h2 class="text-h5 mb-2">Calculated KPIs</h2-->
      <v-table>
        <thead>
          <tr>
            <th class="text-left"><h2 class="text-h5 mb-2"><b>Valuation of your SaaS business</b></h2></th>
            <th class="text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Valuation Method</td>
            <td>
              
            </td>
          </tr>
          <tr>
            <td>Valuation Method</td>
            <td>

            </td>
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
  import { useTrendAnalysis } from '@/utils/trendAnalysis.js';
  import debounce from 'debounce';

  import getKPIInfo from '@/utils/kpiInterpretation/getKPIInfo';


  //components
  import RecurringRevenueDialog from '@/components/kpi_explanations/recurring_revenue_ratio.vue';
  

  const isDialogVisible = ref(false);

  // Function to close the dialog
  function closeDialog() {
    isDialogVisible.value = false;
  }
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //valuation vars
  const thisValuationId = ref(route.params.id);
  const valuationData = reactive({}); 
  // Initialize reactive object to store KPIs
  const valuationKPIs = reactive({});

  
  //compute properties for dynamic table
  const years = computed(() => {
    if (!valuationData.valuation_financials) return [];
    return Object.keys(valuationData.valuation_financials).sort();
  });

  //compute trends 
  const { trendStatement: recurringRevenueTrend } = useTrendAnalysis(valuationKPIs, 'calc_recurring_revenue_ratio');

  

  const rowDefinitionsFinancialInputs = computed(() => [
    // Revenue metrics
    { label: 'Total Revenue', field: 'total_revenue', isCurrency: true },
    { label: 'Recurring Revenue', field: 'recurring_revenue', isCurrency: true },

    // Cost metrics
    { label: 'Total Costs', field: 'total_costs', isCurrency: true },
    { label: 'Costs of Goods Sold', field: 'costs_of_goods_sold', isCurrency: true },
    { label: 'Costs of Customer Acquisition', field: 'costs_of_customer_acquisition', isCurrency: true },
    { label: 'Costs of Research and Development', field: 'costs_of_r_and_d', isCurrency: true },
    { label: 'Costs of General Administration', field: 'costs_of_general_administration', isCurrency: true },

    // Customer metrics
    { label: 'Number of Customers at End of Period', field: 'number_of_customers_end_of_period', isCurrency: false },
    { label: 'Customers Won in Period', field: 'customers_won_in_period', isCurrency: false },
    { label: 'Customers Lost in Period', field: 'customers_lost_in_period', isCurrency: false },
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

  


  
  //get one valuation 
  async function fetchValuation(id) {
    try {
      const response = await axios.get(`${apiBaseURL}/valuations/` + id) ;
      Object.assign(valuationData, response.data[0]); // Assuming the API returns the lots data directly
      //db console.log('valuations data '. valuationData);

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

      //db console.log('Transformed valuations data:', valuationData);
      //console.log(valuationData.value);
      } catch (error) {
      console.error('Error fetching lots:', error);  }
    }


  // Function to get and set financial values
  function getFinancialValue(year, field) {
    return valuationData.valuation_financials[year]?.[field] ?? '';
  }
  
  function updateFinancialValue(year, field, value) {
    const unformattedValue = unformatValue(value);
    if (!valuationData.valuation_financials[year]) {
      valuationData.valuation_financials[year] = {};
    }
    valuationData.valuation_financials[year][field] = unformattedValue;

    // Debounce API calls to prevent excessive requests
    debouncedUpdateValuationFinancial(field, unformattedValue, year);
  }


  // Function to check if a value is missing
  function isMissingValue(year, field) {
    const value = valuationData.valuation_financials[year]?.[field];
    return value == null || value === '';
  }

  // Debounced function to update valuation financials
  const debouncedUpdateValuationFinancial = debounce((field, value, timePeriod) => {
    updateValuationFinancial(field, value, timePeriod);
  }, 500);


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

  // Function to update valuation financials
  async function updateValuationFinancial(field, value, timePeriod) {
    try {
      // Parse the value to a number if it's supposed to be numeric
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        // If the field is not supposed to be numeric, you can handle it differently
        console.error('Invalid number input');
        // Optionally, keep the invalid value for the user to correct
        return;
      }

      // Make the API call to update the data
      const response = await axios.put(`${apiBaseURL}/valuations/financials/${thisValuationId.value}/${timePeriod}`, {
        [field]: parsedValue,
      });

      // Update local data
      valuationData.valuation_financials[timePeriod][field] = parsedValue;

      console.log('Valuation financial updated:', response);
    } catch (error) {
      console.error('Error updating valuation financial:', error);
    }
  }


  onMounted(() => {
    //console.log('thisValuationId: ', thisValuationId.value)
    fetchValuation(thisValuationId.value);
    testGetKPIInfo();
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



  ///////////////
  // START KPI Calculation Functions
  //////

  function calculateKPIsForYear(year) {
    const financials = valuationData.valuation_financials[year];
    const kpis = {};

    if (financials) {
      // Recurring Revenue Ratio
      let missingData = [];
      if (financials.recurring_revenue != null && financials.total_revenue != null) {
        kpis.calc_recurring_revenue_ratio =
          financials.total_revenue !== 0
            ? financials.recurring_revenue / financials.total_revenue
            : 0;
      } else {
        if (financials.recurring_revenue == null) missingData.push('recurring_revenue');
        if (financials.total_revenue == null) missingData.push('total_revenue');
        kpis.calc_recurring_revenue_ratio = { missingData };
      }

      // Year-over-Year Revenue Growth
      missingData = [];
      const yearsArray = Object.keys(valuationData.valuation_financials).sort();
      const firstYear = yearsArray[0];

      if (year === firstYear) {
        // First year, set KPI to '-'
        kpis.calc_yoy_revenue_growth = '-';
      } else {
        const previousYear = parseInt(year) - 1;
        const prevFinancials = valuationData.valuation_financials[previousYear];
        if (financials.total_revenue != null && prevFinancials && prevFinancials.total_revenue != null) {
          kpis.calc_yoy_revenue_growth =
            prevFinancials.total_revenue !== 0
              ? (financials.total_revenue - prevFinancials.total_revenue) / prevFinancials.total_revenue
              : null;
        } else {
          if (financials.total_revenue == null) missingData.push(`total_revenue (${year})`);
          if (!prevFinancials || prevFinancials.total_revenue == null) missingData.push(`total_revenue (${previousYear})`);
          kpis.calc_yoy_revenue_growth = { missingData };
        }
      }


      // Gross Margin
      missingData = [];
      if (financials.total_revenue != null && financials.costs_of_goods_sold != null) {
        const revenue = financials.total_revenue;
        const cogs = financials.costs_of_goods_sold;
        kpis.calc_gross_margin = revenue !== 0 ? (revenue - cogs) / revenue : null;
      } else {
        if (financials.total_revenue == null) missingData.push('total_revenue');
        if (financials.costs_of_goods_sold == null) missingData.push('costs_of_goods_sold');
        kpis.calc_gross_margin = { missingData };
      }



      // EBITDA Margin
      missingData = [];
      if (
        financials.total_revenue != null &&
        financials.costs_of_goods_sold != null &&
        financials.costs_of_customer_acquisition != null &&
        financials.costs_of_r_and_d != null &&
        financials.costs_of_general_administration != null
      ) {
        const totalCosts =
          financials.costs_of_goods_sold +
          financials.costs_of_customer_acquisition +
          financials.costs_of_r_and_d +
          financials.costs_of_general_administration;
        const ebitda = financials.total_revenue - totalCosts;
        kpis.calc_ebitda_margin = financials.total_revenue !== 0 ? ebitda / financials.total_revenue : null;
      } else {
        if (financials.total_revenue == null) missingData.push('total_revenue');
        if (financials.costs_of_goods_sold == null) missingData.push('costs_of_goods_sold');
        if (financials.costs_of_customer_acquisition == null) missingData.push('costs_of_customer_acquisition');
        if (financials.costs_of_r_and_d == null) missingData.push('costs_of_r_and_d');
        if (financials.costs_of_general_administration == null) missingData.push('costs_of_general_administration');
        kpis.calc_ebitda_margin = { missingData };
      }


      // Average Revenue per Customer
      missingData = [];
      if (financials.total_revenue != null && financials.number_of_customers_end_of_period != null) {
        const customers = financials.number_of_customers_end_of_period;
        kpis.calc_average_revenue_per_customer = customers !== 0 ? financials.total_revenue / customers : null;
      } else {
        if (financials.total_revenue == null) missingData.push('total_revenue');
        if (financials.number_of_customers_end_of_period == null) missingData.push('number_of_customers_end_of_period');
        kpis.calc_average_revenue_per_customer = { missingData };
      }


      // Customer Logo Churn
      missingData = [];
      if (
        financials.number_of_customers_end_of_period != null &&
        financials.customers_won_in_period != null &&
        financials.customers_lost_in_period != null
      ) {
        const customersAtEnd = financials.number_of_customers_end_of_period;
        const customersWon = financials.customers_won_in_period;
        const customersLost = financials.customers_lost_in_period;

        const customersAtStart = customersAtEnd - customersWon + customersLost;

        if (customersAtStart !== 0) {
          kpis.calc_customer_logo_churn = customersLost / customersAtStart;
        } else {
          kpis.calc_customer_logo_churn = null;
        }
      } else {
        if (financials.number_of_customers_end_of_period == null) missingData.push('number_of_customers_end_of_period');
        if (financials.customers_won_in_period == null) missingData.push('customers_won_in_period');
        if (financials.customers_lost_in_period == null) missingData.push('customers_lost_in_period');
        kpis.calc_customer_logo_churn = { missingData };
      }


      // LTV to CAC Ratio
      missingData = [];
      if (
        kpis.calc_average_revenue_per_customer != null &&
        kpis.calc_gross_margin != null &&
        kpis.calc_customer_logo_churn != null &&
        financials.costs_of_customer_acquisition != null &&
        financials.customers_won_in_period != null
      ) {
        const avgRevenuePerCustomer = kpis.calc_average_revenue_per_customer;
        const grossMargin = kpis.calc_gross_margin;
        const churnRate = kpis.calc_customer_logo_churn;

        const ltv = churnRate !== 0 ? (avgRevenuePerCustomer * grossMargin) / churnRate : null;
        const cac =
          financials.customers_won_in_period !== 0
            ? financials.costs_of_customer_acquisition / financials.customers_won_in_period
            : null;

        if (ltv != null && cac != null && cac !== 0) {
          kpis.calc_ltv_to_cac = ltv / cac;
        } else {
          kpis.calc_ltv_to_cac = null;
        }
      } else {
        if (kpis.calc_average_revenue_per_customer == null) missingData.push('calc_average_revenue_per_customer');
        if (kpis.calc_gross_margin == null) missingData.push('calc_gross_margin');
        if (kpis.calc_customer_logo_churn == null) missingData.push('calc_customer_logo_churn');
        if (financials.costs_of_customer_acquisition == null) missingData.push('costs_of_customer_acquisition');
        if (financials.customers_won_in_period == null) missingData.push('customers_won_in_period');
        kpis.calc_ltv_to_cac = { missingData };
      }


    } else {
      kpis.missingFinancials = true;
    }

    valuationKPIs[year] = kpis;
  }


  // Sample test function
  function testGetKPIInfo() {
    try {
      // Define sample KPI key and value
      const testKPIKey = 'calc_recurring_revenue_ratio'; // Replace with a valid KPI key from your kpiData
      const testKPIValue = 0.9;        // Replace with a sample value to test

      // Call the getKPIInfo function
      const result = getKPIInfo(testKPIKey, testKPIValue);

      // Output the result to the console
      console.log('Test getKPIInfo Result:', result);
    } catch (error) {
      console.error('Error testing getKPIInfo:', error.message);
    }
  }

  

  watchEffect(() => {
    if (valuationData.valuation_financials) {
      for (const year of years.value) {
        calculateKPIsForYear(year);
      }
    }
  });


  function formatKPIValue(field, value) {
    const percentageKPIs = [
      'calc_recurring_revenue_ratio',
      'calc_yoy_revenue_growth',
      'calc_gross_margin',
      'calc_ebitda_margin',
      'calc_customer_logo_churn'
    ];

    if (percentageKPIs.includes(field)) {
      return (value * 100).toFixed(2) + '%';
    } else if (field === 'calc_ltv_to_cac') {
      return value.toFixed(2); // Format as a ratio
    } else if (field === 'calc_average_revenue_per_customer') {
      return usdFormat(value);
    } else {
      // Default formatting
      return value;
    }
  }



  //////
  // END KPI Calculation Functions
  ///////////////


  
  

  /// change formating of valuation input fields when in focus
  // keep track which cells are focused
  const focusedCells = reactive({});

  function onFocus(year, field) {
    if (!focusedCells[year]) {
      focusedCells[year] = {};
    }
    focusedCells[year][field] = true;
  }

  function onBlur(year, field) {
    if (focusedCells[year]) {
      focusedCells[year][field] = false;
    }
  }

  function isCellFocused(year, field) {
    return focusedCells[year] && focusedCells[year][field];
  }

  function displayedFinancialValue(year, field) {
    const value = getFinancialValue(year, field);
    if (isCellFocused(year, field)) {
      // Return raw value when focused
      return value;
    } else {
      // Get the row definition to check if it's a currency field
      const rowDef = rowDefinitionsFinancialInputs.value.find(row => row.field === field);
      const isCurrency = rowDef ? rowDef.isCurrency : false;
      // Return formatted value when not focused
      return formatFinancialValue(value, isCurrency);
    }
  }

  function formatFinancialValue(value, isCurrency) {
    if (value == null || value === '') return '';
    // Convert the value to a number
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return value;

    // Format the number with 'de-DE' locale for '.' as thousand separator and ',' as decimal separator
    const formattedNumber = numberValue.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    if (isCurrency) {
      return '$' + formattedNumber;
    } else {
      return formattedNumber;
    }
  }

  function unformatValue(value) {
    if (value == null || value === '') return value;
    // Remove currency symbols
    let unformattedValue = value.replace(/\$/g, '');
    // Remove thousand separators '.'
    unformattedValue = unformattedValue.replace(/\./g, '');
    // Replace decimal separator ',' with '.'
    unformattedValue = unformattedValue.replace(/,/g, '.');

    return unformattedValue;
  }



  
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

<style>
  .input_data {
    width: 85px;
    text-align: right;
    padding: 4px;
    border-radius: 5px;
    border: 1px solid #cccccc;
  }
  
  .missing-data {
    border: 1px solid gray;
    background-color: #f6f6f6;
  }

</style>