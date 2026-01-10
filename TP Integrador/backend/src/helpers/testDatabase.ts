// backend/src/helpers/testDatabase.ts
import { DatabaseConnection } from '../patterns/singleton/database.connection';

export const resetTestDatabase = async () => {
  const sequelize = DatabaseConnection.getInstance();

  await sequelize.query('DROP SCHEMA IF EXISTS test CASCADE;');
  await sequelize.query('CREATE SCHEMA test;');

  console.log('✅ Schema "test" reiniciado');
};
