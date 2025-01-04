const express = require('express');
const AuthService = require('../../domain/services/auth');
const authMiddleware = require('../../core/middlewares/authMiddleware');
const roleMiddleware = require('../../core/middlewares/roleMiddleware');

const router = express.Router();

// Register new user
router.post('/register', AuthService.register);

// Login user
router.post('/login', AuthService.login);

// Get user profile
router.get('/profile', authMiddleware, AuthService.profile);

// Example: Admin-only route
router.delete('/admin/someRestrictedAction', [authMiddleware, roleMiddleware(['Admin'])], (req, res) => {
    res.status(403).json({ error: 'Access denied.' });
});

module.exports = router;
