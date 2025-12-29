// src/controllers/orderDetail.controller.ts

import { Request, Response } from 'express';
import orderDetailService from '../services/orderDetail.service';

export class orderDetailController {
  async getAll(req: Request, res: Response) {
    try {
      const orderDetails = await orderDetailService.getAll();
      res.status(200).json(orderDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error to obtain OrderDetails' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

      const orderdetail = await orderDetailService.getById(id);
      if (!orderdetail) {
        return res.status(404).json({ message: 'OrderDetail not found' });
      }
      res.status(200).json(orderdetail);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error to obtain OrderDetail' });
    }
  }

  async getByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId)) return res.status(400).json({ error: 'Invalid productId' });

      const orderdetails = await orderDetailService.getByProductId(productId);
      res.status(200).json(orderdetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error to obtain OrderDetails with orderId' });
    }
  }

  async getByOrderId(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      if (isNaN(orderId)) return res.status(400).json({ error: 'Invalid orderId' });

      const orderdetails = await orderDetailService.getByOrderId(orderId);
      res.status(200).json(orderdetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error to obtain OrderDetails with orderId' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newOrderDetail = await orderDetailService.create(req.body);
      res.status(201).json(newOrderDetail);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear OrderDetail' });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    try {
      await orderDetailService.delete(id);
      const orderdetail = await orderDetailService.getById(id);
      if (!orderdetail) {
        return res.status(404).json({ error: 'OrderDetail no encontrado' });
      }
      res.status(200).json({ message: 'OrderDetail eliminado correctamente' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }
}

export default new orderDetailController();
