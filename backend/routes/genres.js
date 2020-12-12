const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const { Genre, validate } = require('../model/genre');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

router.get('/:id', validateObjectId, async(req, res) => {

    const { id } = req.params;
 
    const genre = await Genre.findById(id);

    if (!genre)
        return res.status(404).send("Genre not found");

    res.send(genre);

});

router.post('/', auth, async(req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    try {

        genre = await genre.save();
        res.send(genre);

    } catch (e) {
        res.send(e);
    }
    
})

router.put('/:id', async(req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    const { error } = validate(req.body)
    if (error) 
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate( id, { name: name }, { new: true })

    if (!genre) 
        return res.status(404).send("Genre not found");

    res.send(genre)

})

router.delete('/:id', [auth, admin], async(req, res) => {
    
    const { id } = req.params;
    const genre = await Genre.findByIdAndRemove(id);

    if (!genre)
        return res.status(404).send("Genre not found.");
    
    res.send(genre);

})

module.exports = router;