import { Injectable, Inject } from '@nestjs/common';
import { StorageInterface } from '../interface/storage.interface';
import { Slice } from '../model/slice.model';
import { padIntegerWithZero, REDIS_KEYS_PATTERNS } from '../util/utiL';

@Injectable()
  
export class AppService {

  constructor(
    @Inject('STORAGE_MANAGER')
    private readonly storageManager: StorageInterface,
  ) { }
  
  async getFlight(flightNumber: number, departureDateString: string | undefined): Promise<Slice[]> {

    let patterns = [];

    if (flightNumber !== undefined && flightNumber !== null) {
      const flightNumberPadded = padIntegerWithZero(flightNumber, 8);
      patterns.push(REDIS_KEYS_PATTERNS.byFlightNumber(flightNumberPadded))
    }

    if (departureDateString !== undefined) {
      if (patterns.length === 0) {
        patterns.push('*');
      }

      const departureDate = new Date();
      departureDate.setTime(Date.parse(departureDateString));
      patterns.push(REDIS_KEYS_PATTERNS.flyingOn(departureDate))
    }

    if (patterns.length !== 0) {
      const pattern = patterns.reduce((a, c) => `${a}${c}`, '');
      return await this.storageManager.keys(pattern);
    }

    return await this.storageManager.keys('*');
  }
}
