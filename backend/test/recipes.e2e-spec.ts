
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('RecipesController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a user for testing
        const userResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com',
                country: 'USA',
                password: 'password123'
            })
            .expect(201);

        const userId = userResponse.body.id;

        jwtService = app.get(JwtService);
        token = jwtService.sign({ sub: userId, email: 'test@example.com' });
    });

    let secondUserToken: string;
    beforeEach(async () => {
        // Create a second user for ownership testing
        const secondUserResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Other User',
                username: 'otheruser',
                email: 'other@example.com',
                country: 'UK',
                password: 'password123'
            });

        // If duplicate (previous runs), login instead
        let otherUserId;
        if (secondUserResponse.status === 409) {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'otheruser', password: 'password123' })
                .expect(201);
            secondUserToken = loginResponse.body.access_token;
        } else {
            otherUserId = secondUserResponse.body.id;
            secondUserToken = jwtService.sign({ sub: otherUserId, email: 'other@example.com' });
        }
    });

    it('/recipes (POST)', () => {
        return request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Spaghetti Bolognese',
                instructions: 'Boil pasta. Cook sauce. Mix.',
                description: 'A classic Italian dish',
                category: 'Main Course',
                photoUrl: 'http://example.com/spaghetti.jpg',
                cookTime: 30,
                prepTime: 15,
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
                expect(res.body.cookTime).toBe(30);
                expect(res.body.prepTime).toBe(15);
            });
    });

    it('/recipes (GET) - should return recipes sorted by popularity', async () => {
        // Create Recipe A
        const rA = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'SortTest A',
                instructions: 'Instructions',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            }).expect(201);

        // Create Recipe B
        const rB = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'SortTest B',
                instructions: 'Instructions',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            }).expect(201);

        // Like Recipe B (Popularity = 1)
        await request(app.getHttpServer())
            .post(`/recipes/${rB.body.id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        // Get Recipes - Expect B then A (among others)
        return request(app.getHttpServer())
            .get('/recipes')
            .expect(200)
            .expect((res) => {
                const recipes = res.body;
                // Filter to our test recipes
                const ourRecipes = recipes.filter(r => r.name.startsWith('SortTest'));
                // Expect at least our 2 recipes (if pagination allows)
                // If other tests run before, there might be more, but B should be before A

                // Assuming default limit=20 is enough to catch them
                const indexA = recipes.findIndex(r => r.id === rA.body.id);
                const indexB = recipes.findIndex(r => r.id === rB.body.id);

                expect(indexA).not.toBe(-1);
                expect(indexB).not.toBe(-1);

                // B should be before A (lower index)
                expect(indexB).toBeLessThan(indexA);
            });
    });

    it('/recipes/search (GET) - filter by name and category with sorting', async () => {
        // Create recipes
        const s1 = await request(app.getHttpServer()).post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'SearchSort Soup A',
                instructions: 'Cook chicken.',
                category: 'SoupTests',
                ingredients: [{ quantity: 1, unit: 'bowl', customIngredientText: 'Chicken' }]
            });
        const s2 = await request(app.getHttpServer()).post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'SearchSort Soup B',
                instructions: 'Cook tomato.',
                category: 'SoupTests',
                ingredients: [{ quantity: 1, unit: 'bowl', customIngredientText: 'Tomato' }]
            });

        // Like Soup B -> Matches = 1
        await request(app.getHttpServer())
            .post(`/recipes/${s2.body.id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        // Search for 'Soup' with category 'SoupTests'
        // Expect B before A
        return request(app.getHttpServer())
            .get('/recipes/search?name=SearchSort&category=SoupTests')
            .expect(200)
            .expect((res) => {
                const recipes = res.body;
                expect(recipes.length).toBeGreaterThanOrEqual(2);

                const indexA = recipes.findIndex(r => r.id === s1.body.id);
                const indexB = recipes.findIndex(r => r.id === s2.body.id);

                expect(indexB).toBeLessThan(indexA);
            });
    });

    it('/recipes/:id/fork (POST) - should fork an existing recipe', async () => {
        // 1. Create a recipe to fork
        const createResponse = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Original Recipe',
                instructions: 'Original instructions',
                description: 'Original description',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            })
            .expect(201);

        const originalRecipeId = createResponse.body.id;

        // 2. Fork the recipe
        return request(app.getHttpServer())
            .post(`/recipes/${originalRecipeId}/fork`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.id).not.toBe(originalRecipeId);
                expect(res.body.name).toContain('Original Recipe'); // Or however we decide to name forks
                expect(res.body.originalRecipeId).toBe(originalRecipeId);
            });
    });

    it('Social Interactions - Likes and Comments', async () => {
        // 1. Create a recipe
        const createResponse = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Social Recipe',
                instructions: 'Instructions',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            })
            .expect(201);

        const recipeId = createResponse.body.id;

        // 2. Like the recipe
        await request(app.getHttpServer())
            .post(`/recipes/${recipeId}/like`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect((res) => {
                expect(res.body.liked).toBe(true);
                expect(res.body.likesCount).toBe(1);
            });

        // 3. Like again (toggle -> unlike)
        await request(app.getHttpServer())
            .post(`/recipes/${recipeId}/like`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect((res) => {
                expect(res.body.liked).toBe(false);
                expect(res.body.likesCount).toBe(0);
            });

        // 4. Add a comment
        const commentText = 'This is a great recipe!';
        await request(app.getHttpServer())
            .post(`/recipes/${recipeId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: commentText })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.text).toBe(commentText);
                expect(res.body.recipeId).toBe(recipeId);
            });

        // 5. Get comments
        await request(app.getHttpServer())
            .get(`/recipes/${recipeId}/comments`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
                expect(res.body[0].text).toBe(commentText);
            });

        // 6. Verify counts in recipe details
        await request(app.getHttpServer())
            .get(`/recipes/${recipeId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.likesCount).toBe(0); // Unliked in step 3
                expect(res.body.commentsCount).toBe(1); // Added one comment
            });
    });

    it('/recipes (GET) - pagination with offset and limit', async () => {
        // Create 3 recipes
        for (let i = 1; i <= 3; i++) {
            await request(app.getHttpServer()).post('/recipes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: `Recipe ${i}`,
                    instructions: 'Instructions',
                    ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
                })
                .expect(201);
        }

        // Test limit=2
        const resLimit = await request(app.getHttpServer())
            .get('/recipes?limit=2')
            .expect(200);

        expect(resLimit.body.length).toBe(2);

        // Test offset=1, limit=1
        // Since order is DESC by createdAt (default in service), we might need to be flexible or check content.
        // Assuming recently created are at top.
        const resOffset = await request(app.getHttpServer())
            .get('/recipes?offset=1&limit=1')
            .expect(200);

        expect(resOffset.body.length).toBe(1);
        // The item at offset 1 should be different from item at offset 0
        const resFirst = await request(app.getHttpServer())
            .get('/recipes?limit=1')
            .expect(200);

        expect(resOffset.body[0].id).not.toBe(resFirst.body[0].id);
    });

    it('Edit/Delete Own Recipe', async () => {
        // 1. Create a recipe as First User
        const createResponse = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'My Special Recipe',
                instructions: 'Do secret things.',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Secret Item' }]
            })
            .expect(201);

        const recipeId = createResponse.body.id;

        // 2. Second User tries to UPDATE -> 403 Forbidden
        await request(app.getHttpServer())
            .patch(`/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${secondUserToken}`)
            .send({ name: 'Hacked Recipe' })
            .expect(403);

        // 3. Second User tries to DELETE -> 403 Forbidden
        await request(app.getHttpServer())
            .delete(`/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${secondUserToken}`)
            .expect(403);

        // 4. Owner (First User) updates -> 200 OK
        await request(app.getHttpServer())
            .patch(`/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated My Recipe' })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe('Updated My Recipe');
            });

        // 5. Owner (First User) deletes -> 200 OK (or 204)
        await request(app.getHttpServer())
            .delete(`/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        // 6. Verify Deletion
        await request(app.getHttpServer())
            .get(`/recipes/${recipeId}`)
            .expect(404);
    });

    it('Get User Recipes (Created and Forked)', async () => {
        // 1. Create a recipe as First User
        const r1 = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'User 1 Recipe',
                instructions: 'Instructions',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            }).expect(201);

        // 2. Create a recipe as Second User
        const r2 = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${secondUserToken}`)
            .send({
                name: 'User 2 Recipe',
                instructions: 'Instructions',
                ingredients: [{ quantity: 1, unit: 'pc', customIngredientText: 'Item' }]
            }).expect(201);

        // 3. User 1 Forks User 2's recipe
        const r3 = await request(app.getHttpServer())
            .post(`/recipes/${r2.body.id}/fork`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        // 4. Get User 1's recipes (should have r1 and r3)
        // We need to decode the token to get the ID (it is userResponse.body.id from setup)
        // But since we don't have access to userId variable easily here (it's inside beforeEach),
        // we'll fetch it from the /users/me endpoint if it existed, or just trust the earlier logic.
        // Actually, we can get it from decoding the token.
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) throw new Error('Invalid token');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const userId = payload.sub;

        await request(app.getHttpServer())
            .get(`/recipes/user/${userId}?role=creator`)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBeGreaterThanOrEqual(2);
                const ids = res.body.map(r => r.id);
                expect(ids).toContain(r1.body.id);
                expect(ids).toContain(r3.body.id);
                // Should NOT contain r2
                expect(ids).not.toContain(r2.body.id);
            });
    });

    it('Search by Ingredients (POST) - Strict Subset Logic', async () => {
        // 1. Create a recipe with [Tomato, Cheese] -> Match
        const r1 = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Caprese Salad',
                instructions: 'Slice and mix.',
                ingredients: [
                    { quantity: 1, unit: 'pc', customIngredientText: 'Tomato' },
                    { quantity: 1, unit: 'pc', customIngredientText: 'Cheese' },
                ]
            }).expect(201);

        // 2. Create a recipe with [Tomato] -> Match (subset)
        const r2 = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Just Tomato',
                instructions: 'Eat it.',
                ingredients: [
                    { quantity: 1, unit: 'pc', customIngredientText: 'Tomato' },
                ]
            }).expect(201);

        // 3. Create a recipe with [Tomato, Cheese, Basil] -> No Match (Basil not in fridge)
        const r3 = await request(app.getHttpServer())
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pesto Pasta',
                instructions: 'Mix.',
                ingredients: [
                    { quantity: 1, unit: 'pc', customIngredientText: 'Tomato' },
                    { quantity: 1, unit: 'pc', customIngredientText: 'Cheese' },
                    { quantity: 1, unit: 'pc', customIngredientText: 'Basil' },
                ]
            }).expect(201);

        // 4. Search for ['Tomato', 'Cheese']
        // Expect R1 and R2. Sort order: R1 (2 matches) > R2 (1 match).
        await request(app.getHttpServer())
            .post('/recipes/search/ingredients')
            .set('Authorization', `Bearer ${token}`)
            .send(['Tomato', 'Cheese'])
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                const ids = res.body.map(r => r.id);
                // Verify R1 and R2 are present
                expect(ids).toContain(r1.body.id);
                expect(ids).toContain(r2.body.id);
                // Verify R3 is NOT present
                expect(ids).not.toContain(r3.body.id);

                // Verify Order: R1 then R2 (filtered list to only relevant ones)
                const relevant = res.body.filter(r => [r1.body.id, r2.body.id].includes(r.id));
                expect(relevant[0].id).toBe(r1.body.id);
                expect(relevant[1].id).toBe(r2.body.id);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
