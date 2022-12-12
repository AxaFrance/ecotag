import {format} from 'date-fns'

export const formatTimestampToString = (timeStamp) => {

    const date = new Date(timeStamp / 1e+4 + new Date('0001-01-01T00:00:00Z').getTime());
    try {
        return format(date, 'dd/MM/yyyy');
    } catch (e) {
        return "Invalid date";
    }
}

