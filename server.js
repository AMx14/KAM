require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const logger = require('./src/core/logger');
const errorHandler = require('./src/core/middlewares/errorHandler');
const db = require('./src/infra/db');

// Import routes
const authRoutes = require('./src/api/routes/auth');
const restaurantRoutes = require('./src/api/routes/restaurant');
const contactRoutes = require('./src/api/routes/contact');
const addressRoutes = require('./src/api/routes/address');
const interactionRoutes = require('./src/api/routes/interaction');
const healthRoutes = require('./src/api/routes/health');

const app = express();

// Load OpenAPI spec
const swaggerDocument = YAML.load('./openapi.yaml');

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routes directly (not under /api)
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/contacts', contactRoutes);
app.use('/addresses', addressRoutes);
app.use('/interactions', interactionRoutes);
app.use('/health', healthRoutes);

// Handle undefined routes
app.use((req, res, next) => {
    logger.warn(`Undefined route accessed: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: `The route ${req.method} ${req.originalUrl} does not exist.` 
    });
});

// Global Error Handling Middleware
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 3000; // Changed to match your .env
let server;

const startServer = async () => {
    try {
        // Database connection
        await db.sequelize.authenticate();
        logger.info('Database connected!');

        // Sync database
        await db.sequelize.sync();
        logger.info('Database synced!');

        // Start server
        server = app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
            logger.info(`Database Host: ${process.env.DB_HOST}`);
            logger.info(`Redis Host: ${process.env.REDIS_HOST}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

// Graceful Shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received: Shutting down gracefully...');
    if (server) {
        server.close(() => {
            logger.info('HTTP server closed.');
            db.sequelize.close()
                .then(() => {
                    logger.info('Database connection closed.');
                    process.exit(0);
                })
                .catch((err) => {
                    logger.error('Error closing database connection:', err.message);
                    process.exit(1);
                });
        });
    }
});

module.exports = app;
