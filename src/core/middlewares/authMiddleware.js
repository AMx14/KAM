const jwt = require('jsonwebtoken');
const logger = require('../logger'); // Use logger for structured error logs

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.error('Unauthorized access: Token missing');
        return res.status(401).json({ error: 'Unauthorized access. Token missing.' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // Attach user info to request
        next();
    } catch (err) {
        logger.error(`Invalid token: ${err.message}`);
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
