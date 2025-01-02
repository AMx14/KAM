const express = require('express');
const restaurantRoutes = require('./routes/restaurant');
const contactRoutes = require('./routes/contact');
const interactionRoutes = require('./routes/interaction');

const router = express.Router();

// Mount individual routes
router.use('/restaurants', restaurantRoutes);
router.use('/contacts', contactRoutes);
router.use('/interactions', interactionRoutes);

// Optional: Add a base route
router.get('/', (req, res) => {
    res.send({ message: 'Welcome to the KAM API!' });
});

module.exports = router;
