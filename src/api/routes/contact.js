const express = require('express');
const router = express.Router();
const ContactService = require('../../domain/services/contact');

// Create a new contact
router.post('/', async (req, res) => {
    try {
        const contact = await ContactService.createContact(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await ContactService.getAllContacts();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all contacts for a specific restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const contacts = await ContactService.getContactsByRestaurantId(req.params.restaurantId);
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedContact = await ContactService.updateContact(req.params.id, req.body);
        res.status(200).json(updatedContact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
    try {
        const success = await ContactService.deleteContact(req.params.id);
        if (!success) return res.status(404).json({ error: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
