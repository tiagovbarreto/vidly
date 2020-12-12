const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const { User, validate } = require('../model/user');

router.get('/', async(req, res) => {
    const user = await User.find().sort({ name: 1 });
    res.send(user);
})

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


router.get('/:id', async(req, res) => {

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user)
        return res.status(404).send("User not found");

    res.send(user);

})

router.post('/', async(req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
  
    const { name, email, password, isAdmin } = req.body;
    
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).send('User already registered.')

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt); 

    user = new User({
        name: name,
        email: email,
        password: hashed,
        isAdmin: isAdmin
    });

    try {

        user = await user.save();
        const token = user.generateAuthToken();
        
        res.header('x-auth-token', token).send({ id: user.id, name: user.name, email: user.email });

    } catch (e) {
        res.send(e);
    }
})

router.put('/:id', async(req, res) => {

    const { error } = validate(req.body)
    if (error) 
        return res.status(400).send(error.details[0].message);
    
    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, req.body, { new: true });

    if (!user) 
        return res.status(404).send("User not found");

    res.send(user)

})

router.delete('/:id', async(req, res) => {
    
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id);

    if (!user)
        return res.status(404).send("User not found.");
    
    res.send(user);

})

module.exports = router;