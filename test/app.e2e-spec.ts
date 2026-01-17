import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRecipeDto } from '../src/recipes/dtos/recipe.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/recipes (POST)', () => {
    const recipe: CreateRecipeDto = {
      name: "soup",
      instructions: "call the restaurant",
      ingredients: []
    }
    return request(app.getHttpServer())
      .post('/recipes')
      .send(recipe)
      .expect(201);
  });
});
