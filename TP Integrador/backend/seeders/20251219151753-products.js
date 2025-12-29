'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Products',
      [
        // Proteínas
        {
          name: 'Proteína Whey',
          price: 15000,
          image: '/images/products/Proteina-Whey.webp',
          category_id: 1,
          stock: 10,
          rating: 4.5,
          brand: 'Optimum',
          description: 'Proteína en polvo para aumentar masa muscular.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Proteína Vegetal',
          price: 18000,
          image: '/images/products/Proteina-Vegetal.webp',
          category_id: 1,
          stock: 15,
          rating: 4.2,
          brand: 'VeganPro',
          description: 'Proteína vegetal en polvo para complementar tu dieta.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Creatina
        {
          name: 'Creatina Monohidratada',
          price: 8000,
          image: '/images/products/Creatina-Monohidratada.webp',
          category_id: 2,
          stock: 20,
          rating: 4.8,
          brand: 'MyProtein',
          description: 'Creatina monohidratada pura para mejorar fuerza y resistencia.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Creatina Micronizada',
          price: 9000,
          image: '/images/products/Creatina-Micronizada.webp',
          category_id: 2,
          stock: 12,
          rating: 4.7,
          brand: 'Universal',
          description: 'Creatina micronizada para mejor absorción.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Aminoácidos
        {
          name: 'BCAA 2:1:1',
          price: 12000,
          image: '/images/products/BCAA-211.webp',
          category_id: 3,
          stock: 25,
          rating: 4.6,
          brand: 'Scivation',
          description: 'Aminoácidos ramificados para recuperación y síntesis proteica.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Pre-entreno
        {
          name: 'Pre-entreno Hardcore',
          price: 14000,
          image: '/images/products/Preentreno-Hardcore.webp',
          category_id: 4,
          stock: 18,
          rating: 4.4,
          brand: 'Cellucor',
          description: 'Mejora tu energía y concentración antes de entrenar.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Vitaminas y Minerales
        {
          name: 'Multivitamínico Daily',
          price: 7000,
          image: '/images/products/Multivitaminico-Daily.webp',
          category_id: 5,
          stock: 30,
          rating: 4.3,
          brand: 'Now Foods',
          description: 'Suplemento multivitamínico para salud general.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Quemadores de grasa
        {
          name: 'L-Carnitina',
          price: 9000,
          image: '/images/products/L-Carnitina.webp',
          category_id: 6,
          stock: 20,
          rating: 4.1,
          brand: 'Nutrex',
          description: 'Apoya el metabolismo de grasas durante el ejercicio.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Hidratación
        {
          name: 'Electrolitos en Polvo',
          price: 6000,
          image: '/images/products/Electrolitos-en-Polvo.webp',
          category_id: 7,
          stock: 25,
          rating: 4.5,
          brand: 'HydroMax',
          description: 'Bebida en polvo para reponer sales y mantener hidratación.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Snacks
        {
          name: 'Barra Proteica Chocolate',
          price: 3500,
          image: '/images/products/Barra-Proteica-Chocolate.webp',
          category_id: 8,
          stock: 40,
          rating: 4.6,
          brand: 'Quest',
          description: 'Barras de proteína ideales para un snack rápido.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Omega
        {
          name: 'Omega 3 1000mg',
          price: 11000,
          image: '/images/products/Omega-3-1000mg.webp',
          category_id: 9,
          stock: 22,
          rating: 4.7,
          brand: 'Nordic Naturals',
          description: 'Ácidos grasos esenciales para salud cardiovascular y articular.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};

