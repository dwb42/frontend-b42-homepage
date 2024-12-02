// useTrendAnalysis.js
import { computed } from 'vue';

function useTrendAnalysis(valuationKPIs, kpiField) {
  const trendStatement = computed(() => {
    console.group(`Trend Analysis for ${kpiField}`);
    console.log('Raw Input Data:', valuationKPIs);

    // Extract and filter data points
    const dataPoints = Object.keys(valuationKPIs)
      .sort()
      .map(year => {
        const kpiValue = valuationKPIs[year][kpiField];
        return {
          year: parseInt(year),
          value: typeof kpiValue === 'number' ? kpiValue : null,
        };
      })
      .filter(point => point.value != null);

    console.log('Processed Data Points:', dataPoints);

    // Check data sufficiency
    if (dataPoints.length < 2) {
      console.log('❌ Insufficient data points:', dataPoints.length);
      console.groupEnd();
      return 'Insufficient data to determine trend. At least two data points are required.';
    }

    // Calculate key metrics
    const valueFirst = dataPoints[0].value;
    const valueLast = dataPoints[dataPoints.length - 1].value;
    const n = dataPoints.length - 1;

    console.group('Key Metrics');
    console.log('First Value:', valueFirst.toFixed(4));
    console.log('Last Value:', valueLast.toFixed(4));
    console.log('Number of Intervals:', n);
    console.groupEnd();

    if (valueFirst === 0) {
      console.log('❌ First value is zero - cannot calculate trend');
      console.groupEnd();
      return 'Cannot determine trend due to zero initial value.';
    }

    // Overall change calculation
    const deltaOverall = ((valueLast - valueFirst) / Math.abs(valueFirst)) * 100;
    console.log('Overall Change %:', deltaOverall.toFixed(2) + '%');

    // Expected values calculation
    const m = (valueLast - valueFirst) / n;
    const expectedValues = [];
    for (let i = 1; i < n; i++) {
      const expectedValue = valueFirst + m * i;
      expectedValues.push(expectedValue);
    }

    console.group('Expected vs Actual Values');
    console.log('Slope (m):', m.toFixed(4));
    console.log('Expected Values:', expectedValues.map(v => v.toFixed(4)));
    console.groupEnd();

    // Consistency checks
    console.group('Consistency Checks');

    // First, check if the series is monotonic (either increasing or decreasing)
    let isMonotonicIncreasing = true;
    let isMonotonicDecreasing = true;

    for (let i = 1; i < dataPoints.length; i++) {
      const prevValue = dataPoints[i - 1].value;
      const currValue = dataPoints[i].value;

      if (currValue > prevValue) {
        isMonotonicDecreasing = false;
      } else if (currValue < prevValue) {
        isMonotonicIncreasing = false;
      }
    }

    const isMonotonic = isMonotonicIncreasing || isMonotonicDecreasing;
    console.log('Is Monotonic:', isMonotonic);

    let isConsistentTrend;

    if (isMonotonic) {
      isConsistentTrend = true;
      console.log('Series is monotonic. Trend is consistent.');
    } else {
      // Proceed with existing consistency check
      const consistencyChecks = [];
      for (let i = 1; i < dataPoints.length - 1; i++) {
        const actualValue = dataPoints[i].value;
        const expectedValue = expectedValues[i - 1];
        const lowerBound = expectedValue * 0.9;
        const upperBound = expectedValue * 1.1;
        const isConsistent = actualValue >= lowerBound && actualValue <= upperBound;

        console.log(`Year ${dataPoints[i].year}:`, {
          actual: actualValue.toFixed(4),
          expected: expectedValue.toFixed(4),
          bounds: `${lowerBound.toFixed(4)} - ${upperBound.toFixed(4)}`,
          consistent: isConsistent
        });

        consistencyChecks.push(isConsistent);
      }
      isConsistentTrend =
        consistencyChecks.length === 0 || consistencyChecks.every(check => check);
      console.log('Is Trend Consistent (Based on Deviation Checks):', isConsistentTrend);
    }
    console.groupEnd();

    // Intermediate deviations
    console.group('Intermediate Deviations');
    let deviationsWithin15Percent = true;
    for (let i = 1; i < dataPoints.length - 1; i++) {
      const deviation = Math.abs((dataPoints[i].value - valueFirst) / Math.abs(valueFirst)) * 100;
      console.log(`Year ${dataPoints[i].year} deviation:`, deviation.toFixed(2) + '%');
      if (deviation > 15) {
        deviationsWithin15Percent = false;
      }
    }
    console.log('All Deviations Within 15%:', deviationsWithin15Percent);
    console.groupEnd();

    // Trend classification
    console.group('Trend Classification');
    let statement = '';

    if (isConsistentTrend) {
      if (deltaOverall >= -5 && deltaOverall <= 5) {
        statement = 'In the time period that you have provided data for, your ratio has been more or less stable.';
        console.log('Classification: Stable (-5% to 5%)');
      } else if (deltaOverall > 5 && deltaOverall <= 15) {
        statement = 'In the time period that you have provided data for, your ratio has improved slightly.';
        console.log('Classification: Slight Improvement (5% to 15%)');
      } else if (deltaOverall > 15) {
        statement = 'In the time period that you have provided data for, your ratio has improved considerably.';
        console.log('Classification: Considerable Improvement (>15%)');
      } else if (deltaOverall >= -15 && deltaOverall < -5) {
        statement = 'In the time period that you have provided data for, your ratio has decreased slightly.';
        console.log('Classification: Slight Decrease (-15% to -5%)');
      } else if (deltaOverall < -15) {
        statement = 'In the time period that you have provided data for, your ratio has decreased considerably.';
        console.log('Classification: Considerable Decrease (<-15%)');
      }
    } else {
      if (deltaOverall >= -5 && deltaOverall <= 5 && deviationsWithin15Percent) {
        statement = 'In the time period that you have provided data for, your ratio has been more or less stable.';
        console.log('Classification: Stable with Fluctuations');
      } else {
        statement = 'In the time period that you have provided data for, your ratio has not followed a recognizable trend.';
        console.log('Classification: No Clear Trend');
      }
    }

    console.log('Final Statement:', statement);
    console.groupEnd();
    console.groupEnd();

    return statement;
  });

  return {
    trendStatement,
  };
}

export { useTrendAnalysis };
