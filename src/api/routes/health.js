const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Add basic health checks here
        // Example: Database connection check
        await sequelize.authenticate();
        res.status(200).json({ status: 'healthy' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

module.exports = router; 