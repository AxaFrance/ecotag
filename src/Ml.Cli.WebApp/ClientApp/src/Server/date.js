import { format, parseISO } from 'date-fns'

// Converti une date String internationale en objet Date local
const dateTimeReviver = (propertyName, value) => {
  if (typeof value === 'string') {
    if (propertyName.toLowerCase().includes("date")) {
        return parseISO(value);
    }
  }
  return value;
};

export const convertStringDateToDateObject = origin => {
 // if (typeof origin === 'string') {
 //   return dateTimeReviver(origin);
 // }
  if (Array.isArray(origin)) {
    return origin.map(e => convertStringDateToDateObject(e));
  }
  for (const propertyName in origin) {
    if (Object.prototype.hasOwnProperty.call(origin, propertyName)) {
      const value = origin[propertyName];
      if (typeof value === 'string') {
        origin[propertyName] = dateTimeReviver(propertyName, value);
      } else if (typeof value === 'object') {
        convertStringDateToDateObject(value);
      }
    }
  }
  return origin;
};


export const formatDateToString = (date) =>{
  //TODO: handle dates properly
  if(date instanceof Date) {
    try{
      return format(date, 'dd/MM/yyyy');
    }
    catch (e) {
      return "Invalid date";
    }
  }
  return "-";
}

