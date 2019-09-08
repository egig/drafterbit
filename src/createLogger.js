const winston = require('winston');

module.exports = function createLogger(debug) {

    // TODO add rotate file logger
    const logger = winston.createLogger({
        level: debug ? 'debug' : 'warn',
        format: winston.format.json(),
        transports: []
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    return logger;
}