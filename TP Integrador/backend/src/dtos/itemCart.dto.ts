// src/dtos/itemCart.dto.ts
import { ItemCart } from '../models/entity/itemCart.model';

export interface ItemCartInput {
  cart_id: number;
  product_id: number;
  quantity: number;
}

// export interface ItemCartInput {
//   cart_id: number;
//   product_id: number;
//   quantity: number;
//   unit_price?: number;
// }
