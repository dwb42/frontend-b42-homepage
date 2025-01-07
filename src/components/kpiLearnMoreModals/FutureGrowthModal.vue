
<template>
  <p class="mb-4">
      Every investor will consider growth in the valuation of your SaaS business.
  </p>
  <p class="mb-4">
      This is because the faster a company grows, the bigger its revenue and its subsequent profit will be in the future.
  </p>
  <p class="mb-4">
      Imagine two businesses that are both earning $1M in revenue with a 20% EBITDA margin, where one grows at 5% and the other at 30%. After 5 yeards the high growth business will generate 3x the revenue and profit as the low growth business. Because of this, investors will be willing to pay a much higher multiple for faster growth companies.
  </p>

  <v-table class="mb-4">
    <thead>
      <tr>
        <th class="text-left">Business</th>
        <th class="text-left">Revenue Now</th>
        <th class="text-left">Profit Now</th>
        <th class="text-center">...</th>
        <th class="text-right">Revenue +5yrs</th>
        <th class="text-right">Profit  +5yrs</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>5% Growth</b><br>20% Margin</td>
        <td class="text-left">$1M</td>
        <td class="text-left">200k</td>
        <td class="text-center">...</td>
        <td class="text-right">$1.28M</td>
        <td class="text-right">$256k</td>
      </tr>
      <tr>
        <td><b>30% Growth</b><br>20% Margin</td>
        <td class="text-left">$1M</td>
        <td class="text-left">200k</td>
        <td class="text-center">...</td>
        <td class="text-right">$3.7M</td>
        <td class="text-right">$740k</td>
      </tr>
    </tbody>
  </v-table>

  <p class="mb-4 mt-6">
      <b>There are two main KPIs that investors use to estimate your future growth:</b>
  </p>
  <p class="mb-4">
      <b>Year-over-Year Growth Rate </b><br>
      Calculating your current growth rate by comparing your current revenue to last year's revenue is one of the first things every investor will do. This is why it is so important to show strong current growth.
  </p>
  <p class="mb-4">
      <b>Compounded Annual Growth Rate (CAGR) </b><br>
      If your business has been around for a while (> 3 years), an investor will calculate your CAGR to determine your average growth rate per year.
  </p>
  <p class="mb-4">
      If you have a strategy or innovation that will lead to significantly higher future growth rates, you can make a case for it. Be prepared, though, as investors will likely ask you to demonstrate that growth (i.e., show that it delivers the promised results) before they evaluate your business based on that predicted growth.
  </p>
  <p class="mb-4">
      Our valuation formula works well for growth companies. However, if you are experiencing negative growth (i.e., shrinkage), you will be categorized as a company in distress and may be moved to the bargain bin.
  </p>
  <p class="mb-4">
      <b>We use the following Growth Rate Ranges with their respective impact on the multiple in our SaaS valuation formula:</b>
  </p>

  
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Future Growth</th>
        <th class="text-right">Range</th>
        <th class="text-right">Multiple Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(range, index) in growthRanges" :key="index">
        <td>{{ range.rangeName }}</td>
        <td class="text-right">{{ formatRange(range.min, range.max) }}</td>
        <td class="text-right">{{ formatImpact(range.impactPercentage) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import kpiData from '@/utils/kpiInterpretation/kpiData';

const growthRanges = kpiData.calc_growth_general;

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
