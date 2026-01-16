// backend/jest.setup.ts
// import dotenv from 'dotenv';
// dotenv.config();
//dotenv.config({ path: '.env.test' });
//dotenv.config({ path: './.env.test' }); // ruta relativa desde el cwd

// backend/jest.setup.ts
// import dotenv from 'dotenv';
// import path from 'path';

// // Cargar el .env que está en el directorio padre (TP Integrador)
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// console.log('✅ Variables de entorno cargadas para Jest');

// backend/jest.setup.ts
import path from 'path';
import dotenv from 'dotenv';

// Resuelve la ruta desde el root del backend
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

//console.log(process.env.JWT_SECRET)
//console.log('✅ Variables de entorno cargadas para Jest');
