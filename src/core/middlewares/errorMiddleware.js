const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error (using the logger)
    const logger = require('../logger');
    logger.error(`Error: ${message} | Status: ${status}`);

    res.status(status).json({
        error: true,
        status,
        message,
    });
};

module.exports = errorMiddleware;
