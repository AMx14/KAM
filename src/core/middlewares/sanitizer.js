const xss = require('xss');

const sanitizeRequest = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key].trim(), {
                    whiteList: {}, // empty object means no tags are allowed
                    stripIgnoreTag: true,
                    stripIgnoreTagBody: ['script'] // remove script tags and their contents
                });
            }
        });
    }
    next();
};

module.exports = sanitizeRequest; 