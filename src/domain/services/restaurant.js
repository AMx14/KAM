const { models, Sequelize } = require('../../infra/db');

const RestaurantService = {
    async createRestaurant(restaurantData) {
        return await models.Restaurant.create(restaurantData);
    },

    async getAllRestaurants() {
        return await models.Restaurant.findAll();
    },

    async getRestaurantById(id) {
        return await models.Restaurant.findByPk(id);
    },

    async updateRestaurant(id, updateData) {
        const restaurant = await models.Restaurant.findByPk(id);
        if (!restaurant) return null;
        return await restaurant.update(updateData);
    },

    async deleteRestaurant(id) {
        const restaurant = await models.Restaurant.findByPk(id);
        if (!restaurant) return false;
        await restaurant.destroy();
        return true;
    },

    async getLeadsDueForCall() {
        return await models.Restaurant.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { last_call_date: null }, // No call has been made
                    Sequelize.literal(
                        '"last_call_date" + "call_frequency" * interval \'1 day\' <= CURRENT_DATE'
                    ),
                ],
            },
        });
    },

    async getPerformanceMetrics() {
        try {
            const restaurants = await models.Restaurant.findAll({
                include: [
                    {
                        model: models.Interaction,
                        as: 'interactions',
                        attributes: ['type', 'date'], // Fetch relevant fields
                    },
                ],
            });

            return restaurants.map((restaurant) => {
                const interactions = restaurant.interactions || [];
                const orderInteractions = interactions.filter((i) => i.type === 'order');

                const totalOrders = orderInteractions.length;

                if (totalOrders === 0) {
                    return {
                        id: restaurant.id,
                        name: restaurant.name,
                        totalOrders,
                        averageOrderFrequency: null,
                        performanceStatus: 'underperforming',
                        message: 'No orders have been placed for this restaurant.',
                    };
                }

                const averageOrderFrequency =
                    totalOrders > 1
                        ? Math.round(
                            orderInteractions.reduce((acc, interaction, index) => {
                                if (index === 0) return acc; // Skip first interaction
                                const prevInteraction = orderInteractions[index - 1];
                                const gapInDays =
                                    (new Date(interaction.date) - new Date(prevInteraction.date)) /
                                    (1000 * 60 * 60 * 24);
                                return acc + gapInDays;
                            }, 0) /
                            (totalOrders - 1)
                        )
                        : null;

                const performanceStatus =
                    totalOrders >= 10
                        ? 'well-performing'
                        : totalOrders > 0
                            ? 'average'
                            : 'under-performing';

                return {
                    id: restaurant.id,
                    name: restaurant.name,
                    totalOrders,
                    averageOrderFrequency,
                    performanceStatus,
                };
            });
        } catch (error) {
            console.error('Error fetching performance metrics:', error.message || error);
            throw new Error('Unable to fetch performance metrics');
        }
    },
};

module.exports = RestaurantService;
