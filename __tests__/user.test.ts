import request from "supertest";
import { app, closeServer } from "../src";
import { LoginPayload, RegistrationPayload } from "../src/controllers/user";

const registrationMockData: RegistrationPayload = {
    email: 'test_with_jest@test_with_jest',
    lastname: 'lastname',
    firstname: 'firstname',
    country: 'country',
    referral: 'referral',
    username: 'username',
    password: 'password',
    secret_code: 1234,
    phone_number: 'phone_number',
    dateOfBirth: new Date().toISOString(),
}

const loginMockData: LoginPayload = {
    email: registrationMockData.email,
    password: registrationMockData.password,
    phone_number: registrationMockData.phone_number,
};

describe('user flows', () => {
    const runStartServer = request(app);
    let token = '';
    let userId = '';

    afterAll(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Тайм-аут для ожидания завершения всех операций
        await closeServer(); // Явный вызов await для закрытия сервера
    });

    it('test', async () => {
        await runStartServer
            .post('/api/test')
            .expect(200)
            .expect({ status: 'test passed' });
    });

    it('check registration user method', async () => {
        const resp = await runStartServer
            .post('/api/registration')
            .send(registrationMockData)
            .expect(200);

        userId = resp.body.id;
    });

    it('check login user method', async () => {
        const resp = await runStartServer
            .post('/api/login')
            .send(loginMockData)
            .expect(200);

        token = resp.body.token;
    });

    it('check getUserById user method', async () => {
        await runStartServer
            .get(`/api/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('check delete user method', async () => {
        await runStartServer
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('detect failed login user method after delete user', async () => {
        await runStartServer
            .post('/api/login')
            .send(loginMockData)
            .expect(400); // Failed login after delete user
    });
});
