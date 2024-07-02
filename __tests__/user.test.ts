import request from "supertest";
import { app, closeServer } from "../src";
import {
    LoginRequest,
    RegistrationRequest,
    CheckSMSCodePayload,
    SendSMSCodePayload
} from "../src/types/user";

const registrationMockData: RegistrationRequest = {
    email: process.env.MOCK_USER_FOR_SEND_MESSAGE || '',
    lastName: 'lastname',
    firstName: 'firstname',
    country: 'country',
    referral: 1,
    username: 'username',
    password: 'password',
    phone_number: 'phone_number',
    dateOfBirth: new Date().toISOString(),
};

const loginMockData: LoginRequest = {
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

    afterAll(async () => {
        await closeServer();
    });

    it('Test endpoint', async () => {
        const response = await runStartServer
            .post('/api/test')
            .expect(200);

        expect(response.body).toEqual({ status: 'test passed' });
    });

    it('Successful send sms code', async () => {
      await runStartServer
            .post('/api/registration/send-sms-code')
            .send({ email: registrationMockData.email } as SendSMSCodePayload)
            .expect(200);
    });

    it('Successful check sms code', async () => {
      await runStartServer
            .post('/api/registration/check-sms-code')
            .send({ email: registrationMockData.email, code: '0000' } as CheckSMSCodePayload)
            .expect(400);
    });

    it('Successful user registration', async () => {
        await runStartServer
            .post('/api/registration')
            .send(registrationMockData as RegistrationRequest)
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

        const request: LoginRequest = {
            ...loginMockData,
            client_id: temp_client_id,
            client_secret: temp_client_secret_code,
        }

        const response = await runStartServer
            .post('/api/login')
            .send(request)
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
