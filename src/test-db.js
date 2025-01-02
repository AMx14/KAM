const { sequelize, models } = require('./infra/db');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
        console.log('Models:', Object.keys(models)); // Log loaded models
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
