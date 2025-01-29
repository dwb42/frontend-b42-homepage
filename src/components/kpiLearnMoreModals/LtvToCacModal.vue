
<template>
  <p class="mb-4">
    The Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC) Ratio measures the relationship between the lifetime value of a customer and the cost of acquiring that customer. The LTV-to-CAC ratio is calculated by dividing your LTV by CAC.
  </p>

  <p class="mb-4"><b>
    We get your "per Customer Acquisition Cost" by dividing your "Total Customer Acquisition Cost" by the "number of customers won" in your latest period. </b>
  </p>

  <p class="mb-4">
    <b>Calculating the Customer Lifetime Value is a little more difficult: </b><br>
    a) calculate Customer Churn Rate by using the following formula: "Customers at beginning of period" / "Customers lost in period" <br>
    b) calculate the Customer Lifetime via: 1 / Customer Churn Rate <br>
    c) multiply Customer Lifetime * Average Revenue per Customer 
  </p>


  <p class="mb-4">
    <b>For a SaaS business, a LTV-to-CAC ratio of around 3 is considered good.</b>  
  </p>

  <p class="mb-4">
    If your Ratio is significantly lower than 3, investors will assume that you have not found product-market fit yet or that you are not proficient in sales & marketing. They will penalize this with a lower multiple and will want to find out if this is something that can be fixed or not. 
  </p>

  <p class="mb-4">
    Having a LTV-to-CAC ratio that is significantly higher than 3 is definitively better than having a ratio below 3. Investors will assume that you could be spending more aggressively on marketing and sales and will want to find out why you are not doing so. 
  </p>

  <p class="mb-4 font-weight-bold">
    We use the following LTV-to-CAC ratio ranges with their respective impact on the Multiple in our SaaS valuation formula:
  </p>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">LTV-to-CAC Ratio</th>
        <th class="text-right">Range</th>
        <th class="text-right">Multiple Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(range, index) in ltvToCacRanges" :key="index">
        <td>{{ range.rangeName }}</td>
        <td class="text-right">{{ formatRange(range.min, range.max) }}</td>
        <td class="text-right">{{ formatImpact(range.impactPercentage) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref } from 'vue';
import kpiData from '@/utils/kpiInterpretation/kpiData';

const ltvToCacRanges = kpiData.calc_ltv_to_cac;




function formatRange(min, max) {
  if (max === Infinity || max === 100) {
    return `> ${min}`;
  }
  if (min === Infinity || min === -100) {
    return `< ${max}`;
  }
  return `${min} - ${max}`;
}

function formatImpact(impact) {
  return `${(impact * 100).toFixed(0)}%`;
}
</script>
