// backend/src/config/database.config.ts
import { Sequelize } from 'sequelize';
import env from './env.config';

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // Neon / producción
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Docker / local
  sequelize = new Sequelize(env.DB_NAME!, env.DB_USER!, env.DB_PASSWORD!, {
    host: env.DB_HOST!,
    port: Number(env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  });
}

export { sequelize };
