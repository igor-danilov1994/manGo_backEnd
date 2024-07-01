import request from "supertest";
import { app, closeServer } from "../src";
import { LoginPayload, RegistrationPayload } from "../src/types/user";
import { afterEach } from "node:test";

const registrationMockData: RegistrationPayload = {
    email: 'test@test.com',
    lastName: 'lastname',
    firstName: 'firstname',
    country: 'country',
    referral: 1,
    username: 'username',
    password: 'password',
    phone_number: 'phone_number',
    dateOfBirth: new Date().toISOString(),
};

const loginMockData: LoginPayload = {
    email: registrationMockData.email,
    password: registrationMockData.password,
    phone_number: registrationMockData.phone_number,
};

let temp_client_id = ''
let temp_client_secret_code = ''

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
        await runStartServer
            .post('/api/registration')
            .send(registrationMockData)
            .expect(200);
    });

    it('Successful createClient', async () => {
        const response = await runStartServer
            .get('/api/create-client')
            .expect(200);

        temp_client_id = response.body.client_id;
        temp_client_secret_code = response.body.client_secret;
    });

    it('Successful user authentication', async () => {
        const response = await runStartServer
            .post('/api/login')
            .send({
                ...loginMockData,
                client_id: temp_client_id,
                client_secret: temp_client_secret_code,
            })
            .expect(200);

        token = response.body.access_token;
        userId = response.body.id;
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
