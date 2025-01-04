const express = require('express');
const router = express.Router();
const AddressService = require('../../domain/services/address');

// Create a new address
router.post('/', async (req, res, next) => {
    try {
        const address = await AddressService.createAddress(req.body);
        res.status(201).json(address);
    } catch (error) {
        next(error); // Delegate to the global error handler
    }
});

// Get all addresses
router.get('/', async (req, res, next) => {
    try {
        const addresses = await AddressService.getAllAddresses();
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
});

// Get a specific address by ID
router.get('/:id', async (req, res, next) => {
    try {
        const address = await AddressService.getAddressById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Address not found.' });
        }
        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
});

// Update an address by ID
router.put('/:id', async (req, res, next) => {
    try {
        const updatedAddress = await AddressService.updateAddress(req.params.id, req.body);
        if (!updatedAddress) {
            return res.status(404).json({ error: 'Address not found.' });
        }
        res.status(200).json(updatedAddress);
    } catch (error) {
        next(error);
    }
});

// Delete an address by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const success = await AddressService.deleteAddress(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Address not found or linked to an entity.' });
        }
        res.status(200).json({ message: 'Address deleted successfully.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
