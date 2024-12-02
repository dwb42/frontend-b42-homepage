const kpiData = {
  "calc_recurring_revenue_ratio": [
    {
      "min": 0,
      "max": 0.5,
      "rangeName": "Very Low",
      "multipleVectorName": "success_factor",
      "impactPercentage": "0.5",
      "evaluationDescription": "Low proportion of recurring revenue."
    },
    {
      "min": 0.5,
      "max": 0.6,
      "rangeName": "Low",
      "multipleVectorName": "success_factor",
      "impactPercentage": "0.65",
      "evaluationDescription": "Average proportion of recurring revenue."
    },
    {
      "min": 0.6,
      "max": 0.75,
      "rangeName": "2/3 recurring",
      "multipleVectorName": "success_factor",
      "impactPercentage": "0.9",
      "evaluationDescription": "High proportion of recurring revenue."
    },
    {
      "min": 0.75,
      "max": 0.9,
      "rangeName": "SaaS Norm",
      "multipleVectorName": "success_factor",
      "impactPercentage": "1",
      "evaluationDescription": "High proportion of recurring revenue."
    },
    {
      "min": 0.9,
      "rangeName": "Fully Recurring",
      "multipleVectorName": "success_factor",
      "impactPercentage": "1.25",
      "evaluationDescription": "High proportion of recurring revenue."
    }
  ],
  
  "calc_yoy_revenue_growth": [
    {
      "min": -Infinity,
      "max": 0,
      "rangeName": "Negative Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": "70%",
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": "90%",
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.5,
      "rangeName": "Moderate Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": "100%",
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.5,
      "rangeName": "High Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": "120%",
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ],
  // ... Include similar entries for other KPIs ...
};

export default kpiData;