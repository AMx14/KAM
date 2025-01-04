module.exports = (err, req, res, next) => {
    console.error('Error:', err.message || err);

    // Handle Sequelize Validation Errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors.map((e) => e.message).join(', ') });
    }

    // Handle Foreign Key Constraint Errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: 'Invalid foreign key provided.' });
    }

    // Handle Resource Not Found
    if (err.status === 404) {
        return res.status(404).json({ error: err.message || 'Resource not found.' });
    }

    // Default to 500 Internal Server Error
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
};
