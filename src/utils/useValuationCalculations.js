
import { computed } from 'vue'

export function useValuationCalculations(valuationData, analysed_kpis, latestYear) {
  const futureGrowthRate = computed(() => {
    if (analysed_kpis.calc_yoy_revenue_growth && analysed_kpis.calc_cagr_revenue) {
      return (analysed_kpis.calc_yoy_revenue_growth.value + analysed_kpis.calc_cagr_revenue.value) / 2;
    }
    return null;
  });

  const total_arr_multiple_impact = computed(() => {
    // Safely check if the values exist before multiplying
    const growthImpact = analysed_kpis.calc_growth_combined?.analysisResult?.impactPercentage ?? 1;
    const marginImpact = analysed_kpis.calc_gross_margin?.analysisResult?.impactPercentage ?? 1;
    const recurringImpact = analysed_kpis.calc_recurring_revenue_ratio?.analysisResult?.impactPercentage ?? 1;
    const ltvToCacImpact = analysed_kpis.calc_ltv_to_cac?.analysisResult?.impactPercentage ?? 1;

    return growthImpact * marginImpact * recurringImpact * ltvToCacImpact;
  });

  const final_arr_multiple = computed(() => {
    if (valuationData.base_arr_multiple && total_arr_multiple_impact.value) {
      return (valuationData.base_arr_multiple * total_arr_multiple_impact.value).toFixed(2);
    }
    return null;
  });

  const companyWorth = computed(() => {
    const arr = valuationData.valuation_financials?.[latestYear.value]?.recurring_revenue ?? 0;
    return final_arr_multiple.value ? arr * final_arr_multiple.value : null;
  });

  return {
    futureGrowthRate,
    total_arr_multiple_impact,
    final_arr_multiple,
    companyWorth
  }
}
