import request from "supertest";
import { app, closeServer } from "../src";

const registrationData = {
    email: 'test_with_jest@test_with_jest',
    lastname: 'lastname',
    firstname: 'firstname',
    country: 'country',
    referral: 'referral',
    username: 'username',
    password: 'password',
    secret: 'secret',
    phone_number: 'phone_number',
}

describe('user flows', () => {
    const runStartServer = request(app)
    let token = ''

    afterAll(async () => {
        closeServer()
    });

    it('test ', async () => {
        await runStartServer
            .post('/api/test')
            .expect({ status: 'test passed' })
    });

    it('check registration user method', async () => {
       await runStartServer
            .post('/api/registration')
            .send(registrationData)
            .expect(200)
    });

    it('check login user method', async () => {
        const resp = await runStartServer
            .post('/api/login')
            .send({
                email: registrationData.email ,
                password: registrationData.password,
                phone_number: registrationData.phone_number,
            })
            .expect(200)

        token = resp.body.token
    });

    it('check delete user method', async () => {
       await runStartServer
           .delete('/api/user/delete')
           .set('Authorization', `Bearer ${token}`)
           .expect(200)
    });
})

