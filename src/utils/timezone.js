const moment = require('moment-timezone');

const TimezoneUtils = {
    /**
     * Convert a date to UTC
     * @param {Date|string} date - The date to convert
     * @returns {Date} - The UTC date
     */
    toUTC(date) {
        return moment(date).utc().toDate();
    },

    /**
     * Convert a UTC date to a specific timezone
     * @param {Date|string} date - The UTC date to convert
     * @param {string} timezone - The target timezone (e.g., 'Asia/Kolkata')
     * @returns {string} - The date formatted in the target timezone
     */
    fromUTC(date, timezone) {
        return moment.utc(date).tz(timezone).format();
    },

    /**
     * Convert a date from one timezone to another
     * @param {Date|string} date - The date to convert
     * @param {string} fromTimezone - The source timezone
     * @param {string} toTimezone - The target timezone
     * @returns {string} - The date formatted in the target timezone
     */
    convertTimezone(date, fromTimezone, toTimezone) {
        return moment.tz(date, fromTimezone).tz(toTimezone).format();
    },

    /**
     * Get the current date in a specific timezone
     * @param {string} timezone - The target timezone
     * @returns {string} - The current date formatted in the target timezone
     */
    nowInTimezone(timezone) {
        return moment.tz(timezone).format();
    },
};

module.exports = TimezoneUtils;
