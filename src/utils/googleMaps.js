const axios = require('axios');

const GoogleMaps = {
    async getTimezone(city, country) {
        try {
            const location = `${city}, ${country}`;
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/timezone/json`,
                {
                    params: {
                        location,
                        timestamp: Math.floor(Date.now() / 1000),
                        key: process.env.GOOGLE_MAPS_API_KEY,
                    },
                }
            );
            if (response.data.status === 'OK') {
                return response.data.timeZoneId;
            } else {
                throw new Error(`Google Maps API Error: ${response.data.status}`);
            }
        } catch (error) {
            console.error('Error fetching timezone:', error.message);
            throw error;
        }
    },
};

module.exports = GoogleMaps;
