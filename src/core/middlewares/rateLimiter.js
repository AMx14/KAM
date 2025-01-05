const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../../infra/redis');

const limiter = rateLimit({
    store: new RedisStore({
        client: redis,
        prefix: 'rate_limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

module.exports = limiter; 