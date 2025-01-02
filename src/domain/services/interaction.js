const { models, Sequelize } = require('../../infra/db');

const InteractionService = {
    async createInteraction(interactionData) {
        const interaction = await models.Interaction.create(interactionData);

        if (interaction.type === 'call') {
            const restaurant = await models.Restaurant.findByPk(interaction.restaurant_id);
            if (restaurant) {
                restaurant.last_call_date = interaction.date || new Date();
                await restaurant.save();
            }
        }

        return interaction;
    },

    async getInteractionsByRestaurantId(restaurantId) {
        return await models.Interaction.findAll({
            where: { restaurant_id: restaurantId },
            order: [['date', 'DESC']],
        });
    },

    async updateInteraction(interactionId, updates) {
        const interaction = await models.Interaction.findByPk(interactionId);
        if (!interaction) throw new Error('Interaction not found');
        return await interaction.update(updates);
    },

    async deleteInteraction(interactionId) {
        const interaction = await models.Interaction.findByPk(interactionId);
        if (!interaction) throw new Error('Interaction not found');
        await interaction.destroy();
        return true;
    },

    async getLeadsDueForCall() {
        return await models.Restaurant.findAll({
            where: Sequelize.literal(`
                "last_call_date" IS NULL
                OR "last_call_date" + "call_frequency" * interval '1 day' <= CURRENT_DATE
            `),
        });
    },
    async getOrderFrequency(restaurantId) {
        const orders = await models.Interaction.findAll({
            where: {
                restaurant_id: restaurantId,
                type: 'order',
            },
            order: [['date', 'ASC']],
        });

        if (orders.length < 2) return { frequency: null, averageGap: null };

        const intervals = [];
        for (let i = 1; i < orders.length; i++) {
            const diff = orders[i].date - orders[i - 1].date; // Difference in milliseconds
            intervals.push(diff);
        }

        const averageGap = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        return {
            frequency: orders.length,
            averageGap: Math.round(averageGap / (1000 * 60 * 60 * 24)), // Convert to days
        };
    },

    async getPerformanceData() {
        const allRestaurants = await models.Restaurant.findAll({
            include: [
                {
                    model: models.Interaction,
                    as: 'interactions',
                    where: { type: 'order' },
                    required: false,
                },
            ],
        });

        const performanceData = allRestaurants.map((restaurant) => {
            const orderInteractions = restaurant.interactions.filter(
                (interaction) => interaction.type === 'order'
            );

            const orderFrequency = orderInteractions.length;
            return {
                restaurantId: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                orderFrequency,
                status: orderFrequency > 5 ? 'well-performing' : 'underperforming', // Example threshold
            };
        });

        return performanceData;
    },

};

module.exports = InteractionService;




// Remaining Tasks Beyond Call Planning
// The remaining tasks you’ve mentioned are separate from call planning:
//
//     Performance Tracking:
//
//     Analyze ordering patterns and implement logic to determine well-performing and underperforming accounts based on Interaction data.
//     Authentication and Authorization:
//
//     Add JWT-based authentication.
//     Implement role-based access control for Admins and Regular Users.