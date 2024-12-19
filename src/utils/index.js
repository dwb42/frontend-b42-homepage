import { format } from 'date-fns';

export const formatDateUsingDateFns = (date,instruction) => {
  if (!date) return ''; // Return an empty string if the date is null or undefined
  try {
    if (instruction === 'noTime') {
      return format(new Date(date), 'dd.MM.yyyy');
    } else {
      return format(new Date(date), 'dd.MM.yyyy HH:mm');
    }  
  } catch (error) {
    console.error('Error formatting date:', error);
    return ''; // Return empty string on error
  }
};


export const truncateString = (str, maxLength) => {  
  if (str.length>maxLength) {  
    return str.substring(0, maxLength) + " ..";  
  } else {  
  return str;  
    }  
  }  

export const usdFormat = (number) => {
  if (number === null || number === undefined) {
    return ''; // or any other default value you'd prefer to display
  }
  
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const convertToPercent = (number) => {
  if (number === null || number === undefined) {
    return ''; // or any other default value you'd prefer to display
  }

  const percentage = number * 100;
  return `${percentage}%`;
};

export const multipleImpact = (value) => {
  if (value === 1) return "No impact on Multiple.";
  const percentageDiff = Math.abs(((value - 1) * 100).toFixed(0));
  const iconCount = Math.floor(percentageDiff / 20);
  let result = '';
  let icons = '';

  for (let i = 0; i < iconCount; i++) {
    if (value > 1) {
      icons += '<span class="mdi mdi-arrow-up-circle text-success"></span>';
    } else {
      icons += '<span class="mdi mdi-arrow-down-circle text-deep-orange"></span>';
    }
  }

  if (value > 1) {
    result = `Multiple Boost by +${percentageDiff}% ${icons}`;
  } else {
    result = `Multiple Reduction by -${percentageDiff}% ${icons}`;
  }

  return result;
}

export const multipleImpactPercent = (value) => {
  if (value === 1) return "-";
  const percentageDiff = Math.abs(((value - 1) * 100).toFixed(0));
  const iconCount = Math.floor(percentageDiff / 20);
  let result = '';
  let icons = '';



  if (value > 1) {
    result = `+${percentageDiff}%`;
  } else {
    result = `-${percentageDiff}% `;
  }

  return result;
}



const isDevelopment = window.location.href.includes('replit.dev');
// Determine the API base URL
export const apiBaseURL = isDevelopment
  //? process.env.BACKEND_BASE_URL_DEV
  //: process.env.BACKEND_BASE_URL_PROD
  ? process.env.BACKEND_BASE_URL_DEV
  : process.env.BACKEND_BASE_URL_PROD
