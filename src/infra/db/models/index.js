const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const models = {};

// Dynamically import all model files
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        models[model.name] = model;
    });

// Define associations if available in models
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Export Sequelize instance and models
module.exports = { sequelize, models };
