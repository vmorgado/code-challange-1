import { Slice } from "../model/slice.model";
import { Flight } from "../model/flight.model";

export const REDIS_KEYS_PATTERNS = {
  flyingOn: (startDate: Date): string => {
    const regex = `_${year(startDate)}-${month(startDate)}-${day(startDate)}*`
    return regex;
  },
  byFlightNumber: (flightNumber: string): string => { return `${flightNumber}` },
}

export const dateInSeconds = (date: string) => Math.floor(Date.parse(date) / 1000);

export const padIntegerWithZero = (id: number, size: number): string => { 
  let stringifiedId = `${id}`;
  while (stringifiedId.length < size) stringifiedId = `0${stringifiedId}`;
  return stringifiedId;
};

export const getSliceIdentifier = (slice: Slice) => `${padIntegerWithZero(slice.flight_number, 8)}_${slice.departure_date_time_utc}`;
export const departureTimeSeconds = (slice: Slice): string => `${Math.floor(Date.parse(slice.departure_date_time_utc) / 1000)}` ;

export const getIndividualSlices = (result: Slice[], object: Flight): Slice[] => {

  const individualPrice = object.price / object.slices.length;
  object.slices.map((slice: Slice) => result.push( Object.assign({}, slice, { individual_price: individualPrice, internal_identifier: getSliceIdentifier(slice) } )));
  return result;
}

export const cleanDuplicatedSlices = (result: Slice[], object: Slice) => {

  return result.map((slice) => slice.internal_identifier).includes(object.internal_identifier) ? result : [...result, object];
}

export const calculateNowToDepartureDate = (departureDateInSeconds: number): number => {
  const now = Date.now() / 1000;
  return Math.floor(now - departureDateInSeconds);
}

const year = (startDate: Date) => startDate.getFullYear();
const month = (startDate: Date) => padIntegerWithZero(startDate.getMonth() + 1, 2);
const day = (startDate: Date) => padIntegerWithZero(startDate.getDate(), 2);