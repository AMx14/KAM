const { sequelize, models } = require('../../infra/db');
const RestaurantService = require('../../domain/services/restaurant');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recreate the database schema

    // Seed a test restaurant
    const restaurant = await models.Restaurant.create({
        name: 'Test Restaurant',
        address: '123 Main St',
        status: 'active',
    });

    // Seed interactions for performance metrics
    await models.Interaction.bulkCreate([
        { type: 'order', details: 'Order 1', date: '2024-12-01', restaurant_id: restaurant.id },
        { type: 'order', details: 'Order 2', date: '2024-12-05', restaurant_id: restaurant.id },
        { type: 'order', details: 'Order 3', date: '2024-12-10', restaurant_id: restaurant.id },
    ]);
});

afterAll(async () => {
    await sequelize.close(); // Close the database connection
});

describe('Restaurant Service', () => {
    test('Should create a new restaurant', async () => {
        const restaurantData = { name: 'Another Restaurant', address: '456 Elm St', status: 'active' };
        const restaurant = await RestaurantService.createRestaurant(restaurantData);
        expect(restaurant).toHaveProperty('id');
        expect(restaurant.name).toBe('Another Restaurant');
    });

    test('Should delete a restaurant by ID', async () => {
        // Create a new restaurant and associated data
        const restaurant = await models.Restaurant.create({
            name: 'Delete Me',
            address: '789 Pine St',
            status: 'active',
        });

        await models.Contact.create({
            name: 'Contact for Deletion',
            role: 'Manager',
            restaurant_id: restaurant.id,
        });

        await models.Interaction.create({
            type: 'call',
            details: 'Follow-up before deletion.',
            restaurant_id: restaurant.id,
        });

        // Delete the restaurant
        const success = await RestaurantService.deleteRestaurant(restaurant.id);
        expect(success).toBe(true);

        // Verify the restaurant is deleted
        const deletedRestaurant = await models.Restaurant.findByPk(restaurant.id);
        expect(deletedRestaurant).toBeNull();

        // Verify no associated contacts or interactions exist
        const associatedContacts = await models.Contact.findAll({ where: { restaurant_id: restaurant.id } });
        expect(associatedContacts.length).toBe(0);

        const associatedInteractions = await models.Interaction.findAll({ where: { restaurant_id: restaurant.id } });
        expect(associatedInteractions.length).toBe(0);
    });

    test('Should fetch performance metrics for all restaurants', async () => {
        const performanceData = await RestaurantService.getPerformanceMetrics();
        expect(performanceData).toBeDefined();
        expect(performanceData.length).toBeGreaterThanOrEqual(1);

        const testRestaurantMetrics = performanceData.find((r) => r.name === 'Test Restaurant');
        expect(testRestaurantMetrics).toBeDefined();
        expect(testRestaurantMetrics.totalOrders).toBe(3);
        expect(testRestaurantMetrics.performanceStatus).toBe('average');
    });
});
