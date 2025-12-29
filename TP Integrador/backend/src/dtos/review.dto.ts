// src/dtos/review.dto.ts
import { Review } from '../models/entity/review.model';

//export type ReviewInput = Omit<Review, 'review_id'>;
// TODO: FIJARSE SI EL NUEVO INTERFACE FUNCIONA, tuve que cambiarlo por un tema del test unitario, sino descomentar la linea de abajo
//export type ReviewInput = Omit<Review, 'review_id'> & { date?: Date };

export interface ReviewInput {
  user_id: number;
  product_id: number;
  qualification: number;
  comment: string;
  date?: Date;
}