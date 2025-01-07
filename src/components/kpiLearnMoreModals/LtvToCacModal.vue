<template>
  <p>
    Every investor will consider growth into the valuation of your SaaS business. 
   <br><br>
  
    This is because the faster a company grows the bigger its revenue and its subsequent profit will be in the future. 
  <br><br>
  
    Imagine two businesses that are both earning $1 Mio. in revenue with a 20% EBITDA-Margin (i.e. returning $200k in profit). Business (a) grows at 5% Year-over-Year. Business (b) at 30% Year-over-Year. If the growth rate and EBITDA-Margin stay the same, business (a) will do about $1.28Mio in Revenue with $256k in profit and business (b) will do about $3.7Mio in Revenue with $740k in profit. Because of this difference, investors will be willing to pay a much higher multiple for business (b) compared to business (a). 
  <br><br>
  
  <b>There are two main KPIs that investors uses to estimate your future growth:</b> 
  <br><br>

    <b>Year-over-Year Growth Rate </b><br>
    Calculating your current Growth Rate by comparing your current revenue to last year's revenue is one of the first things every investor will do. This is why it is so important that you can show good current growth. 
    <br><br>
    
  <b>Compounded Annual Growth Rate (CAGR) </b><br>
  If your business has been around for a while (> 3 years) an investor will calculate your CAGR to see your average growth rate per year. 
  <br><br>
  
  If you have some trick up your sleeve that will lead to much higher future growth rates, you can make a case for this. Be prepared that investors will ask you to pull that trick out yet (as in show that delivers the promised growth) before they evaluate your business based on that predicted growth. 
  <br><br>
  
  Our valuation formular works well for growth companies. If you are experiencing negative growth (i.e. shinkage), you will be categorized as a company in distress and be moved to the bargain bin.  
  <br><br>
  
  <b>We use following Grwoth Ranges with their respective impact on the multiple in our SaaS valuation formula:</b><br>
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