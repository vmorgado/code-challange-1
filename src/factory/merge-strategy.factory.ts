import { StubResponse } from '../model/stub-response.model';
import { Slice } from '../model/slice.model';
import { getIndividualSlices, cleanDuplicatedSlices } from '../util/util';

export const mergeStrategyFactory = () => {

  return (results: StubResponse[]): Slice[] => {

    const extractFlights = (previous: any, next: any) => {
      return previous.concat(next.flights);
    };

    const slices = results
      .reduce(extractFlights, [])
      .reduce(getIndividualSlices, [])
      .reduce(cleanDuplicatedSlices, []);
    
    return slices;
  }
};
