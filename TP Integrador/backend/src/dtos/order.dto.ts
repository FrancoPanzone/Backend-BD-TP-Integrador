// src/dtos/order.dto.ts
//import { Order } from '../models/entity/order.model';

export type OrderItem = {
  productId: number;
  quantity: number;
};

export type OrderInput = {
  user_id: number;
  total?: number; // creado por el service
  //cart_id: number; // 👈 SOLO PARA EL FLUJO
  items: OrderItem[];
};

export type OrderCreatePayload = {
  user_id: number;
  total: number;
  items: { productId: number; quantity: number }[];
};
