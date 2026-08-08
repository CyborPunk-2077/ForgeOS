import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// Global setup for tests
export const globalSetup = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture;
};