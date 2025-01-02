const { models } = require('../../infra/db');

const ContactService = {
    /**
     * Add a new contact for a specific restaurant.
     * @param {Object} contactData - Data for the new contact.
     * @returns {Object} - The created contact.
     */
    async createContact(contactData) {
        return await models.Contact.create(contactData);
    },

    /**
     * Get all contacts.
     * @returns {Array} - List of all contacts.
     */
    async getAllContacts() {
        return await models.Contact.findAll();
    },

    /**
     * Get all contacts for a specific restaurant.
     * @param {string} restaurantId - The ID of the restaurant.
     * @returns {Array} - List of all contacts for the restaurant.
     */
    async getContactsByRestaurantId(restaurantId) {
        return await models.Contact.findAll({
            where: { restaurant_id: restaurantId },
        });
    },

    /**
     * Update a contact by ID.
     * @param {string} contactId - The ID of the contact.
     * @param {Object} updateData - Data to update.
     * @returns {Object} - The updated contact, or null if not found.
     */
    async updateContact(contactId, updateData) {
        const contact = await models.Contact.findByPk(contactId);
        if (!contact) return null;
        return await contact.update(updateData);
    },

    /**
     * Delete a contact by ID.
     * @param {string} contactId - The ID of the contact.
     * @returns {boolean} - True if deleted, false otherwise.
     */
    async deleteContact(contactId) {
        const contact = await models.Contact.findByPk(contactId);
        if (!contact) return false;
        await contact.destroy();
        return true;
    },
};

module.exports = ContactService;
