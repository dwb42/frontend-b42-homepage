<template>
  <v-container>  
    <span class="text-caption"><router-link :to="`/app/valuations/`">Valuations</router-link></span>
    <h1 class="text-h4 mb-0">
      <div v-if="!isEditingName" @click="startEditingName" style="cursor: pointer;">
        <b>{{ valuationData.company_name }}</b> &nbsp;
      </div>
      <v-text-field
        v-else
        v-model="valuationData.company_name"
        @blur="stopEditingName"
        @keyup.enter="stopEditingName"
        ref="nameInput"
        class="text-h4"

      ></v-text-field>
    </h1>
    <div class="d-flex align-center">
      <template v-if="!isEditingURL">
        <a :href="valuationData.company_url" target="_blank" class="text-body-1 mr-2">{{ valuationData.company_url }}</a>
        <v-icon @click="startEditingURL" style="cursor: pointer; font-size: 18px; color: gray;">mdi-pencil</v-icon>
      </template>
      <v-text-field
        v-else
        v-model="valuationData.company_url"
        @blur="() => { stopEditingURL(); formatURL(); }"
        @keyup.enter="stopEditingURL"
        :rules="[urlRules]"
        placeholder="www.example.com"
        hide-details="auto"
        ref="urlInput"
        style="max-width: 400px;"
      ></v-text-field>
    </div>

    <div class="mt-10"></div>

    <h2 class="text-h5 mb-2" id="section-general"><b>(1) Provide general info & select business stage</b></h2>
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
        <v-text-field v-model="valuationData.number_of_employees" id="number_of_employees" label="Number of employees (incl. active founders and freelance)" required hide-details class="mb-6"></v-text-field>

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

        <!---v-btn 
          color="primary" 
          type="button"
          class="mt-6"
          @click="createInitialYearlyInputs"
        >
          create yrls
        </v-btn-->


        
      </v-form>
    </v-card>
    


    <!-- ///////////////////////// -->
    <!-- YEARLY INPUTS START        -->
    <!-- /////////////////////////  -->

    <template 
      v-if="valuationData.show_yearly_inputs"
      >
    <h2 class="text-h5 mb-2" id="section-financials"><b>(2) Enter your financial data <!--({{valuationData.valuation_type}})--></b></h2>
    <v-card variant="outlined" class="pa-3 mb-10">
      
      <h3 class="text-h6 mb-2 mt-2">Select Detail-Level</h3>
      <v-radio-group v-model="valuationData.valuation_type">
        <v-radio value="minimal">
          <template v-slot:label>
            <div class="mb-2"><strong>Minimal</strong><br>Enter financial data for your latest financial period to provide investors with a first sense of growth and profitability.  </div>
          </template>
        </v-radio>
        <v-radio value="standard">
          <template v-slot:label>
            <div class="mt-2 mb-2"><strong>Standard</strong><br>Add revenue of previous years to get your CAGR and current period customer data to calculate your logo churn. </div>
          </template>
        </v-radio>
        <v-radio value="complete">
          <template v-slot:label>
            <div class="mt-2"><strong>Complete</strong><br>Provide investors with a complete overview of your current and past performance so that they can include trends in the valuation of your company. </div>
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
                    @blur="handleBlur(year, row.field)"     
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
    <pre>calculatedKPIs<br>{{calculatedKPIs}}</pre>
    <pre>analysed_kpis<br>{{analysed_kpis}}</pre>
    <pre>valuationCalculation<br>{{valuationCalculation}}</pre-->

 
    <!-- ///////////////////////// -->
    <!-- EVALUATION START     1234      -->
    <!-- /////////////////////////  -->
    <template v-if="showResults">
      <h2 class="text-h5 mb-2" id="section-valuation"><b>(3) Review valuation <!--({{valuationData.valuation_type}})--></b></h2>

        <v-card variant="outlined" class="pa-3 mb-10">
          
          <div class="text-left">
            <v-btn
              color="primary"
              variant="tonal"
              density="compact"
              @click="valuationData.showValuationExplanation = !valuationData.showValuationExplanation"
              class="mb-6"
            >
              {{ valuationData.showValuationExplanation ? 'Hide Valuation Explanation' : 'Show Valuation Explanation' }}
            </v-btn>
          </div>

          <!-- Description above base multiple input -->
          <p v-if="valuationData.showValuationExplanation" v-html="currentEvaluation.description_above_input"></p>

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
          <p v-if="valuationData.showValuationExplanation" class="mb-6 text-body-1" v-html="currentEvaluation.description_below_input"></p>

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

          <h3 class="text-h6 mb-2 mt-6">
            Is my company really worth {{ valuationData.state_of_business === 'earlyStage' ? usdFormat(outputData.arr_final_valuation) : usdFormat(outputData.ebitda_final_valuation) }}?
          </h3>

          <p class="mb-6">No. Your company is worth exactly as much as someone is willing to pay for it.</p>
          <p class="mb-6">Each investor applies their own point of view with regards to what kind of performance will have what kind of impact on your multiple, so that the end result can vary dramatically.</p>
          <p class="mb-6">But if you take the time to understand what goes into the valuation of your business (i.e. the financials) as well as to learn about the multiples that an investor will calculate to evaluate your business, you will enter a negotiation with more knowledge than 95% of SaaS founders, who are great at running their business, but not know little to nothing about how an investor looks at them. </p>

          <p class="mb-2"><b>We hope this tool helps you along that path and wish you the best of luck!</b></p>
          
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

    <!-- allEvaluationContent <pre>{{allEvaluationContent}}</pre> -->
    
    <!-- ///////////////////////// -->
    <!-- EVALUATION END           -->
    <!-- /////////////////////////  -->

    <!-- ///////////////////////// -->
    <!-- FEEDBACK START    --> 
    <!-- /////////////////////////  -->
    <template v-if="showResults">
      <h2 class="text-h5 mb-2 mt-0" id="section-feedback"><b>(4) Give us Feedback</b></h2>
      
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
    <template v-if="showResults" class="mt-12">
      <h2 class="text-h5 mb-2 mt-0"><b>Overview Financial Inputs and KPIs</b></h2>
      <v-card variant="outlined" class="pa-3 mb-6" v-if="showResults">
        <p class="mb-6 text-body-2">The valuation above is based on your financials and the KPIs calculated below. 
        <span v-if="valuationData.valuation_type === 'minimal'"class="mb-6">Change the "Detail-Level" to "standard" or "complete", provide us with more yearly inputs and gain more insights.</span>
          <span v-if="valuationData.valuation_type === 'standard'"class="mb-6">Change the "Detail-Level" to "complete", provide us with more yearly inputs and gain more insights.</span>
      </p>
        <!--h2 class="text-h5 mb-2">Calculated KPIs</h2-->
        <v-table>
          <thead>
            <tr>
              <th class="text-left"><!--h2 class="text-h5 mb-2"><b>Calculated Yearly KPIs</b></h2--></th>
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
                    <!-- If data is missing -->
                    <template v-if="calculatedKPIs[year][row.field].missingData">
                      <!-- We wrap our link and tooltip in a relative container yyyy -->
                      <div class="tooltip-container" style="display:inline-block; position:relative;">
                        <!-- Clicking toggles the tooltip on/off -->
                        <a href="#" @click.prevent="toggleTooltip(year, row.field)"><span class="mdi mdi-help-circle-outline"></span>
</a>
                        <!-- Only show the tooltip if isTooltipActive(...) returns true -->
                        <div
                          v-if="isTooltipActive(year, row.field)"
                          class="custom-tooltip"
                          v-html="missingDataTooltip(calculatedKPIs[year][row.field].missingData)"
                        ></div>
                      </div>
                    </template>
                    <!-- If not missingData, check if numeric or '-' -->
                    <template v-else-if="typeof calculatedKPIs[year][row.field].value === 'number'">
                      {{ formatKPIValue(row.field, calculatedKPIs[year][row.field].value) }}
                    </template>
                    <template v-else-if="calculatedKPIs[year][row.field].value === '-'">
                      -
                    </template>
                    <template v-else>
                      <span style="color: red;">No data</span>
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
        <div v-else class="mt-2 ml-4 text-body-2">Do the "standard" or "complete" valuation to find out your CAGR.</div>
        

      </v-card>
    </template>

    

    <!-- ///////////////////////// -->
    <!-- KPI YEARLY TABLE END          <pre>calculatedKPIs<br>{{calculatedKPIs}}</pre> -->
    <!-- /////////////////////////  -->
    
  </v-container>  

  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="activeNav"
      color="primary"
      horizontal
      grow
    >
      <v-btn @click="scrollToSection('section-general')">
        <v-icon>mdi-information</v-icon>
        General
      </v-btn>

      <v-btn @click="scrollToSection('section-financials')">
        <v-icon>mdi-finance</v-icon>
        Financials
      </v-btn>

      <v-btn v-if="showResults" @click="scrollToSection('section-valuation')">
        <v-icon>mdi-chart-line</v-icon>
        Valuation
      </v-btn>

      <v-btn v-if="showResults" @click="scrollToSection('section-feedback')">
        <v-icon>mdi-comment-text</v-icon>
        Feedback
      </v-btn>
    </v-bottom-navigation>
  </v-layout>

</template>

<script setup>
  import { reactive, ref, computed, watchEffect, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat, convertToPercent, multipleImpact, multipleImpactPercent, apiBaseURL, checkValidPastYear } from '@/utils/index.js';
  import { urlRules, formatURL as formatURLUtil } from '@/utils/url_formatting.js';
  import debounce from 'debounce';


  
  const isLoading = ref(true); // Variable to track loading state used to delay display of valuation 
  const showResults = ref(false); // Variable to track if the results are shown or not
  const showInputAlert = ref(false); // Variable to track if the input alert is shown or not
  
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //valuation vars
  const thisValuationId = ref(route.params.id);
  const isInitialLoad = ref(true);
  const valuationData = reactive({
    show_yearly_inputs: false, 
  }); 

  // Initialize reactive object to store KPIs and calculated metrics
  //const valuationKPIs = reactive({}); // KPIs (mostly yearly) based on valuationData.financial...

  const calculatedKPIs = reactive({}); // var to save the output of calculateKPIsForYear 

  const analysed_kpis = reactive({}); // var to save the output of getKPIInfo 

  const valuationCalculation = reactive({}); // object to save ARR and EBIDTA impact and valuation in 

  const outputData = reactive({}); // object to save the core metrics of valuationCalculation to be saved in db 
  
  //////////////////////////////////////////////////////
  // GENERAL INPUT START 
  //////////////////////////////////////////////////////
  
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
  await fetchValuation(thisValuationId.value);
  valuationData.show_yearly_inputs = true;

  nextTick(() => {
    scrollToSection('section-financials');
  });
} 

  //////////////////////////////////////////////////////
  // GENERAL INPUT START 
  //////////////////////////////////////////////////////


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
      label: 'Number of Customers at Start of Period',
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
    //debouncedUpdateValuationFinancial(field, unformattedValue, year);
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

  //still needed?
  function onBlur(year, field) { 
    if (focusedCells[year]) {
      focusedCells[year][field] = false;
    }
  }

  function handleBlur(year, field) {
    // un-focus the cell:
    if (focusedCells[year]) {
       focusedCells[year][field] = false;
    }
    // The final unformatted value user typed
    const unformattedValue = valuationData.valuation_yearly_inputs[year][field];
    // Actually call your existing update function (non-debounced or lightly debounced)
    updateValuationFinancial(field, unformattedValue, year);
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

  // Main function to calculate all yearly KPIs and store them in $calculatedKPIs[year]
  function calculateKPIsForYear(year) {
    const financials = valuationData.valuation_yearly_inputs?.[year];

    // If there are no financials for this year, store an error and return
    if (!financials) {
      calculatedKPIs[year] = {
        error: `No financial data available for the year: ${year}`,
      };
      return;
    }

    // We'll store the year’s KPI results in this object
    const kpis = {};

    // Helper function to build an object: { value, missingData: string | null }
    function makeKPI(value, missingFieldsArray) {
      if (missingFieldsArray && missingFieldsArray.length > 0) {
        // Join missing fields into a single string: 'Field A, Field B'
        return {
          value: value,
          missingData: missingFieldsArray.join(', '),
        };
      } else {
        return {
          value: value,
          missingData: null,
        };
      }
    }

    /***********************************************************
     * [ENHANCEMENT] Assign costs to calc_* fields
     ***********************************************************/
    // calc_recurring_revenue
    if (financials.recurring_revenue != null) {
      kpis.calc_recurring_revenue = makeKPI(financials.recurring_revenue, []);
    } else {
      kpis.calc_recurring_revenue = makeKPI(null, ['Recurring Revenue']);
    }
    
    // calc_costs_of_goods_sold
    if (financials.costs_of_goods_sold != null) {
      kpis.calc_costs_of_goods_sold = makeKPI(financials.costs_of_goods_sold, []);
    } else {
      kpis.calc_costs_of_goods_sold = makeKPI(null, ['Costs of Goods Sold']);
    }

    // calc_costs_of_cac
    if (financials.costs_of_customer_acquisition != null) {
      kpis.calc_costs_of_cac = makeKPI(financials.costs_of_customer_acquisition, []);
    } else {
      kpis.calc_costs_of_cac = makeKPI(null, ['Costs of Customer Acquisition']);
    }

    // calc_costs_of_r_and_d
    if (financials.costs_of_r_and_d != null) {
      kpis.calc_costs_of_r_and_d = makeKPI(financials.costs_of_r_and_d, []);
    } else {
      kpis.calc_costs_of_r_and_d = makeKPI(null, ['Costs of R&D']);
    }

    // calc_costs_of_g_and_a
    if (financials.costs_of_general_administration != null) {
      kpis.calc_costs_of_g_and_a = makeKPI(financials.costs_of_general_administration, []);
    } else {
      kpis.calc_costs_of_g_and_a = makeKPI(null, ['Costs of General Administration']);
    }
    
    /***********************************************************
     * 1) TOTAL REVENUE
     ***********************************************************/
    if (financials.total_revenue != null) {
      kpis.calc_total_revenue = makeKPI(financials.total_revenue, []);
    } else {
      kpis.calc_total_revenue = makeKPI(null, ['Total Revenue']);
    }

    /***********************************************************
     * 2) GROSS MARGIN NET = total_revenue - costs_of_goods_sold
     ***********************************************************/
    if (
      financials.total_revenue != null &&
      financials.costs_of_goods_sold != null
    ) {
      const gmNet = financials.total_revenue - financials.costs_of_goods_sold;
      kpis.calc_gross_margin_net = makeKPI(gmNet, []);
    } else {
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      if (financials.costs_of_goods_sold == null) missingFields.push('Costs of Goods Sold');
      kpis.calc_gross_margin_net = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 3) EBITDA NET = total_revenue - sum of major costs
     ***********************************************************/
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
      kpis.calc_ebitda_net = makeKPI(financials.total_revenue - totalCosts, []);
    } else {
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      if (financials.costs_of_goods_sold == null) missingFields.push('Costs of Goods Sold');
      if (financials.costs_of_customer_acquisition == null) missingFields.push('Costs of Customer Acquisition');
      if (financials.costs_of_r_and_d == null) missingFields.push('Costs of R&D');
      if (financials.costs_of_general_administration == null) missingFields.push('Costs of General Administration');
      kpis.calc_ebitda_net = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 4) RECURRING REVENUE RATIO = recurring_revenue / total_revenue
     ***********************************************************/
    if (financials.recurring_revenue != null && financials.total_revenue != null) {
      const ratio = (financials.total_revenue === 0)
        ? 0
        : financials.recurring_revenue / financials.total_revenue;
      kpis.calc_recurring_revenue_ratio = makeKPI(ratio, []);
    } else {
      const missingFields = [];
      if (financials.recurring_revenue == null) missingFields.push('Recurring Revenue');
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      kpis.calc_recurring_revenue_ratio = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 5) YEAR-OVER-YEAR REVENUE GROWTH vs previous year
     ***********************************************************/
    const yearsArray = Object.keys(valuationData.valuation_yearly_inputs).sort();
    const firstYear = yearsArray[0];

    if (year.toString() === firstYear) {
      // For earliest year => no YoY comparison
      kpis.calc_yoy_revenue_growth = makeKPI('-', null);
    } else {
      const prevYear = (parseInt(year) - 1).toString();
      const prevFinancials = valuationData.valuation_yearly_inputs[prevYear];
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push(`Total Revenue (${year})`);
      if (!prevFinancials || prevFinancials.total_revenue == null) {
        missingFields.push(`Total Revenue (${prevYear})`);
      }

      if (missingFields.length === 0) {
        const yoyGrowth = (prevFinancials.total_revenue !== 0)
          ? (financials.total_revenue - prevFinancials.total_revenue) / prevFinancials.total_revenue
          : null;
        kpis.calc_yoy_revenue_growth = makeKPI(yoyGrowth, []);
      } else {
        kpis.calc_yoy_revenue_growth = makeKPI(null, missingFields);
      }
    }

    /***********************************************************
     * 6) GROSS MARGIN = (total_revenue - costs_of_goods_sold) / total_revenue
     ***********************************************************/
    if (
      financials.total_revenue != null &&
      financials.costs_of_goods_sold != null
    ) {
      const revenue = financials.total_revenue;
      const cogs = financials.costs_of_goods_sold;
      const gm = (revenue === 0) ? 0 : (revenue - cogs) / revenue;
      kpis.calc_gross_margin = makeKPI(gm, []);
    } else {
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      if (financials.costs_of_goods_sold == null) missingFields.push('Costs of Goods Sold');
      kpis.calc_gross_margin = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 7) EBITDA MARGIN = EBITDA / total_revenue
     ***********************************************************/
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
      const margin = (financials.total_revenue === 0) ? 0 : ebitda / financials.total_revenue;
      kpis.calc_ebitda_margin = makeKPI(margin, []);
    } else {
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      if (financials.costs_of_goods_sold == null) missingFields.push('Costs of Goods Sold');
      if (financials.costs_of_customer_acquisition == null) missingFields.push('Costs of Customer Acquisition');
      if (financials.costs_of_r_and_d == null) missingFields.push('Costs of R&D');
      if (financials.costs_of_general_administration == null) missingFields.push('Costs of General Administration');
      kpis.calc_ebitda_margin = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 8) AVERAGE REVENUE PER CUSTOMER
     ***********************************************************/
    if (
      financials.total_revenue != null &&
      financials.number_of_customers_end_of_period != null
    ) {
      const customers = financials.number_of_customers_end_of_period;
      const arpc = (customers === 0) ? 0 : financials.total_revenue / customers;
      kpis.calc_average_revenue_per_customer = makeKPI(arpc, []);
    } else {
      const missingFields = [];
      if (financials.total_revenue == null) missingFields.push('Total Revenue');
      if (financials.number_of_customers_end_of_period == null) {
        missingFields.push('Number of Customers End of Period');
      }
      kpis.calc_average_revenue_per_customer = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 9) CUSTOMER LOGO CHURN
     ***********************************************************/
    if (
      financials.number_of_customers_end_of_period != null &&
      financials.customers_lost_in_period != null
    ) {
      const startCount = financials.number_of_customers_end_of_period;
      const lost = financials.customers_lost_in_period;
      const churn = (startCount !== 0) ? lost / startCount : null;
      kpis.calc_customer_logo_churn = makeKPI(churn, []);
    } else {
      const missingFields = [];
      if (financials.number_of_customers_end_of_period == null) {
        missingFields.push('Number of Customers End of Period');
      }
      if (financials.customers_lost_in_period == null) {
        missingFields.push('Customers Lost in Period');
      }
      kpis.calc_customer_logo_churn = makeKPI(null, missingFields);
    }

    /***********************************************************
     * 10) LTV to CAC Ratio
     ***********************************************************/
    if (
      kpis.calc_average_revenue_per_customer.value != null &&
      kpis.calc_gross_margin.value != null &&
      kpis.calc_customer_logo_churn.value != null &&
      financials.costs_of_customer_acquisition != null &&
      financials.customers_won_in_period != null
    ) {
      const avgRevenuePerCustomer = kpis.calc_average_revenue_per_customer.value;
      const grossMargin = kpis.calc_gross_margin.value;
      const churnRate = kpis.calc_customer_logo_churn.value;

      const ltv = (churnRate !== 0)
        ? (avgRevenuePerCustomer * grossMargin) / churnRate
        : null;
      const cac = (financials.customers_won_in_period !== 0)
        ? financials.costs_of_customer_acquisition / financials.customers_won_in_period
        : null;

      if (ltv != null && cac != null && cac !== 0) {
        const ratio = ltv / cac;
        kpis.calc_ltv_to_cac = makeKPI(ratio, []);
      } else {
        // The formula breaks down => treat as missing / not computable
        kpis.calc_ltv_to_cac = makeKPI(null, ['LTV or CAC is invalid']);
      }
    } else {
      const missingFields = [];
      if (kpis.calc_average_revenue_per_customer.value == null)
        missingFields.push('Average Revenue Per Customer');
      if (kpis.calc_gross_margin.value == null)
        missingFields.push('Gross Margin');
      if (kpis.calc_customer_logo_churn.value == null)
        missingFields.push('Customer Logo Churn');
      if (financials.costs_of_customer_acquisition == null)
        missingFields.push('Costs of Customer Acquisition');
      if (financials.customers_won_in_period == null)
        missingFields.push('Customers Won in Period');

      kpis.calc_ltv_to_cac = makeKPI(null, missingFields);
    }

    // Finally, store the KPI results for this year
    calculatedKPIs[year] = kpis;
  }

  ////////////////////
  //some functions to handle tooltip for missingData 
  // Example function to check missing data
  function isMissingValue(year, field) {
    const value = valuationData.valuation_yearly_inputs[year]?.[field];
    return value == null || value === '';
  }

  // We store all tooltips states here
  const tooltipStates = reactive({});

  /**
   * Toggle the tooltip for a specific (year, field).
   * We define a unique key (e.g. '2022--calc_total_revenue') to store its open/close state.
   */
  function toggleTooltip(year, field) {
    const key = `${year}--${field}`;
    tooltipStates[key] = !tooltipStates[key];
  }

  /**
   * Checks if the tooltip is active for a specific (year, field).
   */
  function isTooltipActive(year, field) {
    const key = `${year}--${field}`;
    return tooltipStates[key] === true;
  }

  /**
   * The function that returns the HTML or text we want to show in the tooltip.
   * Currently it just returns a basic string, but you can expand it as you wish.
   */
  function missingDataTooltip(missingData) {
    if (!missingData || typeof missingData !== 'string') {
      return '<b>Missing data</b><br>- unknown fields';
    }
    const fields = missingData.split(',');
    let content = '<b>Missing data</b><br>';
    fields.forEach((f) => {
      content += `- ${f.trim()}<br>`;
    });
    return content;
  }
  /// end of tooltip functions 
  ////////////////////////////////////////////////
  



  async function saveOutputs() {
    try {
      // If we haven't built allEvaluationContent yet, bail out.
      if (!allEvaluationContent.value) {
        console.log("No allEvaluationContent - cannot save outputs");
        return;
      }

      // Determine which detail level ("minimal", "standard", or "complete")
      const detail = valuationData.valuation_type;
      if (!detail) {
        console.log("No valuation_type selected - cannot save outputs");
        return;
      }

      // Grab the ARR scenario object
      const scenarioArr = allEvaluationContent.value.arr[detail];
      // Grab the EBITDA scenario object
      const scenarioEbitda = allEvaluationContent.value.ebitda[detail];

      if (!scenarioArr || !scenarioEbitda) {
        console.log("Scenarios not found in allEvaluationContent - cannot save outputs");
        return;
      }

      // Fill both ARR and EBITDA fields no matter what asdf
      outputData.arr_multiple_impact    = scenarioArr.multiple_impact;
      outputData.arr_final_multiple     = scenarioArr.final_multiple;
      outputData.arr_final_valuation    = scenarioArr.final_valuation;
      outputData.ebitda_multiple_impact = scenarioEbitda.multiple_impact;
      outputData.ebitda_final_multiple  = scenarioEbitda.final_multiple;
      outputData.ebitda_final_valuation = scenarioEbitda.final_valuation;



      
      
      // Send outputData to your endpoint
      const response = await axios.post(
        `${apiBaseURL}/valuations/${thisValuationId.value}/outputs`,
        outputData
      );

      console.log('Outputs saved successfully:', response.data);

    } catch (error) {
      console.error('Error saving outputs:', error);
    }
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
    { label: '- Costs of Goods Sold', field: 'calc_costs_of_goods_sold', use_for_analysis: false, rank_for_analysis: 0 },
    { label: '= Gross Margin Net', field: 'calc_gross_margin_net', use_for_analysis: false, rank_for_analysis: 0 },
    { label: '- Costs of Customer Acquisition', field: 'calc_costs_of_cac', use_for_analysis: false, rank_for_analysis: 0 },
    { label: '- Costs of Research & Development', field: 'calc_costs_of_r_and_d', use_for_analysis: false, rank_for_analysis: 0 },
    { label: '- Costs of General Administration', field: 'calc_costs_of_g_and_a', use_for_analysis: false, rank_for_analysis: 0 },
    { label: '= EBITDA Net', field: 'calc_ebitda_net', use_for_analysis: false, rank_for_analysis: 0 },
    { label: 'Recurring Revenue', field: 'calc_recurring_revenue', use_for_analysis: false, rank_for_analysis: 0 },
    
    { label: 'Recurring Revenue Ratio', field: 'calc_recurring_revenue_ratio', use_for_analysis: true, rank_for_analysis: 5 },
    { label: 'Year-over-Year Revenue Growth', field: 'calc_yoy_revenue_growth', use_for_analysis: true, rank_for_analysis: 1 },
    { label: 'Gross Margin', field: 'calc_gross_margin', use_for_analysis: true, rank_for_analysis: 3 },
    { label: 'EBITDA Margin', field: 'calc_ebitda_margin', use_for_analysis: true, rank_for_analysis: 4 },
    { label: 'Average Revenue per Customer', field: 'calc_average_revenue_per_customer', use_for_analysis: false, rank_for_analysis: null },
    { label: 'Customer Logo Churn', field: 'calc_customer_logo_churn', use_for_analysis: false, rank_for_analysis: null },
    { label: 'LTV-to-CAC Ratio', field: 'calc_ltv_to_cac', use_for_analysis: true, rank_for_analysis: 6 }
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
      title: 'Number of Customers at Start of Period',
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
        const kpiValue = calculatedKPIs[latestYearValue]?.[field].value;

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

  
  ////////////////////////////////////////////////////////////////////////////////
  // // TREND ANALYSIS
  ////////////////////////////////////////////////////////////////////////////////
  function analyseTrend(calculatedKPIs) {
    // We only want to look at the last 3 years (descending, e.g. 2024, 2023, 2022)
    const allYears = Object.keys(calculatedKPIs)
      .map(y => parseInt(y))
      .sort((a, b) => b - a);

    if (allYears.length < 3) {
      console.log('Not enough years to do trend analysis');
      return;
    }

    // last 3 years in descending order
    const [yearA, yearB, yearC] = allYears; // yearA is newest, yearB is middle, yearC is oldest

    // We want to do the trend analysis for these KPI fields:
    const kpiFieldsToAnalyze = [
      'calc_yoy_revenue_growth',
      'calc_gross_margin',
      'calc_average_revenue_per_customer',
      'calc_recurring_revenue_ratio'
    ];

    // Mapping from label to multipleImpact
    const labelToMultipleImpact = {
      'accelerating quickly': 1.15,
      'accelerating': 1.1,
      'accelerating slightly': 1.05,
      'no significant change': 1,
      'decelerating quickly': 0.8,
      'decelerating': 0.9,
      'decelerating slightly': 0.95,
      'fluctuating': 1
    };

    // Mapping from label to multipleImpact
    const labelToDescription = {
      'accelerating quickly': 'has been accelerating quickly over the last 3 years. Investors will see this as a very positive sign and might boost this multiple by 15%.',
      'accelerating': 'has been accelerating over the last 3 years. Investors will see this as a positive sign and might boost this multiple by 10%.',
      'accelerating slightly': 'has been accelerating slightly over the last 3 years. Investors will see this as a positive sign and might boost this multiple by 5%.',
      'no significant change': 'has not changed significantly over the last 3 years so that it will not affect your multiple.',
      'decelerating quickly': 'has been decelerating quickly over the last 3 years. Investors will see this as a very negative sign and might reduce this multiple by 20%.',
      'decelerating': 'has been decelerating over the last 3 years. Investors will see this as a negative sign and might reduce this multiple by 10%.',
      'decelerating slightly': 'has been decelerating slightly over the last 3 years. Investors will see this as a negative sign and might reduce this multiple by 5%.',
      'fluctuating': 'has been fluctuating over the last 3 years. Be prepared to explain why. ',
    };

    // Helper function to produce a "trend label" for (newestVal, midVal, oldestVal)
    function getTrendLabel(newestVal, midVal, oldestVal) {
      // If any of them is null, or '-' (string), or not a valid number -> skip
      if (
        newestVal == null || midVal == null || oldestVal == null ||
        newestVal === '-' || midVal === '-' || oldestVal === '-' ||
        isNaN(newestVal) || isNaN(midVal) || isNaN(oldestVal)
      ) {
        return 'no significant change'; // fallback
      }

      const a = parseFloat(newestVal); // e.g. 2024
      const b = parseFloat(midVal);    // e.g. 2023
      const c = parseFloat(oldestVal); // e.g. 2022

      // 1) strictly increasing
      if (c < b && b < a) {
        const totalChangePercent = ((a - c) / c) * 100;
        if (totalChangePercent >= 40) return "accelerating quickly";
        else if (totalChangePercent >= 30) return "accelerating";
        else if (totalChangePercent >= 20) return "accelerating slightly";
        else return "no significant change";
      }
      // 2) strictly decreasing
      if (c > b && b > a) {
        const decChangePercent = ((c - a) / c) * 100;
        if (decChangePercent >= 40) return "decelerating quickly";
        else if (decChangePercent >= 30) return "decelerating";
        else if (decChangePercent >= 20) return "decelerating slightly";
        else return "no significant change";
      }
      // 3) upThenDown or downThenUp
      const isUpThenDown = (c < b && a < b);
      const isDownThenUp = (c > b && a > b);
      if (isUpThenDown || isDownThenUp) {
        const netChange = a - c;
        const totalChangePercent = (netChange / c) * 100;
        if (Math.abs(totalChangePercent) >= 20) return "fluctuating";
        else return "no significant change";
      }
      // fallback
      return "no significant change";
    }

    // For each KPI, read the values from calculatedKPIs for yearA, yearB, yearC
    kpiFieldsToAnalyze.forEach(kpiField => {
      const valA = calculatedKPIs[yearA]?.[kpiField];
      const valB = calculatedKPIs[yearB]?.[kpiField];
      const valC = calculatedKPIs[yearC]?.[kpiField];

      // produce a trend label
      const trendLabel = getTrendLabel(valA, valB, valC);
      // determine the corresponding multipleImpact
      const multipleImpact = labelToMultipleImpact[trendLabel] || 1;
      // determine the corresponding description
      const description = labelToDescription[trendLabel] || 1;

      // Make sure the base object for that KPI is not null:
      if (!analysed_kpis[kpiField]) {
        analysed_kpis[kpiField] = {};
      }
      // Store both label and multipleImpact under analysed_kpis[kpiField].trend
      analysed_kpis[kpiField].trend = {
        label: trendLabel,
        multipleImpact: multipleImpact,
          description: description
      };
    });
  }

  // END TREND ANALYSIS

  
  //////////////////////////////////////////////////////
  // KPI ANALYSIS END
  //////////////////////////////////////////////////////


  //////////////////////////////////////////////////////
  // VALUATION START 
  //////////////////////////////////////////////////////

  const showValuationExplanation = ref(true);
  
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
    const growthImpactMinimal = analysed_kpis.calc_growth_combined?.analysisResult?.impactPercentage ?? 1; // not use combined but only yoy asdf
  const growthImpactComplete = ((analysed_kpis.calc_growth_combined?.analysisResult.impactPercentage -1) * analysed_kpis.calc_yoy_revenue_growth.trend.multipleImpact)+1;

    const grossMarginImpact = analysed_kpis.calc_gross_margin?.analysisResult?.impactPercentage ?? 1;
  const grossMarginImpactComplete = ((analysed_kpis.calc_gross_margin?.analysisResult?.impactPercentage - 1) * analysed_kpis.calc_gross_margin.trend.multipleImpact)+1;
  
  
    const ebitdaMarginImpact = analysed_kpis.calc_ebitda_margin?.analysisResult?.impactPercentage ?? 1;
    const recurringImpact = analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.impactPercentage ?? 1;
    const ltvToCacImpact = analysed_kpis.calc_ltv_to_cac?.analysisResult?.impactPercentage ?? 1;

    const arrVal = latestYear.value && valuationData.valuation_yearly_inputs
      ? valuationData.valuation_yearly_inputs[latestYear.value]?.recurring_revenue
      : null;
    const ebitdaVal = latestYear.value
      ? calculatedKPIs[latestYear.value]?.calc_ebitda_net.value
      : null;


    // -------------------------------------------------
    // ARR - STANDARD 
    // -------------------------------------------------
    const futureGrowthRate = (yoy + cagr) / 2;
    const totalArrImpact = growthImpact * grossMarginImpact * recurringImpact * ltvToCacImpact;
    const totalArrImpactInterpretation = getKPIInfo('final_multiple', totalArrImpact).evaluationDescription
    const baseArrMultiple = valuationData.base_arr_multiple || 3; // fallback
    const finalArrMultiple = parseFloat((baseArrMultiple * totalArrImpact).toFixed(2));
    let companyWorthArr = null;
    if (arrVal != null && !isNaN(finalArrMultiple)) {
      companyWorthArr = arrVal * finalArrMultiple;
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
    let companyWorthEbitda = null;
    if (ebitdaVal != null && !isNaN(finalEbitdaMultiple)) {
        companyWorthEbitda = ebitdaVal * finalEbitdaMultiple;
    }

    // -------------------------------------------------
    // ARR - MINIMAL (ignore CAGR, ignore LTV-to-CAC)
    // -------------------------------------------------
    const futureGrowthRateMinimalArr = yoy; 
    const totalArrImpactMinimal = growthImpactMinimal * grossMarginImpact * recurringImpact;
    const totalArrImpactInterpretationMinimal = getKPIInfo('final_multiple', totalArrImpactMinimal).evaluationDescription
    const finalArrMultipleMinimal = parseFloat((baseArrMultiple * totalArrImpactMinimal).toFixed(2));
    let companyWorthArrMinimal = null;
    if (arrVal != null && !isNaN(finalArrMultipleMinimal)) {
      companyWorthArrMinimal = arrVal * finalArrMultipleMinimal;
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
    let companyWorthEbitdaMinimal = null;
    if (ebitdaVal != null && !isNaN(finalEbitdaMultipleMinimal)) {
      companyWorthEbitdaMinimal = ebitdaVal * finalEbitdaMultipleMinimal;
    }

    // -------------------------------------------------
    // ARR - COMPLETE (same as standard in this example)
    // -------------------------------------------------
    const futureGrowthRateCompleteArr = futureGrowthRate; 
    
    const totalArrImpactComplete = totalArrImpact;
    const totalArrImpactInterpretationComplete = getKPIInfo('final_multiple', totalArrImpactComplete).evaluationDescription
    const finalArrMultipleComplete = finalArrMultiple;
    const companyWorthArrComplete = companyWorthArr;

    // -------------------------------------------------
    // EBITDA - COMPLETE (same as standard in this example)
    // -------------------------------------------------
    const totalEbitdaImpactComplete = totalEbitdaImpact;
    const totalEbitdaImpactInterpretationComplete = getKPIInfo('final_multiple', totalEbitdaImpactComplete).evaluationDescription
    const finalEbitdaMultipleComplete = finalEbitdaMultiple;
    const companyWorthEbitdaComplete = companyWorthEbitda;

    // -----------------------------------------
    // Return the full object 1234
    // -----------------------------------------
    return {
      arr: {
        minimal: {
          multiple_impact: totalArrImpactMinimal,
          final_multiple: finalArrMultipleMinimal,
          final_valuation: companyWorthArrMinimal,
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
                    Your current Year-on-Year growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br><br>
                    A growth rate of ${formatKPIValue('calc_yoy_revenue_growth', yoy)} is ${
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
                      }. <br><br>

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
                      }. <br><br>
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

            <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthArrMinimal)}. </p>
            `,
        },

        standard: {
          multiple_impact: totalArrImpact,
          final_multiple: finalArrMultiple,
          final_valuation: companyWorthArr,
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
                      }. <br><br>

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
                      }. <br><br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                      Your current LTV-to-CAC Ratio is ${
                      analysed_kpis.calc_ltv_to_cac?.value?.toFixed(2) || 'N/A'
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

              <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthArr)}. </p>
            `,
        },

        complete: {
          multiple_impact: totalArrImpactComplete,
          final_multiple: finalArrMultipleComplete,
          final_valuation: companyWorthArrComplete,
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
              }.<br><br>
               Trend Analysis: Your rate of growth ${
analysed_kpis.calc_yoy_revenue_growth?.trend?.description || 'N/A'
              } 
              `,
              impact: `${multipleImpactPercent(growthImpactComplete)}`,
            },
            profitability: {
              description: `
                      When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br><br>

                      Your current Gross Margin is ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      }. <br><br>

                      A Gross Margin of ${
                        analysed_kpis.calc_gross_margin
                          ? formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value)
                          : 'N/A'
                      } is ${
analysed_kpis.calc_gross_margin?.analysisResult?.evaluationDescription || 'N/A'
              }.<br><br>
               Trend Analysis: Your Gross Margin ${
analysed_kpis.calc_gross_margin?.trend?.description || 'N/A'
              }
                `,
              impact: `${multipleImpactPercent(grossMarginImpactComplete)}`,
            },
            recurringRevenueRatio: {
              description: `
                      Your current Recurring Revenue Ratio is ${
                        analysed_kpis.calc_recurring_revenue_ratio
                          ? formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value)
                          : 'N/A'
                      }. <br><br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
              }.
                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                    Your current LTV-to-CAC Ratio is ${
                    analysed_kpis.calc_ltv_to_cac?.value?.toFixed(2) || 'N/A'
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

              <p class="mb-2 font-weight-bold">Multiplying this with your ARR of ${usdFormat(arrVal)} we estimate the worth of your business to be ${usdFormat(companyWorthArr)}. </p>
            `,
        },
      },
      //1234
      ebitda: {
        minimal: {
          multiple_impact: totalEbitdaImpactMinimal,
          final_multiple: finalEbitdaMultipleMinimal,
          final_valuation: companyWorthEbitdaMinimal,
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
                Your current Year-on-Year growth is ${formatKPIValue('calc_yoy_revenue_growth', yoy)}. <br><br>
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
                      }. <br><br>
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
                      }. <br><br>
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
            
            <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEbitdaMinimal)}. </p>
            
          `,
        },

        standard: {
          multiple_impact: totalEbitdaImpact,
          final_multiple: finalEbitdaMultiple,
          final_valuation: companyWorthEbitda,
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
                  }. <br><br>
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
                }. <br><br>
                This is ${
          analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
        }.

                `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                    Your current LTV-to-CAC Ratio is ${
                    analysed_kpis.calc_ltv_to_cac?.value?.toFixed(2) || 'N/A'
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
            
              <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEbitda)}. </p>
            `,
        },

        complete: {
          multiple_impact: totalEbitdaImpactComplete,
          final_multiple: finalEbitdaMultipleComplete,
          final_valuation: companyWorthEbitdaComplete,
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
                      }. <br><br>
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
                      }. <br><br>
                      This is ${
                analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.evaluationDescription || 'N/A'
                }.
              `,
              impact: `${multipleImpactPercent(recurringImpact)}`,
            },
            ltvToCac: {
              description: `
                  Your current LTV-to-CAC Ratio is ${
                    analysed_kpis.calc_ltv_to_cac?.value?.toFixed(2) || 'N/A'
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

            <p class="mb-2 font-weight-bold">Multiplying this with your EBITDA of ${usdFormat(ebitdaVal)} we estimate the worth of your business to be ${usdFormat(companyWorthEbitda)}. </p>
          `,
        },
      },
    };
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

  /*/ Debounced function to update valuation financials
  const debouncedUpdateValuationFinancial = debounce((field, value, timePeriod) => {
    updateValuationFinancial(field, value, timePeriod);
  }, 1000); */


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
    () => {
      // clone or restructure so that `.valuation_yearly_inputs` is excluded:
      const { valuation_yearly_inputs, ...fieldsWeCareAbout } = valuationData;
      return fieldsWeCareAbout;
    },
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
          //console.log('i am in base multi')
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



  import confetti from 'canvas-confetti';

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

    // 4. do Trend Analysis
    //if (valuationData.valuation_type === 'complete') {
      analyseTrend(calculatedKPIs);
    //}

    // 5. *** Rebuild textual content for minimal, standard, complete ***
    allEvaluationContent.value = gatherValuationContent(valuationData, analysed_kpis, latestYear);

    // 6. save core EvaluationOutput in DB 
    saveOutputs();

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 7. Set loading to false after the first full calculation
    showResults.value = true;
    showInputAlert.value = false;

    nextTick(() => {
      scrollToSection('section-valuation');
    });
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
      'calc_recurring_revenue',
      'calc_gross_margin_net',
      'calc_ebitda_net', 
      'calc_costs_of_goods_sold',
      'calc_costs_of_cac',
      'calc_costs_of_r_and_d',
      'calc_costs_of_g_and_a',
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


  const activeNav = ref(0)

  function scrollToSection(sectionId) {
    const HEADER_OFFSET = 60  // Adjust as needed
    const el = document.getElementById(sectionId)
    if (el) {
      const topPosition = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top: topPosition, behavior: 'smooth' })
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


  /* A container to help position the tooltip absolutely */
  .tooltip-container {
    cursor: pointer;
  }

  /* The tooltip itself */
  .custom-tooltip {
    position: absolute;
    top: 0;
    left: 20px;
    background-color: #fff;
    border: 1px solid #dadada;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 8px;
    min-width: 150px;
    z-index: 10;
    border-radius: 6px;
    font-size: 0.85rem;
    white-space: nowrap;
    text-align: left;
  }

</style>