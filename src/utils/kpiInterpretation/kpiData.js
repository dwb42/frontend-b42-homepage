
const kpiData = {
  "calc_recurring_revenue_ratio": [
    {
      "min": 0,
      "max": 0.5,
      "rangeName": "Very Low",
      "impactPercentage": 0.50,
      "evaluationDescription": "is such a low Ratio that it will cause serious doubts in an investor that you are actually running a SaaS business. You beter have a good explanation for it. For valuation purposes we will half your multiple"
    },
    {
      "min": 0.5,
      "max": 0.6,
      "rangeName": "Low",
      "impactPercentage": 0.65,
      "evaluationDescription": "a very low value for a SaaS business and will lead to a reduction in your multiple by 35%"
    },
    {
      "min": 0.6,
      "max": 0.75,
      "rangeName": "2/3 Recurring",
      "impactPercentage": 0.90,
      "evaluationDescription": "slightly below what is expected of a typical SaaS business and will reduce your multiple by 10%"
    },
    {
      "min": 0.75,
      "max": 0.9,
      "rangeName": "SaaS Norm",
      "impactPercentage": 1.00,
      "evaluationDescription": "considered to be the norm for a SaaS business and hence does not affect your multiple"
    },
    {
      "min": 0.9,
      "max": Infinity,
      "rangeName": "Fully Recurring",
      "impactPercentage": 1.15,
      "evaluationDescription": "is an excellent value and will improve your multiple by 15%"
    }
  ],
  "calc_yoy_revenue_growth": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "impactPercentage": 0.90,
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.5,
      "rangeName": "Moderate Growth",
      "impactPercentage": 1.00,
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "impactPercentage": 1.20,
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ],
  "calc_gross_margin": [
    {
      "min": -100,
      "max": 0.6,
      "rangeName": "Is This Even SaaS?",
      "impactPercentage": 0.50,
      "evaluationDescription": "Gross margin below 60% questions the SaaS nature of the business."
    },
    {
      "min": 0.6,
      "max": 0.7,
      "rangeName": "Less Efficient SaaS",
      "impactPercentage": 0.80,
      "evaluationDescription": "is a sign of an inefficient SaaS business and will reduce your multiple by 20%"
    },
    {
      "min": 0.7,
      "max": 0.8,
      "rangeName": "Looks Like SaaS",
      "impactPercentage": 1.00,
      "evaluationDescription": "is in the typical range for SaaS businesses and has no impact on the multiple"
    },
    {
      "min": 0.8,
      "max": 0.9,
      "rangeName": "Super Healthy SaaS",
      "impactPercentage": 1.20,
      "evaluationDescription": "Gross margin between 80% and 90% indicates a super healthy SaaS business."
    },
    {
      "min": 0.9,
      "max": 1,
      "rangeName": "Amazing Gross Margin",
      "impactPercentage": 1.40,
      "evaluationDescription": "Gross margin above 90% is considered amazing in SaaS."
    }
  ],
  "calc_ebitda_margin": [
    {
      "min": 0,
      "max": 0.1,
      "rangeName": "Barely Profitable",
      "impactPercentage": 0.65,
      "evaluationDescription": "EBITDA margin between 0% and 10% indicates minimal profitability."
    },
    {
      "min": 0.1,
      "max": 0.2,
      "rangeName": "Somewhat Profitable",
      "impactPercentage": 0.80,
      "evaluationDescription": "EBITDA margin between 10% and 20% shows some profitability."
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "SaaS-Like Profitable",
      "impactPercentage": 1.00,
      "evaluationDescription": "EBITDA margin between 20% and 30% is standard for SaaS."
    },
    {
      "min": 0.3,
      "max": 0.4,
      "rangeName": "Very Profitable",
      "impactPercentage": 1.20,
      "evaluationDescription": "EBITDA margin between 30% and 40% indicates strong profitability."
    },
    {
      "min": 0.4,
      "max": Infinity,
      "rangeName": "Amazingly Profitable",
      "impactPercentage": 1.40,
      "evaluationDescription": "considered amazing and increases your multiple by 40%"
    }
  ],
  "calc_ltv_to_cac": [
    {
      "min": 0,
      "max": 1,
      "rangeName": "Unsustainable",
      "impactPercentage": 0.75,
      "evaluationDescription": "LTV to CAC ratio less than 1 indicates unsustainable acquisition costs."
    },
    {
      "min": 1,
      "max": 2,
      "rangeName": "Needs Improvement",
      "impactPercentage": 0.85,
      "evaluationDescription": "LTV to CAC ratio between 1 and 3 needs improvement."
    },
    {
      "min": 2,
      "max": 4,
      "rangeName": "SaaS Norm",
      "impactPercentage": 1.00,
      "evaluationDescription": "in the range of one expects a SaaS business' LTV-to-CAC ratio to be in and hence has no impact on the multiple"
    },
    {
      "min": 4,
      "max": 6,
      "rangeName": "Good",
      "impactPercentage": 1.10,
      "evaluationDescription": "a better than expected LTV-to-CAC ratio and will improve your multiple by 10%"
    },
    {
      "min": 6,
      "max": Infinity,
      "rangeName": "Excellent",
      "impactPercentage": 1.2,
      "evaluationDescription": "a much better than expected LTV-to-CAC ratio and will improve your multiple by 20%"
    }
  ],
  "calc_cagr_revenue": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.2,
      "rangeName": "Low Growth",
      "impactPercentage": 0.90,
      "evaluationDescription": "Low year-over-year revenue growth."
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "Moderate Growth",
      "impactPercentage": 1.00,
      "evaluationDescription": "Moderate year-over-year revenue growth."
    },
    {
      "min": 0.3,
      "max": 0.5,
      "rangeName": "Strong Growth",
      "impactPercentage": 1.30,
      "evaluationDescription": "Strong revenue growth in reported period."
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "impactPercentage": 1.20,
      "evaluationDescription": "High year-over-year revenue growth."
    }
  ],
  "calc_growth_general": [
    {
      "min": -100,
      "max": 0,
      "rangeName": "Negative Growth",
      "impactPercentage": 0.70,
      "evaluationDescription": "Negative year-over-year revenue growth."
    },
    {
      "min": 0,
      "max": 0.1,
      "rangeName": "Slow Growth",
      "impactPercentage": 0.90,
      "evaluationDescription": "is slow growth and will decrease your mutiple by 10%"
    },
    {
      "min": 0.1,
      "max": 0.2,
      "rangeName": "Low Growth",
      "impactPercentage": 0.90,
      "evaluationDescription": "is low growth and has no effect on your multiple"
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "Good Growth",
      "impactPercentage": 1.10,
      "evaluationDescription": "is good and will improve your mutiple by 10%"
    },
    {
      "min": 0.3,
      "max": 0.5,
      "rangeName": "Strong Growth",
      "impactPercentage": 1.25,
      "evaluationDescription": "strong and will improve your multiple by 25%"
    },
    {
      "min": 0.5,
      "max": 100,
      "rangeName": "High Growth",
      "impactPercentage": 1.40,
      "evaluationDescription": "excellent and will improve your multiple by 40%"
    }, 
  ],
    "final_multiple": [
      {
        "min": 0,
        "max": 0.5,
        "rangeName": "Really bad performance",
        "impactPercentage": 0.70,
        "evaluationDescription": "means that based on your performance data you are performing a lot worse than a typical SaaS business and that investors will drastically reduce your valuation because of it."
      },
      {
        "min": 0.5,
        "max": 0.7,
        "rangeName": "A lot worse than typical SaaS",
        "impactPercentage": 0.90,
        "evaluationDescription": "means that based on your performance data you are performing a lot worse than a typical SaaS business."
      },
      {
        "min": 0.7,
        "max": 0.9,
        "rangeName": "Slightly worse than typical SaaS",
        "impactPercentage": 0.90,
        "evaluationDescription": "means that based on your performance data you are performing slightly worse than a typical SaaS business."
      },
      {
        "min": 0.9,
        "max": 1.1,
        "rangeName": "SaaS typical",
        "impactPercentage": 1.10,
        "evaluationDescription": "shows that your business performing at a level an investor expects a SaaS business to perform at."
      },
      {
        "min": 1.1,
        "max": 1.3,
        "rangeName": "Better than typcial SaaS ",
        "impactPercentage": 1.25,
        "evaluationDescription": "shows that your business performing at a level slightly better than an investor expects a SaaS business to perform at."
      },
      {
        "min": 1.3,
        "max": 1.5,
        "rangeName": "A lot better than typical SaaS ",
        "impactPercentage": 1.40,
        "evaluationDescription": "shows that your business performing at a level a lot better than an investor expects a SaaS business to perform at."
      }
    ,
    {
      "min": 1.5,
      "max": 3.8,
      "rangeName": "Outshining SaaS ",
      "impactPercentage": 1.40,
      "evaluationDescription": "is a great result and shows that you are outshining your SaaS competition. You can be proud of your achievement and approach investors with confidence."
    }
  ]
};

export default kpiData;
