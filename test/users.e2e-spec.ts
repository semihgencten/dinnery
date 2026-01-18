
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/users (POST)', () => {
        const uniqueUsername = `user_${Date.now()}`;
        const uniqueEmail = `${uniqueUsername}@example.com`;

        return request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'Test User',
                username: uniqueUsername,
                email: uniqueEmail,
                country: 'TestLand',
                avatar: 'http://example.com/avatar.jpg'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.username).toBe(uniqueUsername);
                expect(res.body.email).toBe(uniqueEmail);
            });
    });

    it('/users (GET)', async () => {
        const uniqueUsername = `user_list_${Date.now()}`;
        const uniqueEmail = `${uniqueUsername}@example.com`;

        await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'List User',
                username: uniqueUsername,
                email: uniqueEmail,
                country: 'ListLand'
            })
            .expect(201);

        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                const user = res.body.find(u => u.username === uniqueUsername);
                expect(user).toBeDefined();
                expect(user.country).toBe('ListLand');
            });
    });

    it('/users/:id (GET)', async () => {
        const uniqueUsername = `user_single_${Date.now()}`;
        const uniqueEmail = `${uniqueUsername}@example.com`;

        const createResponse = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'Single User',
                username: uniqueUsername,
                email: uniqueEmail,
                country: 'SingleLand'
            })
            .expect(201);

        const id = createResponse.body.id;

        return request(app.getHttpServer())
            .get(`/users/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBe(id);
                expect(res.body.username).toBe(uniqueUsername);
                expect(res.body.email).toBe(uniqueEmail);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
