
import { getIndividualSlices, cleanDuplicatedSlices } from "./util";
import { Slice } from "src/model/slice.model";

describe('clean duplicated slices function', () => {


  
  
  it('duplicated slices should vbe removed', () => {

    const useCases = [{
      slices: [{ "origin_name": "Schonefeld" }, { "origin_name": "Stansted" }],
      price: 100
    }, {
      slices: [{ "origin_name": "London" }, { "origin_name": "Berlin" }],
      price: 120,
      }];
    
    const result = useCases.reduce(getIndividualSlices, []);
    expect(result.length).toBe(4);
  });



  
  it('duplicated slices should be removed', () => {

    const useCases = [
      { "internal_identifier": "146_2019-08-08T16:00:00.000Z" },
      // the next three all have the same identifier
      { "internal_identifier": "145_2019-08-10T06:50:00.000Z" },
      { "internal_identifier": "145_2019-08-10T06:50:00.000Z" },
      { "internal_identifier": "145_2019-08-10T06:50:00.000Z" }
    ] as Slice[];

    const result = useCases.reduce(cleanDuplicatedSlices, []);
    expect(result.length).toBe(2);
  });

});
