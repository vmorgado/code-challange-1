import { NestFactory, BaseExceptionFilter } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GeneralExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const exceptionFilter = await app.resolve<BaseExceptionFilter>(GeneralExceptionFilter);

  app.useGlobalFilters(exceptionFilter);
  
  const options = new DocumentBuilder()
    .setTitle('comtrago-exercise')
    .setDescription('comtrago-exercise')
    .setVersion('1.0')
    .addTag('flights')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
 