<template>
  <v-container>  
    <span class="text-caption"><router-link :to="`/app/valuations/`">Valuations</router-link></span>
    <h1 class="text-h4 mb-0">
      <div v-if="!isEditingName" @click="startEditingName" style="cursor: pointer;">
        <b>{{ valuationData.company_name }}</b> &nbsp;
      </div>
      <input
        v-else
        v-model="valuationData.company_name"
        @blur="stopEditingName"
        @keyup.enter="stopEditingName"
        ref="nameInput"
        class="text-h4"
        style="border: 1px solid #767676; outline: none; background: #ddd; font-weight: bold; width: 100%;"
      >
    </h1>
    <div class="d-flex align-center">
      <template v-if="!isEditingURL">
        <a :href="valuationData.company_url" target="_blank" class="text-body-1 mr-2">{{ valuationData.company_url }}</a>
        <v-icon @click="startEditingURL" style="cursor: pointer;">mdi-pencil</v-icon>
      </template>
      <v-text-field
        v-else
        v-model="valuationData.company_url"
        @blur="stopEditingURL"
        @keyup.enter="stopEditingURL"
        :rules="[urlRules]"
        placeholder="www.example.com"
        @blur="formatURL"
        hide-details="auto"
        ref="urlInput"
        style="max-width: 400px;"
      ></v-text-field>
    </div>

    <div class="mt-10"></div>

    <h2 class="text-h5 mb-2"><b>(1) Provide general info & select business stage</b></h2>
    <v-card variant="outlined" class="pa-3 mb-12">
      
      
      <v-form @submit.prevent="">
        <!--v-text-field v-model="valuationData.company_name" id="company_name" label="Company Name" required hide-details class="mb-6"></v-text-field-->
        <!--v-text-field 
          v-model="valuationData.company_url" 
          id="company_url" 
          label="Company Website" 
          required
          :rules="[urlRules]"
          placeholder="www.example.com"
          @blur="formatURL"
          hide-details="auto"
          class="mb-6"
        ></v-text-field-->
        <v-text-field 
          v-model="valuationData.operational_since" 
          id="operational_since" 
          label="Operational since" 
          required 
          :rules="[checkValidPastYear]"
          hide-details="auto"
          class="mb-6"
        ></v-text-field>
        <v-text-field v-model="valuationData.number_of_employees" id="number_of_employees" label="Number of employees (incl. active founders)" required hide-details class="mb-6"></v-text-field>

        <h3 class="text-h6 mb-2 mt-6">What best describes your current stage of business?</h3>
        <v-radio-group v-model="valuationData.state_of_business">
          <v-radio value="preRevenue">
            <template v-slot:label>
              <div class="mb-2"><strong>pre revenue</strong><br>we are just getting started and do not have revenue yet </div>
            </template>
          </v-radio>
          <v-radio value="earlyStage">
            <template v-slot:label>
              <div class="mt-2 mb-2"><strong>early stage / growth focused</strong><br>we are investing heavily in product and/or growth and have little to no profit because of it </div>
            </template>
          </v-radio>
          <v-radio value="laterStage">
            <template v-slot:label>
              <div class="mt-2"><strong>later stage / balanced</strong><br>we are balancing our focus on growth and profitability </div>
            </template>
          </v-radio>
        </v-radio-group>

        <v-alert
          v-if="valuationData.state_of_business === 'preRevenue'"
          text=""
          title="Sorry, our valuation method does not work for pre-revenue businesses. We wish you success in sales!"
          color="#b00020"
        ></v-alert>

        <v-alert
          v-if="valuationData.state_of_business === 'earlyStage'"
          text="We will use the ARR-Multiple Method for valuation."
          title=""
          color="secondary"
          >
          </v-alert>

        <v-alert
          v-if="valuationData.state_of_business === 'laterStage'"
          text="We will use the EBITDA-Multiple Method for valuation."
          title=""
          color="secondary"
          >
        </v-alert>



        <v-btn 
          v-if="!valuationData.show_yearly_inputs && valuationData.state_of_business !== 'preRevenue'"
          color="primary" 
          type="button"
          class="mt-6"
          @click="navigateToFinancialInfo"
          :disabled="!isGeneralInfoComplete"
        >
          Enter Financial Information
        </v-btn>

        <!-- <v-btn 
          color="primary" 
          type="button"
          class="mt-6"
          @click="createInitialYearlyInputs"
        >
          create yrls
        </v-btn> -->


        
      </v-form>
    </v-card>
    


    <!-- ///////////////////////// -->
    <!-- YEARLY INPUTS START        -->
    <!-- /////////////////////////  -->

    <template 
      v-if="valuationData.show_yearly_inputs"
      >
    <h2 class="text-h5 mb-2"><b>(2) Enter your financial data <!--({{valuationData.valuation_type}})--></b></h2>
    <v-card variant="outlined" class="pa-3 mb-10">
      
      <h3 class="text-h6 mb-2 mt-2">Select Detail-Level</h3>
      <v-radio-group v-model="valuationData.valuation_type">
        <v-radio value="minimal">
          <template v-slot:label>
            <div class="mb-2"><strong>minimal</strong><br>Enter financial data for latest financial period to provide investors with a first sense of growth and profitability.  </div>
          </template>
        </v-radio>
        <v-radio value="standard">
          <template v-slot:label>
            <div class="mt-2 mb-2"><strong>standard</strong><br>Add more revenue data to get CAGR and current period customer data to calculate logo churn. </div>
          </template>
        </v-radio>
        <v-radio value="complete">
          <template v-slot:label>
            <div class="mt-2"><strong>complete</strong><br>Provide investors with a complete overview of your current and past performance so that they can include trends in the valuation of your company. </div>
          </template>
        </v-radio>
      </v-radio-group>

      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <!--h2 class="text-h5 mb-2"><b>Your Yearly Performance</b></h2-->
            </th>
            <template v-for="year in years" :key="year">
              <th class="text-right">{{ year }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefinitionsFinancialInputs" :key="row.field">
            <td>
              <span style="color: inherit; text-decoration: underline dotted; cursor: pointer;" @click="openModal(row.field)">
                {{ row.label }}
              </span>
            </td>
            <template v-for="year in years" :key="year">
              <td class="text-right">
                <template v-if="isRowFieldActive(valuationData.valuation_type, year, years, row)">
                  <input
                    :value="displayedFinancialValue(year, row.field)"
                    @focus="onFocus(year, row.field)"
                    @blur="onBlur(year, row.field)"
                    @input="updateFinancialValue(year, row.field, $event.target.value)"
                    :class="['input_data', { 'missing-data': isMissingValue(year, row.field) }]"
                    autocomplete="off"
                    type="text"
                  />
                </template>
                <template v-else>
                  -
                </template>
              </td>

            </template>
          </tr>
        </tbody>
      </v-table>

      <v-alert
        v-if="showInputAlert" 
        ariant="tonal"
        density="compact"
        text="recalculate 👇"  
        title="Your inputs have changed"
        color="yellow-lighten-4"
        class="mt-4"
      ></v-alert>
      
      <v-btn
        color="primary"
        class="mt-4"
        :disabled="!allActiveFieldsFilled"
        @click="recalculateAllMetrics"
      >
        Evaluate your business
      </v-btn>

    </v-card>
    </template>

    <!-- ///////////////////////// -->
    <!-- YEARLY INPUTS END          -->
    <!-- /////////////////////////  -->

    <!--pre>valuationData<br>{{valuationData}}</pre>
    <pre>analysed_kpis<br>{{analysed_kpis}}</pre>
    <pre>valuationCalculation<br>{{valuationCalculation}}</pre-->

 
    <!-- ///////////////////////// -->
    <!-- EVALUATION START     1234      -->
    <!-- /////////////////////////  -->
    <template v-if="showResults">
      <h2 class="text-h5 mb-2"><b>(3) Review valuation <!--({{valuationData.valuation_type}})--></b></h2>

        <v-card variant="outlined" class="pa-3 mb-10">

          <!-- Description above base multiple input -->
          <p v-html="currentEvaluation.description_above_input"></p>

          <!-- Base multiple input -->
          <v-text-field
            v-model="baseMultiple"
            :label="currentEvaluationMethod === 'arr' ? 'Base ARR-Multiple' : 'Base EBITDA-Multiple'"
            type="number"
            :rules="[v => v >= 0 || 'Multiple must be non-negative']"
            style="width:250px"
            class="mb-6"
          ></v-text-field>

          <!-- Description below base multiple input -->
          <p class="mb-6 text-body-1" v-html="currentEvaluation.description_below_input"></p>

          <!-- Table structure with 5 rows  -->
          <v-table>
            <thead>
              <tr>
                <th class="text-left" width="75%">Metric & Evaluation</th>
                <th class="text-right" width="25%">Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <!-- Growth 456 -->
                <td>
                  <div class="py-2">
                    <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                    <p class="text-body-2 mb-2">
                      <div v-html="currentEvaluation.table.growth.description"></div>
                    </p>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
  
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </div>
                </td>
                <td class="text-right">
                  <span>{{ currentEvaluation.table.growth.impact }}</span>
                </td>
              </tr>
              <tr>
                <!-- Profitability -->
                <td>
                  <div class="py-2">
                    <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                    <p class="text-body-2 mb-2">
                      <div v-html="currentEvaluation.table.profitability.description"></div>
                    </p>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"

                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_profitability')"
                    ></v-btn>
                  </div>
                </td>
                <td class="text-right">
                  <span>{{ currentEvaluation.table.profitability.impact }}</span>
                </td>
              </tr>
              <tr>
                <!-- Recurring Revenue Ratio -->
                <td>
                  <div class="py-2">
                    <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                    <p class="text-body-2 mb-2">
                      <div v-html="currentEvaluation.table.recurringRevenueRatio.description"></div>
                    </p>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"

                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </div>
                </td>
                <td class="text-right">
                  <span>{{ currentEvaluation.table.recurringRevenueRatio.impact }}</span>
                </td>
              </tr>
              <tr>
                <!-- LTV-to-CAC Ratio -->
                <td>
                  <div class="py-2">
                    <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                    <p class="text-body-2 mb-2">
                      <div v-html="currentEvaluation.table.ltvToCac.description"></div>
                    </p>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"

                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </div>
                </td>
                <td class="text-right">
                  <span>{{ currentEvaluation.table.ltvToCac.impact }}</span>
                </td>
              </tr>
              <tr>
                <!-- Final Impact -->
                <td>
                  <div class="py-2">
                    <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                    <p class="text-body-2 mb-2">
                      <div v-html="currentEvaluation.table.final.description"></div>
                    </p>
                  </div>
                </td>
                <td class="text-right font-weight-bold">
                  <span>{{ currentEvaluation.table.final.impact }}</span>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Final valuation content -->
          <div class="mt-6" v-html="currentEvaluation.evaluation_content"></div>

        </v-card>



      <!--pre>valuationData<br>{{valuationData}}</pre>
      <pre>analysed_kpis<br>{{analysed_kpis}}</pre>
      <pre>valuationCalculation<br>{{valuationCalculation}}</pre-->

    </template>

    <!-- The Dialog that will show the selected KPI details -->
    <!-- putting it outside the showResults if so that it works for inputs -->
    <v-dialog v-model="isDialogOpen" :style="{ maxWidth: '800px' }">
      <v-card :title="selectedKPI && kpiModalConfig[selectedKPI] ? kpiModalConfig[selectedKPI].title : 'someone forgot to give this modal a title ..'">

        <v-card-text>
          <!-- Dynamically render the component -->
          <component 
            v-if="selectedKPI && kpiModalConfig[selectedKPI]" 
            :is="kpiModalConfig[selectedKPI].component"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isDialogOpen = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ///////////////////////// -->
    <!-- EVALUATION END           -->
    <!-- /////////////////////////  -->

    <!-- ///////////////////////// -->
    <!-- FEEDBACK START    --> 
    <!-- /////////////////////////  -->
    <template v-if="showResults">
      <h2 class="text-h5 mb-2 mt-0"><b>(4) Gives us Feedback</b></h2>
      
      <v-card variant="outlined" class="pa-3 mb-12">
        <v-form @submit.prevent="">
  
          <h3 class="text-h6 mb-0 mt-0">Rate this tool on a scale of 1 to 5 </h3>
          <v-radio-group v-model="valuationData.feedback_rating_1to10_of_tool">
            <v-radio value="">
              <template v-slot:label><strong>no answer</strong></template>
            </v-radio>
            <v-radio value="1">
              <template v-slot:label><strong>1 - pretty shitty</strong></template>
            </v-radio>
            <v-radio value="2">
              <template v-slot:label><strong>2 - below average</strong></template>
            </v-radio>
            <v-radio value="3">
              <template v-slot:label><strong>3 - not sure</strong></template>
            </v-radio>
            <v-radio value="4">
              <template v-slot:label><strong>4 - pretty cool</strong></template>
            </v-radio>
            <v-radio value="5">
              <template v-slot:label><strong>5 - awesome</strong></template>
            </v-radio>          
          </v-radio-group>
  
  
          <h3 class="text-h6 mb-2 mt-2">What do you like? What should we add / improve?</h3>
          <v-textarea v-model="valuationData.feedback_text" id="feedback_text" label="" hide-details class="mb-6"></v-textarea>
  
  
          <h3 class="text-h6 mb-2 mt-2">Do you want to share this evaluation with investors? </h3>
          <v-checkbox v-model="valuationData.feedback_share_with_investors" value="share"  label="By checking this box, you agree that we share your business data with a few hand picked investors who are interested in SaaS investment opportunities and might contact you. Your business information will not be made public. "></v-checkbox>
  
  
        </v-form>
      </v-card>
    </template>

    <!-- ///////////////////////// -->
    <!-- FEEDBACK END           -->
    <!-- /////////////////////////  -->
    

    <!-- ///////////////////////// -->
    <!-- KPI YEARLY TABLE START    --> 
    <!-- /////////////////////////  -->

    <v-card variant="outlined" class="pa-3 mb-6" v-if="showResults">
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
                <template v-if="calculatedKPIs[year] && calculatedKPIs[year][row.field] != null">
                  <!-- Display dash for first year -->
                  <template v-if="calculatedKPIs[year][row.field] === '-'">
                    -
                  </template>
                  <!-- Check if KPI value is a number -->
                  <template v-else-if="typeof calculatedKPIs[year][row.field] === 'number'">
                    {{ formatKPIValue(row.field, calculatedKPIs[year][row.field]) }}
                  </template>
                  <!-- If KPI value is an object with missing data -->

                  <template v-else-if="calculatedKPIs[year][row.field].missingData">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          color="red"
                          icon="mdi-progress-question"
                        ></v-icon>
                      </template>
                      <div v-html="missingDataTooltipContent(calculatedKPIs[year][row.field].missingData)" />
                    </v-tooltip>
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

      <div 
        v-if="calculatedKPIs[latestYear] && calculatedKPIs[latestYear].calc_cagr_revenue != null"
        class="mt-2 ml-4 text-body-2"
        >
        Compounded Average Growth Rate (CAGR) {{ oldestYear }} - {{ latestYear }}:
        {{ (calculatedKPIs[latestYear].calc_cagr_revenue * 100).toFixed(2) }}%
      </div>
    </v-card>


    <!-- ///////////////////////// -->
    <!-- KPI YEARLY TABLE END           -->
    <!-- /////////////////////////  -->
    
  </v-container>  
</template>

<script setup>
  import { reactive, ref, computed, watchEffect, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat, convertToPercent, multipleImpact, multipleImpactPercent, apiBaseURL, checkValidPastYear } from '@/utils/index.js';
  import { urlRules, formatURL as formatURLUtil } from '@/utils/url_formatting.js';
  import { useTrendAnalysis } from '@/utils/trendAnalysis.js';
  import debounce from 'debounce';


  
  const isLoading = ref(true); // Variable to track loading state used to delay display of valuation 
  const showResults = ref(false); // Variable to track if the results are shown or not
  const showInputAlert = ref(false); // Variable to track if the input alert is shown or not
const isEditingName = ref(false);
const isEditingURL = ref(false);
const nameInput = ref(null);
const urlInput = ref(null);

function startEditingName() {
  isEditingName.value = true;
  nextTick(() => {
    nameInput.value.focus();
  });
}

function stopEditingName() {
  isEditingName.value = false;
}

function startEditingURL() {
  isEditingURL.value = true;
  nextTick(() => {
    urlInput.value.focus();
  });
}

function stopEditingURL() {
  isEditingURL.value = false;
  formatURL();
}
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //valuation vars
  const thisValuationId = ref(route.params.id);
  const isInitialLoad = ref(true);
  const valuationData = reactive({
    show_yearly_inputs: false
  }); 

  async function createInitialYearlyInputs() {
  try {
    let years = [];
    const operationalYear = parseInt(valuationData.operational_since);
    const currentYear = 2024;
    
    const startYear = Math.max(2021, operationalYear);
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    const response = await axios.post(`${apiBaseURL}/valuations/${thisValuationId.value}/createInitialYearlyInputs`, {
      years: years
    });
    console.log('Yearly inputs created:', response.data);
  } catch (error) {
    console.error('Error creating yearly inputs:', error);
  }
}

async function navigateToFinancialInfo() {
  await createInitialYearlyInputs();
  valuationData.show_yearly_inputs = true;
} 
  // Initialize reactive object to store KPIs and calculated metrics
  //const valuationKPIs = reactive({}); // KPIs (mostly yearly) based on valuationData.financial...

  const calculatedKPIs = reactive({}); // var to save the output of calculateKPIsForYear 
  
  const analysed_kpis = reactive({}); // var to save the output of getKPIInfo 

  const valuationCalculation = reactive({}); // object to save ARR and EBIDTA impact and valuation in 


  //////////////////////////////////////////////////////
  // FINANCIAL DATA INPUT START 
  //////////////////////////////////////////////////////

  
  const isGeneralInfoComplete = computed(() => {
    // Safely access, trim values, and ensure they are not null or undefined
    const hasCompanyName = valuationData.company_name != null && valuationData.company_name.toString().trim() !== '';
    const hasOperationalSince = valuationData.operational_since != null && valuationData.operational_since.toString().trim() !== '';
    const hasNumberOfEmployees = valuationData.number_of_employees != null && valuationData.number_of_employees.toString().trim() !== '';
    const hasStateOfBusiness = valuationData.state_of_business != null && valuationData.state_of_business.toString().trim() !== '';

    // Return true only if *all* are non-empty and not null
    return (
      hasCompanyName &&
      hasOperationalSince &&
      hasNumberOfEmployees &&
      hasStateOfBusiness 
    );
  }); 
  
  //compute properties for dynamic table
  const years = computed(() => {
    if (!valuationData.valuation_yearly_inputs) return [];
    return Object.keys(valuationData.valuation_yearly_inputs).sort();
  });

  //finde latest year of financial data
  const latestYear = computed(() => {
    const sortedYears = years.value;
    return sortedYears.length ? sortedYears[sortedYears.length - 1] : null;
  });

  const oldestYear = computed(() => {
    return years.value.length ? years.value[0] : null;
  });

  //compute trends 
  //temp const { trendStatement: recurringRevenueTrend } = useTrendAnalysis(valuationKPIs, 'calc_recurring_revenue_ratio');
  

  const rowDefinitionsFinancialInputs = computed(() => [
    {
      label: 'Total Revenue',
      field: 'total_revenue',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestAndPrevious',
        standard: 'all',
        complete: 'all'
      }
    },
    {
      label: 'Recurring Revenue',
      field: 'recurring_revenue',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    /*{
      label: 'Total Costs',
      field: 'total_costs',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },*/
    {
      label: 'Costs of Goods Sold',
      field: 'costs_of_goods_sold',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Costs of Customer Acquisition',
      field: 'costs_of_customer_acquisition',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Costs of Research and Development',
      field: 'costs_of_r_and_d',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Costs of General Administration',
      field: 'costs_of_general_administration',
      isCurrency: true,
      applyToRules: {
        minimal: 'latestOnly',
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Number of Customers at End of Period',
      field: 'number_of_customers_end_of_period',
      isCurrency: false,
      applyToRules: {
        minimal: null,   // Not used for minimal
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Customers Won in Period',
      field: 'customers_won_in_period',
      isCurrency: false,
      applyToRules: {
        minimal: null,
        standard: 'latestOnly',
        complete: 'all'
      }
    },
    {
      label: 'Customers Lost in Period',
      field: 'customers_lost_in_period',
      isCurrency: false,
      applyToRules: {
        minimal: null,
        standard: 'latestOnly',
        complete: 'all'
      }
    }
  ])

  // Helper to Determine If a RowField Is Active depending on valuation_type 
  function isRowFieldActive(valuationType, year, allYears, row) {
    // If no valuation type is selected
    if (!valuationType) return false

    // Get the rule from the row
    const rule = row.applyToRules?.[valuationType]

    // If there is no rule (or it's null), not active
    if (!rule) return false

    // Figure out how to interpret the rule
    const lastIndex = allYears.length - 1
    if (lastIndex < 0) return false
    const latestYearValue = allYears[lastIndex]

    switch (rule) {
      case 'all':
        return true
      case 'latestOnly':
        return year === latestYearValue
      case 'latestAndPrevious': {
        if (lastIndex <= 0) {
          // Only 1 year total, so that must be the latest
          return year === latestYearValue
        }
        const secondToLastIndex = lastIndex - 1
        const previousYearValue = allYears[secondToLastIndex]
        return (year === latestYearValue || year === previousYearValue)
      }
      default:
        return false
    }
  }


  // Computed Property to check if all active fields have been filled 
  const allActiveFieldsFilled = computed(() => {
    const valuationType = valuationData.valuation_type
    if (!valuationType) return false

    const allYearsArray = years.value
    if (!allYearsArray.length) return false

    // For each row definition
    for (const row of rowDefinitionsFinancialInputs.value) {
      const rule = row.applyToRules?.[valuationType]
      if (!rule) continue // means row not required for this type

      // Determine relevant years
      let relevantYears = []
      switch (rule) {
        case 'all':
          relevantYears = allYearsArray
          break
        case 'latestOnly':
          relevantYears = [ allYearsArray[allYearsArray.length - 1] ]
          break
        case 'latestAndPrevious': {
          const lastIndex = allYearsArray.length - 1
          if (lastIndex < 0) break // no years
          const latest = allYearsArray[lastIndex]
          if (lastIndex === 0) {
            // only one year total
            relevantYears = [ latest ]
          } else {
            const prev = allYearsArray[lastIndex - 1]
            relevantYears = [ prev, latest ]
          }
          break
        }
        default:
          break
      }

      // Check each relevant year for a value
      for (const y of relevantYears) {
        const val = valuationData.valuation_yearly_inputs[y]?.[row.field]
        if (val == null || val === '') {
          return false
        }
      }
    }
    return true
  })


  // Function to get and set financial values
  function getFinancialValue(year, field) {
    return valuationData.valuation_yearly_inputs[year]?.[field] ?? '';
  }

  function updateFinancialValue(year, field, value) {
    const unformattedValue = unformatValue(value);
    if (!valuationData.valuation_yearly_inputs[year]) {
      valuationData.valuation_yearly_inputs[year] = {};
    }
    valuationData.valuation_yearly_inputs[year][field] = unformattedValue;

    // Debounce API calls to prevent excessive requests
    debouncedUpdateValuationFinancial(field, unformattedValue, year);
  }


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

  //////////////////////////////////////////////////////
  // FINANCIAL DATA INPUT END
  //////////////////////////////////////////////////////


  //////////////////////////////////////////////////////
  // KPI CALCULATION START 
  //////////////////////////////////////////////////////

  //main function to calculate all yearly kpis and store them in $calculatedKPIs[year]
  function calculateKPIsForYear(year) {
    const financials = valuationData.valuation_yearly_inputs?.[year];

    // If there are no financials for the year, set an error and return early
    if (!financials) {
      calculatedKPIs[year] = {
        error: `No financial data available for the year: ${year}`,
      };
      return;
    }

    // Prepare an object to store the final KPI values (numbers, null, or simple strings)
    const kpis = {
      missingFields: [],
    };

    /**
     * 1) Total Revenue
     */
    if (financials.total_revenue != null) {
      kpis.calc_total_revenue = financials.total_revenue;
    } else {
      kpis.calc_total_revenue = null;
      kpis.missingFields.push('total_revenue');
    }

    /**
     * 2) Gross Margin Net = total_revenue - costs_of_goods_sold
     */
    if (
      financials.total_revenue != null &&
      financials.costs_of_goods_sold != null
    ) {
      kpis.calc_gross_margin_net =
        financials.total_revenue - financials.costs_of_goods_sold;
    } else {
      kpis.calc_gross_margin_net = null;
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
      if (financials.costs_of_goods_sold == null)
        kpis.missingFields.push('costs_of_goods_sold');
    }

    /**
     * 3) EBITDA Net = total_revenue - (sum of major costs)
     */
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
      kpis.calc_ebitda_net = financials.total_revenue - totalCosts;
    } else {
      kpis.calc_ebitda_net = null;
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
      if (financials.costs_of_goods_sold == null)
        kpis.missingFields.push('costs_of_goods_sold');
      if (financials.costs_of_customer_acquisition == null)
        kpis.missingFields.push('costs_of_customer_acquisition');
      if (financials.costs_of_r_and_d == null)
        kpis.missingFields.push('costs_of_r_and_d');
      if (financials.costs_of_general_administration == null)
        kpis.missingFields.push('costs_of_general_administration');
    }

    /**
     * 4) Recurring Revenue Ratio = recurring_revenue / total_revenue
     */
    if (
      financials.recurring_revenue != null &&
      financials.total_revenue != null
    ) {
      kpis.calc_recurring_revenue_ratio =
        financials.total_revenue !== 0
          ? financials.recurring_revenue / financials.total_revenue
          : 0;
    } else {
      kpis.calc_recurring_revenue_ratio = null;
      if (financials.recurring_revenue == null)
        kpis.missingFields.push('recurring_revenue');
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
    }

    /**
     * 5) Year-over-Year Revenue Growth
     *    Compare current year's total_revenue to previous year's total_revenue
     */
    {
      const yearsArray = Object.keys(valuationData.valuation_yearly_inputs).sort();
      const firstYear = yearsArray[0];

      if (year === firstYear) {
        // For the earliest year, we can't do a YoY comparison
        kpis.calc_yoy_revenue_growth = '-'; // or null, or any placeholder
      } else {
        const previousYear = parseInt(year) - 1;
        const prevFinancials = valuationData.valuation_yearly_inputs[previousYear];

        if (
          financials.total_revenue != null &&
          prevFinancials &&
          prevFinancials.total_revenue != null
        ) {
          if (prevFinancials.total_revenue !== 0) {
            kpis.calc_yoy_revenue_growth =
              (financials.total_revenue - prevFinancials.total_revenue) /
              prevFinancials.total_revenue;
          } else {
            kpis.calc_yoy_revenue_growth = null;
          }
        } else {
          kpis.calc_yoy_revenue_growth = null;
          if (financials.total_revenue == null)
            kpis.missingFields.push(`total_revenue (${year})`);
          if (!prevFinancials || prevFinancials.total_revenue == null)
            kpis.missingFields.push(`total_revenue (${previousYear})`);
        }
      }
    }

    /**
     * 6) Gross Margin = (total_revenue - costs_of_goods_sold) / total_revenue
     */
    if (
      financials.total_revenue != null &&
      financials.costs_of_goods_sold != null
    ) {
      const revenue = financials.total_revenue;
      const cogs = financials.costs_of_goods_sold;
      kpis.calc_gross_margin =
        revenue !== 0 ? (revenue - cogs) / revenue : 0;
    } else {
      kpis.calc_gross_margin = null;
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
      if (financials.costs_of_goods_sold == null)
        kpis.missingFields.push('costs_of_goods_sold');
    }

    /**
     * 7) EBITDA Margin = EBITDA / total_revenue
     */
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
      kpis.calc_ebitda_margin =
        financials.total_revenue !== 0 ? ebitda / financials.total_revenue : 0;
    } else {
      kpis.calc_ebitda_margin = null;
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
      if (financials.costs_of_goods_sold == null)
        kpis.missingFields.push('costs_of_goods_sold');
      if (financials.costs_of_customer_acquisition == null)
        kpis.missingFields.push('costs_of_customer_acquisition');
      if (financials.costs_of_r_and_d == null)
        kpis.missingFields.push('costs_of_r_and_d');
      if (financials.costs_of_general_administration == null)
        kpis.missingFields.push('costs_of_general_administration');
    }

    /**
     * 8) Average Revenue per Customer = total_revenue / number_of_customers_end_of_period
     */
    if (
      financials.total_revenue != null &&
      financials.number_of_customers_end_of_period != null
    ) {
      const customers = financials.number_of_customers_end_of_period;
      kpis.calc_average_revenue_per_customer =
        customers !== 0 ? financials.total_revenue / customers : 0;
    } else {
      kpis.calc_average_revenue_per_customer = null;
      if (financials.total_revenue == null) kpis.missingFields.push('total_revenue');
      if (financials.number_of_customers_end_of_period == null)
        kpis.missingFields.push('number_of_customers_end_of_period');
    }

    /**
     * 9) Customer Logo Churn = customers_lost_in_period / (starting number of customers)
     *    starting number of customers = end_of_period - won_in_period + lost_in_period
     */
    if (
      financials.number_of_customers_end_of_period != null &&
      financials.customers_won_in_period != null &&
      financials.customers_lost_in_period != null
    ) {
      const endCount = financials.number_of_customers_end_of_period;
      const won = financials.customers_won_in_period;
      const lost = financials.customers_lost_in_period;

      const startCount = endCount - won + lost;

      if (startCount !== 0) {
        kpis.calc_customer_logo_churn = lost / startCount;
      } else {
        kpis.calc_customer_logo_churn = null;
      }
    } else {
      kpis.calc_customer_logo_churn = null;
      if (financials.number_of_customers_end_of_period == null)
        kpis.missingFields.push('number_of_customers_end_of_period');
      if (financials.customers_won_in_period == null)
        kpis.missingFields.push('customers_won_in_period');
      if (financials.customers_lost_in_period == null)
        kpis.missingFields.push('customers_lost_in_period');
    }

    /**
     * 10) LTV to CAC Ratio
     *     LTV = (avg_revenue_per_customer * gross_margin) / churn_rate
     *     CAC = costs_of_customer_acquisition / customers_won_in_period
     */
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

      const ltv =
        churnRate !== 0
          ? (avgRevenuePerCustomer * grossMargin) / churnRate
          : null;

      const cac =
        financials.customers_won_in_period !== 0
          ? financials.costs_of_customer_acquisition /
            financials.customers_won_in_period
          : null;

      if (ltv != null && cac != null && cac !== 0) {
        kpis.calc_ltv_to_cac = ltv / cac;
      } else {
        kpis.calc_ltv_to_cac = null;
      }
    } else {
      kpis.calc_ltv_to_cac = null;
      if (kpis.calc_average_revenue_per_customer == null)
        kpis.missingFields.push('calc_average_revenue_per_customer');
      if (kpis.calc_gross_margin == null)
        kpis.missingFields.push('calc_gross_margin');
      if (kpis.calc_customer_logo_churn == null)
        kpis.missingFields.push('calc_customer_logo_churn');
      if (financials.costs_of_customer_acquisition == null)
        kpis.missingFields.push('costs_of_customer_acquisition');
      if (financials.customers_won_in_period == null)
        kpis.missingFields.push('customers_won_in_period');
    }

    // Finally, store the newly calculated KPIs in calculatedKPIs
    calculatedKPIs[year] = kpis;
  }





  function computeCAGR() {
    const allYears = years.value;
    if (allYears.length < 2) return null; // Not enough data

    const firstYear = allYears[0];
    const lastYear = allYears[allYears.length - 1];

    const beginningValue = valuationData.valuation_yearly_inputs[firstYear]?.total_revenue;
    const endingValue = valuationData.valuation_yearly_inputs[lastYear]?.total_revenue;

    if (beginningValue == null || endingValue == null || beginningValue === 0) {
      return { missingData: ['total_revenue'] };
    }

    const n = allYears.length;
    const cagr = Math.pow((endingValue / beginningValue), 1/(n-1)) - 1;

    // Store it in a new KPI field for the latest year (or a special place)
    // Since CAGR is not year-specific, you could store it under the latest year for convenience
    calculatedKPIs[lastYear].calc_cagr_revenue = cagr;
  }


  //////////////////////////////////////////////////////
  // KPI CALCULATION START 
  //////////////////////////////////////////////////////
  

  //////////////////////////////////////////////////////
  // KPI ANALYSIS START
  //////////////////////////////////////////////////////
  const rowDefinitionsKPIOutputs = computed(() => [
    { label: 'Total Revenue', field: 'calc_total_revenue', use_for_analysis: false, rank_for_analysis: 0 },
     { label: 'Gross Margin Net', field: 'calc_gross_margin_net', use_for_analysis: false, rank_for_analysis: 0 },
     { label: 'EBITDA Net', field: 'calc_ebitda_net', use_for_analysis: false, rank_for_analysis: 0 },
    
    { label: 'Recurring Revenue Ratio', field: 'calc_recurring_revenue_ratio', use_for_analysis: true, rank_for_analysis: 5 },
    { label: 'Year-over-Year Growth', field: 'calc_yoy_revenue_growth', use_for_analysis: true, rank_for_analysis: 1 },
    { label: 'Gross Margin', field: 'calc_gross_margin', use_for_analysis: true, rank_for_analysis: 3 },
    { label: 'EBITDA Margin', field: 'calc_ebitda_margin', use_for_analysis: true, rank_for_analysis: 4 },
    { label: 'Average Revenue per Customer', field: 'calc_average_revenue_per_customer', use_for_analysis: false, rank_for_analysis: null },
    { label: 'Customer Logo Churn', field: 'calc_customer_logo_churn', use_for_analysis: false, rank_for_analysis: null },
    { label: 'LTV to CAC Ratio', field: 'calc_ltv_to_cac', use_for_analysis: true, rank_for_analysis: 6 }
  ]);

  import getKPIInfo from '@/utils/kpiInterpretation/getKPIInfo';

  //import kpiLearnMoreModals
  import YearOnYearGrowthModal from '@/components/kpiLearnMoreModals/YearOnYearGrowthModal.vue';
  import FutureGrowthModal from '@/components/kpiLearnMoreModals/FutureGrowthModal.vue';
  import GrossMarginModal from '@/components/kpiLearnMoreModals/GrossMarginModal.vue';
  import EBITDAMarginModal from '@/components/kpiLearnMoreModals/EBITDAMarginModal.vue';
  import FutureProfitabiliyModal from '@/components/kpiLearnMoreModals/FutureProfitabiliyModal.vue';
  import RecurringRevenueRatioModal from '@/components/kpiLearnMoreModals/RecurringRevenueRatioModal.vue';
  import LtvToCacModal from '@/components/kpiLearnMoreModals/LtvToCacModal.vue';

//import inputDataLearnMoreModals
  import AdminCostsInputModal from '@/components/inputDataLearnMoreModals/AdminCostsInputModal.vue';
  import CostsOfGoodsSoldInputModal from '@/components/inputDataLearnMoreModals/CostsOfGoodsSoldInputModal.vue';
  import CustomerAcquisitionCostsInputModal from '@/components/inputDataLearnMoreModals/CustomerAcquisitionCostsInputModal.vue';
  import CustomerCountInputModal from '@/components/inputDataLearnMoreModals/CustomerCountInputModal.vue';
  import CustomersLostInputModal from '@/components/inputDataLearnMoreModals/CustomersLostInputModal.vue';
  import CustomersWonInputModal from '@/components/inputDataLearnMoreModals/CustomersWonInputModal.vue';
  import RAndDCostsInputModal from '@/components/inputDataLearnMoreModals/RAndDCostsInputModal.vue';
  import RecurringRevenueInputModal from '@/components/inputDataLearnMoreModals/RecurringRevenueInputModal.vue';
  import TotalRevenueInputModal from '@/components/inputDataLearnMoreModals/TotalRevenueInputModal.vue';

  //vars for kpi learn more modals 
  const isDialogOpen = ref(false);
  const selectedKPI = ref(null);

  // Configuration object: key = KPI field, value = { title, component }
  const kpiModalConfig = {
    // KPI Analysis Modals
    calc_yoy_revenue_growth: {
      title: 'Year-over-Year Growth',
      component: YearOnYearGrowthModal
    },
    calc_growth_combined: {
      title: 'Growth impact on valuation',
      component: FutureGrowthModal
    },
    calc_gross_margin: {
      title: 'Gross Margin impact on valuation',
      component: GrossMarginModal
    },
    calc_ebitda_margin: {
      title: 'EBITDA Margin impact on valuation',
      component: EBITDAMarginModal
    },
    calc_profitability: {
      title: 'Profitability impact on valuation',
      component: FutureProfitabiliyModal
    },
    calc_recurring_revenue_ratio: {
      title: 'Recurring Revenue Ratio impact on valuation',
      component: RecurringRevenueRatioModal
    },
    calc_ltv_to_cac: {
      title: 'LTV to CAC Ratio impact on valuation',
      component: LtvToCacModal
    },
    // Input Field Help Modals
    total_revenue: {
      title: 'Total Revenue',
      component: TotalRevenueInputModal
    },
    recurring_revenue: {
      title: 'Recurring Revenue',
      component: RecurringRevenueInputModal
    },
    costs_of_goods_sold: {
      title: 'Costs of Goods Sold',
      component: CostsOfGoodsSoldInputModal
    },
    costs_of_customer_acquisition: {
      title: 'Costs of Customer Acquisition',
      component: CustomerAcquisitionCostsInputModal
    },
    costs_of_r_and_d: {
      title: 'Costs of Research and Development',
      component: RAndDCostsInputModal
    },
    costs_of_general_administration: {
      title: 'Costs of General Administration',
      component: AdminCostsInputModal
    },
    number_of_customers_end_of_period: {
      title: 'Number of Customers at End of Period',
      component: CustomerCountInputModal
    },
    customers_won_in_period: {
      title: 'Customers Won in Period',
      component: CustomersWonInputModal
    },
    customers_lost_in_period: {
      title: 'Customers Lost in Period',
      component: CustomersLostInputModal
    }
  };

  function openModal(key) {
    selectedKPI.value = key;
    isDialogOpen.value = true;
  }

  //// END MODAL DIALOG STATES

  //function to compare yearly kpis to ranges and populate $analysed_kpis 
  function analyseYearlyKPIs() {
    try {
      const latestYearValue = latestYear.value;

      // Get KPI definitions with use_for_analysis = true, sorted by rank_for_analysis
      const kpiDefinitions = rowDefinitionsKPIOutputs.value
        .filter(kpi => kpi.use_for_analysis)
        .sort((a, b) => a.rank_for_analysis - b.rank_for_analysis);

      //console.log('Analyzing KPIs for latest year:', latestYearValue);

      // Clear the analysed_kpis before starting
      Object.keys(analysed_kpis).forEach(key => delete analysed_kpis[key]);

      kpiDefinitions.forEach(kpiDef => {
        const field = kpiDef.field;
        const kpiValue = calculatedKPIs[latestYearValue]?.[field];

        // Log KPI details before analysis
        /*console.log('-------------------');
        console.log(`Processing KPI: ${kpiDef.label}`);
        console.log(`Field: ${field}`);
        console.log(`Raw Value: ${kpiValue}`);*/

        // Only proceed if we have a valid numeric value
        if (kpiValue != null && typeof kpiValue === 'number') {
          try {
            const result = getKPIInfo(field, kpiValue);
            //console.log('Analysis Result:', result);

            // Save kpiDef and result into analysed_kpis
            analysed_kpis[field] = {
              ...kpiDef,
              value: kpiValue,
              analysisResult: result
            };

          } catch (error) {
            console.warn(`Could not analyze ${field}:`, error.message);
          }
        } else {
          console.warn(`Skipping ${field} - invalid or missing value`);
        }
      });

    } catch (error) {
      console.error('Error in testGetKPIInfo:', error.message);
    }

  console.log('analysed kpis: ',analysed_kpis)

  // After completing the logic, set loading to false
  //isLoading.value = false;
  //console.log('is loading: ',isLoading.value)
  }

  // Function to check if a value is missing
  function isMissingValue(year, field) {
    const value = valuationData.valuation_yearly_inputs[year]?.[field];
    return value == null || value === '';
  }

  //function to provide the content of the missing fields tooltip 
  function missingDataTooltipContent(missingFields) {
    //console.log('missingFields = ', missingFields);
    if (!Array.isArray(missingFields)) {
      return '<b>Missing data</b><br>- unknown fields';
    }

    const labels = missingFields.map(field => {
      //console.log('Field in missingFields:', field); // <--- Debug log
      const rowDef = rowDefinitionsFinancialInputs.value.find(r => r.field === field);
      return rowDef ? rowDef.label : field;
    });

    return `<b>Missing data</b><br>- ` + labels.join('<br>- ');
  }

  //function to calculate and analyse combined / derived kpis for evaluation 
  function analyseOtherKPIs() {
    try {
      const latestYearValue = latestYear.value;
      const latestYearKPIs = calculatedKPIs[latestYearValue];

      if (!latestYearKPIs) {
        console.warn('No KPI data available for latest year');
        return;
      }

      // 1. Calculate Combined Growth Rate (average of YoY and CAGR)
      if (typeof latestYearKPIs.calc_yoy_revenue_growth === 'number' && 
          typeof latestYearKPIs.calc_cagr_revenue === 'number') {

        const combinedGrowthRate = (latestYearKPIs.calc_yoy_revenue_growth + latestYearKPIs.calc_cagr_revenue) / 2;
        console.log('Combined Growth Rate:', combinedGrowthRate);

        try {
          const growthAnalysis = getKPIInfo('calc_growth_general', combinedGrowthRate);
          analysed_kpis['calc_growth_combined'] = {
            label: 'Combined Growth Rate',
            field: 'calc_growth_combined',
            value: combinedGrowthRate,
            analysisResult: growthAnalysis
          };
        } catch (error) {
          console.warn('Could not analyze combined growth rate:', error.message);
        }
      }

      // 2. Explicitly analyze the CAGR now that it is commented out of rowDefinitionsKPIOutputs
      if (typeof latestYearKPIs.calc_cagr_revenue === 'number') {
        try {
          const cagrValue = latestYearKPIs.calc_cagr_revenue;
          const cagrAnalysis = getKPIInfo('calc_cagr_revenue', cagrValue); 
          analysed_kpis['calc_cagr_revenue'] = {
            label: 'CAGR',
            field: 'calc_cagr_revenue',
            value: cagrValue,
            analysisResult: cagrAnalysis
          };
        } catch (error) {
          console.warn('Could not analyze CAGR:', error.message);
        }
      }

      // Here you can add more combined/derived KPI calculations following the same pattern

    } catch (error) {
      console.error('Error in analyseOtherKPIs:', error.message);
    }
  }
  
  //////////////////////////////////////////////////////
  // KPI ANALYSIS END
  //////////////////////////////////////////////////////


  //////////////////////////////////////////////////////
  // VALUATION START 
  //////////////////////////////////////////////////////

  /** 1234
   * This function gathers:
   *  - All textual content for minimal, standard, complete for ARR and EBITDA
   *  - All necessary calculations for each scenario
   *  - Returns a single object with 6 main sub-objects: 
   *    arr.minimal, arr.standard, arr.complete, ebitda.minimal, ebitda.standard, ebitda.complete
   */
  function gatherValuationContent(valuationData, analysed_kpis, latestYear) {
    // ---------------------------
    // Helper functions
    // ---------------------------
    //console.log('latestYear', latestYear)
    
    const formatKPIValue = (key, value) => {
      if (value == null) return 'N/A';
      // Example: show as percentage with 2 decimals
      return `${(value * 100).toFixed(2)}%`;
    };
    const usdFormat = (val) => {
      if (val == null) return 'N/A';
      return `$${Number(val).toLocaleString()}`;
    };
    const multipleImpactPercent = (val) => {
      if (val == null) return 'N/A';
      // e.g., "1.20x"
      return `${val.toFixed(2)}x`;
    };

    // ---------------------------
    // Common Calculations
    // ---------------------------
    const yoy = analysed_kpis.calc_yoy_revenue_growth?.value || 0;
    const cagr = analysed_kpis.calc_cagr_revenue?.value || 0;
    const growthImpact = analysed_kpis.calc_growth_combined?.analysisResult?.impactPercentage ?? 1;
    const growthImpactMinimal = analysed_kpis.calc_yoy_revenue_growth?.analysisResult?.impactPercentage ?? 1; // not use combined but only yoy
    const grossMarginImpact = analysed_kpis.calc_gross_margin?.analysisResult?.impactPercentage ?? 1;
    const ebitdaMarginImpact = analysed_kpis.calc_ebitda_margin?.analysisResult?.impactPercentage ?? 1;
    const recurringImpact = analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.impactPercentage ?? 1;
    const ltvToCacImpact = analysed_kpis.calc_ltv_to_cac?.analysisResult?.impactPercentage ?? 1;

    const arrVal = latestYear.value && valuationData.valuation_yearly_inputs
      ? valuationData.valuation_yearly_inputs[latestYear.value]?.recurring_revenue
      : null;
    const ebitdaVal = latestYear.value
      ? calculatedKPIs[latestYear.value]?.calc_ebitda_net
      : null;


    // -------------------------------------------------
    // ARR - STANDARD 
    // -------------------------------------------------
    const futureGrowthRate = (yoy + cagr) / 2;
    const totalArrImpact = growthImpact * grossMarginImpact * recurringImpact * ltvToCacImpact;
    const totalArrImpactInterpretation = getKPIInfo('final_multiple', totalArrImpact).evaluationDescription
    const baseArrMultiple = valuationData.base_arr_multiple || 3; // fallback
    const finalArrMultiple = parseFloat((baseArrMultiple * totalArrImpact).toFixed(2));
    let companyWorthARR = null;
    if (arrVal != null && !isNaN(finalArrMultiple)) {
      companyWorthARR = arrVal * finalArrMultiple;
    }

    // -------------------------------------------------
    // EBITDA - STANDARD 
    // -------------------------------------------------
    const totalEbitdaImpact =
      growthImpact *
      ((grossMarginImpact + ebitdaMarginImpact) / 2) *
      recurringImpact *
      ltvToCacImpact;
    const totalEbitdaImpactInterpretation = getKPIInfo('final_multiple', totalEbitdaImpact).evaluationDescription
    const baseEbitdaMultiple = valuationData.base_ebitda_multiple || 3; // fallback
    const finalEbitdaMultiple = parseFloat((baseEbitdaMultiple * totalEbitdaImpact).toFixed(2));
    let companyWorthEBITDA = null;
    if (ebitdaVal != null && !isNaN(finalEbitdaMultiple)) {
      companyWorthEBITDA = ebitdaVal * finalEbitdaMultiple;
    }

    // -------------------------------------------------
    // ARR - MINIMAL (ignore CAGR, ignore LTV-to-CAC)
    // -------------------------------------------------
    const futureGrowthRateMinimalArr = yoy; 
    const totalArrImpactMinimal = growthImpactMinimal * grossMarginImpact * recurringImpact;
    const totalArrImpactInterpretationMinimal = getKPIInfo('final_multiple', totalArrImpactMinimal).evaluationDescription
    const finalArrMultipleMinimal = parseFloat((baseArrMultiple * totalArrImpactMinimal).toFixed(2));
    let companyWorthARRMinimal = null;
    if (arrVal != null && !isNaN(finalArrMultipleMinimal)) {
      companyWorthARRMinimal = arrVal * finalArrMultipleMinimal;
    }

    // -------------------------------------------------
    // EBITDA - MINIMAL (ignore CAGR, ignore LTV-to-CAC)
    // -------------------------------------------------
    const totalEbitdaImpactMinimal =
      growthImpactMinimal *
      ((grossMarginImpact + ebitdaMarginImpact) / 2) *
      recurringImpact;
    const totalEbitdaImpactInterpretationMinimal = getKPIInfo('final_multiple', totalEbitdaImpactMinimal).evaluationDescription
    const finalEbitdaMultipleMinimal = parseFloat(
      (baseEbitdaMultiple * totalEbitdaImpactMinimal).toFixed(2)
    );
    let companyWorthEBITDAMinimal = null;
    if (ebitdaVal != null && !isNaN(finalEbitdaMultipleMinimal)) {
      companyWorthEBITDAMinimal = ebitdaVal * finalEbitdaMultipleMinimal;
    }

    // -------------------------------------------------
    // ARR - COMPLETE (same as standard in this example)
    // -------------------------------------------------
    const futureGrowthRateCompleteArr = futureGrowthRate; 
    const totalArrImpactComplete = totalArrImpact;
    const totalArrImpactInterpretationComplete = getKPIInfo('final_multiple', totalArrImpactComplete).evaluationDescription
    const finalArrMultipleComplete = finalArrMultiple;
    const companyWorthARRComplete = companyWorthARR;

    // -------------------------------------------------
    // EBITDA - COMPLETE (same as standard in this example)
    // -------------------------------------------------
    const totalEbitdaImpactComplete = totalEbitdaImpact;
    const totalEbitdaImpactInterpretationComplete = getKPIInfo('final_multiple', totalEbitdaImpactComplete).evaluationDescription
    const finalEbitdaMultipleComplete = finalEbitdaMultiple;
    const companyWorthEBITDAComplete = companyWorthEBITDA;

    // -----------------------------------------
    // Return the full object 1234
    // -----------------------------------------
    return {
      arr: {
        minimal: {
          description_above_input: `
            <h3 class="text-h6 mb-2 mt-0">ARR-Multiple-Method</h3>
            <p class="mb-6">To value an earlier stage business that is still investing heavily in growth and/or product (rather than striving for profit) an investor would typically use the ARR-Multiple valuation method. </p>

            <p class="mb-6">i.e. Annual Recurring Revenue times a certain Multiple.</p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>

            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>

            <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

            <p class="mb-6">We recommend that you ask any investor at what ARR-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

            <p class="mb-6">We set the default Base ARR-Multiple to 3. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-1 mb-6">In order to find out what ARR-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   

            <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

            <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
            <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

            <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>

            <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

            <p class="text-body-1 mb-6">With regards to evaluating your profitability as an earlier stage business using the ARR-Multiple method, we calculate your "Gross Margin" to find the percentage of revenue remaining after deducting the direct costs associated with delivering your service. </p>


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

            <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

            <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

            <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
            <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>

          `,
          table: {
            growth: {
              description: `
                    Your current Year-on-Year growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                    A growth rate of ${(yoy * 100)}% is ${
              analysed_kpis.calc_growth_combined?.analysisResult?.evaluationDescription || 'N/A'
                  }.
                    `,
              impact: `${multipleImpactPercent(growthImpactMinimal)}`,
            },
            profitability: {
              description: `
                      When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br>

                      A Gross Margin of ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      } is ${
                analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(grossMarginImpact)}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                    When doing the "minimal" evaluation, the LTV-to-CAC ratio can not be calulated and hence has no impact on your multiple. 
              `,
              impact: '-',
            },
            final: {
              description: `
                  Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
                  ${growthImpact} *
                  ${grossMarginImpact} *
                  ${recurringImpact} = ${multipleImpactPercent(totalArrImpactMinimal)}.
                `,
              impact: `${multipleImpactPercent(totalArrImpactMinimal)}`,
            },
          },
          evaluation_content: `
            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>

            <p class="mb-6">Based on our evaluation we need to adjust the Base ARR-Multiple by a factor of ${multipleImpactPercent(
            totalArrImpactMinimal)}.</p>

            <p class="mb-6">This ${totalArrImpactInterpretationMinimal}  </p>

            <p class="mb-6">Adjusting your base ARR-Multiple of ${baseArrMultiple} by ${multipleImpactPercent(
            totalArrImpactMinimal)} gives us your final ARR-Multiple of ${finalArrMultipleMinimal}.</p>

            <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthARRMinimal)}. </p>
            `,
        },

        standard: {
          description_above_input: `
            <h3 class="text-h6 mb-2 mt-0">ARR-Multiple-Method</h3>
            <p class="mb-6">To value an earlier stage business that is still investing heavily in growth and/or product (rather than striving for profit) an investor would typically use the ARR-Multiple valuation method. </p>

            <p class="mb-6">i.e. Annual Recurring Revenue times a certain Multiple.</p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>

            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>

            <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

            <p class="mb-6">We recommend that you ask any investor at what ARR-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

            <p class="mb-6">We set the default Base ARR-Multiple to 3. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-1 mb-6">In order to find out what ARR-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   

            <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

            <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
            <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

            <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>

            <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

            <p class="text-body-1 mb-6">With regards to evaluating your profitability as an earlier stage business using the ARR-Multiple method, we calculate your "Gross Margin" to find the percentage of revenue remaining after deducting the direct costs associated with delivering your service. </p>


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

            <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

            <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

            <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
            <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>

          `,
          table: {
            growth: {
              description: `
                Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', cagr)}. <br>

                For valuation purposes we will calculate your future growth rate at <br>
                (${formatKPIValue('calc_yoy_revenue_growth', yoy)}
                 + 
                ${formatKPIValue('calc_cagr_revenue', cagr)})
                / 2 = ${(futureGrowthRate * 100).toFixed(2)}%

                <br><br>
                A future growth rate of ${(futureGrowthRate * 100).toFixed(2)}% is ${
                analysed_kpis.calc_growth_combined?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(growthImpact)}`,
            },
            profitability: {
              description: `
                      When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br>

                      A Gross Margin of ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      } is ${
                analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(grossMarginImpact)}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                      Your current LTV-to-CAC Ratio is ${
                        analysed_kpis.calc_ltv_to_cac
                          ? formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)
                          : 'N/A'
                      }. <br><br>

                      This is ${
                analysed_kpis.calc_ltv_to_cac?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(ltvToCacImpact)}`,
            },
            final: {
              description: `
                  Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
                  ${growthImpact} *
                  ${grossMarginImpact} *
                  ${recurringImpact} * 
                  ${ltvToCacImpact} 
                  = ${multipleImpactPercent(totalArrImpact)}.
                `,
              impact: `${multipleImpactPercent(totalArrImpact)}`,
            },
          },
          evaluation_content: `
              <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>

              <p class="mb-6">Based on our evaluation we need to adjust the Base ARR-Multiple by a factor of ${multipleImpactPercent(
              totalArrImpact)}.</p>

              <p class="mb-6">This ${totalArrImpactInterpretation}  </p>

              <p class="mb-6">Adjusting your base ARR-Multiple of ${baseArrMultiple} by ${multipleImpactPercent(
              totalArrImpact)} gives us your final ARR-Multiple of ${finalArrMultiple}.</p>

              <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthARR)}. </p>
            `,
        },

        complete: {
          description_above_input: `
            <h3 class="text-h6 mb-2 mt-0">ARR-Multiple-Method</h3>
            <p class="mb-6">To value an earlier stage business that is still investing heavily in growth and/or product (rather than striving for profit) an investor would typically use the ARR-Multiple valuation method. </p>

            <p class="mb-6">i.e. Annual Recurring Revenue times a certain Multiple.</p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>

            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>

            <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

            <p class="mb-6">We recommend that you ask any investor at what ARR-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

            <p class="mb-6">We set the default Base ARR-Multiple to 3. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-1 mb-6">In order to find out what ARR-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   

            <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

            <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
            <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

            <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>

            <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

            <p class="text-body-1 mb-6">With regards to evaluating your profitability as an earlier stage business using the ARR-Multiple method, we calculate your "Gross Margin" to find the percentage of revenue remaining after deducting the direct costs associated with delivering your service. </p>


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

            <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

            <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

            <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
            <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>

          `,
          table: {
            growth: {
              description: `
                Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', cagr)}. <br>

                For valuation purposes we will calculate your future growth rate at <br>
                (${formatKPIValue('calc_yoy_revenue_growth', yoy)}
                 + 
                ${formatKPIValue('calc_cagr_revenue', cagr)})
                / 2 = ${(futureGrowthRate * 100).toFixed(2)}%

                <br><br>
                A future growth rate of ${(futureGrowthRate * 100).toFixed(2)}% is ${
                analysed_kpis.calc_growth_combined?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(growthImpact)}`,
            },
            profitability: {
              description: `
                      When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br>

                      A Gross Margin of ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      } is ${
                analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(grossMarginImpact)}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                      Your current LTV-to-CAC Ratio is ${
                        analysed_kpis.calc_ltv_to_cac
                          ? formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)
                          : 'N/A'
                      }. <br><br>

                      This is ${
                analysed_kpis.calc_ltv_to_cac?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(ltvToCacImpact)}`,
            },
            final: {
              description: `
                  Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
                  ${growthImpact} *
                  ${grossMarginImpact} *
                  ${recurringImpact} * 
                  ${ltvToCacImpact} 
                  = ${multipleImpactPercent(totalArrImpact)}.
                `,
              impact: `${multipleImpactPercent(totalArrImpact)}`,
            },
          },
          evaluation_content: `
              <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>

              <p class="mb-6">Based on our evaluation we need to adjust the Base ARR-Multiple by a factor of ${multipleImpactPercent(
              totalArrImpact)}.</p>

              <p class="mb-6">This ${totalArrImpactInterpretation}  </p>

              <p class="mb-6">Adjusting your base ARR-Multiple of ${baseArrMultiple} by ${multipleImpactPercent(
              totalArrImpact)} gives us your final ARR-Multiple of ${finalArrMultiple}.</p>

              <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthARR)}. </p>
            `,
        },
      },
      //1234
      ebitda: {
        minimal: {
          description_above_input: `
              <h3 class="text-h6 mb-2 mt-0">EBITDA-Multiple-Method</h3>
              <p class="mb-6">As a later stage business that is balancing its focus on "growing" vs. "generating a profit" an investor would typically use the EBIDTA-Multiple valuation method. </p>

              <p class="mb-6">i.e. Earnings Before Interest Tax Depreciation & Amortization times a certain Multiple.</p>

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
              
              <p class="mb-6">To find the EBITDA-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>
              
              <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

              <p class="mb-6">We recommend that you ask any investor at what EBITDA-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

              <p class="mb-6">We set the default Base EBITDA-Multiple to 10. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
            `,
          description_below_input: `
              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
              <p class="text-body-1 mb-6">In order to find out what EBITDA-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   
              
              <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

              <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
              <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

              <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>
          
              <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

              <p class="text-body-1 mb-6">With regards to evaluating your profitability as a later stage business using the EBITDA-Multiple method, we calculate both your "Gross Margin" and your "EBITDA Margin" and apply their combined impact to the multiple impact for "profitability". </p>

              
              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

              <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

              <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

              <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
              <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>
              
            `,
          table: {
            growth: {
              description: `
                Your current Year-on-Year growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                A growth rate of ${formatKPIValue('calc_yoy_revenue_growth', yoy)} is ${
          analysed_kpis.calc_yoy_revenue_growth?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(growthImpactMinimal)}`,
            },
            profitability: {
              description: `
                      When using the EBITDA valuation method, we determine your profitability based on your Gross Margin and your EBITDA Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin 
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br>
                      A Gross Margin of ${
                                analysed_kpis.calc_gross_margin
                                  ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                                  : 'N/A'
                              } is ${
                        analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
                      }.<br><br>

                      Your current EBITDA Margin is ${
                        analysed_kpis.calc_ebitda_margin
                          ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                          : 'N/A'
                      }. <br>
                      An EBITDA Margin of ${
                        analysed_kpis.calc_ebitda_margin
                          ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                          : 'N/A'
                      } is ${
                analysed_kpis.calc_ebitda_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.<br><br>
                The combined impact of your Gross Margin and your EBITDA Margin is ${multipleImpactPercent(
                (grossMarginImpact + ebitdaMarginImpact) / 2
              )}.
                `,
              impact: `${multipleImpactPercent(
                (grossMarginImpact + ebitdaMarginImpact) / 2
              )}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                  <!-- LTV TO CAC ROW -->
                      When doing the "minimal" evaluation, the LTV-to-CAC ratio can not be calulated and hence has no impact on your multiple. 
                `,
              impact: '-',
            },
            final: {
              description: `
                  <!-- TOTAL IMPACT ROW -->
                      Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
                      ${growthImpact} *
                      ${(grossMarginImpact + ebitdaMarginImpact) / 2} *
                      ${recurringImpact} = ${multipleImpactPercent(totalEbitdaImpactMinimal)}.
                `,
              impact: `${multipleImpactPercent(totalEbitdaImpactMinimal)}`,
            },
          },
          evaluation_content: `
            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>

            <p class="mb-6">Based on our evaluation we need to adjust the Base EBITDA-Multiple by a factor of ${multipleImpactPercent(totalEbitdaImpactMinimal)}.</p>

            <p class="mb-6">This ${totalEbitdaImpactInterpretationMinimal}  </p>
            
            <p class="mb-6">Adjusting your base EBITDA-multiple of ${baseEbitdaMultiple} by ${multipleImpactPercent(
          totalEbitdaImpactMinimal)} gives us your final EBITDA Multiple of ${finalEbitdaMultipleMinimal}.
            </p>
            
            <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEBITDAMinimal)}. </p>
            
          `,
        },

        standard: {
          description_above_input: `
              <h3 class="text-h6 mb-2 mt-0">EBITDA-Multiple-Method</h3>
              <p class="mb-6">As a later stage business that is balancing its focus on "growing" vs. "generating a profit" an investor would typically use the EBIDTA-Multiple valuation method. </p>

              <p class="mb-6">i.e. Earnings Before Interest Tax Depreciation & Amortization times a certain Multiple.</p>

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>

              <p class="mb-6">To find the EBITDA-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>

              <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

              <p class="mb-6">We recommend that you ask any investor at what EBITDA-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

              <p class="mb-6">We set the default Base EBITDA-Multiple to 10. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
            `,
          description_below_input: `
              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
              <p class="text-body-1 mb-6">In order to find out what EBITDA-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   

              <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

              <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
              <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

              <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>

              <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

              <p class="text-body-1 mb-6">With regards to evaluating your profitability as a later stage business using the EBITDA-Multiple method, we calculate both your "Gross Margin" and your "EBITDA Margin" and apply their combined impact to the multiple impact for "profitability". </p>


              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

              <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

              <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

              <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

              <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
              <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>

            `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', cagr)}. <br>

                For valuation purposes we will calculate your future growth rate at <br>
                (${formatKPIValue('calc_yoy_revenue_growth', yoy)}
                 + 
                ${formatKPIValue('calc_cagr_revenue', cagr)})
                / 2 = ${(futureGrowthRate * 100).toFixed(2)}%

                <br><br>
                A future growth rate of ${(futureGrowthRate * 100).toFixed(2)}% is ${
                analysed_kpis.calc_growth_combined?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(growthImpact)}`,
            },
            profitability: {
              description: `
                  <!-- PROFITABILITY ROW -->
                  When using the EBITDA valuation method, we determine your profitability based on your Gross Margin and your EBITDA Margin. <br><br>

                  Your current Gross Margin is ${
                    analysed_kpis.calc_gross_margin 
                      ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                      : 'N/A'
                  }. <br>
                  A Gross Margin of ${
                            analysed_kpis.calc_gross_margin
                              ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                              : 'N/A'
                          } is ${
                    analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
                  }.<br><br>

                  Your current EBITDA Margin is ${
                    analysed_kpis.calc_ebitda_margin
                      ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                      : 'N/A'
                  }. <br>
                  An EBITDA Margin of ${
                    analysed_kpis.calc_ebitda_margin
                      ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                      : 'N/A'
                  } is ${
            analysed_kpis.calc_ebitda_margin?.analysisResult?.evaluationDescription || 'N/A'
          }.<br><br>
            The combined impact of your Gross Margin and your EBITDA Margin is ${multipleImpactPercent(
            (grossMarginImpact + ebitdaMarginImpact) / 2
          )}.
                `,
              impact: `${multipleImpactPercent(
                (grossMarginImpact + ebitdaMarginImpact) / 2
              )}`,
            },
            recurringRevenueRatio: {
              description: `
                Your current Recurring Revenue Ratio is ${
                  analysed_kpis.calc_recurring_revenue_ratio
                    ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                    : 'N/A'
                }. <br>
                This is ${
          analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
        }.

                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                  <!-- LTV TO CAC ROW -->
                      Your current LTV-to-CAC Ratio is ${
                        analysed_kpis.calc_ltv_to_cac
                          ? formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)
                          : 'N/A'
                      }. <br><br>

                      This is ${
                analysed_kpis.calc_ltv_to_cac?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(ltvToCacImpact)}`,
            },
            final: {
              description: `
                Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
                ${growthImpact} *
                ${(grossMarginImpact + ebitdaMarginImpact) / 2} *
                ${recurringImpact} = ${multipleImpactPercent(totalEbitdaImpactMinimal)}.
  
                `,
              impact: `${multipleImpactPercent(totalEbitdaImpact)}`,
            },
          },
          evaluation_content: `
              <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            
              <p class="mb-6">Based on our evaluation we need to adjust the Base EBITDA-Multiple of your business by a factor of ${multipleImpactPercent(totalEbitdaImpact)}.</p>
            
              <p class="mb-6">This ${totalEbitdaImpactInterpretation}  </p>
            
              <p class="mb-6">Adjusting your base EBITDA-multiple of ${baseEbitdaMultiple} by ${multipleImpactPercent(
              totalEbitdaImpact)} gives us your final EBITDA Multiple of ${finalEbitdaMultiple}.
              </p>
            
              <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEBITDA)}. </p>
            `,
        },

        complete: {
          description_above_input: `
            <h3 class="text-h6 mb-2 mt-0">EBITDA-Multiple-Method</h3>
            <p class="mb-6">As a later stage business that is balancing its focus on "growing" vs. "generating a profit" an investor would typically use the EBIDTA-Multiple valuation method. </p>

            <p class="mb-6">i.e. Earnings Before Interest Tax Depreciation & Amortization times a certain Multiple.</p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>

            <p class="mb-6">To find the EBITDA-Multiple that an investor might value your business at, we first set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case.  </p>

            <p class="mb-6">The value of this Base Multiple depends on the current "temperature" of the financial market, the world-region you and your customers are located in, as well as the investment preferences of the given investor.  </p>

            <p class="mb-6">We recommend that you ask any investor at what EBITDA-Multiple he would value a SaaS business that ticks all the boxes. Doing so will put you "in the lead" and will allow you to "base-level" compare different investors.   </p>

            <p class="mb-6">We set the default Base EBITDA-Multiple to 10. We think that this represents a rough average of what you might hear in the market. Feel free to change it.    </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-1 mb-6">In order to find out what EBITDA-Multiple he would be willing to pay for your business, an investor will investigate, if your SaaS business "checks all the boxes".</p>   

            <p class="text-body-1 mb-6">If he finds out you are performing better than expected, he would increase the multiple. If worse than expected, he would decrease the multiple. If it is as expected, he would leave the multiple unchanged. </p> 

            <p class="text-body-1 mb-6">While every investor has his unique way of evaluating a SaaS business, most investors will agree that the following criteria are pivotal investment criteria:</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Growth & Profitability</h4>
            <p class="text-body-1 mb-6">Getting a very good understanding of your company's past and current growth and profitability is most important to every investor and will impact your valuation like no other metric will. </p>

            <p class="text-body-1 mb-6">This is because your company's future earning potential can be estimated by estimating its future revenue (via growth) and based on that its future earnings (via profitability). </p>

            <p class="text-body-1 mb-6">When you do the "minial" evaluation, we will estimate your future growth based on your current growth (as latest Year-over-Year growth). In "standard" we calculate the average of this "current growth" and your "compounded average growth" (CAGR) for all years that you have provided financial data for. In "complete" we also factor in a "trend analysis".  </p>

            <p class="text-body-1 mb-6">With regards to evaluating your profitability as a later stage business using the EBITDA-Multiple method, we calculate both your "Gross Margin" and your "EBITDA Margin" and apply their combined impact to the multiple impact for "profitability". </p>


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Recurring Revenue Ratio</h4>

            <p class="text-body-1 mb-6">Since the defining characteristic of SaaS companies is having most of its revenue being recurring, we evaluate your current Recurring Revenue Ratio. </p>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">LTV-to-CAC Ratio</h4>

            <p class="text-body-1 mb-6">When you do the "standard" or "complete" evaluation and provide us with how many customers you have, you have won and you have lost, we use that data to calculate your Logo-Churn and use that together with your Cost of Customer Acquisition to calculate your LTC-to-CAC ratio. This ratio gives investors a first indication of how easily your business can grow. </p>

            <h3 class="text-h6 mb-2 mt-0">Evaluating each metric</h3>
            <p class="mb-6">After calculating each metric we compare it to certain ranges and give it a score. This score comes with a "multiple impact". If this "multiple impact" is > 1 you are overperforming in this dimension and your multiple will be "boosted". If it is < 1 your are underperforming and your multiple will be "reduced". If the multiple impact is 1, you are within the range that is deemed to be expected from a SaaS business and your multiple will not be affected. </p>

          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br>
                Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', cagr)}. <br>

                For valuation purposes we will calculate your future growth rate at <br>
                (${formatKPIValue('calc_yoy_revenue_growth', yoy)}
                 + 
                ${formatKPIValue('calc_cagr_revenue', cagr)})
                / 2 = ${(futureGrowthRate * 100).toFixed(2)}%

                <br><br>
                A future growth rate of ${(futureGrowthRate * 100).toFixed(2)}% is ${
                analysed_kpis.calc_growth_combined?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(growthImpact)}`,
            },
            profitability: {
              description: `
                      <!-- PROFITABILITY ROW -->
                      When using the EBITDA valuation method, we determine your profitability based on your Gross Margin and your EBITDA Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin 
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br>
                      A Gross Margin of ${
                                analysed_kpis.calc_gross_margin
                                  ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                                  : 'N/A'
                              } is ${
                        analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
                      }.<br><br>

                      Your current EBITDA Margin is ${
                        analysed_kpis.calc_ebitda_margin
                          ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                          : 'N/A'
                      }. <br>
                      An EBITDA Margin of ${
                        analysed_kpis.calc_ebitda_margin
                          ? formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)
                          : 'N/A'
                      } is ${
                analysed_kpis.calc_ebitda_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.<br><br>
                The combined impact of your Gross Margin and your EBITDA Margin is ${multipleImpactPercent(
                (grossMarginImpact + ebitdaMarginImpact) / 2
              )}.
                    `,
              impact: `${multipleImpactPercent(
                (grossMarginImpact + ebitdaMarginImpact) / 2
              )}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
                }.
              `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                  <!-- LTV TO CAC ROW -->
                      Your current LTV-to-CAC Ratio is ${
                        analysed_kpis.calc_ltv_to_cac
                          ? formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)
                          : 'N/A'
                      }. <br><br>

                      This is ${
                analysed_kpis.calc_ltv_to_cac?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(ltvToCacImpact)}`,
            },
            final: {
              description: `
              Note that we have to multiply (not add) the invididual impact multiples to calculate the final multiple impact, i.e. 
              ${growthImpact} *
              ${(grossMarginImpact + ebitdaMarginImpact) / 2} *
              ${recurringImpact} = ${multipleImpactPercent(totalEbitdaImpactMinimal)}.

              `,
              impact: `${multipleImpactPercent(totalEbitdaImpactComplete)}`,
            },
          },
          evaluation_content: `
            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>

            <p class="mb-6">Based on our evaluation we need to adjust the Base EBITDA-Multiple by a factor of ${multipleImpactPercent(totalEbitdaImpact)}.</p>

            <p class="mb-6">This ${totalEbitdaImpactInterpretation}  </p>

            <p class="mb-6">Adjusting your base EBITDA-multiple of ${baseEbitdaMultiple} by ${multipleImpactPercent(
            totalEbitdaImpact)} gives us your final EBITDA Multiple of ${finalEbitdaMultiple}.
            </p>

            <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEBITDA)}. </p>
          `,
        },
      },
    };
  }

  
  function buk_gatherValuationContent(valuationData, analysed_kpis, latestYear) {
    return {
      arr: {
        /**
         * For ARR (earlyStage), we reuse the same "standard" textual content from old code
         * for minimal, standard, and complete to ensure identical display.
         */
        minimal: {
          description_above_input: `
            <!-- EARLY STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Early Stage / Growth SaaS Cases using ARR-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br><br>

                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the ARR Base Multiple of ${valuationData.base_arr_multiple} by ${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_arr_multiple}
              *  ${valuationCalculation.total_arr_multiple_impact.toFixed(2)} = ${valuationCalculation.final_arr_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final ARR-Multiple is  ${valuationCalculation.final_arr_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the ARR Multiple Method, all that is left to do is to multiply your current ARR with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].recurring_revenue)} * ${valuationCalculation.final_arr_multiple}
              = ${usdFormat(valuationCalculation.companyWorthARR)} 
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the ARR-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthARR)}.</p>
          `
        },

        /**
         * We reuse the same text from above for "standard" and "complete"
         */
        standard: {
          description_above_input: `
            <!-- EARLY STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Early Stage / Growth SaaS Cases using ARR-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br><br>

                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the ARR Base Multiple of ${valuationData.base_arr_multiple} by ${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_arr_multiple}
              *  ${valuationCalculation.total_arr_multiple_impact.toFixed(2)} = ${valuationCalculation.final_arr_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final ARR-Multiple is  ${valuationCalculation.final_arr_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the ARR Multiple Method, all that is left to do is to multiply your current ARR with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].recurring_revenue)} * ${valuationCalculation.final_arr_multiple}
              = ${usdFormat(valuationCalculation.companyWorthARR)}
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the ARR-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthARR)}.</p>
          `
        },
        complete: {
          description_above_input: `
            <!-- EARLY STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Early Stage / Growth SaaS Cases using ARR-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br><br>

                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the ARR Base Multiple of ${valuationData.base_arr_multiple} by ${multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_arr_multiple}
              *  ${valuationCalculation.total_arr_multiple_impact.toFixed(2)} = ${valuationCalculation.final_arr_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final ARR-Multiple is  ${valuationCalculation.final_arr_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the ARR Multiple Method, all that is left to do is to multiply your current ARR with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].recurring_revenue)} * ${valuationCalculation.final_arr_multiple}
              = ${usdFormat(valuationCalculation.companyWorthARR)}
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the ARR-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthARR)}.</p>
          `
        }
      },

      ebitda: {
        /**
         * For EBITDA (laterStage), we also reuse the "standard" textual content from old code
         * for minimal, standard, and complete.
         */
        minimal: {
          description_above_input: `
            <!-- LATER STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Later Stage / Steady SaaS Cases using EBITDA-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the EBITDA Valuation, we determine your profitability based on your Gross Margin as well as your EBITDA Margin. <br><br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br>
                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.<br><br>

                    Your current EBITDA Margin is ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)}.<br>
                    An EBITDA Margin of ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)} is ${analysed_kpis.calc_ebitda_margin.analysisResult.evaluationDescription}. <br><br>

                    To calculate the total impact of your Gross Margin and EBITDA Margin, we add them together and divide them by 2. <br>
                    i.e. (${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} + ${analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage}) / 2 = ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2}. <br>

                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent((analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the EBITDA Base Multiple of ${valuationData.base_ebitda_multiple} by ${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_ebitda_multiple}
              *  ${valuationCalculation.total_ebitda_multiple_impact} = ${valuationCalculation.final_ebitda_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final EBITDA-Multiple is  ${valuationCalculation.final_ebitda_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the EBITDA-Multiple-Method, all that is left to do is to multiply your current EBITDA with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].calc_ebitda_net)} * ${valuationCalculation.final_ebitda_multiple}
              = ${usdFormat(valuationCalculation.companyWorthEBITDA)}
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the EBITDA-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthEBITDA)}.</p>
          `
        },
        standard: {
          // For "standard" we reuse the same text from minimal (the standard scenario in old code).
          description_above_input: `
            <!-- LATER STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Later Stage / Steady SaaS Cases using EBITDA-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the EBITDA Valuation, we determine your profitability based on your Gross Margin as well as your EBITDA Margin. <br><br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br>
                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.<br><br>

                    Your current EBITDA Margin is ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)}.<br>
                    An EBITDA Margin of ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)} is ${analysed_kpis.calc_ebitda_margin.analysisResult.evaluationDescription}. <br><br>

                    To calculate the total impact of your Gross Margin and EBITDA Margin, we add them together and divide them by 2. <br>
                    i.e. (${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} + ${analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage}) / 2 = ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2}. <br>

                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent((analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the EBITDA Base Multiple of ${valuationData.base_ebitda_multiple} by ${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_ebitda_multiple}
              *  ${valuationCalculation.total_ebitda_multiple_impact} = ${valuationCalculation.final_ebitda_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final EBITDA-Multiple is  ${valuationCalculation.final_ebitda_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the EBITDA-Multiple-Method, all that is left to do is to multiply your current EBITDA with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].calc_ebitda_net)} * ${valuationCalculation.final_ebitda_multiple}
              = ${usdFormat(valuationCalculation.companyWorthEBITDA)}
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the EBITDA-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthEBITDA)}.</p>
          `
        },
        complete: {
          // For "complete" we reuse the same text from minimal (the standard scenario in old code).
          description_above_input: `
            <!-- LATER STAGE -->
            <h3 class="text-h5 mb-2 mt-4">Valuing Later Stage / Steady SaaS Cases using EBITDA-Multiple</h3>
            <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).</p>

            <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
            <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 
              As a default we set this multiple at "3". 
            </p>
          `,
          description_below_input: `
            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>
            <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple).</p> 

            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analyzing Growth & Profitability</h4>
            <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be.</p>
            <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financials to get a "future growth rate".</p>
            <p class="text-body-2 mb-2">We will use your "current Gross Margin" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future.</p>
          `,
          table: {
            growth: {
              description: `
                <!-- GROWTH ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is ${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth?.value)}. <br>
                    Your compounded growth (CAGR) is ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue?.value)}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    (${formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value)}
                     + 
                    ${formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value)})
                    / 2 = 
                    ${valuationCalculation.futureGrowthRate * 100}%

                    <br><br>
                    A future growth rate of ${valuationCalculation.futureGrowthRate * 100}% is ${analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}.

                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_growth_combined')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage)}`
            },
            profitability: {
              description: `
                <!-- PROFITABILITY ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the EBITDA Valuation, we determine your profitability based on your Gross Margin as well as your EBITDA Margin. <br><br>

                    Your current Gross Margin is ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)}.<br>
                    A Gross Margin of ${formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)} is ${analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}.<br><br>

                    Your current EBITDA Margin is ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)}.<br>
                    An EBITDA Margin of ${formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value)} is ${analysed_kpis.calc_ebitda_margin.analysisResult.evaluationDescription}. <br><br>

                    To calculate the total impact of your Gross Margin and EBITDA Margin, we add them together and divide them by 2. <br>
                    i.e. (${analysed_kpis.calc_gross_margin.analysisResult.impactPercentage} + ${analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage}) / 2 = ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2}. <br>

                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_gross_margin')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent((analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2)}`
            },
            recurringRevenueRatio: {
              description: `
                <!-- RECURRING REVENUE ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is ${formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)}. <br><br>

                    This is ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_recurring_revenue_ratio')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage)}`
            },
            ltvToCac: {
              description: `
                <!-- LTV TO CAC ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is ${formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value)}. <br><br>

                    This is ${analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}.
                    <br>
                    <v-btn
                      color="blue-lighten-2"
                      variant="tonal"
                      density="compact"
                      text="Learn More"
                      class="mt-4"
                      @click="openModal('calc_ltv_to_cac')"
                    ></v-btn>
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage)}`
            },
            final: {
              description: `
                <!-- TOTAL IMPACT ROW -->
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    (${analysed_kpis.calc_growth_combined.analysisResult.impactPercentage} *
                    ${(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage) / 2} *
                    ${analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage} *
                    ${analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage})
                  </p>
                </div>
              `,
              impact: `${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}`
            }
          },
          evaluation_content: `
            <!-- FINAL EVALUATION CONTENT -->
            <p class="mb-2 mt-6">
              Based on your business' performance, we need to adjust the EBITDA Base Multiple of ${valuationData.base_ebitda_multiple} by ${multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}.
            </p>
            <p class="mb-2">
              i.e. ${valuationData.base_ebitda_multiple}
              *  ${valuationCalculation.total_ebitda_multiple_impact} = ${valuationCalculation.final_ebitda_multiple}
            </p>
            <p class="mb-2 font-weight-bold">Your final EBITDA-Multiple is  ${valuationCalculation.final_ebitda_multiple}.</p>

            <h3 class="text-h6 mb-2 mt-6">Calculating the worth of your company</h3>
            <p class="mb-2">
              To evaluate the worth of your business using the EBITDA-Multiple-Method, all that is left to do is to multiply your current EBITDA with the final multiple. <br>
              i.e. ${usdFormat(valuationData.valuation_yearly_inputs[latestYear].calc_ebitda_net)} * ${valuationCalculation.final_ebitda_multiple}
              = ${usdFormat(valuationCalculation.companyWorthEBITDA)}
            </p>
            <p class="mb62 font-weight-bold">Your business' valuation using the EBITDA-Multiple-Method is ${usdFormat(valuationCalculation.companyWorthEBITDA)}.</p>
          `
        }
      }
    };
  
  //1234


    // ------------------------------------------------
    // Fill in the object now
    // ------------------------------------------------

  
  }

  // We gather all possible scenarios once:
  const allEvaluationContent = ref(null);

  const currentEvaluationMethod = computed(() => {
    if (valuationData.state_of_business === 'earlyStage') {
      return 'arr';
    } else if (valuationData.state_of_business === 'laterStage') {
      return 'ebitda';
    } else {
      // fallback if it's neither earlyStage nor laterStage
      return null; 
    }
  });
  

  // The final “currentEvaluation” is:
  const currentEvaluation = computed(() => {
    if (!allEvaluationContent.value) return {};

    const method = currentEvaluationMethod.value;      // 'arr' or 'ebitda'
    const detail = valuationData.valuation_type;       // 'minimal', 'standard', or 'complete'

    // if either is missing, return empty
    if (!method || !detail) return {};

    //console.log('currentEvaluation', currentEvaluation)

    return allEvaluationContent.value[method][detail];
  });



  // We also track a "baseMultiple" as used in the input
  const baseMultiple = computed({
    get() {
      if (currentEvaluationMethod.value === 'arr') {
        return valuationData.base_arr_multiple;
      } else {
        return valuationData.base_ebitda_multiple;
      }
    },
    set(val) {
      if (currentEvaluationMethod.value === 'arr') {
        valuationData.base_arr_multiple = val;
      } else {
        valuationData.base_ebitda_multiple = val;
      }
    },
  });



  ///// END chat gpt input 


  //////////////////////////////////////////////////////
  // VALUATION END
  //////////////////////////////////////////////////////

  
  //////////////////////////////////////////////////////
  // API INTERACTIONS START 
  //////////////////////////////////////////////////////
  
  //get one valuation 
  async function fetchValuation(id) {
    try {
      // Fetch the valuation data
      const { data } = await axios.get(`${apiBaseURL}/valuations/${id}`)

      console.log('Fetched valuation data:', data);

      // Convert the `valuation_yearly_inputs` array into an object keyed by `time_period`
      if (data.valuation_yearly_inputs) {
        data.valuation_yearly_inputs = data.valuation_yearly_inputs.reduce((acc, item) => {
          acc[item.time_period] = item
          return acc
        }, {})
      }

      // Merge the transformed data into `valuationData`
      Object.assign(valuationData, data)
    } catch (error) {
      console.error('Error fetching valuations:', error)
    }
  }

  // Debounced function to update valuation financials
  const debouncedUpdateValuationFinancial = debounce((field, value, timePeriod) => {
    updateValuationFinancial(field, value, timePeriod);
  }, 1000);


  //save valuation data to db
  async function saveValuation() {
    // Make an HTTP PUT request to update the lot in the database using Sequelize
    try {
      //db console.log('val data ',valuationData)
      console.log('update valuation:', valuationData);
      const response = await axios.put(`${apiBaseURL}/valuations/` + thisValuationId.value, valuationData);
      console.log('valuation updated:', response);

    } catch (error) {
      console.error('Error updating valuation in db:', error);
    }
  }

  // Function to update valuation financials
  async function updateValuationFinancial(field, value, timePeriod) {
    try {
      // Check if the value is null or empty
      const parsedValue = value === null || value === '' ? null : parseFloat(value);

      // If the value is not null and is not a valid number, handle the error
      if (parsedValue !== null && isNaN(parsedValue)) {
        console.error('Invalid number input');
        return;
      }

      // Make the API call to update the data
      const response = await axios.put(
        `${apiBaseURL}/valuations/yearly-inputs/${thisValuationId.value}/${timePeriod}`,
        {
          [field]: parsedValue,
        }
      );

      // Update local data
      valuationData.valuation_yearly_inputs[timePeriod][field] = parsedValue;

      console.log('Valuation Yearly Input updated:', response);
    } catch (error) {
      console.error('Error updating valuation financial:', error);
    }
  }

  const saveData = debounce(async (data) => {
    await saveValuation(data);
  }, 500);
  
  //////////////////////////////////////////////////////
  // API INTERACTIONS END  
  //////////////////////////////////////////////////////


  //////////////////////////////////////////////////////
  // WATCHER AN LIFECYCLE HOOKS START 
  //////////////////////////////////////////////////////
  onMounted(async () => {
    // Wait for fetchValuation to complete
    await fetchValuation(thisValuationId.value);
    isInitialLoad.value = false;
    //await nextTick();
  });

  
  // Single watcher for data changes
  watch(
    () => valuationData,
    async (newVal, oldVal) => {
      try {
        if (!isInitialLoad.value) {
          await saveData(newVal);
          console.log('overlord watcher on valuationData')
        }
      } catch (error) {
        console.error('Error in watch handler:', error);
      }
    },
    { deep: true }
  );


  // recalc all metric if multiple changes
  watch(
     [
      () => valuationData.base_arr_multiple,
      () => valuationData.base_ebitda_multiple,
     ],
    async (newVal, oldVal) => {
      try {
        if (!isInitialLoad.value) {
          console.log('i am in base multi')
          if (!isInitialLoad.value) {
            recalculateAllMetrics();
          }
        }
      } catch (error) {
        console.error('Error in watch handler:', error);
      }
    },
  );

  // qqqq
  watch(
    [
      () => valuationData.valuation_yearly_inputs, // financials
      () => valuationData.state_of_business,        // arr or ebitda
      () => valuationData.valuation_type            // minimal, standard, complete
    ],
    async (newVal, oldVal) => {
      try {
        if (showResults.value === true) {
          showResults.value = false;
          showInputAlert.value = true;
          console.log('watcher that set showResults to false')
        }
      } catch (error) {
        console.error('Error in watch handler:', error);
      }
    },
    { deep: true }
  );



  
  function recalculateAllMetrics() {
    // Clear existing KPIs
    //Object.keys(valuationKPIs).forEach(key => delete valuationKPIs[key]);
    Object.keys(analysed_kpis).forEach(key => delete analysed_kpis[key]);

    // 1. Calculate KPIs for all years
    years.value.forEach(year => {
      calculateKPIsForYear(year);
    });

    // 2. Compute CAGR
    computeCAGR();

    // 3. Analyse Yearly and Other KPIs
    analyseYearlyKPIs();
    analyseOtherKPIs();

    // 4. *** Rebuild textual content for minimal, standard, complete ***
    allEvaluationContent.value = gatherValuationContent(valuationData, analysed_kpis, latestYear);

    // Set loading to false after the first full calculation
    showResults.value = true;
    showInputAlert.value = false;
  }
  //////////////////////////////////////////////////////
  // WATCHER AN LIFECYCLE HOOKS START 
  //////////////////////////////////////////////////////

  
  //////////////////////////////////////////////////////
  // FORMATING AND HELPER FUNCTIONS START 
  //////////////////////////////////////////////////////
  function formatKPIValue(field, value) {
    const percentageKPIs = [
      'calc_recurring_revenue_ratio',
      'calc_yoy_revenue_growth',
      'calc_gross_margin',
      'calc_ebitda_margin',
      'calc_customer_logo_churn', 
      'calc_cagr_revenue', 
      'calc_growth_combined'
    ];

    // Check if field is one of the new currency fields
    const currencyFields = [
      'calc_total_revenue',
      'calc_gross_margin_net',
      'calc_ebitda_net'
    ];

    if (value == null || (typeof value === 'object' && value.missingData)) {
      return 'Missing data';
    }

    if (percentageKPIs.includes(field)) {
      return (value * 100).toFixed(2) + '%';
    } else if (field === 'calc_ltv_to_cac') {
      return value.toFixed(2);
    } else if (field === 'calc_average_revenue_per_customer') {
      return usdFormat(value);
    } else if (currencyFields.includes(field)) {
      // Format as currency
      return usdFormat(value);
    } else {
      // Default formatting
      return value;
    }
  }

  
  // Format URL wrapper function
  function formatURL() {
    if (valuationData.company_url) {
      valuationData.company_url = formatURLUtil(valuationData.company_url);
    }
  }

  //////////////////////////////////////////////////////
  // FORMATING AND HELPER END 
  //////////////////////////////////////////////////////
  
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