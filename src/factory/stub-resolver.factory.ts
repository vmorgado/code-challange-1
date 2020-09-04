import { HttpService } from '@nestjs/common';
import { StubResponse } from '../model/stub-response.model';
import { DiscoveryStubInterface } from '../interface/discovery-stub.interface';
import { ConfigService } from '@nestjs/config';

export const stubResolverFactory = (httpService: HttpService, url: string): DiscoveryStubInterface => {
  const resolve = async (): Promise<StubResponse> => {
    try {
      const response = await httpService.get<StubResponse>(url).toPromise();
      return response.data;
    } catch (e) {
      console.error('Service Unavailable');
      return { flights: [] };
    }
  }
  // returns a function that calls the stub
  return { resolve }
};


export const stubArrayFactory = (configService: ConfigService, httpService: HttpService): DiscoveryStubInterface[] => {
  return configService.get<string[]>('stubs.urls').map((url: string) => stubResolverFactory(httpService, url));
};
