const express = require('express');
const router = express.Router();
const RestaurantService = require('../../domain/services/restaurant');

// Create a new restaurant
router.post('/', async (req, res) => {
    try {
        const restaurant = await RestaurantService.createRestaurant(req.body);
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await RestaurantService.getAllRestaurants();
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch leads due for a call
router.get('/due-calls', async (req, res) => {
    try {
        const leads = await RestaurantService.getLeadsDueForCall();
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get performance metrics for all restaurants
router.get('/performance-metrics', async (req, res) => {
    try {
        const performanceData = await RestaurantService.getPerformanceMetrics();
        res.status(200).json(performanceData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await RestaurantService.getRestaurantById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a restaurant by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedRestaurant = await RestaurantService.updateRestaurant(req.params.id, req.body);
        res.status(200).json(updatedRestaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a restaurant by ID
router.delete('/:id', async (req, res) => {
    try {
        const success = await RestaurantService.deleteRestaurant(req.params.id);
        if (!success) return res.status(404).json({ error: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
