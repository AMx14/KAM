const { Model, DataTypes } = require('sequelize');

class Restaurant extends Model {}

module.exports = (sequelize) => {
    Restaurant.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false, // Name is mandatory
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true, // Address is optional
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'converted'),
                defaultValue: 'active', // Default to 'active' when not specified
            },
            call_frequency: {
                type: DataTypes.INTEGER,
                defaultValue: 7, // Default to 7 days for call reminders
            },
            last_call_date: {
                type: DataTypes.DATE,
                allowNull: true, // Nullable initially as no calls might have been made
            },
        },
        {
            sequelize,
            modelName: 'Restaurant',
            tableName: 'Restaurants', // Explicitly define table name
            timestamps: true, // Automatically manage createdAt and updatedAt
        }
    );

    // Define model associations
    Restaurant.associate = (models) => {
        // A restaurant can have many contacts
        Restaurant.hasMany(models.Contact, {
            foreignKey: 'restaurant_id',
            as: 'contacts', // Alias for accessing associated contacts
            onDelete: 'CASCADE', // Delete associated contacts when a restaurant is deleted
        });

        // A restaurant can have many interactions
        Restaurant.hasMany(models.Interaction, {
            foreignKey: 'restaurant_id',
            as: 'interactions', // Alias for accessing associated interactions
            onDelete: 'CASCADE', // Delete associated interactions when a restaurant is deleted
        });
    };

    return Restaurant;
};
