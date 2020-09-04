import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { FlightStorageUpdater } from '../service/flight-storage-updater.service';

@Injectable()
export class UpdateFromDiscoveryStubTask {

  constructor(
    private readonly flightCacheBuilder: FlightStorageUpdater,
  ) { }

  @Interval(600000)
  async handleCron() {
    await this.flightCacheBuilder.update()
  }
}
