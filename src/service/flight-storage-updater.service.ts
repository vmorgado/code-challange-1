import { Inject } from '@nestjs/common';
import { StubResponse } from "../model/stub-response.model";
import { Slice } from "../model/slice.model";
import { StorageInterface } from "../interface/storage.interface";
import { DiscoveryStubInterface } from "../interface/discovery-stub.interface";
import { ConfigService } from '@nestjs/config';

export class FlightStorageUpdater {
  constructor(
    @Inject('DISCOVERY_STUB_LIST')
    private readonly stubs: DiscoveryStubInterface[],
    @Inject('FLIGHT_RESULT_MERGER')
    private readonly merge: (result: StubResponse[]) => Slice[],
    @Inject('STORAGE_MANAGER')
    private readonly memoryManager: StorageInterface,
    private readonly configService: ConfigService,
  ) { }
  
  async update(): Promise<void> {
    const resolvers = this.stubs.map((stub: DiscoveryStubInterface) => stub.resolve());

    await Promise.all(resolvers).then(async (results) => {
      this.merge(results).map((result) => {
        this.memoryManager.set(result.internal_identifier, result, this.configService.get('redis.memory.ttl'));
      });
    });
  }
}
