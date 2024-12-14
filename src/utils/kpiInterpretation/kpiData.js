const kpiData = {
  "calc_recurring_revenue_ratio": [
    {
      "min": 0,
      "max": 0.5,
      "rangeName": "Very Low",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 0.50,
      "evaluationDescription": "Low proportion of recurring revenue."
    },
    {
      "min": 0.5,
      "max": 0.6,
      "rangeName": "Low",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 0.65,
      "evaluationDescription": "Average proportion of recurring revenue."
    },
    {
      "min": 0.6,
      "max": 0.75,
      "rangeName": "2/3 Recurring",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 0.90,
      "evaluationDescription": "High proportion of recurring revenue."
    },
    {
      "min": 0.75,
      "max": 0.9,
      "rangeName": "SaaS Norm",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "High proportion of recurring revenue."
    },
    {
      "min": 0.9,
      "max": Infinity,
      "rangeName": "Fully Recurring",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 1.25,
      "evaluationDescription": "High proportion of recurring revenue."
    }
  ],
  "calc_yoy_revenue_growth": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.90,
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.5,
      "rangeName": "Moderate Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.20,
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ],
  "calc_gross_margin": [
    {
      "min": 0,
      "max": 0.6,
      "rangeName": "Is This Even SaaS?",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 0.50,
      "evaluationDescription": "Gross margin below 60% questions the SaaS nature of the business."
    },
    {
      "min": 0.6,
      "max": 0.7,
      "rangeName": "Less Efficient SaaS",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 0.80,
      "evaluationDescription": "Gross margin between 60% and 70% indicates less efficient SaaS operations."
    },
    {
      "min": 0.7,
      "max": 0.8,
      "rangeName": "Looks Like SaaS",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "Gross margin between 70% and 80% is typical for SaaS businesses."
    },
    {
      "min": 0.8,
      "max": 0.9,
      "rangeName": "Super Healthy SaaS",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.20,
      "evaluationDescription": "Gross margin between 80% and 90% indicates a super healthy SaaS business."
    },
    {
      "min": 0.9,
      "max": 1,
      "rangeName": "Amazing Gross Margin",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.40,
      "evaluationDescription": "Gross margin above 90% is considered amazing in SaaS."
    }
  ],
  "calc_ebitda_margin": [
    {
      "min": 0,
      "max": 0.1,
      "rangeName": "Barely Profitable",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 0.65,
      "evaluationDescription": "EBITDA margin between 0% and 10% indicates minimal profitability."
    },
    {
      "min": 0.1,
      "max": 0.2,
      "rangeName": "Somewhat Profitable",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 0.80,
      "evaluationDescription": "EBITDA margin between 10% and 20% shows some profitability."
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "SaaS-Like Profitable",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "EBITDA margin between 20% and 30% is standard for SaaS."
    },
    {
      "min": 0.3,
      "max": 0.4,
      "rangeName": "Very Profitable",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.20,
      "evaluationDescription": "EBITDA margin between 30% and 40% indicates strong profitability."
    },
    {
      "min": 0.4,
      "max": Infinity,
      "rangeName": "Amazingly Profitable",
      "multipleVectorName": "Profitability Factor",
      "impactPercentage": 1.40,
      "evaluationDescription": "EBITDA margin above 40% is considered amazing."
    }
  ],
  "calc_ltv_to_cac": [
    {
      "min": 0,
      "max": 1,
      "rangeName": "Unsustainable",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 0.50,
      "evaluationDescription": "LTV to CAC ratio less than 1 indicates unsustainable acquisition costs."
    },
    {
      "min": 1,
      "max": 3,
      "rangeName": "Needs Improvement",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 0.75,
      "evaluationDescription": "LTV to CAC ratio between 1 and 3 needs improvement."
    },
    {
      "min": 3,
      "max": 5,
      "rangeName": "Good",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "LTV to CAC ratio between 3 and 5 is good."
    },
    {
      "min": 5,
      "max": Infinity,
      "rangeName": "Excellent",
      "multipleVectorName": "Success Factor",
      "impactPercentage": 1.25,
      "evaluationDescription": "LTV to CAC ratio greater than 5 is excellent."
    }
  ],
  "calc_cagr_revenue": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.90,
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "Moderate Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.3,
      "max": 0.5,
      "rangeName": "Strong Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.30,
      "evaluationDescription": "Strong revenue growth in reported period."
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.20,
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ],
  "calc_growth_general": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 0.90,
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "Moderate Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.00,
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.3,
      "max": 0.5,
      "rangeName": "Strong Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.30,
      "evaluationDescription": "Strong revenue growth in reported period."
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "multipleVectorName": "Growth Factor",
      "impactPercentage": 1.20,
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ]
};

export default kpiData;