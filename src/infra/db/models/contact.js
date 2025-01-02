// src/infra/db/models/contact.js
const { Model, DataTypes } = require('sequelize');

class Contact extends Model {}

module.exports = (sequelize) => {
    Contact.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isEmail: true,
                },
            },
            restaurant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Restaurants', // Match the table name explicitly
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'Contact',
            tableName: 'Contacts', // Explicit table name
            timestamps: true,
        }
    );

    Contact.associate = (models) => {
        Contact.belongsTo(models.Restaurant, {
            foreignKey: 'restaurant_id',
            as: 'restaurant',
        });
    };


    return Contact;
};
