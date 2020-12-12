const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => winston.info(`Success connecting with ${ db } ...`));
}