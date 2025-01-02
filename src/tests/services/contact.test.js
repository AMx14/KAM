const { sequelize, models } = require('../../infra/db');
const ContactService = require('../../domain/services/contact');

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

describe('Contact Service', () => {
    test('Should create a new contact for a restaurant', async () => {
        const contactData = {
            name: 'John Doe',
            role: 'Manager',
            phone: '1234567890',
            email: 'john.doe@example.com',
            restaurant_id: 1,
        };

        const contact = await ContactService.createContact(contactData);
        expect(contact).toHaveProperty('id');
        expect(contact.name).toBe('John Doe');
    });

    test('Should fetch all contacts for a restaurant', async () => {
        const contacts = await ContactService.getContactsByRestaurantId(1);
        expect(contacts.length).toBeGreaterThanOrEqual(1);
        expect(contacts[0].restaurant_id).toBe(1);
    });

    test('Should update a contact by ID', async () => {
        const contacts = await ContactService.getContactsByRestaurantId(1);
        const updated = await ContactService.updateContact(contacts[0].id, {
            name: 'Jane Doe',
        });

        expect(updated.name).toBe('Jane Doe');
    });

    test('Should delete a contact by ID', async () => {
        const contacts = await ContactService.getContactsByRestaurantId(1);
        const success = await ContactService.deleteContact(contacts[0].id);

        expect(success).toBe(true);
        const remainingContacts = await ContactService.getContactsByRestaurantId(1);
        expect(remainingContacts.length).toBe(0);
    });
});
