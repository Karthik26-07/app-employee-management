const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: async (password) => {
        return await bcrypt.hash(password, 10);
    },
    calculateDaysBetween: (startDate, endDate) => {
        // Convert the input dates to JavaScript Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in milliseconds
        const diffInMs = end - start;

        // Convert milliseconds to days
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        // Return 1 day if the dates are the same
        return diffInDays === 0 ? 1 : diffInDays + 1;
    },
    is_cl: (value) => {
        return value == "Casual Leave";
    },
    is_sl: (value) => {
        return value == "Sick Leave";
    }


}
