import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IngredientsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ingredients (POST)', () => {
        return request(app.getHttpServer())
            .post('/ingredients')
            .send({
                name: 'Tomato',
                displayName: 'Fresh Tomato',
                photoUrl: 'http://example.com/tomato.jpg',
                category: 'Vegetable',
            })
            .expect(201);
    });

    it('/ingredients/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .post('/ingredients')
            .send({
                name: 'Onion',
                displayName: 'Red Onion',
            })
            .expect(201);

        const id = response.body.id;

        return request(app.getHttpServer())
            .get(`/ingredients/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBe(id);
                expect(res.body.name).toBe('onion'); // name is lowercased in domain model
                expect(res.body.displayName).toBe('Red Onion');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
