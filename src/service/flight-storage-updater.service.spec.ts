import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import defaultConfig from '../config/default.config';
import { FlightStorageUpdater } from './flight-storage-updater.service';
import { StubResponse } from '../model/stub-response.model';
import { StorageInterface } from '../interface/storage.interface';

describe('flight storage service', () => {
    const redis = {
        get: (key: string) => Promise.resolve(`{ "foo": "bar"}`),
        set: (key: string, value: any, ttl: number) => Promise.resolve(undefined),
        keys: (pattern: string) => Promise.all(["savedonstore_memory"]),
        command: (...param: string[]) => Promise.resolve([]),
        setex: (key: string, seconds: number, value: any) => Promise.resolve(undefined),
    }

    const configService = new ConfigService(defaultConfig());
    let fileStorageUpdateService: FlightStorageUpdater;

    let stubArrayReference: any;
    let mergeReference: (stubs: StubResponse[]) => Promise<any>;
    let fakeMergerReference: { merge: (...a: any) => any };
    let redisReference: StorageInterface;
    

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [], // Add
            controllers: [], // Add
            providers: [
                { provide: ConfigService, useValue: configService },
                { provide: 'DISCOVERY_STUB_LIST', useValue: [
                    { resolve: () => Promise.resolve({ flights: [{ slices: [{internal_identifier: ''}], price: 0}] }) },
                    { resolve: () => Promise.resolve({ flights: [{ slices: [{internal_identifier: ''}], price: 0}] }) }
                ]},
                { provide: 'STORAGE_MANAGER', useValue: redis },
                { provide: 'FLIGHT_RESULT_MERGER', useValue: (stubs: StubResponse[]) => [{ internal_identifier: 'foo' }], },
                FlightStorageUpdater,
            ],   // Add
        }).compile();

        fileStorageUpdateService = await moduleRef.resolve<FlightStorageUpdater>(FlightStorageUpdater);
        stubArrayReference = await moduleRef.resolve('DISCOVERY_STUB_LIST');
        mergeReference = await moduleRef.resolve('FLIGHT_RESULT_MERGER');
        redisReference = await moduleRef.resolve('STORAGE_MANAGER');
        fakeMergerReference = { merge: mergeReference };
        
        console.log({stubArrayReference, mergeReference, redisReference, fakeMergerReference});
    });

    it('should be able to initialize the service and call the update() functiomn', async () => {
        expect(FlightStorageUpdater).toBeDefined();

        const stubsSpy = spyOn(stubArrayReference, 'map').and.returnValue([ () => stubArrayReference[0].resolve ])
        const redisSetSpy = spyOn(redisReference, 'set').and.callThrough();

        const result = await fileStorageUpdateService.update();
        console.log(result)
        expect(stubsSpy).toHaveBeenCalled();
        expect(redisSetSpy).toHaveBeenCalled();

    });
});
