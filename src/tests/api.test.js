import request from 'supertest';
import server from '../index.js';

describe('CRUD API testing', () => {
    let createdUserId;
    const userData = {
        "username": "wowwan",
        "age": 41,
        "hobbies": ["staff", "beer", "trips"]
    };


    test('GET /api/users should return status 200', async () => {
		const response = await request(server).get('/api/users');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});

    test('GET /api/users/invalid_userId should return status 400', async () => {
        const response = await request(server).get('/api/users/invalid_userId');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "userId invalid"})
    });

    test('GET /Invalid URL should return status 404', async () => {
        const response = await request(server).get('/invalid');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Requested URL not found"})
    }, 10000);

    test('POST /api/users should return status 200', async () => {
        const response = await request(server).post('/api/users').send(userData);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(userData)
        createdUserId = response.body.id;

    }, 10000);

    test('GET /api/users/:userId should return status 200', async () => {
        const response = await request(server).get(`/api/users/${createdUserId}`)
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(userData);
    }, 10000);

    test('PUT /api/users/:userId should return status 200', async () => {
        const response = await request(server).put(`/api/users/${createdUserId}`).send(userUpdatedData);
        expect(response.status).toBe(200);
        //expect(response.body).toMatchObject(userUpdatedData);

    }, 10000);

    test('DELETE /api/users/:userId should return status 200', async () => {
        const response = await request(server).delete(`/api/users/${createdUserId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted"});
    }, 10000);

});
