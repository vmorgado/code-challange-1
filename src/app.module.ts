import { GeneralExceptionFilter } from './exception.filter';
import { AppController } from './app.controller';
import { HttpModule, HttpService, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import defaultConfiguration from './config/default.config';
import { stubArrayFactory } from './factory/stub-resolver.factory';
import { AppService } from './service/app.service';
import { FlightStorageUpdater } from './service/flight-storage-updater.service';
import { mergeStrategyFactory } from './factory/merge-strategy.factory';
import { storageFactory } from './factory/storage.factory';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateFromDiscoveryStubTask } from './tasks/update-from-discovery-stub.task';
import { HttpCacheInterceptor } from './interceptor/cache.interceptor';
import { Tedis } from 'tedis';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [defaultConfiguration] }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('httpTimeout'),
        maxRedirects: configService.get('httpMaxRedirects'),
        withCredentials: true,
        auth: configService.get('stubs.auth'),
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),
  ],
  providers: [
    { provide: 'DISCOVERY_STUB_LIST', useFactory: stubArrayFactory, inject: [ConfigService, HttpService] },
    { provide: 'REDIS_CLIENT', useFactory: (configService: ConfigService) => new Tedis(configService.get('redis.config')), inject: [ConfigService] },
    { provide: 'CACHE_MANAGER', useFactory: (cs, redis) => storageFactory(cs, 'cacahe', redis), inject: [ConfigService, 'REDIS_CLIENT'] },
    { provide: 'STORAGE_MANAGER', useFactory: (cs, redis) => storageFactory(cs, 'memory', redis), inject: [ConfigService, 'REDIS_CLIENT'] },
    { provide: 'FLIGHT_RESULT_MERGER', useFactory: mergeStrategyFactory },
    { provide: GeneralExceptionFilter, useClass: GeneralExceptionFilter },
    { provide: FlightStorageUpdater, useClass: FlightStorageUpdater },
    { provide: HttpCacheInterceptor, useClass: HttpCacheInterceptor, inject: ['CACHE_MANAGER'] },
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    { provide: UpdateFromDiscoveryStubTask, useClass: UpdateFromDiscoveryStubTask, inject: [FlightStorageUpdater] },
    AppService
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly flightCacheBuilder: FlightStorageUpdater,
  ) {}

  async onApplicationBootstrap() {
    this.flightCacheBuilder.update();
  }
}
