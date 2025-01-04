require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const routes = require('./src/api'); // Import the API routes
const db = require('./src/infra/db'); // Sequelize setup
const logger = require('./src/core/logger'); // Logger utility
const errorHandler = require('./src/core/middlewares/errorHandler'); // Global error handler

const app = express();

// Load OpenAPI spec
const swaggerDocument = YAML.load('./openapi.yaml');

// Middleware
app.use(helmet()); // Add security headers
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Serve Swagger UI for API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Static Assets (e.g., custom Swagger UI branding, if needed)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', routes);

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        logger.info('Health check passed: Database connected');
        res.status(200).json({ status: 'OK', database: 'Connected' });
    } catch (err) {
        logger.error(`Health check failed: ${err.message}`);
        res.status(500).json({ status: 'FAIL', database: 'Disconnected', error: 'Database connection error.' });
    }
});

// Handle undefined routes
app.use((req, res, next) => {
    logger.warn(`Undefined route accessed: ${req.method} ${req.url}`);
    res.status(404).json({ error: `The route ${req.method} ${req.originalUrl} does not exist.` });
});

// Global Error Handling Middleware
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 3000;
let server;

if (process.env.NODE_ENV !== 'test') {
    db.sequelize.sync()
        .then(() => {
            logger.info('Database connected!');
            server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
        })
        .catch((err) => {
            logger.error('Failed to connect to database:', err.message);
            process.exit(1);
        });
} else {
    // For test environment, sync with force: true
    db.sequelize.sync({ force: true })
        .then(() => {
            logger.info('Test database synchronized');
        })
        .catch((err) => {
            logger.error('Failed to sync test database:', err.message);
            process.exit(1);
        });
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
                    process.exit(0); // Exit with success
                })
                .catch((err) => {
                    logger.error('Error closing database connection:', err.message);
                    process.exit(1); // Exit with failure
                });
        });
    }
});

// Export app instance for testing
module.exports = app;
