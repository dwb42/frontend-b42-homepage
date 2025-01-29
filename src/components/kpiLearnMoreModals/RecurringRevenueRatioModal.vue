<template>
  <p class="mb-4">
    In order to assess if you are a “true” SaaS business, investors will want to know how much of your annual revenue is recurring revenue. 
</p>
    
  <p class="mb-4">
    A recurring revenue ratio of 80 to 90% is deemed the norm for SaaS businesses.
  </p>

  <p class="mb-4">
    If you score above 90% investors might be willing to pay a premium. 
  </p>

  <p class="mb-4">
    If you score below 80% (i.e. more than 20% of your revenue is non-recurring), investors will want to know what parts of your product or service are non-recurring. 
  </p>

  <p class="mb-4">
    If the services have to be delivered by you as the founder or by other key personnel (such as consulting services, one-off software development or similar) the investor will see these activities as a distraction from the main business, which are probably hard to scale and likely reduce the multiple they are willing to pay.  
  </p>

  <p class="mb-4">
    If on the other hand the services rendered to incur the non-recurring revenue are of repeatable nature that can be taught to members of the customer success team (such as one-time onboarding fees or one-time services rendered) investors might have less of a problem with it. Be sure to explain / mark the repeatable and scalable nature of such one-off revenue. 
  </p>

  <p class="mb-4">
    For our formula we assume that the non-recurring revenue is seen as a detractor to the valuation. We also assume that a business with an ARR ratio of less than 50% is not really a SaaS business and hence falls outside our valuation envelope. 
  </p>

  <p class="mb-4 font-weight-bold">
    We use the following Recurring Revenue ratio ranges with their respective impact on the Success Factor in our SaaS valuation formula:
  </p>
      
      <v-table>
      <thead>
        <tr>
          <th class="text-left">Recurring Revenue Ratio</th>
          <th class="text-right">Range</th>
          <th class="text-right">Multiple Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(range, index) in recurringRevenueRanges" :key="index">
          <td>{{ range.rangeName }}</td>
          <td class="text-right">{{ formatRange(range.min, range.max) }}</td>
          <td class="text-right">{{ formatImpact(range.impactPercentage) }}</td>
        </tr>
      </tbody>
      </v-table>
</template>

<script setup>
import kpiData from '@/utils/kpiInterpretation/kpiData';

const recurringRevenueRanges = kpiData.calc_recurring_revenue_ratio;

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