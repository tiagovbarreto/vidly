const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors');

module.exports = function() {

    winston.handleExceptions( 
        new winston.transports.Console({ colorise: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtException.log' })
    );
    
    process.on('unhandledRejection', (e) => { 
        throw e;
    });
    //const p = Promise.reject(new Error('Promise reject error'));
    //p.then(() => console.log('Done'));
    
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    // winston.add(winston.transports.MongoDB, {
    //     db: 'mongodb://db/vidly',
    //     level: 'error'
    // });
}