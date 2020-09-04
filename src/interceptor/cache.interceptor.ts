import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StorageInterface } from '../interface/storage.interface';
import { Request, Response } from 'express';
import { HeadersAlreadyWrittenException } from 'src/exception/headers-already-written.exception';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {

  constructor(
    @Inject('CACHE_MANAGER')
    private readonly storageManager: StorageInterface,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const httpContext = context.switchToHttp();
    const request:Request = httpContext.getRequest();
    const response: Response = httpContext.getResponse();


    const hasCache = await this.storageManager.get(request.originalUrl);

    if (hasCache) {
      response.status(200)
        .set('Connection', 'close')
        .send(hasCache);
    }

    return next.handle();
  }
}
