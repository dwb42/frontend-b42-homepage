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
                <template v-if="calculatedKPIs[year] && valuationKPIs[year][row.field] != null">
                  <!-- Display dash for first year -->
                  <template v-if="calculatedKPIs[year][row.field] === '-'">
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


    
    <!-- initial kachelansatz where kpis are displayed and analysed now deprecated because its all done in valuation table ... less is more ...  -->
    <!-- v-card variant="elevated" class="pa-3 mb-6">
      <h2 class="text-h5 mb-2"><b>Analysis of your KPIs</b></h2>
      <p class="mb-6">To assess your current performance we analyse your {{ latestYear }} metrics. </p>
      
      <v-row>
        <v-col 
          v-for="(kpi, key) in analysed_kpis" :key="key"
          cols="12" md="6" lg="4"
        >
          <v-card variant="elevated" class="pa-3 mb-6">

            <v-card-item>
              <v-card-title>{{ kpi.label }}: {{ formatKPIValue(key, kpi.value) }}</v-card-title>

              <v-card-subtitle>{{ kpi.analysisResult.rangeName }}</v-card-subtitle>


            </v-card-item>

            
            
            <v-card-text class="bg-surface-light pt-4">
              <p v-if="kpi.analysisResult">
                {{kpi.analysisResult.evaluationDescription}} <br>
                <div class="mt-4 font-weight-bold text-high-emphasis" v-html="multipleImpact(kpi.analysisResult.impactPercentage)"> </div>
              </p>
              <p v-else>
                <strong>Analysis:</strong> <span style="color: red;">No analysis available</span>
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="blue-lighten-2"
                text="Learn More"
                variant="text"
                @click="openModal(key)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-->

    
    <!-- The Dialog that will show the selected KPI details -->
    <v-dialog v-model="isDialogOpen" :style="{ maxWidth: '800px' }">
      <v-card>
        <v-card-title>
          <!-- Display the title based on selectedKPI -->
          {{ selectedKPI && kpiModalConfig[selectedKPI] ? kpiModalConfig[selectedKPI].title : 'KPI Details' }}
        </v-card-title>
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

  

    
    <template v-if="!isLoading">
      <v-card variant="elevated" class="pa-3 mb-6" :style="{ maxWidth: '800px' }" >
        <h2 class="text-h4 mb-2"><b>Valuation of your SaaS business</b></h2>
        <p class="mb-6 text-body-1">Depending on which phase your business is, in we will evaluate its worth using the ARR- or the EBITDA-Multiple Method.  </p>
  
        <h3 class="text-h6 mb-2 mt-6">What best describes your current state of business?</h3>
        <v-radio-group v-model="valuationData.state_of_business">
          <v-radio value="preRevenue">
            <template v-slot:label>
              <div>we are just getting started and do not have revenue yet <strong>(pre revenue)</strong></div>
            </template>
          </v-radio>
          <v-radio value="earlyStage">
            <template v-slot:label>
              <div>we are investing heavily in product and/or growth and have little to no profit because of it <strong>(early stage)</strong></div>
            </template>
          </v-radio>
          <v-radio value="laterStage">
            <template v-slot:label>
              <div>we are balancing our focus on growth and profitability <strong>(later stage)</strong></div>
            </template>
          </v-radio>
        </v-radio-group>
  
        <!-- STARTING OUTPUT DEPENDING ON RADIO SELECTION -->
        <!-- PRE REVENUE ... WONT DO -->
        <template v-if="valuationData.state_of_business === 'preRevenue'">
          <p class="text-body-1">
            ❌ Our valuation method does not work for pre-revenue businesses. 🤷‍♂️
          </p>
        </template>
  
  
        <!-- EARLY STAGE -->
        <template v-if="valuationData.state_of_business === 'earlyStage'">
          <h3 class="text-h5 mb-2 mt-4">Valueing Early Stage / Growth SaaS Cases using ARR-Multiple</h3>
          <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).  </p>

          
          <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

          <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
          <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 

            As a default we set this multiple at "3". 
          </p>

          <v-text-field
            v-model="valuationData.base_arr_multiple"
            label="Base ARR-Multiple"
            type="number"
            :rules="[v => v >= 0 || 'Multiple must be non-negative']"
            persistent-hint
            class="mb-6"
            style="width:300px"
            @update:modelValue="saveData"
          ></v-text-field>

          <!--hint="Base multiple for SaaS valuation"-->


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>

          <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple). </p> 
         
          <!--p class="text-body-2 mb-6">He would thenlook at current market conditions and some other attributes that  have an impact on your valuation multiple. </p-->
          
          
          <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analysing Growth & Profitability</h4>
          <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be. </p>
          <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financial to get a "future growth rate".  </p>
          <p class="text-body-2 mb-2">We will ues your "current Gross Maring" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future. </p>
       
  
        <v-table>
          <thead>
            <tr>
              <th class="text-left" width="80%">Factor</th>
              <th class="text-right"  width="20%">Multiple-Impact </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is {{ formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value) }}. <br>
                    Your compounded growth (CAGR) is {{ formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value) }}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    ({{ formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value) }}
                     + 
                    {{ formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value) }})
                    / 2 = 
                    {{valuationCalculation.futureGrowthRate*100}}%

                    <br><br>
                    A future growth rate of {{valuationCalculation.futureGrowthRate*100}}% is {{analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}}.
                    
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
              </td>
              <td v-if="analysed_kpis.calc_growth_combined.analysisResult.impactPercentage" class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage) }} 
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the ARR Valuation, we determine your profitability based on your Gross Margin. <br>

                    Your current Gross Margin is {{ formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value) }}.<br> <br>

                    A Gross Margin of {{ formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value) }} is {{analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}}.

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
              </td>
              <td class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage) }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is {{ formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value) }}. <br><br>

                    This is {{analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}}.
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
              </td>
              <td class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage) }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is {{ formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value) }}. <br><br>

                    This is {{analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}}.
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
              </td>
              <td class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage) }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    ({{analysed_kpis.calc_growth_combined.analysisResult.impactPercentage}} *
                    {{analysed_kpis.calc_gross_margin.analysisResult.impactPercentage}} *
                    {{analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage}} *
                    {{analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage}})
                  </p>
                </div>
              </td>
              <td class="text-right font-weight-bold">
                {{ multipleImpactPercent(valuationCalculation.total_arr_multiple_impact) }}
              </td>
            </tr>
  
          </tbody>
        </v-table>

          <p class="mb-2 mt-6">
           Based on your business' performance, we need to adjust the ARR Base Multiple of {{valuationData.base_arr_multiple}} by {{multipleImpactPercent(valuationCalculation.total_arr_multiple_impact)}}.  

          </p>
          <p class="mb-2">
            i.e. {{valuationData.base_arr_multiple}} 
            *  {{valuationCalculation.total_arr_multiple_impact.toFixed(2)}} = {{valuationCalculation.final_arr_multiple}}</p>
          
          <p class="mb-2 font-weight-bold">Your final ARR-Multiple is  {{valuationCalculation.final_arr_multiple}}.</p>
         

        <h3 class="text-h6 mb-2 mt-6">Calcuating the worth of your company</h3>
        <p class="mb-2">
          To evaluate the worth of your business using the ARR Multiple Method, all that is left to do is to multiply your current ARR with the final multiple. <br>
          i.e.{{usdFormat(valuationData.valuation_financials[latestYear].recurring_revenue)}} *     {{valuationCalculation.final_arr_multiple}}    
          = {{usdFormat(valuationCalculation.companyWorthARR)}} 
        </p>
        <p class="mb62 font-weight-bold">Your business' valuation using the ARR-Multiple-Method is {{usdFormat(valuationCalculation.companyWorthARR)}}.</p>
       </template>
        
     


    <template v-if="valuationData.state_of_business === 'laterStage'">
          <h3 class="text-h5 mb-2 mt-4">Valueing Later Stage / Steady SaaS Cases using EBITDA-Multiple</h3>
          <p class="mb-6">Since early stage business often have low or negative EBITDA, their valuation is often done using a Multiple on their Annual Recurring Revenue (ARR).  </p>


          <h3 class="text-h6 mb-2 mt-0">Finding the ARR-Multiple for your business</h3>

          <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Setting a Base Multiple</h4>
          <p class="mb-6">To find the ARR-Multiple that an investor might value your business at, we first have to set a Base Multiple that an investor would use to value a SaaS business that he deems to be a solid SaaS investment case. 

            As a default we set this multiple at "3". 
          </p>

          <v-text-field
            v-model="valuationData.base_ebitda_multiple"
            label="Base EBITDA-Multiple"
            type="number"
            :rules="[v => v >= 0 || 'Multiple must be non-negative']"
            persistent-hint
            class="mb-6"
            style="width:300px"
            @update:modelValue="saveData"
          ></v-text-field>

          <!--hint="Base multiple for SaaS valuation"-->


            <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Adjusting the Base Multiple to your business' performance</h4>

          <p class="text-body-2 mb-6">An investor would then evaluate your Financial Metrics to find out if they are "SaaS norm" (i.e. have no impact on your multiple), "better than average" (i.e. increase your multiple) or if they are "worse than average" (i.e. decrease your multiple). </p> 

          <!--p class="text-body-2 mb-6">He would thenlook at current market conditions and some other attributes that  have an impact on your valuation multiple. </p-->


          <h4 class="text-body-1 font-weight-bold mb-2 mt-0">Analysing Growth & Profitability</h4>
          <p class="text-body-2 mb-2">Every investor will want to get a good sense of how fast you will be growing your revenue and how profitable your business will be. </p>
          <p class="text-body-2 mb-2">In our evaluation we will use the average of your "current growth" (i.e. last Year-on-Year growth) and your "compounded growth (CAGR)" over the time period you have provided financial to get a "future growth rate".  </p>
          <p class="text-body-2 mb-2">We will ues your "current Gross Maring" to estimate the profit potential of your business. We will ignore your EBITDA Margin, because it is negatively affected by too many costs that you will grow out of or won't have in the future. </p>


        <v-table>
          <thead>
            <tr>
              <th class="text-left" width="80%">Factor</th>
              <th class="text-right"  width="20%">Multiple-Impact </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Growth</p>
                  <p class="text-body-2 mb-2">
                    Your current growth is {{ formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value) }}. <br>
                    Your compounded growth (CAGR) is {{ formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value) }}. <br>

                    For valuation purposes we will calculate your future growth rate at <br>
                    ({{ formatKPIValue('calc_yoy_revenue_growth', analysed_kpis.calc_yoy_revenue_growth.value) }}
                     + 
                    {{ formatKPIValue('calc_cagr_revenue', analysed_kpis.calc_cagr_revenue.value) }})
                    / 2 = 
                    {{valuationCalculation.futureGrowthRate*100}}%

                    <br><br>
                    A future growth rate of {{valuationCalculation.futureGrowthRate*100}}% is {{analysed_kpis.calc_growth_combined.analysisResult.evaluationDescription}}.

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
              </td>
              <td v-if="analysed_kpis.calc_growth_combined.analysisResult.impactPercentage" class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_growth_combined.analysisResult.impactPercentage) }} 
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Profitability</p>
                  <p class="text-body-2 mb-2">
                    When using the EBITDA Valuation, we determine your profitability based on your Gross Margin as well as your EBITDA Margin. <br><br>

                    Your current Gross Margin is {{ formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value) }}.<br> 

                    A Gross Margin of {{ formatKPIValue('calc_gross_margin', analysed_kpis.calc_gross_margin.value) }} is {{analysed_kpis.calc_gross_margin.analysisResult.evaluationDescription}}.<br> <br>

                    Your current EBITDA Margin is {{ formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value) }}.<br> 

                    An EBITDA Margin of {{ formatKPIValue('calc_ebitda_margin', analysed_kpis.calc_ebitda_margin.value) }} is {{analysed_kpis.calc_ebitda_margin.analysisResult.evaluationDescription}}. <br> <br>

                    To calculate the total impact of your Gross Margin and EBITDA Margin, we add them together and devide them by 2. <br>

                    i.e. ({{analysed_kpis.calc_gross_margin.analysisResult.impactPercentage}} + {{analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage}}) / 2 = {{(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage)/2}}. <br>


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
              </td>
              <td class="text-right">
                {{multipleImpactPercent((analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage)/2)}}
                
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Recurring Revenue Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current Recurring Revenue Ratio is {{ formatKPIValue('calc_recurring_revenue_ratio', analysed_kpis.calc_recurring_revenue_ratio.value) }}. <br><br>

                    This is {{analysed_kpis.calc_recurring_revenue_ratio.analysisResult.evaluationDescription}}.
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
              </td>
              <td class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage) }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">LTV-to-CAC Ratio</p>
                  <p class="text-body-2 mb-2">
                    Your current LTV-to-CAC Ratio is {{ formatKPIValue('calc_ltv_to_cac', analysed_kpis.calc_ltv_to_cac.value) }}. <br><br>

                    This is {{analysed_kpis.calc_ltv_to_cac.analysisResult.evaluationDescription}}.
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
              </td>
              <td class="text-right">
                {{ multipleImpactPercent(analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage) }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="py-2">
                  <p class="text-body-1 font-weight-bold mb-1">Total Impact on Multiple</p>
                  <p class="text-body-2 mb-2">
                    ({{analysed_kpis.calc_growth_combined.analysisResult.impactPercentage}} *
                    {{(analysed_kpis.calc_gross_margin.analysisResult.impactPercentage + analysed_kpis.calc_ebitda_margin.analysisResult.impactPercentage)/2}} *
                    {{analysed_kpis.calc_recurring_revenue_ratio.analysisResult.impactPercentage}} *
                    {{analysed_kpis.calc_ltv_to_cac.analysisResult.impactPercentage}})
                  </p>
                </div>
              </td>
              <td class="text-right font-weight-bold">
                {{ multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact) }}
              </td>
            </tr>

          </tbody>
        </v-table>

          <p class="mb-2 mt-6">
           Based on your business' performance, we need to adjust the EBITDA Base Multiple of {{valuationData.base_ebitda_multiple}} by {{multipleImpactPercent(valuationCalculation.total_ebitda_multiple_impact)}}.  

          </p>
          <p class="mb-2">
            i.e. {{valuationData.base_ebitda_multiple}} 
            *  {{valuationCalculation.total_ebitda_multiple_impact}} = {{valuationCalculation.final_ebitda_multiple}}</p>

          <p class="mb-2 font-weight-bold">Your final EBITDA-Multiple is  {{valuationCalculation.final_ebitda_multiple}}.</p>


        <h3 class="text-h6 mb-2 mt-6">Calcuating the worth of your company</h3>
        <p class="mb-2">
          To evaluate the worth of your business using the EBITDA-Multiple-Method, all that is left to do is to multiply your current EBITDA with the final multiple. <br>
          i.e.{{usdFormat(valuationData.valuation_financials[latestYear].calc_ebitda_net)}} *     {{valuationCalculation.final_ebitda_multiple}}    
          = {{usdFormat(valuationCalculation.companyWorthEBITDA)}} 
        </p>
        <p class="mb62 font-weight-bold">Your business' valuation using the EBITDA-Multiple-Method is {{usdFormat(valuationCalculation.companyWorthEBITDA)}}.</p>
       </template>

      </v-card>
      <pre>analysed_kpis<br>{{analysed_kpis}}</pre>
      <pre>valuationData<br>{{valuationData}}</pre>
      <pre>valuationCalculation<br>{{valuationCalculation}}</pre>

    </template>

    
  </v-container>  
</template>

<script setup>
  import { reactive, ref, computed, watchEffect, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios'; 
  import { formatDateUsingDateFns, truncateString, usdFormat, convertToPercent, multipleImpact, multipleImpactPercent, apiBaseURL } from '@/utils/index.js';
  import { useTrendAnalysis } from '@/utils/trendAnalysis.js';
  import debounce from 'debounce';

  import getKPIInfo from '@/utils/kpiInterpretation/getKPIInfo';

  //import kpiLearnMoreModals
  import YearOnYearGrowthModal from '@/components/kpiLearnMoreModals/YearOnYearGrowthModal.vue';
  import FutureGrowthModal from '@/components/kpiLearnMoreModals/FutureGrowthModal.vue';
  import GrossMarginModal from '@/components/kpiLearnMoreModals/GrossMarginModal.vue';
  import EBITDAMarginModal from '@/components/kpiLearnMoreModals/EBITDAMarginModal.vue';
  import RecurringRevenueRatioModal from '@/components/kpiLearnMoreModals/RecurringRevenueRatioModal.vue';
  import LtvToCacModal from '@/components/kpiLearnMoreModals/LtvToCacModal.vue';

  //////////// START MODAL DIALOG STATES
  const isDialogOpen = ref(false);
  const selectedKPI = ref(null);

  // Configuration object: key = KPI field, value = { title, component }
  const kpiModalConfig = {
    calc_yoy_revenue_growth: {
      title: 'Year-over-Year Growth Details',
      component: YearOnYearGrowthModal
    },
    calc_growth_combined: {
      title: 'Future Growth Details',
      component: FutureGrowthModal
    },
    calc_gross_margin: {
      title: 'Gross Margin Details',
      component: GrossMarginModal
    },
    calc_ebitda_margin: {
      title: 'EBITDA Margin Details',
      component: EBITDAMarginModal
    },
    calc_recurring_revenue_ratio: {
      title: 'Recurring Revenue Ratio Details',
      component: RecurringRevenueRatioModal
    },
    calc_ltv_to_cac: {
      title: 'LTV to CAC Ratio Details',
      component: LtvToCacModal
    }
  };

  function openModal(key) {
    selectedKPI.value = key;
    isDialogOpen.value = true;
  }

  //////////// END MODAL DIALOG STATES
  const isLoading = ref(true); // Variable to track loading state used to delay display of valuation 
  
  //setup router
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const routeParams = route.params;

  //valuation vars
  const thisValuationId = ref(route.params.id);
  const valuationData = reactive({}); 
  
  // Initialize reactive object to store KPIs and calculated metrics
  const valuationKPIs = reactive({}); // KPIs (mostly yearly) based on valuationData.financial...

  const calculatedKPIs = reactive({}); // var to save the output of calculateKPIsForYear 
  
  const analysed_kpis = reactive({}); // var to save the output of getKPIInfo 

  const valuationCalculation = reactive({}); // object to save ARR and EBIDTA impact and valuation in 

  
  //compute properties for dynamic table
  const years = computed(() => {
    if (!valuationData.valuation_financials) return [];
    return Object.keys(valuationData.valuation_financials).sort();
  });

  //finde latest year of financial data
  const latestYear = computed(() => {
    const sortedYears = years.value;
    return sortedYears.length ? sortedYears[sortedYears.length - 1] : null;
    
  });

  //compute trends 
  //temp const { trendStatement: recurringRevenueTrend } = useTrendAnalysis(valuationKPIs, 'calc_recurring_revenue_ratio');

  

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
    { label: 'Total Revenue', field: 'calc_total_revenue', use_for_analysis: false, rank_for_analysis: 0 },
     { label: 'Gross Margin Net', field: 'calc_gross_margin_net', use_for_analysis: false, rank_for_analysis: 0 },
     { label: 'EBITDA Net', field: 'calc_ebitda_net', use_for_analysis: false, rank_for_analysis: 0 },
    
    { label: 'Recurring Revenue Ratio', field: 'calc_recurring_revenue_ratio', use_for_analysis: true, rank_for_analysis: 5 },
    { label: 'Year-over-Year Growth', field: 'calc_yoy_revenue_growth', use_for_analysis: true, rank_for_analysis: 1 },
    { label: 'CAGR', field: 'calc_cagr_revenue', use_for_analysis: true, rank_for_analysis: 2 },
    { label: 'Gross Margin', field: 'calc_gross_margin', use_for_analysis: true, rank_for_analysis: 3 },
    { label: 'EBITDA Margin', field: 'calc_ebitda_margin', use_for_analysis: true, rank_for_analysis: 4 },
    { label: 'Average Revenue per Customer', field: 'calc_average_revenue_per_customer', use_for_analysis: false, rank_for_analysis: null },
    { label: 'Customer Logo Churn', field: 'calc_customer_logo_churn', use_for_analysis: false, rank_for_analysis: null },
    { label: 'LTV to CAC Ratio', field: 'calc_ltv_to_cac', use_for_analysis: true, rank_for_analysis: 6 }
  ]);


  
  //get one valuation 
  async function fetchValuation(id) {
    try {
      // Fetch the valuation data
      const { data } = await axios.get(`${apiBaseURL}/valuations/${id}`)

      // Convert the `valuation_financials` array into an object keyed by `time_period`
      if (data.valuation_financials) {
        data.valuation_financials = data.valuation_financials.reduce((acc, item) => {
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
      //db console.log('val data ',valuationData)
      const response = await axios.put(`${apiBaseURL}/valuations/` + thisValuationId.value, valuationData);
      //db console.log('valuation updated:', response);

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


  function hasSufficientFinancialData() {
    if (!valuationData.valuation_financials) return false;
    // check if there's at least one year with something non-empty
    const yearsKeys = Object.keys(valuationData.valuation_financials);
    if (yearsKeys.length === 0) return false;

    // For example, verify that some fields are not null
    // If you want at least 'total_revenue' before proceeding:
    for (const year of yearsKeys) {
      const fin = valuationData.valuation_financials[year];
      if (fin.total_revenue != null && fin.total_revenue !== '') {
        return true; // we have at least 1 non-empty year
      }
    }
    return false;
  }
  
  
  function recalculateAllMetrics() {
    // Skip if no financial data available
    if (!hasSufficientFinancialData()) {
      return;
    }

    // Clear existing KPIs
    Object.keys(valuationKPIs).forEach(key => delete valuationKPIs[key]);
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

    // 4. Perform Valuation Calculation
    doValuationCalculation();

    // Set loading to false after the first full calculation
    isLoading.value = false;
  }

  onMounted(async () => {
    // Wait for fetchValuation to complete
    await fetchValuation(thisValuationId.value);
    // Set default base_arr_multiple if not already set
    if (!valuationData.base_arr_multiple) {
      valuationData.base_arr_multiple = 3;
    }
    // Trigger initial calculation ... not neccessary anymore since caught by watchEffect
    //await nextTick();
    //recalculateAllMetrics();
  });


  const debouncedRecalculate = debounce(() => {
    recalculateAllMetrics();
  }, 500);

  
  // Single watcher for data changes
  watch(
    () => valuationData,
    async () => {
      try {
        await saveData(valuationData);
        await nextTick();
        // Check again if valuationData.valuation_financials is not empty
        if (hasSufficientFinancialData()) {
          recalculateAllMetrics();
        } else {
          // skip the KPI calculations
          console.log('Skipping recalcAllMetrics - not enough data yet');
        }
      } catch (error) {
        console.error('Error in watch handler:', error);
      }
    },
    { deep: true }
  );

  function analyseOtherKPIs() {
    try {
      const latestYearValue = latestYear.value;
      const latestYearKPIs = valuationKPIs[latestYearValue];

      if (!latestYearKPIs) {
        console.warn('No KPI data available for latest year');
        return;
      }

      // Calculate Combined Growth Rate (average of YoY and CAGR)
      if (typeof latestYearKPIs.calc_yoy_revenue_growth === 'number' && 
          typeof latestYearKPIs.calc_cagr_revenue === 'number') {
        
        const combinedGrowthRate = (latestYearKPIs.calc_yoy_revenue_growth + latestYearKPIs.calc_cagr_revenue) / 2;
        
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

      // Here you can add more combined/derived KPI calculations following the same pattern

    } catch (error) {
      console.error('Error in analyseOtherKPIs:', error.message);
    }
  }


  const saveData = debounce(async (data) => {
    await saveValuation(data);
  }, 500);

  async function analyseYearlyKPIsAsync() {
    return analyseYearlyKPIs();
  }

  async function analyseOtherKPIsAsync() {
    return analyseOtherKPIs();
  }

  async function doValuationCalculationAsync() {
    return doValuationCalculation();
  }



  ///////////////
  // START KPI Calculation Functions
  //////

  
  function calculateKPIsForYear(year) {
    const financials = valuationData.valuation_financials && valuationData.valuation_financials[year];
    if (!financials) {
      valuationKPIs[year] = { error: 'No financial data available for this year yet.' };
      return;
    }
    const kpis = {};

    // calc_total_revenue = total_revenue directly
    if (financials.total_revenue != null) {
      kpis.calc_total_revenue = financials.total_revenue;
    } else {
      kpis.calc_total_revenue = { missingData: ['total_revenue'] };
    }
    // Store calc_total_revenue in valuationData
    financials.calc_total_revenue = kpis.calc_total_revenue;

    // calc_gross_margin_net = total_revenue - costs_of_goods_sold
    if (financials.total_revenue != null && financials.costs_of_goods_sold != null) {
      kpis.calc_gross_margin_net = financials.total_revenue - financials.costs_of_goods_sold;
    } else {
      const missingData = [];
      if (financials.total_revenue == null) missingData.push('total_revenue');
      if (financials.costs_of_goods_sold == null) missingData.push('costs_of_goods_sold');
      kpis.calc_gross_margin_net = { missingData };
    }
    // Store calc_gross_margin_net in valuationData
    financials.calc_gross_margin_net = kpis.calc_gross_margin_net;

    // calc_ebitda_net = total_revenue - (sum of all major costs)
    if (
      financials.total_revenue != null &&
      financials.costs_of_goods_sold != null &&
      financials.costs_of_customer_acquisition != null &&
      financials.costs_of_r_and_d != null &&
      financials.costs_of_general_administration != null
    ) {
      const totalCosts = financials.costs_of_goods_sold
                       + financials.costs_of_customer_acquisition
                       + financials.costs_of_r_and_d
                       + financials.costs_of_general_administration;
      kpis.calc_ebitda_net = financials.total_revenue - totalCosts;
    } else {
      const missingData = [];
      if (financials.total_revenue == null) missingData.push('total_revenue');
      if (financials.costs_of_goods_sold == null) missingData.push('costs_of_goods_sold');
      if (financials.costs_of_customer_acquisition == null) missingData.push('costs_of_customer_acquisition');
      if (financials.costs_of_r_and_d == null) missingData.push('costs_of_r_and_d');
      if (financials.costs_of_general_administration == null) missingData.push('costs_of_general_administration');
      kpis.calc_ebitda_net = { missingData };
    }
    // Store calc_ebitda_net in valuationData
    financials.calc_ebitda_net = kpis.calc_ebitda_net;


    // Recurring Revenue Ratio
    {
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
    }

    // Year-over-Year Revenue Growth
    {
      let missingData = [];
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
    }

    // Gross Margin
    {
      let missingData = [];
      if (financials.total_revenue != null && financials.costs_of_goods_sold != null) {
        const revenue = financials.total_revenue;
        const cogs = financials.costs_of_goods_sold;
        kpis.calc_gross_margin = revenue !== 0 ? (revenue - cogs) / revenue : null;
      } else {
        if (financials.total_revenue == null) missingData.push('total_revenue');
        if (financials.costs_of_goods_sold == null) missingData.push('costs_of_goods_sold');
        kpis.calc_gross_margin = { missingData };
      }
    }

    // EBITDA Margin
    {
      let missingData = [];
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
    }

    // Average Revenue per Customer
    {
      let missingData = [];
      if (financials.total_revenue != null && financials.number_of_customers_end_of_period != null) {
        const customers = financials.number_of_customers_end_of_period;
        kpis.calc_average_revenue_per_customer = customers !== 0 ? financials.total_revenue / customers : null;
      } else {
        if (financials.total_revenue == null) missingData.push('total_revenue');
        if (financials.number_of_customers_end_of_period == null) missingData.push('number_of_customers_end_of_period');
        kpis.calc_average_revenue_per_customer = { missingData };
      }
    }

    // Customer Logo Churn
    {
      let missingData = [];
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
    }

    // LTV to CAC Ratio
    {
      let missingData = [];
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
    }

  calculatedKPIs[year] = kpis;
  }
  


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
        const kpiValue = valuationKPIs[latestYearValue]?.[field];

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
  isLoading.value = false;
  //console.log('is loading: ',isLoading.value)
  }


  function computeCAGR() {
    const allYears = years.value;
    if (allYears.length < 2) return null; // Not enough data

    const firstYear = allYears[0];
    const lastYear = allYears[allYears.length - 1];

    const beginningValue = valuationData.valuation_financials[firstYear]?.total_revenue;
    const endingValue = valuationData.valuation_financials[lastYear]?.total_revenue;

    if (beginningValue == null || endingValue == null || beginningValue === 0) {
      return { missingData: ['total_revenue'] };
    }

    const n = allYears.length;
    const cagr = Math.pow((endingValue / beginningValue), 1/(n-1)) - 1;

    // Store it in a new KPI field for the latest year (or a special place)
    // Since CAGR is not year-specific, you could store it under the latest year for convenience
    valuationKPIs[lastYear].calc_cagr_revenue = cagr;
  }


  

  watchEffect(() => {
    if (valuationData.valuation_financials) {
      for (const year of years.value) {
        calculateKPIsForYear(year);
      }
      // Compute CAGR now that all years are processed
      computeCAGR();
    }
  });


  function doValuationCalculation() {
    console.log('doValuationCalculation called');
    
    // Calculate future growth rate
    const yoy = analysed_kpis.calc_yoy_revenue_growth?.value;
    const cagr = analysed_kpis.calc_cagr_revenue?.value;
    if (typeof yoy === 'number' && typeof cagr === 'number') {
      valuationCalculation.futureGrowthRate = ((yoy + cagr) / 2).toFixed(4);
    } else {
      valuationCalculation.futureGrowthRate = null;
    }

    // Calculate total ARR and EBITDA multiple impact
    const growthImpact = analysed_kpis.calc_growth_combined?.analysisResult?.impactPercentage ?? 1;
    const GrossMarginImpact = analysed_kpis.calc_gross_margin?.analysisResult?.impactPercentage ?? 1;
    const EbitdaMarginImpact = analysed_kpis.calc_ebitda_margin?.analysisResult?.impactPercentage ?? 1;

    const recurringImpact = analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.impactPercentage ?? 1;
    const ltvToCacImpact = analysed_kpis.calc_ltv_to_cac?.analysisResult?.impactPercentage ?? 1;

    //set total_arr_multiple_impact
    valuationCalculation.total_arr_multiple_impact = 
      (growthImpact * GrossMarginImpact * recurringImpact * ltvToCacImpact);

    //set total_ebitda_multiple_impact
    valuationCalculation.total_ebitda_multiple_impact = 
    ((growthImpact * ((GrossMarginImpact + EbitdaMarginImpact)/2) * recurringImpact * ltvToCacImpact)).toFixed(2);

    // Calculate final ARR multiple
    if (valuationData.base_arr_multiple && valuationCalculation.total_arr_multiple_impact) {
      valuationCalculation.final_arr_multiple = (valuationData.base_arr_multiple * valuationCalculation.total_arr_multiple_impact).toFixed(2);
    } else {
      valuationCalculation.final_arr_multiple = null;
    }

    // Calculate final EBITDA multiple
    if (valuationData.base_ebitda_multiple && valuationCalculation.total_ebitda_multiple_impact) {
      valuationCalculation.final_ebitda_multiple = (valuationData.base_ebitda_multiple * valuationCalculation.total_ebitda_multiple_impact).toFixed(2);
    } else {
      valuationCalculation.final_ebitda_multiple = null;
    }

    
    // Calculate company worth ARR
    if (latestYear.value && valuationData.valuation_financials) {
      const arr = valuationData.valuation_financials[latestYear.value]?.recurring_revenue;
      if (arr != null && valuationCalculation.final_arr_multiple) {
        valuationCalculation.companyWorthARR = arr * parseFloat(valuationCalculation.final_arr_multiple);
      } else {
        valuationCalculation.companyWorthARR = null;
      }
    } else {
      valuationCalculation.companyWorthARR = null;
    }

    // Calculate company worth EBITDA 1234
    if (latestYear.value && valuationData.valuation_financials) {
      const ebitda = valuationData.valuation_financials[latestYear.value]?.calc_ebitda_net;
      if (ebitda != null && valuationCalculation.final_arr_multiple) {
        valuationCalculation.companyWorthEBITDA = ebitda * parseFloat(valuationCalculation.final_ebitda_multiple);
      } else {
        valuationCalculation.companyWorthEBITDA = null;
      }
    } else {
      valuationCalculation.companyWorthEBITDA = null;
    }
  }



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