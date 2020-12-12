const express = require('express');
const router = express.Router();

const { Customer, validate } = require('../model/customer');

router.get('/', async(req, res) => {
    const customer = await Customer.find().sort({ name: 1 });
    res.send(customer);
})

router.get('/:id', async(req, res) => {

    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer)
        return res.status(404).send("Customer not found");

    res.send(customer);

})

router.post('/', async(req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const { name, phone, isGold } = req.body;

    let customer = new Customer({
        name: name,
        phone: phone,
        isGold: isGold
    });

    try {

        customer = await customer.save();
        res.send(customer);

    } catch (e) {
        res.send(e);
    }
})

router.put('/:id', async(req, res) => {

    const { error } = validate(req.body)
    if (error) 
        return res.status(400).send(error.details[0].message);
    
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate( id, req.body, { new: true });

    if (!customer) 
        return res.status(404).send("Customer not found");

    res.send(customer)

})

router.delete('/:id', async(req, res) => {
    
    const { id } = req.params;
    const customer = await Customer.findByIdAndRemove(id);

    if (!customer)
        return res.status(404).send("Customer not found.");
    
    res.send(customer);

})

module.exports = router;