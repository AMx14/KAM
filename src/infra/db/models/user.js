const { Model, DataTypes } = require('sequelize');

class User extends Model {}

module.exports = (sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false, // Store hashed passwords only
            },
            role: {
                type: DataTypes.ENUM('Admin', 'KAM', 'Viewer'),
                defaultValue: 'KAM',
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            timestamps: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Restaurant, {
            foreignKey: 'user_id',
            as: 'restaurants',
            onDelete: 'CASCADE',
        });
    };

    return User;
};
