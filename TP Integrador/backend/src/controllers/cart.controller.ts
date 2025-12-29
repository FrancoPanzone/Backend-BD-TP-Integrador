import { Request, Response } from 'express';
import CartService from '../services/cart.service';

class CartController {
  async getAll(req: Request, res: Response) {
    try {
      const carts = await CartService.getAll();
      res.status(200).json(carts);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    try {
      const cart = await CartService.getById(id);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      res.json(cart);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  async getCartByUserId(req: Request, res: Response) {
    const userIdParam = req.params.userId;
    if (!userIdParam) {
      return res.status(400).json({ error: 'userId es requerido' });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'userId inválido' });
    }
    try {
      const cart = await CartService.getCartByUserId(userId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      res.json(cart);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newCart = await CartService.create(req.body);
      res.status(201).json(newCart);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const cart = await CartService.getById(id);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      await CartService.delete(id);
      res.status(200).json({ message: 'Carrito eliminado correctamente' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }
}

export default new CartController();
