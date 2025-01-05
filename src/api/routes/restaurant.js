const express = require('express');
const router = express.Router();
const RestaurantService = require('../../domain/services/restaurant');
const authMiddleware = require('../../core/middlewares/authMiddleware');
const roleMiddleware = require('../../core/middlewares/roleMiddleware');

// Create a new restaurant
router.post('/', async (req, res, next) => {
    try {
        const restaurant = await RestaurantService.createRestaurant(req.body);
        res.status(201).json(restaurant);
    } catch (err) {
        next(err); // Delegate error to global handler
    }
});

// Get all restaurants
router.get('/', async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit
        };

        const result = await RestaurantService.getRestaurants(filters);
        
        res.json({
            status: 'success',
            data: {
                restaurants: result.restaurants,
                pagination: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// Fetch leads due for a call
router.get('/due-calls', async (req, res, next) => {
    try {
        const leads = await RestaurantService.getLeadsDueForCall();
        if (leads.length === 0) {
            return res.status(404).json({ error: 'No restaurants are due for calls today.' });
        }
        res.status(200).json(leads);
    } catch (err) {
        next(err);
    }
});

// Get performance metrics for all restaurants
router.get('/performance-metrics', async (req, res, next) => {
    try {
        const performanceData = await RestaurantService.getPerformanceMetrics();
        if (performanceData.length === 0) {
            return res.status(404).json({ error: 'No performance metrics available for restaurants.' });
        }
        res.status(200).json(performanceData);
    } catch (err) {
        next(err);
    }
});

// Get a specific restaurant by ID
router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await RestaurantService.getRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.status(200).json(restaurant);
    } catch (err) {
        next(err);
    }
});

// Update a restaurant by ID
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const updatedRestaurant = await RestaurantService.updateRestaurant(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.status(200).json(updatedRestaurant);
    } catch (err) {
        next(err);
    }
});

// Delete a restaurant by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const success = await RestaurantService.deleteRestaurant(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.status(200).json({ message: 'Restaurant deleted successfully.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
