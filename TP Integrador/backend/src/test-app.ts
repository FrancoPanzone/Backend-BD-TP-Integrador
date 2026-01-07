// src/test-app.ts
// import express from 'express';
// import productRoutes from './routes/product.routes';
// import reviewsRoutes from './routes/review.routes';
// import orderRoutes from './routes/order.routes';
// import userRoutes from './routes/user.routes';
// import authRoutes from './routes/auth.routes';
// import cartRoutes from './routes/cart.routes';
// import orderDetailRoutes from './routes/orderDetail.routes';
// import itemCartRoutes from './routes/itemCart.routes';
// import categoryRoutes from './routes/category.routes';
// // Importa solo los routers que quieras testear
// // Para otros tests puedes agregar routers mockeados

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Solo el endpoint de auth para los tests
// //app.use('/api/auth', authRoutes);
// //app.use('/api/users', userRoutes);
// app.use('/api/itemCarts', itemCartRoutes);
// app.use('/api/carts', cartRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/reviews', reviewsRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/orderDetails', orderDetailRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);

// // Si quieres, puedes mockear otros routers así:
// // app.use('/api/users', (req, res) => res.status(200).json({}));

// // 🔹 ERROR HANDLER GLOBAL
// // Captura todos los errores que lleguen de tus routes/middlewares
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error('💥 ERROR DETECTADO EN API:', err); // Muestra el stack real en consola
//   res.status(err.status || 500).json({
//     message: err.message || 'Internal Server Error',
//     stack: err.stack, // opcional: útil solo en test
//   });
// });

// export default app;

// src/test-app.ts
// import express from 'express';

// // Routers
// import productRoutes from './routes/product.routes';
// import reviewsRoutes from './routes/review.routes';
// import orderRoutes from './routes/order.routes';
// import userRoutes from './routes/user.routes';
// import authRoutes from './routes/auth.routes';
// import cartRoutes from './routes/cart.routes';
// import orderDetailRoutes from './routes/orderDetail.routes';
// import itemCartRoutes from './routes/itemCart.routes';
// import categoryRoutes from './routes/category.routes';

// // Database singleton
// import { DatabaseConnection } from './patterns/singleton/database.connection';
// const sequelize = DatabaseConnection.getInstance();

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 🔹 Monta todos los routers
// app.use('/api/products', productRoutes);
// app.use('/api/reviews', reviewsRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/carts', cartRoutes);
// app.use('/api/orderDetails', orderDetailRoutes);
// app.use('/api/itemCarts', itemCartRoutes);
// app.use('/api/categories', categoryRoutes);

// // 🔹 Error handler global
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error('💥 ERROR DETECTADO EN API:', err);
//   res.status(err.status || 500).json({
//     message: err.message || 'Internal Server Error',
//     stack: err.stack, // útil solo en test
//   });
// });

// // 🔹 Conexión a DB para tests (opcional, asegura que Sequelize esté listo)
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Sequelize conectado a la DB para test-app');
//   } catch (error) {
//     console.error('❌ Error conectando Sequelize en test-app', error);
//   }
// })();

// export default app;

// src/test-app.ts
import express from 'express';
import productRoutes from './routes/product.routes';
import reviewsRoutes from './routes/review.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import orderDetailRoutes from './routes/orderDetail.routes';
import itemCartRoutes from './routes/itemCart.routes';
import categoryRoutes from './routes/category.routes';
import { DatabaseConnection } from './patterns/singleton/database.connection';

const sequelize = DatabaseConnection.getInstance(); // instancia única

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orderDetails', orderDetailRoutes);
app.use('/api/itemCarts', itemCartRoutes);
app.use('/api/categories', categoryRoutes);

// error handler global
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error', stack: err.stack });
});

export default app;
