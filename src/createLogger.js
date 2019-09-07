const winston = require('winston');

module.exports = function createLogger(DEBUG) {

    // TODO add rotate file logger
    const logger = winston.createLogger({
        level: 'info',
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