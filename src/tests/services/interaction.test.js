const { sequelize, models } = require('../../infra/db');
const InteractionService = require('../../domain/services/interaction');

let testRestaurant;
let testAddress;
let testInteraction;

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

    // Create test interaction
    testInteraction = await models.Interaction.create({
        type: 'call',
        details: 'Test interaction',
        date: new Date(),
        restaurant_id: testRestaurant.id,
    });
});

afterEach(async () => {
    await models.Interaction.destroy({ where: {} });
    await models.Restaurant.destroy({ where: {} });
    await models.Address.destroy({ where: {} });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Interaction Service', () => {
    test('Should fetch all interactions for a restaurant', async () => {
        const interactions = await InteractionService.getInteractionsByRestaurantId(testRestaurant.id);
        expect(interactions.length).toBeGreaterThanOrEqual(1);
        expect(interactions[0].restaurant_id).toBe(testRestaurant.id);
    });

    test('Should create a new interaction', async () => {
        const interactionData = {
            type: 'order',
            details: 'New order placed',
            date: new Date(),
            restaurant_id: testRestaurant.id,
        };

        const interaction = await InteractionService.createInteraction(interactionData);
        expect(interaction).toHaveProperty('id');
        expect(interaction.type).toBe('order');
        expect(interaction.restaurant_id).toBe(testRestaurant.id);
    });

    test('Should update an interaction', async () => {
        const updatedDetails = 'Updated interaction details';
        const updated = await InteractionService.updateInteraction(testInteraction.id, {
            details: updatedDetails,
        });
        expect(updated.details).toBe(updatedDetails);
    });

    test('Should delete an interaction', async () => {
        const success = await InteractionService.deleteInteraction(testInteraction.id);
        expect(success).toBe(true);

        const deletedInteraction = await models.Interaction.findByPk(testInteraction.id);
        expect(deletedInteraction).toBeNull();
    });
});