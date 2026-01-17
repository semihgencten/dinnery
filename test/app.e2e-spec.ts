import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRecipeDto } from '../src/recipes/dtos/createRecipe.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/recipes (POST)', () => {
    const recipe: CreateRecipeDto = {
      name: "soup",
      instructions: "call the restaurant"
    }
    return request(app.getHttpServer())
      .post('/recipes')
      .send(recipe)
      .expect(201);
  });
});
