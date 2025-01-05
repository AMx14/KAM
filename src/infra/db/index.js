const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.PGHOST || process.env.DB_HOST,
    port: process.env.PGPORT || process.env.DB_PORT,
    username: process.env.PGUSER || process.env.DB_USER,
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
    database: process.env.PGDATABASE || process.env.DB_NAME,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = { sequelize, models, Sequelize }; // Export Sequelize explicitly
