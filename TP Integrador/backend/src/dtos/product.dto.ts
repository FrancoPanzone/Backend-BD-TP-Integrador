// src/dtos/product.dto.ts

import { Product } from '../models/entity/product.model';

// DTO o tipo auxiliar para updates parciales
export type ProductUpdate = Partial<Omit<Product, 'product_id'>>;

export type ProductInput = {
  name: string;
  price: number;
  image?: string; //opcional
  category_id: number;
  stock: number;
  rating: number;
  brand: string;
  description: string;
};
