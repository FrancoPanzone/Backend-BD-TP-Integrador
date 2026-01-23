// PARA QUE NO SE DESINCRONICE USAR 
'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          user_id: 1,
          status: 'pending',
          total: 48000,
          order_date: new Date('2023-10-01T10:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          status: 'paid',
          total: 69000,
          order_date: new Date('2023-10-02T11:30:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 3,
          status: 'pending',
          total: 60000,
          order_date: new Date('2023-10-03T12:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 4,
          status: 'paid',
          total: 36000,
          order_date: new Date('2023-10-04T13:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 5,
          status: 'pending',
          total: 15000,
          order_date: new Date('2023-10-05T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 6,
          status: 'paid',
          total: 90000,
          order_date: new Date('2023-10-06T15:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 7,
          status: 'pending',
          total: 30000,
          order_date: new Date('2023-10-07T16:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 8,
          status: 'paid',
          total: 54000,
          order_date: new Date('2023-10-08T17:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 9,
          status: 'pending',
          total: 15000,
          order_date: new Date('2023-10-09T18:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 10,
          status: 'paid',
          total: 36000,
          order_date: new Date('2023-10-10T19:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 11,
          status: 'pending',
          total: 45000,
          order_date: new Date('2023-10-11T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 12,
          status: 'paid',
          total: 18000,
          order_date: new Date('2023-10-12T21:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};

// La columna total se calcula sumando los subtotales de los OrderDetails correspondientes.
// No incluimos los OrderDetails aquí; se relacionan automáticamente por order_id.
// order_id se puede especificar si quieres que coincida con el seeder de OrderDetails, o dejar que la base de datos lo genere automáticamente si quieres.