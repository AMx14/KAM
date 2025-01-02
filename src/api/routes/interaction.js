const express = require('express');
const router = express.Router();
const InteractionService = require('../../domain/services/interaction');

// Create a new interaction
router.post('/', async (req, res) => {
    try {
        const interaction = await InteractionService.createInteraction(req.body);
        res.status(201).json(interaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all interactions for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const interactions = await InteractionService.getInteractionsByRestaurantId(req.params.restaurantId);
        res.status(200).json(interactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an interaction by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedInteraction = await InteractionService.updateInteraction(req.params.id, req.body);
        res.status(200).json(updatedInteraction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an interaction by ID
router.delete('/:id', async (req, res) => {
    try {
        const success = await InteractionService.deleteInteraction(req.params.id);
        if (!success) return res.status(404).json({ error: 'Interaction not found' });
        res.status(200).json({ message: 'Interaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// src/api/routes/interaction.js
router.get('/leads/due', async (req, res) => {
    try {
        const leads = await InteractionService.getLeadsDueForCall();
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
