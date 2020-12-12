const express = require('express');
const router = express.Router();

const moment = require('moment');
const auth = require('../middleware/auth')
const { Rental } = require('../model/rental');

router.post('/', auth, async (req, res) => {

    const { customerId, movieId } = req.body;
    if(!customerId)
        return res.status(400).send('customerId is not provided.');
    
    if(!movieId)
        return res.status(400).send('movieId is not provided.');

    const rental = await Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });

    if(!rental) 
        return res.status(404).send('Rental not found.');

    if(rental.dateReturned)
        return res.status(400).send('Date returned already processed.');    

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate; 

    await rental.save();

    return res.status(200).send();
    
});

module.exports = router;

