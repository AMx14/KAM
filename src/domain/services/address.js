const { models } = require('../../infra/db');
const GoogleMaps = require('../../utils/googleMaps');

const AddressService = {
    async createAddress(data) {
        if (!data.city || !data.country || !data.pin_code) {
            throw new Error('City, country, and pin code are required.');
        }

        // Fetch timezone using city and country
        const timezone = await GoogleMaps.getTimezone(data.city, data.country);
        data.timezone = timezone;

        return await models.Address.create(data);
    },

    async updateAddress(id, data) {
        const address = await models.Address.findByPk(id);
        if (!address) {
            throw new Error('Address not found.');
        }

        // If city or country are updated, recalculate timezone
        if (data.city || data.country) {
            const timezone = await GoogleMaps.getTimezone(data.city || address.city, data.country || address.country);
            data.timezone = timezone;
        }

        return await address.update(data);
    },
};

module.exports = AddressService;
