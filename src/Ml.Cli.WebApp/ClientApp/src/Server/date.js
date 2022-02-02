import { format } from 'date-fns'

export const formatTimestampToString = (timeStamp) =>{
  const date = new Date(timeStamp);
  try{
    return format(date, 'dd/MM/yyyy');
  }
  catch (e) {
    return "Invalid date";
  }
}

