const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { AuthorizationError } = require('../errors/customErrors');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error: 'No authorization header',
                type: 'AuthorizationError'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                error: 'No token provided',
                type: 'AuthorizationError'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            logger.error(`Token verification failed: ${err.message}`);
            return res.status(401).json({
                error: 'Invalid or expired token',
                type: 'AuthorizationError'
            });
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            type: 'ServerError'
        });
    }
};

module.exports = authMiddleware;
