
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RecipesController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/recipes (POST)', () => {
        return request(app.getHttpServer())
            .post('/recipes')
            .send({
                name: 'Spaghetti Bolognese',
                instructions: 'Boil pasta. Cook sauce. Mix.',
                description: 'A classic Italian dish',
                category: 'Main Course',
                photoUrl: 'http://example.com/spaghetti.jpg',
                ingredients: [
                    {
                        quantity: 500,
                        unit: 'g',
                        customIngredientText: 'Spaghetti'
                    },
                    {
                        quantity: 2,
                        unit: 'cups',
                        customIngredientText: 'Tomato Sauce'
                    }
                ]
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.name).toBe('Spaghetti Bolognese');
                expect(res.body.instructions).toBe('Boil pasta. Cook sauce. Mix.');
            });
    });

    it('/recipes (GET)', async () => {
        // Ensure at least one recipe exists
        await request(app.getHttpServer())
            .post('/recipes')
            .send({
                name: 'Pancakes',
                instructions: 'Mix flour and milk. Fry.',
                ingredients: [
                    {
                        quantity: 1,
                        unit: 'cup',
                        customIngredientText: 'Flour'
                    }
                ]
            })
            .expect(201);

        return request(app.getHttpServer())
            .get('/recipes')
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
                const recipe = res.body.find(r => r.name === 'Pancakes');
                expect(recipe).toBeDefined();
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
