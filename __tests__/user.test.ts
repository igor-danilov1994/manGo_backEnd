import request from "supertest";
import { app, closeServer } from "../src";
import { LoginPayload, RegistrationPayload } from "../src/types/user";
import { afterEach } from "node:test";

const registrationMockData: RegistrationPayload = {
    email: 'test@test.com',
    lastName: 'lastname',
    firstName: 'firstname',
    country: 'country',
    referral: 'referral',
    username: 'username',
    password: 'password',
    secret_code: 1234,
    phone_number: 'phone_number',
    dateOfBirth: new Date().toISOString(),
};

const loginMockData: LoginPayload = {
    email: registrationMockData.email,
    password: registrationMockData.password,
    phone_number: registrationMockData.phone_number,
};

describe('User flows', () => {
    const runStartServer = request(app);
    let token = '';
    let userId = '';

    afterEach(async () => {
        await closeServer();
    });

    it('Test endpoint', async () => {
        const response = await runStartServer
            .post('/api/test')
            .expect(200);

        expect(response.body).toEqual({ status: 'test passed' });
    });


    it('Successful user registration', async () => {
        const response = await runStartServer
            .post('/api/registration')
            .send(registrationMockData)
            .expect(200);

        userId = response.body.id;
    });

    it('Successful user authentication', async () => {
        const response = await runStartServer
            .post('/api/login')
            .send(loginMockData)
            .expect(200);

        token = response.body.access_token;
    });

    it('Get my data', async () => {
        await runStartServer
            .get('/api/getMyData')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('Get user by id', async () => {
        await runStartServer
            .get(`/api/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('Delete user', async () => {
        await runStartServer
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('Failed authentication after user deletion', async () => {
        await runStartServer
            .post('/api/login')
            .send(loginMockData)
            .expect(400); // Failed login after user deletion
    });
});
