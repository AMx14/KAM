const { models, Sequelize } = require('../../infra/db');
const { ValidationError, ResourceNotFoundError } = require('../../core/errors/customErrors');

const VALID_STATUSES = ['active', 'inactive', 'converted'];

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

    async updateRestaurant(id, data) {
        // Validate status
        if (data.status && !['active', 'inactive', 'converted'].includes(data.status)) {
            throw new ValidationError("Status must be one of: 'active', 'inactive', or 'converted'");
        }

        // Validate call_frequency
        if (data.call_frequency !== undefined) {
            const frequency = parseInt(data.call_frequency);
            if (isNaN(frequency) || frequency < 1) {
                throw new ValidationError('Call frequency must be a positive integer');
            }
            data.call_frequency = frequency;
        }

        const restaurant = await models.Restaurant.findByPk(id);
        if (!restaurant) {
            throw new ResourceNotFoundError('Restaurant');
        }

        try {
            return await restaurant.update(data);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error.errors[0].message);
            }
            throw error;
        }
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

    async getRestaurants(filters = {}) {
        const where = {};
        
        // Add status filter
        if (filters.status) {
            where.status = filters.status;
        }

        // Add search filter for name
        if (filters.search) {
            where.name = {
                [Sequelize.Op.iLike]: `%${filters.search}%`
            };
        }

        const options = {
            where,
            order: [['createdAt', 'DESC']],
            limit: filters.limit ? parseInt(filters.limit) : 10,
            offset: filters.page ? (parseInt(filters.page) - 1) * (filters.limit || 10) : 0
        };

        const restaurants = await models.Restaurant.findAndCountAll(options);
        
        return {
            restaurants: restaurants.rows,
            total: restaurants.count,
            page: filters.page ? parseInt(filters.page) : 1,
            totalPages: Math.ceil(restaurants.count / (filters.limit || 10))
        };
    },
};

module.exports = RestaurantService;
