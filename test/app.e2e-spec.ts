import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
      await app.close();
  })

    describe('Projects API', () => {
        it('should require authentication for /projects', () => {
            return request(app.getHttpServer())
                .get('/projects')
                .expect(401); // Should fail without auth header
        });

        it('should allow authenticated access to /projects', () => {
            return request(app.getHttpServer())
                .get('/projects')
                .set('x-user-id', '1') // Super Admin
                .expect(200);
        });

        it('should validate project creation data', () => {
            return request(app.getHttpServer())
                .post('/projects')
                .set('x-user-id', '2') // Admin
                .send({ name: '' }) // empty name
                .expect(400);
        });

        it('should allow admin to create project', () => {
            return request(app.getHttpServer())
                .post('/projects')
                .set('x-user-id', '2') // Admin
                .send({
                    name: 'Test Project',
                    userIds: []
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).toBe('Test Project');
                });
        });

        it('should forbid user from creating project', () => {
            return request(app.getHttpServer())
                .post('/projects')
                .set('x-user-id', '4') // Regular user
                .send({
                    name: 'Test Project',
                    userIds: []
                })
                .expect(403);
        });
    });

    describe('Analyses API', () => {
        it('should require authentication for analyses', () => {
            return request(app.getHttpServer())
                .get('/projects/1/analyses')
                .expect(401);
        });

        it('should allow authenticated access to analyses', () => {
            return request(app.getHttpServer())
                .get('/projects/1/analyses')
                .set('x-user-id', '2') // Admin who owns project 1
                .expect(200);
        });

        it('should validate analysis creation data', () => {
            return request(app.getHttpServer())
                .post('/projects/1/analyses')
                .set('x-user-id', '2') // Admin
                .send({ name: '' }) // Invalid - empty name
                .expect(400);
        });
    });

    describe('Authentication', () => {
        it('should work with user email header', () => {
            return request(app.getHttpServer())
                .get('/projects')
                .set('x-user-email', 'superadmin@test.com')
                .expect(200);
        });

        it('should reject invalid user ID', () => {
            return request(app.getHttpServer())
                .get('/projects')
                .set('x-user-id', '999') // Non-existent user
                .expect(401);
        });

        it('should reject invalid user email', () => {
            return request(app.getHttpServer())
                .get('/projects')
                .set('x-user-email', 'nonexistent@test.com')
                .expect(401);
        });
    });
});
