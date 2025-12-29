// src/index.ts

// como estaba antes
// src/index.ts
/* import './config/env.config';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */

// con pattern singleton
import 'dotenv/config';
import app from './app';
import { Database } from './config/database.config';

// 🔹 Importar entidades para registrar asociaciones
import './models/entity'; // Esto ejecuta entity/index.ts y registra todas las relaciones

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    console.log('🧩 Conectando a la base de datos...');
    await Database.connect(); // Inicializa la conexión

    const sequelize = Database.getInstance(); // Obtiene la instancia de Sequelize

    // 🔹 Sincronizar todas las entidades con la DB
    //await sequelize.sync({ alter: true });
    //console.log("✅ Tablas sincronizadas correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
})();
