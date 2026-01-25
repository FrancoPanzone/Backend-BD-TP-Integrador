'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Categories',
      [
        {
          name: 'Proteína',
          description:
            'Todos los productos que suplementen necesidades proteicas, como whey, caseína o proteína vegetal.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Creatina',
          description: 'Suplementos de creatina para fuerza, energía y recuperación muscular.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Aminoácidos',
          description:
            'BCAA, EAA y otros aminoácidos esenciales para recuperación y síntesis proteica.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pre-entreno',
          description: 'Suplementos energizantes para mejorar el rendimiento antes de entrenar.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Vitaminas y Minerales',
          description: 'Suplementos de micronutrientes para mantener la salud general.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Quemadores de grasa',
          description: 'Productos para apoyo en la pérdida de grasa y control de peso.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Hidratación y electrolitos',
          description:
            'Bebidas, sales y cápsulas para mantener el balance hídrico y electrolítico.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Snacks y barras',
          description: 'Barras de proteína, galletas y snacks energéticos para consumo rápido.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Omega y ácidos grasos',
          description:
            'Suplementos de omega-3, aceite de pescado y otros ácidos grasos esenciales.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
