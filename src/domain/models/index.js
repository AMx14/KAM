// src/domain/models/index.js
const { Sequelize } = require('sequelize');
const RestaurantModel = require('../../infra/db/models/restaurant');
const ContactModel = require('../../infra/db/models/contact');
const InteractionModel = require('../../infra/db/models/interaction');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

const Restaurant = RestaurantModel(sequelize);
const Contact = ContactModel(sequelize);
const Interaction = InteractionModel(sequelize);

// Define Relationships
Restaurant.hasMany(Contact, { foreignKey: 'restaurant_id' });
Contact.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

Restaurant.hasMany(Interaction, { foreignKey: 'restaurant_id' });
Interaction.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

module.exports = {
    sequelize,
    Restaurant,
    Contact,
    Interaction,
};
