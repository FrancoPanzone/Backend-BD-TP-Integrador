'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'ItemCarts',
      [
        // Carrito 1
        { cart_id: 1, product_id: 1, quantity: 2, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },
        { cart_id: 1, product_id: 2, quantity: 1, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 2
        { cart_id: 2, product_id: 2, quantity: 3, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },
        { cart_id: 2, product_id: 1, quantity: 1, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 3
        { cart_id: 3, product_id: 1, quantity: 4, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 4
        { cart_id: 4, product_id: 2, quantity: 2, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 5
        { cart_id: 5, product_id: 1, quantity: 1, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 6
        { cart_id: 6, product_id: 2, quantity: 5, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 7
        { cart_id: 7, product_id: 1, quantity: 2, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 8
        { cart_id: 8, product_id: 2, quantity: 3, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 9
        { cart_id: 9, product_id: 1, quantity: 1, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 10
        { cart_id: 10, product_id: 2, quantity: 2, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 11
        { cart_id: 11, product_id: 1, quantity: 3, unit_price: 15000, createdAt: new Date(), updatedAt: new Date() },

        // Carrito 12
        { cart_id: 12, product_id: 2, quantity: 1, unit_price: 18000, createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ItemCarts', null, {});
  },
};

