<template>
  <p class="mb-4">
    Since the valuation of a business is, in essence, the net present value of future cash flows (i.e., future profit flowing back to the investor), a business’ ability to generate a profit is essential to its valuation.
  </p>

  <h2 class="text-body-1 mb-2"><b>“Gross Margin” vs. “EBITDA Margin”</b></h2>

  <p class="mb-4">
    The two main KPIs to get a sense of a business’ profitability are “Gross Margin” and “EBITDA Margin.” Depending on the stage the business finds itself in, one or both of these metrics will be analyzed.
  </p>

  <p class="mb-4">
    If the business is at an early pre-profit stage, where fixed operating costs are not fully covered yet by the operating margin and/or the business is investing heavily into growth and/or product, an investor will focus mostly on the Gross Margin to get a sense of the overall viability of the underlying business model and unit economics.
  </p>

  <p class="mb-4">
    If the business is at a later stage, where it is generating a profit and balancing out growth- vs. profit-considerations, analyzing the EBITDA Margin will give insights into the overall operating efficiency of the business.
  </p>

  <h2 class="text-body-1 mb-2"><b>Implications for the valuation formula</b></h2>

  <p class="mb-4">
    When we value a business based on an ARR-Multiple, we will use Gross Margin to get a sense of its unit economics and future profit potential but disregard the EBITDA Margin, i.e., not let its value influence the valuation.
  </p>

  <p class="mb-4">
    When we value a business based on EBITDA Multiple, we will regard both the Gross Margin as well as the EBITDA Margin for the calculation of our Profitability Factor.
  </p>

  <h2 class="text-body-1 mb-2"><b>How Gross Margin impacts the Profitability Factor</b></h2>

  <p class="mb-4">
    The Gross Margin represents the percentage of revenue remaining after deducting the direct costs associated with delivering the product or service, such as hosting and customer support expenses in a SaaS-business model.
  </p>

  <p class="mb-4">
    If you have, for example, an 80% Gross Margin, $0.80 of every dollar in revenue can be used to (a) pay for all other costs your business incurs (product, sales & marketing, your salary, office, etc.) and (b) to generate profit.
  </p>

  <p class="mb-4">
    Investors will assume that a business with high Gross Margins will be able to scale to profitability more easily and has greater potential for future profit generation.
  </p>

  <p class="mb-4">
    Companies operating a SaaS-business model are expected to have high Gross Margins of around 80%. This is due to the fact that a typical SaaS business will incur very little cost in delivering its service to an additional customer.
  </p>

  <p class="mb-4">
    If your method of product delivery is so lean that your Gross Margin is even higher than 80%, investors might be inclined to pay a premium on your valuation multiple.
  </p>

  <p class="mb-4">
    If your service, on the other hand, includes a lot of costly manual labor and/or you are competing in a price-sensitive environment and have a Gross Margin of less than 70%, investors might question whether you are operating a “true” SaaS business and will hence decrease the multiple they are willing to pay.
  </p>

  <p class="mb-4"><b> We use the following Gross Margin Ranges with their respective impact on the Growth Factor in our SaaS valuation formula:</b>
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

  <h2 class="text-body-1 mb-2"><b>How EBITDA Margin impacts the Profitability Factor</b></h2>

  <p class="mb-4">
    The EBITDA Margin measures a company’s return before non-operating expenditures. It is a good measure to evaluate the overall operating efficiency of a company.
  </p>

  <p class="mb-4">
    If your SaaS business is in its early stage and does not generate a profit yet, the EBITDA Margin has little meaning.
  </p>

  <p class="mb-4">
    If you are running a later-stage SaaS company that is balancing growth with profitability, an investor will analyze your EBITDA Margin to get a sense of your business’ efficiency.
  </p>

  <p class="mb-4">
    Hence, we include the EBITDA Margin in our SaaS Valuation formula only when we value a business based on EBITDA Multiple.
  </p>

  <p class="mb-4">
    It is important to note that the EBITDA Margin does not serve as an indicator of current profitability but of efficiency, which is an indicator of future profitability, and that investors will pay a premium for businesses that are more efficient.
  </p>

  <p class="mb-4">
    For a mature SaaS business, an EBITDA Margin of about 30% might be considered as the norm.
  </p>

  <p class="mb-4">If, for example, two businesses both have a €1 Mio EBITDA and one has an EBITDA Margin of 40% and the other only 10%, the business with the 40% Margin might be valued at a premium, whereas the business with the 10% Margin might be valued at a discount.
  </p>

  <p class="mb-4"><b> We use the following EBITDA Margin Ranges with their respective impact on the Growth Factor in our SaaS valuation formula:</b>
  </p>

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