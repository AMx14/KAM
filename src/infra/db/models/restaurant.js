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
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'converted'),
                allowNull: false,
                defaultValue: 'active',
                validate: {
                    isIn: {
                        args: [['active', 'inactive', 'converted']],
                        msg: "Status must be one of: 'active', 'inactive', or 'converted'"
                    }
                }
            },
            call_frequency: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    isInt: true
                }
            },
            last_call_date: {
                type: DataTypes.DATE,
                allowNull: true, // Nullable initially as no calls might have been made
            },
            address_id: {
                type: DataTypes.INTEGER,
                allowNull: true, // Foreign key to the addresses table
                references: {
                    model: 'addresses', // Matches the table name
                    key: 'id',
                },
                onDelete: 'SET NULL', // Optional: Set NULL if the address is deleted
            },
        },
        {
            sequelize,
            modelName: 'Restaurant',
            tableName: 'Restaurants', // Change back to original table name with capital 'R'
            timestamps: true, // Automatically manage createdAt and updatedAt
        }
    );

    // Define model associations
    Restaurant.associate = (models) => {
        // A restaurant belongs to an address
        Restaurant.belongsTo(models.Address, {
            foreignKey: 'address_id',
            as: 'address', // Unique alias
        });

        // A restaurant can have many contacts
        Restaurant.hasMany(models.Contact, {
            foreignKey: 'restaurant_id',
            as: 'contacts', // Unique alias
            onDelete: 'CASCADE',
        });

        // A restaurant can have many interactions
        Restaurant.hasMany(models.Interaction, {
            foreignKey: 'restaurant_id',
            as: 'interactions', // Unique alias
            onDelete: 'CASCADE',
        });
    };


    return Restaurant;
};
