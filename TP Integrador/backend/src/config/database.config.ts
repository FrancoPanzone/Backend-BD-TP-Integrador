// src/config/database.config.ts
import { Sequelize } from 'sequelize';
import env from './env.config';

export class Database {
  private static instance: Sequelize;

  private constructor() {} // Previene instanciación externa

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        dialect: 'postgres',
        logging: false,
      });
      console.log('🟢 Instancia de Sequelize creada.');
    }
    return Database.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const sequelize = Database.getInstance();
      await sequelize.authenticate();
      console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
    }
  }
}

// Exporta la instancia única
export const sequelize = Database.getInstance();
