module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true, // Street address is optional
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false, // City is mandatory
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true, // State is optional
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false, // Country is mandatory
      },
      pin_code: {
        type: Sequelize.STRING,
        allowNull: false, // Pin code is mandatory
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: true, // Timezone is optional but will be automated later
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Use CURRENT_TIMESTAMP for portability
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // Auto-update on changes
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('addresses'); // Safely drops the table on rollback
  },
};
