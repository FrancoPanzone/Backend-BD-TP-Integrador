// src/controllers/order.controller.ts
import { Request, Response } from 'express';
import OrderService from '../services/order.service';
import { OrderStatus } from '../models/entity/order.model';

class OrderController {
  // GET /api/orders
  async getAll(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAll();
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  // GET /api/orders/:id
  // async getById(req: Request, res: Response) {
  //   const id = Number(req.params.id);
  //   if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  //   try {
  //     const order = await OrderService.getById(id);
  //     if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  //     res.json(order);
  //   } catch (err: any) {
  //     res.status(500).json({ error: err.message || 'Error interno del servidor' });
  //   }
  // }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const order = await OrderService.getById(id);
      res.json(order);
    } catch (err: any) {
      if (err.message === 'Orden no encontrada') {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  // GET /api/orders/user/:userId
  async getByUserId(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'ID de usuario inválido' });

    try {
      const orders = await OrderService.getByUserId(userId);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  // POST /api/orders
  async create(req: Request, res: Response) {
    try {
      const newOrder = await OrderService.create(req.body);
      res.status(201).json(newOrder);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'No se pudo crear la orden' });
    }
  }

  // DELETE /api/orders/:id
  // async delete(req: Request, res: Response) {
  //   const id = Number(req.params.id);
  //   if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  //   try {
  //     const success = await OrderService.delete(id);
  //     if (!success) return res.status(404).json({ error: 'Orden no encontrada' });
  //     res.json({ message: 'Orden eliminada correctamente' });
  //   } catch (err: any) {
  //     res.status(500).json({ error: err.message || 'Error interno del servidor' });
  //   }
  // }

  // DELETE /api/orders/:id
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      await OrderService.delete(id);
      res.json({ message: 'Orden eliminada correctamente' });
    } catch (err: any) {
      if (err.message === 'Orden no encontrada') {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  // PATCH /api/orders/:id/status
  async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { status } = req.body as { status: OrderStatus };

    // try {
    //   const updated = await OrderService.updateStatus(id, status);
    //   if (!updated) return res.status(404).json({ error: 'Orden no encontrada' });
    //   res.json(updated);
    // } catch (err: any) {
    //   res.status(500).json({ error: err.message || 'Error actualizando estado de la orden' });
    // }
    try {
      const updated = await OrderService.updateStatus(id, status);
      res.json(updated);
    } catch (err: any) {
      if (err.message === 'Orden no encontrada') {
        return res.status(404).json({ error: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  }

  // POST /api/orders/checkout/:userId
  // async checkout(req: Request, res: Response) {
  //   const userId = Number(req.params.userId);
  //   if (isNaN(userId)) return res.status(400).json({ error: 'ID de usuario inválido' });

  //   try {
  //     const order = await OrderService.checkout(userId);
  //     const orderWithDetails = await OrderService.getById(order.order_id); // trae detalles
  //     //res.status(201).json(order);
  //     res.json(orderWithDetails);

  //   } catch (err: any) {
  //     res.status(400).json({ error: err.message || 'No se pudo hacer checkout' });
  //   }
  // }

  // POST /api/orders/checkout/:userId
  async checkout(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
      const order = await OrderService.checkout(userId);
      const orderWithDetails = await OrderService.getById(order.order_id);

      return res.json(orderWithDetails);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message || 'No se pudo hacer checkout',
      });
    }
  }
}

export default new OrderController();
