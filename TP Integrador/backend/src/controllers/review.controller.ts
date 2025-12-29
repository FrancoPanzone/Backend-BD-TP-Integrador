// src/controllers/review.controller.ts

import { Request, Response } from 'express';
import ReviewService from '../services/review.service';

class ReviewController {
  async getAll(req: Request, res: Response) {
    try {
      const reviews = await ReviewService.getAll();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener reviews' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const review = await ReviewService.getById(id);
      if (!review) {
        return res.status(404).json({ message: 'Review no encontrada' });
      }
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener review' });
    }
  }

  async getByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId)) return res.status(400).json({ error: 'productId inválido' });

      const reviews = await ReviewService.getByProductId(productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newReview = await ReviewService.create(req.body);
      res.status(201).json(newReview);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear review' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const success = await ReviewService.delete(id);
      if (!success) {
        return res.status(404).json({ message: 'Review no encontrada' });
      }
      res.status(200).json({ message: 'Review eliminada correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al eliminar review' });
    }
  }
}

export default new ReviewController();
