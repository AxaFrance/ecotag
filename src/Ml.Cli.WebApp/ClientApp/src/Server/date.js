import { format } from 'date-fns'

const timeStampToDate = (propertyName, value) => {
  if (propertyName.toLowerCase().includes("date")) {
      return formatDateToString(value);
  }
  return value;
};

export const convertTimestampToDateObject = origin => {
  if (Array.isArray(origin)) {
    return origin.map(e => convertTimestampToDateObject(e));
  }
  for (const propertyName in origin){
    if (Object.prototype.hasOwnProperty.call(origin, propertyName)) {
      const value = origin[propertyName];
      if(typeof value === "object"){
        convertTimestampToDateObject(value);
      }
      else {
        origin[propertyName] = timeStampToDate(propertyName, value);
      }
    }
  }
  return origin;
};


export const formatDateToString = (timeStamp) =>{
  const date = new Date(timeStamp);
  try{
    return format(date, 'dd/MM/yyyy');
  }
  catch (e) {
    return "Invalid date";
  }
}

