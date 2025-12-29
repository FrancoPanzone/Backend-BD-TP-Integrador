// src/patterns/singleton/database.connection.ts
import { Sequelize } from 'sequelize';
import env from '../../config/env.config';

export class DatabaseConnection {
  private static instance: Sequelize;

  private constructor() {} // impide instanciación directa

  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        dialect: 'postgres',
        logging: false,
      });
      console.log('🟢 [Singleton] Nueva instancia de Sequelize creada.');
    }
    return DatabaseConnection.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const sequelize = DatabaseConnection.getInstance();
      await sequelize.authenticate();
      console.log('✅ Conexión establecida correctamente.');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
    }
  }
}
