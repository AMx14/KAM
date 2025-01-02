const { Model, DataTypes } = require('sequelize');

class Interaction extends Model {}

module.exports = (sequelize) => {
    Interaction.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM('call', 'order'), // Interaction types: call or order
                allowNull: false,
            },
            details: {
                type: DataTypes.TEXT,
                allowNull: true, // Optional details about the interaction
            },
            date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW, // Default to the current date
            },
            restaurant_id: {
                type: DataTypes.INTEGER,
                allowNull: false, // Interaction must be associated with a restaurant
                references: {
                    model: 'Restaurants', // Reference to the Restaurants table
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Interaction',
            tableName: 'Interactions', // Explicit table name
            timestamps: true, // Automatically manage createdAt and updatedAt
        }
    );

    // Define model associations
    Interaction.associate = (models) => {
        Interaction.belongsTo(models.Restaurant, {
            foreignKey: 'restaurant_id',
            as: 'restaurant',
            onDelete: 'CASCADE', // Ensure cascade delete
        });
    };


    return Interaction;
};
