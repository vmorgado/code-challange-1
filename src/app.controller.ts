import { Controller, Get, UseInterceptors, Query, Req, Inject, Res, Next, CallHandler } from '@nestjs/common';
import { AppService } from './service/app.service';
import { Slice } from './model/slice.model';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from './interceptor/cache.interceptor';
import { Request, Response } from 'express';
import { StorageInterface } from './interface/storage.interface';
import { ConfigService } from '@nestjs/config';
import { HeadersAlreadyWrittenException } from './exception/headers-already-written.exception';
import { nextTick } from 'process';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: StorageInterface,
    private readonly configService: ConfigService,
    
  ) { }
  
  @Get('flights')
  @ApiTags('flight')
  @UseInterceptors(HttpCacheInterceptor)
  async getFlights(@Req() request: Request, @Next() next: CallHandler, @Query('flight') flightNumber?: number, @Query('departure') departureDate?: string): Promise<Slice[]> {
    let result: Slice[] = null;

    const response: Response = request.res;

    try {
      // in case cache had been already delivered to the user.
      if (!response.finished) {
        result = await this.appService.getFlight(flightNumber, departureDate);

        return result;
      }
      

    } catch (e) {


      next.handle();
      throw new HeadersAlreadyWrittenException(`Can't write headers. Reques has been fulfilled by the cache. Updating Cache..`);
      
    } finally {
      const cacheKey = request.originalUrl;
      await this.cacheManager.set(cacheKey, result, this.configService.get('redis.cache.ttl'));
    }
  }
}
