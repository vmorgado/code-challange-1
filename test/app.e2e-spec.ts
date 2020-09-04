import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/flights (GET)', async () => {
    
    try {
      const result = await request(app.getHttpServer())
        .get('/flights').send();
      console.log(result.body);
    
    expect(result.body).toBeDefined();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      await app.close();
    }

  });

  afterAll( async () => {

    await app.close();
  })
});
