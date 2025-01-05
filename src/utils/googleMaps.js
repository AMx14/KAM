const axios = require('axios');

const GoogleMaps = {
    async getTimezone(city, country) {
        try {
            // First get coordinates from address
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                `${city}, ${country}`
            )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            
            const geocodeResponse = await axios.get(geocodeUrl);
            
            if (geocodeResponse.data.status !== 'OK') {
                throw new Error(`Geocoding failed: ${geocodeResponse.data.status}`);
            }

            const location = geocodeResponse.data.results[0].geometry.location;
            
            // Then get timezone from coordinates
            const timestamp = Math.floor(Date.now() / 1000);
            const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            
            const timezoneResponse = await axios.get(timezoneUrl);
            
            if (timezoneResponse.data.status !== 'OK') {
                throw new Error(`Timezone lookup failed: ${timezoneResponse.data.status}`);
            }

            return timezoneResponse.data.timeZoneId;
        } catch (error) {
            console.error('Google Maps API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch timezone information');
        }
    }
};

module.exports = GoogleMaps;
