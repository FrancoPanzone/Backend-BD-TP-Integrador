// src/test-app.ts
import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
// Importa solo los routers que quieras testear
// Para otros tests puedes agregar routers mockeados

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Solo el endpoint de auth para los tests
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Si quieres, puedes mockear otros routers así:
// app.use('/api/users', (req, res) => res.status(200).json({}));

export default app;
