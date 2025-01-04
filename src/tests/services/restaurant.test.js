const { sequelize, models } = require('../../infra/db');
const RestaurantService = require('../../domain/services/restaurant');
const TimezoneUtils = require('../../utils/timezone');

let testRestaurant;
let testAddress;

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    // Create test address
    testAddress = await models.Address.create({
        street: '123 Main St',
        city: 'City A',
        state: 'State A',
        country: 'India',
        pin_code: '123456',
        timezone: 'Asia/Kolkata',
    });

    // Create test restaurant
    testRestaurant = await models.Restaurant.create({
        name: 'Test Restaurant',
        status: 'active',
        call_frequency: 7,
        address_id: testAddress.id,
    });

    // Create test interactions
    await models.Interaction.bulkCreate([
        { 
            type: 'order', 
            details: 'Order 1', 
            date: '2024-12-01', 
            restaurant_id: testRestaurant.id 
        },
        { 
            type: 'order', 
            details: 'Order 2', 
            date: '2024-12-05', 
            restaurant_id: testRestaurant.id 
        },
        { 
            type: 'order', 
            details: 'Order 3', 
            date: '2024-12-10', 
            restaurant_id: testRestaurant.id 
        },
    ]);
});

afterEach(async () => {
    await models.Interaction.destroy({ where: {} });
    await models.Restaurant.destroy({ where: {} });
    await models.Address.destroy({ where: {} });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Restaurant Service', () => {
    test('Should create a new restaurant', async () => {
        const address = await models.Address.create({
            street: '456 Elm St',
            city: 'City B',
            state: 'State B',
            country: 'USA',
            pin_code: '654321',
            timezone: 'America/New_York',
        });

        const restaurantData = {
            name: 'Another Restaurant',
            status: 'active',
            call_frequency: 10,
            address_id: address.id,
        };

        const restaurant = await RestaurantService.createRestaurant(restaurantData);
        expect(restaurant).toHaveProperty('id');
        expect(restaurant.name).toBe('Another Restaurant');
    });

    test('Should delete a restaurant by ID', async () => {
        const restaurant = await models.Restaurant.create({
            name: 'Delete Me',
            status: 'inactive',
            call_frequency: 7,
            address_id: testAddress.id,
        });

        const success = await RestaurantService.deleteRestaurant(restaurant.id);
        expect(success).toBe(true);

        const deletedRestaurant = await models.Restaurant.findByPk(restaurant.id);
        expect(deletedRestaurant).toBeNull();
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