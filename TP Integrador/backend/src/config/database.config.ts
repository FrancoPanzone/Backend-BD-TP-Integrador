// src/config/database.config.ts
// import { Sequelize } from 'sequelize';
// import env from './env.config';

// export class Database {
//   private static instance: Sequelize;

//   private constructor() {} // Previene instanciación externa

//   public static getInstance(): Sequelize {
//     if (!Database.instance) {
//       Database.instance = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
//         host: env.DB_HOST,
//         port: Number(env.DB_PORT),
//         dialect: 'postgres',
//         logging: false,
//       });
//       console.log('🟢 Instancia de Sequelize creada.');
//     }
//     return Database.instance;
//   }

//   public static async connect(): Promise<void> {
//     try {
//       const sequelize = Database.getInstance();
//       await sequelize.authenticate();
//       console.log('✅ Conexión a PostgreSQL establecida correctamente.');
//     } catch (error) {
//       console.error('❌ Error al conectar con la base de datos:', error);
//     }
//   }
// }

// // Exporta la instancia única
// export const sequelize = Database.getInstance();




// src/config/database.config.ts
// import { Sequelize } from 'sequelize';
// import env from './env.config';

// const isDatabaseUrl = !!process.env.DATABASE_URL;

// export const sequelize = isDatabaseUrl
//   ? new Sequelize(process.env.DATABASE_URL as string, {
//       dialect: 'postgres',
//       logging: false,
//       dialectOptions: {
//         ssl: {
//           require: true,
//           rejectUnauthorized: false,
//         },
//       },
//     })
//   : new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
//       host: env.DB_HOST,
//       port: Number(env.DB_PORT),
//       dialect: 'postgres',
//       logging: false,
//     });

// export const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Conectado a PostgreSQL');
//   } catch (error) {
//     console.error('❌ Error de conexión a PostgreSQL:', error);
//     throw error;
//   }
// };


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
  sequelize = new Sequelize(
    env.DB_NAME!,
    env.DB_USER!,
    env.DB_PASSWORD!,
    {
      host: env.DB_HOST!,
      port: Number(env.DB_PORT),
      dialect: 'postgres',
      logging: false,
    }
  );
}

export { sequelize };

