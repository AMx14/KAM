const { Model, DataTypes } = require('sequelize');

class Address extends Model {}

module.exports = (sequelize) => {
    Address.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true, // Street address is optional
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false, // City is required
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true, // State is optional
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false, // Country is required
            },
            pin_code: {
                type: DataTypes.STRING,
                allowNull: false, // Pin code is required
            },
            timezone: {
                type: DataTypes.STRING,
                allowNull: true, // Timezone will be calculated
            },
        },
        {
            sequelize,
            modelName: 'Address',
            tableName: 'addresses',
            timestamps: true, // Include createdAt and updatedAt
        }
    );

    // Define model associations
    Address.associate = (models) => {
        // An address can be associated with many restaurants
        Address.hasMany(models.Restaurant, {
            foreignKey: 'address_id',
            as: 'restaurants', // Alias for accessing associated restaurants
            onDelete: 'SET NULL', // Optional: Set NULL if the address is deleted
        });
    };

    return Address;
};
