const { sequelize, models } = require('../../infra/db');
const ContactService = require('../../domain/services/contact');

let testRestaurant;
let testAddress;
let testContact;

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

    // Create test contact
    testContact = await models.Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'manager',
        restaurant_id: testRestaurant.id,
    });
});

afterEach(async () => {
    await models.Contact.destroy({ where: {} });
    await models.Restaurant.destroy({ where: {} });
    await models.Address.destroy({ where: {} });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Contact Service', () => {
    test('Should fetch all contacts for a restaurant', async () => {
        const contacts = await ContactService.getContactsByRestaurantId(testRestaurant.id);
        expect(contacts.length).toBeGreaterThanOrEqual(1);
        expect(contacts[0].restaurant_id).toBe(testRestaurant.id);
    });

    test('Should create a new contact', async () => {
        const contactData = {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1987654321',
            role: 'staff',
            restaurant_id: testRestaurant.id,
        };

        const contact = await ContactService.createContact(contactData);
        expect(contact).toHaveProperty('id');
        expect(contact.name).toBe('Jane Smith');
        expect(contact.restaurant_id).toBe(testRestaurant.id);
    });

    test('Should update a contact', async () => {
        const updatedName = 'John Smith';
        const updated = await ContactService.updateContact(testContact.id, {
            name: updatedName,
        });
        expect(updated.name).toBe(updatedName);
    });

    test('Should delete a contact', async () => {
        const success = await ContactService.deleteContact(testContact.id);
        expect(success).toBe(true);

        const deletedContact = await models.Contact.findByPk(testContact.id);
        expect(deletedContact).toBeNull();
    });
});