import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Organizations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/organizations (GET)', () => {
    return request(app.getHttpServer())
      .get('/organizations')
      .expect(401); // Assuming authentication is required
  });

  it('/organizations/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/organizations/1')
      .expect(401); // Assuming authentication is required
  });

  it('/organizations (POST)', () => {
    return request(app.getHttpServer())
      .post('/organizations')
      .send({
        name: 'Test Organization',
        description: 'A test organization'
      })
      .expect(401); // Assuming authentication is required
  });
});