const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');

const { Rental } = require('../../model/rental');
const { User } = require('../../model/user');

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let rental;
    let customer;
    let movie;
    let token;

    const exec = () => {

        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId });

    }

    beforeEach( async() => { 

        server = require('../../index');
       
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        token = new User().generateAuthToken();
        
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();

    });

    afterEach( async () => { 
        await Rental.deleteOne({}); 
        await server.close();
    });

    it('shoud return 401 if client is not logged in', async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('shoud return 400 if custumerId is not provided', async() => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    
    it('shoud return 400 if movieId is not provided', async() => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    
    it('shoud return 404 if no rental is returned from customer/movie', async() => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('shoud return 400 if rental is processed', async() => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('shoud return 200 if it is a valid request', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('shoud set the return date if input is valid', async() => {
        await exec();
        const result = await Rental.findById(rental._id);
        const diff = new Date() - result.dateReturned;
        expect(diff).toBeLessThan(10 * 1000); //10s
    });

    it('shoud set the rental fee if input is valid', async() => {
        rental.dateOut = moment().subtract(7, 'days').toDate();
        await rental.save();

        await exec();
        
        const result = await Rental.findById(rental._id);
        expect(result.rentalFee).toBe(14);
    });

});