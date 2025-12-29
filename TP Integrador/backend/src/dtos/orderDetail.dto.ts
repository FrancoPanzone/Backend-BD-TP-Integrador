// src/dtos/orderDetail.dto.ts

export type OrderDetailInput = {
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
};
