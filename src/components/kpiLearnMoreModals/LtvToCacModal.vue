
<template>
  <p class="mb-4">
    The Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC) Ratio measures the relationship between the lifetime value of a customer and the cost of acquiring that customer. 
  </p>

  <p class="mb-4">
    The LTV-to-CAC ratio is calculated by dividing your LTV by CAC.
  </p>

  <p class="mb-4">
    We get your customer acquisition costs from the data you provide to us. 
  </p>

  <p class="mb-4">
    Calculating the Customer Lifetime Value is a little more difficult: 
  </p>

  <v-card class="mb-6">
    <v-list density="compact">
      <v-list-item 
        v-for="(item, i) in includeItems" 
        :key="i"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-check"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
  
  <p class="mb-4">
    If the services have to be delivered by you as the founder or by other key personnel (such as consulting services, one-off software development or similar) the investor will see these activities as a distraction from the main business that are probably hard to scale and likely reduce the multiple they are willing to pay.  
  </p>

  <p class="mb-4">
    If on the other hand the services rendered to incur the non-recurring revenue are of repeatable nature that can be taught to members of the customer success team (such as one-time onboarding fees, one-time services rendered) investors might have less of a problem with it. Be sure to explain / mark the repeatable and scalable nature of such one-off revenue. 
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

const includeItems = ref([
  { text: 'Count each unique customer organization once' },
  { text: 'Include all subscription tiers' },
  { text: 'Only count active, paying customers' }
]);

const excludeItems = ref([
  { text: 'Free trial users' },
  { text: 'Cancelled/churned customers' },
  { text: 'Internal test accounts' }
]);

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
