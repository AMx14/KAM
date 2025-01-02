// src/tests/services/interaction.test.js
const { sequelize, models } = require('../../infra/db');
const InteractionService = require('../../domain/services/interaction');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recreate the database schema

    // Seed a test restaurant
    await models.Restaurant.create({
        id: 1, // Set a static ID for consistency in testing
        name: 'Test Restaurant',
        address: '123 Main St',
        status: 'active',
    });
});

afterAll(async () => {
    await sequelize.close(); // Close the database connection
});

describe('Interaction Service', () => {
    test('Should create a new interaction for a restaurant', async () => {
        const interactionData = {
            type: 'call',
            details: 'Called to follow up on the order.',
            restaurant_id: 1,
        };
        const interaction = await InteractionService.createInteraction(interactionData);
        expect(interaction).toHaveProperty('id');
        expect(interaction.type).toBe('call');
    });
    test('Should fetch all interactions for a restaurant', async () => {
        const interactions = await InteractionService.getInteractionsByRestaurantId(1);
        expect(interactions.length).toBeGreaterThanOrEqual(1);
        expect(interactions[0].restaurant_id).toBe(1);
    });
    test('Should update an interaction by ID', async () => {
        const interactions = await InteractionService.getInteractionsByRestaurantId(1);
        const updated = await InteractionService.updateInteraction(interactions[0].id, {
            details: 'Updated details of the interaction.',
        });

        expect(updated.details).toBe('Updated details of the interaction.');
    });
    test('Should delete an interaction by ID', async () => {
        const interactions = await InteractionService.getInteractionsByRestaurantId(1);
        const success = await InteractionService.deleteInteraction(interactions[0].id);

        expect(success).toBe(true);

        const remainingInteractions = await InteractionService.getInteractionsByRestaurantId(1);
        expect(remainingInteractions.length).toBe(0);
    });
    test('Should fetch leads due for a call', async () => {
        const leads = await InteractionService.getLeadsDueForCall();
        expect(leads).toBeDefined();
        expect(leads.length).toBeGreaterThanOrEqual(0);
    });
    test('Should calculate order frequency and average gap for a restaurant', async () => {
        const frequencyData = await InteractionService.getOrderFrequency(1);
        expect(frequencyData).toHaveProperty('frequency');
        expect(frequencyData).toHaveProperty('averageGap');
    });
    test('Should fetch performance data for all restaurants', async () => {
        const performanceData = await InteractionService.getPerformanceData();
        expect(performanceData).toBeDefined();
        expect(performanceData.length).toBeGreaterThanOrEqual(1);
    });
});
