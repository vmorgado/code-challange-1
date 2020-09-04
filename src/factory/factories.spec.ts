import { storageFactory } from "./storage.factory";
import { ConfigService } from "@nestjs/config";
import defaultConfig from "../config/default.config";
import { mergeStrategyFactory } from "./merge-strategy.factory";
import { StubResponse } from "../model/stub-response.model";
import { stubResolverFactory, stubArrayFactory } from "./stub-resolver.factory";
import { HttpService } from "@nestjs/common";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

describe('Tests for the factory functions:', () => {

  const httpService = {
    get: (url: string, config: any) => Observable.create({ data: { flights: [] } } as AxiosResponse ),
  } as HttpService;

  it('storage factory resolves a working redis like instance', async () => {

    const configService = new ConfigService(defaultConfig());

    const redis = {
      get: (key: string) => Promise.resolve(`{ "foo": "bar"}`),
      set: (key: string, value: any, ttl: number) => Promise.resolve(undefined),
      keys: (pattern: string) => Promise.all(["savedonstore_memory"]),
      command: (...param: string[]) => Promise.resolve([]),
      setex: (key: string, seconds: number, value: any) => Promise.resolve(undefined),
    }

    const storage = storageFactory(configService, 'memory', redis);

    expect(storage).toBeDefined();
    const firstTerst = await storage.get('foo_memory');
    const secondTest = await storage.keys('*');
    expect(firstTerst).toStrictEqual({ foo: 'bar' });
    expect(secondTest).toStrictEqual([{foo: 'bar'}]);
  });
  
  it('data from two stubs is merged correctly into an list of flights', async () => {
    
    const stubs = [{
      flights: [{
        slices: [
          { "departure_date_time_utc": "2019-08-08T16:00:00.000Z", "flight_number": 145 },
          { "departure_date_time_utc": "2019-08-08T16:00:00.000Z", "flight_number": 150 },
          { "departure_date_time_utc": "2019-08-10T16:00:00.000Z", "flight_number": 145 },
        ],
        price: 100,
      }]
    },{
      flights: [{
        slices: [
          { "departure_date_time_utc": "2019-08-08T16:00:00.000Z", "flight_number": 145 },
          { "departure_date_time_utc": "2019-08-08T16:00:00.000Z", "flight_number": 150 },
          { "departure_date_time_utc": "2019-08-10T16:00:00.000Z", "flight_number": 145 },
        ],
        price: 100,
      }]
    }] as unknown;


    const mergeStrategie = mergeStrategyFactory();
    expect(mergeStrategie).toBeDefined();
    expect(mergeStrategie(stubs as StubResponse[]).length).toBe(3);
  });

  it('we are able to initialize and resolve data from stubs', async () => {

    const stubResolver = stubResolverFactory(httpService, 'http://foo/bar');
    expect(stubResolver).toBeDefined();
    try {
      const stubResponse = await stubResolver.resolve();
      expect(stubResponse).toStrictEqual({ flights: [] });
    } catch(e) {
      
      expect(e.message).toBe('Service Unavailable');
    }
    

  });

  it('we are able to initialize an array of stubs', async () => {
    const configService = new ConfigService(defaultConfig());
    
    const stubArray = stubArrayFactory(configService, httpService);
    expect(stubArray).toBeDefined();
    expect(stubArray.length).toBe(2);
  });

});
