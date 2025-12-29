'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Carts',
      [
        { user_id: 1, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 2, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 3, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 4, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 5, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 6, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 7, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 8, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 9, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 10, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 11, createdAt: new Date(), updatedAt: new Date() },
        { user_id: 12, createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Carts', null, {});
  },
};

