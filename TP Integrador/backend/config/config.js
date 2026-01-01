// config/config.js

// TODO: Todo esta en local aca tengo que poner para que use Neon
// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 5432,
//     dialect: 'postgres',
//   },
//   test: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME + '_test',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 5432,
//     dialect: 'postgres',
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME + '_prod',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 5432,
//     dialect: 'postgres',
//   },
// };


// Para que use Local → usa Docker (db) y Neon / Render → usa DATABASE_URL
// backend/config/config.js
require('dotenv').config();

const useDatabaseUrl = !!process.env.DATABASE_URL;

module.exports = {
  development: useDatabaseUrl
    ? {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
      },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
