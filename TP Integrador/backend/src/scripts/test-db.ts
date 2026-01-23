import { sequelize } from './../config/database.config';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión OK');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
})();
