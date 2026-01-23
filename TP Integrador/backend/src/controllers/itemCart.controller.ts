// src/controllers/itemCart.controller.ts
import { Request, Response } from 'express';
import ItemCartService from '../services/itemCart.service';

class ItemCartController {
  async getAll(req: Request, res: Response) {
    try {
      const items = await ItemCartService.getAll();
      res.status(200).json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByItemId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const item = await ItemCartService.getByItemId(id);
      if (!item) return res.status(404).json({ error: 'Item carrito no encontrado' });
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByCartId(req: Request, res: Response) {
    const cartId = Number(req.params.cartId);
    if (isNaN(cartId)) return res.status(400).json({ error: 'Cart ID inválido' });

    try {
      const items = await ItemCartService.getByCartId(cartId);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByProductId(req: Request, res: Response) {
    const productId = Number(req.params.productId);
    if (isNaN(productId)) return res.status(400).json({ error: 'Product ID inválido' });

    try {
      const items = await ItemCartService.getByProductId(productId);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newItem = await ItemCartService.create(req.body);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      await ItemCartService.delete(id);
      res.status(200).json({ message: 'Item carrito eliminado correctamente' });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}

export default new ItemCartController();
