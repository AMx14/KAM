const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
    });

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message,
            type: 'ValidationError'
        });
    }

    // Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: err.errors[0].message,
            type: 'ValidationError'
        });
    }

    // Resource not found
    if (err.name === 'ResourceNotFoundError') {
        return res.status(404).json({
            error: err.message,
            type: 'NotFoundError'
        });
    }

    // Authorization errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Invalid or expired token',
            type: 'AuthenticationError'
        });
    }

    // Default error
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : err.message,
        type: 'ServerError',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
