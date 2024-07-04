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