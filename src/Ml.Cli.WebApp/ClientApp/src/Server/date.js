// Converti une date String internationale en objet Date local
const dateTimeReviver = value => {
  let a;
  if (typeof value === 'string') {
    a = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
    if (a) {
      const dateFields = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      return new Date(
        Date.UTC(parseInt(dateFields[3], 10), parseInt(dateFields[2], 10) - 1, parseInt(dateFields[1], 10))
      );
    }
  }
  return value;
};

export const convertStringDateToDateObject = origin => {
  if (typeof origin === 'string') {
    return dateTimeReviver(origin);
  }
  if (Array.isArray(origin)) {
    return origin.map(e => convertStringDateToDateObject(e));
  }
  for (const propertyName in origin) {
    if (Object.prototype.hasOwnProperty.call(origin, propertyName)) {
      const value = origin[propertyName];
      if (typeof value === 'string') {
        origin[propertyName] = dateTimeReviver(value);
      } else if (typeof value === 'object') {
        convertStringDateToDateObject(value);
      }
    }
  }
  return origin;
};
