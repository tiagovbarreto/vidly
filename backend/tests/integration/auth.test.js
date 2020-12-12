const request = require('supertest');

const { Genre } = require('../../model/genre');
const { User } = require('../../model/user');

let server;

describe('auth middleware', () => {

    beforeEach(() => { server = require('../../index') });
    afterEach( async () => { 
        await Genre.deleteOne({});
        await server.close(); 
    });

    let token;
    

    beforeEach(() => { 
        token = new User().generateAuthToken();
    });

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if if token is invalid', async() => {
        token = '1';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if if token is valid', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });


});
