// Import the kpiData object
import kpiData from './kpiData.js';

// Define the getKPIInfo function
function getKPIInfo(kpi_key, kpi_value) {
  // Retrieve the ranges for the specified KPI key
  const ranges = kpiData[kpi_key];

  //console.log('kpiData import:', kpiData); 

  // Check if the KPI key exists
  if (!ranges) {
    throw new Error(`KPI key "${kpi_key}" not found.`);
  }

  // Iterate through the ranges to find where the KPI value fits
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const { min, max } = range;

    // Check if the value fits into the current range
    if (kpi_value >= min && (max === undefined || kpi_value < max)) {
      return {
        rangeName: range.rangeName,
        multipleVectorName: range.multipleVectorName,
        impactPercentage: range.impactPercentage,
        evaluationDescription: range.evaluationDescription,
      };
    }
  }

  // If no range is found, throw an error
  throw new Error(
    `Value "${kpi_value}" does not fit into any range for KPI "${kpi_key}".`
  );
}

// Export the getKPIInfo function
export default getKPIInfo;
