// src/models/entity/index.ts

import { sequelize } from '../../config/database.config';

import { Category } from './category.model';
import { Product } from './product.model';
import { User } from './user.model';
import { Cart } from './cart.model';
import { ItemCart } from './itemCart.model';
import { Order } from './order.model';
import { OrderDetail } from './orderDetail.model';
import { Review } from './review.model';

// -----------------
// Asociaciones
// -----------------

// Category 1:N Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

// User 1:1 Cart
// (cuando tengas User model)
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Cart 1:N ItemCart
Cart.hasMany(ItemCart, {
  foreignKey: 'cart_id',
  as: 'items',
});
ItemCart.belongsTo(Cart, {
  foreignKey: 'cart_id',
  as: 'cart',
});

// Product 1:N ItemCart
Product.hasMany(ItemCart, {
  foreignKey: 'product_id',
  as: 'cart_items',
});
ItemCart.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User 1:N Order
 User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
 Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order 1:N OrderDetail
Order.hasMany(OrderDetail, {
  foreignKey: 'order_id',
  as: 'details',
});
OrderDetail.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// Product 1:N OrderDetail
Product.hasMany(OrderDetail, {
  foreignKey: 'product_id',
  as: 'order_details',
});
OrderDetail.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User 1:N Review
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product 1:N Review
Product.hasMany(Review, {
  foreignKey: 'product_id',
  as: 'reviews',
});
Review.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

export {
  sequelize,
  Category,
  Product,
  Cart,
  User,
  ItemCart,
  Order,
  OrderDetail,
  Review,
};
