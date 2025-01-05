const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Initialize Sequelize with DATABASE_URL or local config
const sequelize = new Sequelize(process.env.DATABASE_URL || {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'kam_db',
    dialectOptions: {
        ssl: process.env.DATABASE_URL ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});

// Initialize models object
const models = {};

// Read model files
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.') !== 0 && 
               file !== 'index.js' && 
               file.slice(-3) === '.js';
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        models[model.name] = model;
    });

// Set up associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = { sequelize, models };
