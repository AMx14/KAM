const { Model, DataTypes } = require('sequelize');

class Interaction extends Model {}

module.exports = (sequelize, DataTypes) => {
    const Interaction = sequelize.define('Interaction', {
        type: {
            type: DataTypes.ENUM('call', 'visit', 'email', 'meeting'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['call', 'visit', 'email', 'meeting']],
                    msg: "Type must be one of: 'call', 'visit', 'email', 'meeting'"
                }
            }
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Interaction.associate = (models) => {
        Interaction.belongsTo(models.Restaurant, {
            foreignKey: 'restaurant_id',
            onDelete: 'CASCADE'
        });
    };

    return Interaction;
};
