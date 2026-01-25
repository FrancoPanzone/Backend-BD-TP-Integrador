// // src/patterns/singleton/database.connection.ts
// import { Sequelize } from 'sequelize';
// import env from '../../config/env.config';

// export class DatabaseConnection {
//   private static instance: Sequelize;

//   private constructor() {} // impide instanciación directa

//   public static getInstance(): Sequelize {
//     if (!DatabaseConnection.instance) {
//       DatabaseConnection.instance = new Sequelize(env.DB_NAME!, env.DB_USER!, env.DB_PASSWORD!, {
//         host: env.DB_HOST!,
//         port: Number(env.DB_PORT),
//         dialect: 'postgres',
//         logging: false,
//       });
//       console.log('🟢 [Singleton] Nueva instancia de Sequelize creada.');
//     }
//     return DatabaseConnection.instance;
//   }

//   public static async connect(): Promise<void> {
//     try {
//       const sequelize = DatabaseConnection.getInstance();
//       await sequelize.authenticate();
//       console.log('✅ Conexión establecida correctamente.');
//     } catch (error) {
//       console.error('❌ Error al conectar con la base de datos:', error);
//     }
//   }
// }

// TODO: Singleton ajustado
// src/patterns/singleton/database.connection.ts
// import { Sequelize } from 'sequelize';
// import env from '../../config/env.config';

// export class DatabaseConnection {
//   private static instance: Sequelize;

//   private constructor() {}

//   public static getInstance(): Sequelize {
//     if (!DatabaseConnection.instance) {
//       if (env.DATABASE_URL) {
//         // Neon / Render
//         DatabaseConnection.instance = new Sequelize(env.DATABASE_URL, {
//           dialect: 'postgres',
//           logging: false,
//           dialectOptions: {
//             ssl: {
//               require: true,
//               rejectUnauthorized: false,
//             },
//           },
//         });
//       } else {
//         // Local / Docker
//         DatabaseConnection.instance = new Sequelize(
//           env.DB_NAME!,
//           env.DB_USER!,
//           env.DB_PASSWORD!,
//           {
//             host: env.DB_HOST!,
//             port: Number(env.DB_PORT),
//             dialect: 'postgres',
//             logging: false,
//           }
//         );
//       }

//       console.log('🟢 [Singleton] Nueva instancia de Sequelize creada.');
//     }
//     return DatabaseConnection.instance;
//   }

//   public static async connect(): Promise<void> {
//     try {
//       await DatabaseConnection.getInstance().authenticate();
//       console.log('✅ Conexión establecida correctamente.');
//     } catch (error) {
//       console.error('❌ Error al conectar con la base de datos:', error);
//       throw error;
//     }
//   }
// }

// src/patterns/singleton/database.connection.ts
import { Sequelize } from 'sequelize';
import env from '../../config/env.config';

export class DatabaseConnection {
  private static instance: Sequelize;

  private constructor() {}

  // public static getInstance(): Sequelize {
  //   if (!DatabaseConnection.instance) {
  //     // Validación de entorno
  //     if (!env.DATABASE_URL && (!env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD || !env.DB_HOST)) {
  //       throw new Error(
  //         '❌ No hay configuración de base de datos válida. ' +
  //         'Define DATABASE_URL para producción o DB_NAME, DB_USER, DB_PASSWORD y DB_HOST para local.'
  //       );
  //     }

  //     if (env.DATABASE_URL) {
  //       // Neon / Render
  //       DatabaseConnection.instance = new Sequelize(env.DATABASE_URL, {
  //         dialect: 'postgres',
  //         logging: false,
  //         dialectOptions: {
  //           ssl: {
  //             require: true,
  //             rejectUnauthorized: false, // necesario para Neon
  //           },
  //         },
  //       });
  //       console.log('🟢 [Singleton] Conectando a la base de datos Neon/Render.');
  //     } else {
  //       // Local / Docker
  //       DatabaseConnection.instance = new Sequelize(
  //         env.DB_NAME!,
  //         env.DB_USER!,
  //         env.DB_PASSWORD!,
  //         {
  //           host: env.DB_HOST!,
  //           port: Number(env.DB_PORT),
  //           dialect: 'postgres',
  //           logging: false,
  //         }
  //       );
  //       console.log('🟢 [Singleton] Conectando a la base de datos local Docker.');
  //     }
  //   }

  //   return DatabaseConnection.instance;
  // }

  // public static async connect(): Promise<void> {
  //   try {
  //     await DatabaseConnection.getInstance().authenticate();
  //     console.log('✅ Conexión a PostgreSQL establecida correctamente.');
  //   } catch (error) {
  //     console.error('❌ Error al conectar con la base de datos:', error);
  //     throw error;
  //   }
  // }

  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      // Validación de entorno
      if (!env.DATABASE_URL && (!env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD || !env.DB_HOST)) {
        throw new Error(
          '❌ No hay configuración de base de datos válida. ' +
            'Define DATABASE_URL para producción o DB_NAME, DB_USER, DB_PASSWORD y DB_HOST para local.',
        );
      }

      if (env.DATABASE_URL) {
        // Neon / Render
        //console.log('🔹 Intentando conectar a Neon con URL:', env.DATABASE_URL);
        DatabaseConnection.instance = new Sequelize(env.DATABASE_URL, {
          dialect: 'postgres',
          logging: console.log, // muestra todas las queries y la conexión
          dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
          },
        });
      } else {
        // Local / Docker
        // console.log('🔹 Intentando conectar a local con:', {
        //   host: env.DB_HOST,
        //   user: env.DB_USER,
        //   db: env.DB_NAME,
        //   port: env.DB_PORT,
        // });
        DatabaseConnection.instance = new Sequelize(env.DB_NAME!, env.DB_USER!, env.DB_PASSWORD!, {
          host: env.DB_HOST!,
          port: Number(env.DB_PORT),
          dialect: 'postgres',
          logging: console.log,
        });
      }
    }

    return DatabaseConnection.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const sequelize = DatabaseConnection.getInstance();
      await sequelize.authenticate();
      console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
      throw error; // así puedes ver el stack completo
    }
  }
}
