
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

    it('/recipes/search (GET) - filter by name and category', async () => {
        // Create recipes
        await request(app.getHttpServer()).post('/recipes').send({
            name: 'Chicken Soup',
            instructions: 'Cook chicken.',
            category: 'Soup',
            ingredients: [{ quantity: 1, unit: 'bowl', customIngredientText: 'Chicken' }]
        });
        await request(app.getHttpServer()).post('/recipes').send({
            name: 'Tomato Soup',
            instructions: 'Cook tomato.',
            category: 'Soup',
            ingredients: [{ quantity: 1, unit: 'bowl', customIngredientText: 'Tomato' }]
        });
        await request(app.getHttpServer()).post('/recipes').send({
            name: 'Chicken Salad',
            instructions: 'Mix.',
            category: 'Salad',
            ingredients: [{ quantity: 1, unit: 'bowl', customIngredientText: 'Chicken' }]
        });

        // Search for 'Chicken' with category 'Soup'
        return request(app.getHttpServer())
            .get('/recipes/search?name=Chicken&category=Soup')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].name).toBe('Chicken Soup');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
