const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the KAM API!' });
});

// Import route files
const addressRoutes = require('./routes/address');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const contactRoutes = require('./routes/contact');
const interactionRoutes = require('./routes/interaction');

// Register routes
router.use('/address', addressRoutes);
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/contacts', contactRoutes);
router.use('/interactions', interactionRoutes);

// Debug route to list all registered routes
router.get('/routes', (req, res) => {
    const routes = [];
    router.stack.forEach(middleware => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        }
    });
    res.json(routes);
});

module.exports = router;
