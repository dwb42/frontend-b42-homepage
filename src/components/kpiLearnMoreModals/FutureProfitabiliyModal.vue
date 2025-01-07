<template>
  <p>
  In order to assess if you are a “true” SaaS business, investors will want to know how much of your annual revenue is recurring revenue. 
  <br><br>
  
  A recurring revenue ratio of 80 to 90% is deemed the norm for SaaS businesses. 
  <br><br>
  
  If you score above 90% investors might be willing to pay a premium. 
  <br><br>
  
  If you score below 80% (i.e. more than 20% of your revenue is non-recurring), investors will want to know what parts of your product or service are non-recurring. 
  <br><br>
  
  If the services have to be delivered by you as the founder or by other key personnel (such as consulting services, one-off software development or similar) the investor will see these activities as a distraction from the main business that are probably hard to scale and likely reduce the multiple they are willing to pay. 
  <br><br>
  
  If on the other hand the services rendered to incur the non-recurring revenue are of repeatable nature that can be taught to members of the customer success team (such as one-time onboarding fees, one-time services rendered) investors might have less of a problem with it. Be sure to explain / mark the repeatable and scalable nature of such one-off revenue. 
  <br><br>
  
  For our formula we assume that the non-recurring revenue is seen as a detractor to the valuation. We also assume that a business with an ARR ratio of less than 50% is not really a SaaS business and hence falls outside our valuation envelope. 
  <br><br>
  
  <b>We use following ARR Ratio Ranges with their respective impact on the Success Factor in our SaaS valuation formula:</b><br><br>
  </p>
  
  <v-table>
  <thead>
    <tr>
      <th class="text-left">Gross Margin</th>
      <th class="text-right">Range</th>
      <th class="text-right">Impact on Multiple</th>
    </tr>
  </thead>
    <tbody>
      <tr v-for="(range, index) in grossMarginRanges" :key="index">
        <td>{{ range.rangeName }}</td>
        <td class="text-right">{{ formatRange(range.min, range.max) }}</td>
        <td class="text-right">{{ formatImpact(range.impactPercentage) }}</td>
      </tr>
    </tbody>
  </v-table>


  <v-table>
  <thead>
    <tr>
      <th class="text-left">EBITDA Margin</th>
      <th class="text-right">Range</th>
      <th class="text-right">Impact on Multiple</th>
    </tr>
  </thead>
    <tbody>
      <tr v-for="(range, index) in ebitdaMarginRanges" :key="index">
        <td>{{ range.rangeName }}</td>
        <td class="text-right">{{ formatRange(range.min, range.max) }}</td>
        <td class="text-right">{{ formatImpact(range.impactPercentage) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import kpiData from '@/utils/kpiInterpretation/kpiData';

const grossMarginRanges = kpiData.calc_gross_margin;
const ebitdaMarginRanges = kpiData.calc_ebitda_margin;

function formatRange(min, max) {
  if (max === Infinity || max === 100) {
    return `> ${min * 100}%`;
  }
  if (min === Infinity || min === -100) {
    return `< ${max * 100}%`;
  }
  return `${min * 100}% - ${max * 100}%`;
}

function formatImpact(impact) {
  return `${(impact * 100).toFixed(0)}%`;
}
</script>