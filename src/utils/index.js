// src/utils/dateUtils.js
import { format } from 'date-fns';

export const formatDateUsingDateFns = (date) => {
  if (!date) return ''; // Return an empty string if the date is null or undefined
  try {
      return format(new Date(date), 'dd.MM.yyyy HH:mm');
  } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Return empty string on error
  }
};