
const kpiData = {
  "calc_recurring_revenue_ratio": [
    {
      "min": 0,
      "max": 0.5,
      "rangeName": "not a SaaS business",
      "impactPercentage": 0.10,
      "evaluationDescription": "such a low Ratio that it will cause serious doubts in an investor that you are actually running a SaaS business. You better have a good explanation for it. For valuation purposes we will slash your multiple by the factor of 10"
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
      "rangeName": "Slightly below SaaS Norm",
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
      "impactPercentage": 1.1,
      "evaluationDescription": "an excellent value and will improve your multiple by 10%"
    }
  ],
  //deprecated since for the evaluation the combined growth is used
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
      "evaluationDescription": "Gross margin above 90% is considered amazing in SaaS and will increase your multiple by 40%"
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
  //LTV-to-CAC
  "calc_ltv_to_cac": [
    {
      "min": 0,
      "max": 1,
      "rangeName": "unsustainable - loosing money",
      "impactPercentage": 0.4,
      "evaluationDescription": "terrible, because you are paying more to win a customer than the customer is worth to you. Investors might reduce your multiple by 50%"
    },
    {
      "min": 1,
      "max": 1.4,
      "rangeName": "bad",
      "impactPercentage": 0.7,
      "evaluationDescription": "bad, because you are paying at least 70% of a customer's lifetime value for his acquisition. Investors might reduce your multiple by 30%"
    },
    {
      "min": 1.4,
      "max": 2,
      "rangeName": "pretty bad",
      "impactPercentage": 0.7,
      "evaluationDescription": "pretty bad, because you are paying at least 50% of a customer's lifetime value for his acquisition. Investors might reduce your multiple by 20%"
    },
    {
      "min": 2,
      "max": 2.5,
      "rangeName": "needs improvement",
      "impactPercentage": 0.90,
      "evaluationDescription": "close to the SaaS norm LTV-to-CAC ratio of around 3. Hence it is below it thought, investors might reduce your multiple by 10%"
    },
    {
      "min": 2.5,
      "max": 4,
      "rangeName": "SaaS Norm",
      "impactPercentage": 1.00,
      "evaluationDescription": "in the range of what one expects a SaaS business' LTV-to-CAC ratio to be in (i.e. a LTV-to-CAC ratio of around 3) and hence has no impact on the multiple"
    },
    {
      "min": 4,
      "max": 6,
      "rangeName": "Above SaaS Norm",
      "impactPercentage": 1.10,
      "evaluationDescription": "a better than expected LTV-to-CAC ratio. Investors will wonder if you can invest somewhat more aggressively in customer acquisition. Since that is seen as an upside they might increase your multiple by 10%"
    },
    {
      "min": 6,
      "max": Infinity,
      "rangeName": "Way above SaaS Norm",
      "impactPercentage": 1.2,
      "evaluationDescription": "a much larger than expected LTV-to-CAC ratio. Investors will wonder if you can invest more aggressively in customer acquisition (or if there is a reason that prevents you from doing so). If there is no market cap, they will see this as an upside they might increase your multiple by 20%"
    }
  ],
  //CAGR deprec
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
  //Growth Combined 
  "calc_growth_general": [
    {
      "min": -100,
      "max": -0.1,
      "rangeName": "Strong Negative Growth",
      "impactPercentage": 0.50,
      "evaluationDescription": "strong negative year-over-year revenue growth. Our valuation model does not really apply to such a restructuring case. To place some value on this we will decrease your multiple by 50%"
    },
    {
      "min": -0.1,
      "max": 0,
      "rangeName": "Slight Negative Growth",
      "impactPercentage": 0.70,
      "evaluationDescription": "slight negative year-over-year revenue growth and will decrease your multiple by 30%"
    },
    {
      "min": 0,
      "max": 0.1,
      "rangeName": "Slow Growth",
      "impactPercentage": 0.90,
      "evaluationDescription": "slow growth and will decrease your mutiple by 10%"
    },
    {
      "min": 0.1,
      "max": 0.2,
      "rangeName": "Steady Growth",
      "impactPercentage": 1,
      "evaluationDescription": "steady growth and has no effect on your multiple"
    },
    {
      "min": 0.2,
      "max": 0.3,
      "rangeName": "Good Growth",
      "impactPercentage": 1.10,
      "evaluationDescription": "is good growth and will improve your mutiple by 10%"
    },
    {
      "min": 0.3,
      "max": 0.5,
      "rangeName": "Strong Growth",
      "impactPercentage": 1.25,
      "evaluationDescription": "strong growth and will improve your multiple by 25%"
    },
    {
      "min": 0.5,
      "max": 0.8,
      "rangeName": "Super Strong Growth",
      "impactPercentage": 1.5,
      "evaluationDescription": "super strong growth and will improve your multiple by 50%"
    },
    {
      "min": 0.8,
      "max": 100,
      "rangeName": "Hyper Growth",
      "impactPercentage": 1.8,
      "evaluationDescription": "hyper growth and will improve your multiple by 80%"
    }, 
  ],
  //final multiple
  "final_multiple": [
    {
      "min": 0,
      "max": 0.5,
      "rangeName": "Really bad performance",
      "evaluationDescription": "means that based on your performance data you are performing a lot worse than a typical SaaS business and that investors will cut your valuation at least in half because of it. You should look into ways to improve on your shortcomings to improve your odds on getting a good valuation"
    },
    {
      "min": 0.5,
      "max": 0.7,
      "rangeName": "A lot worse than typical SaaS",
      "evaluationDescription": "means that based on your performance data you are performing a lot worse than a typical SaaS business and that investors will reduce your valuation a lot because of it. You should look into ways to improve on your shortcomings to improve your odds on getting a good valuation"
    },
    {
      "min": 0.7,
      "max": 0.9,
      "rangeName": "Slightly worse than typical SaaS",
      "evaluationDescription": "means that based on your performance data you are performing a somewhat worse than a typical SaaS business. You should review the areas with a multiple impact of less than 1 (i.e. areas where you are underperforming) to see if you can improve those"
    },
    {
      "min": 0.9,
      "max": 1.1,
      "rangeName": "SaaS typical",
      "evaluationDescription": "shows that your business is performing at a level an investor expects a SaaS business to perform at. This means that you should be valued at about the current market base multiple"
    },
    {
      "min": 1.1,
      "max": 1.3,
      "rangeName": "Better than typcial SaaS ",
      "evaluationDescription": "shows that your business is performing at a level slightly better than an investor expects a good SaaS business to perform at. This means that you have build a solid business. Make sure to emphasize your strengths when you negotiate your valuation"
    },
    {
      "min": 1.3,
      "max": 1.5,
      "rangeName": "A lot better than typical SaaS ",
      "evaluationDescription": "shows that your business is performing at a level a lot better than an investor expects a good SaaS business to perform at. This means that you have build a strong business. Make sure to emphasize your strengths when you negotiate your valuation"
      },
    {
      "min": 1.5,
      "max": 3.8,
      "rangeName": "Outshining SaaS ",
      "evaluationDescription": "is a great result and shows that you are outshining your SaaS competition. You can be proud of your achievement and approach investors with confidence to negotiate a killer valuation"
    }
  ]
};

export default kpiData;
