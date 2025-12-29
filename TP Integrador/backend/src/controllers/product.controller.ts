// src/controllers/product.controller.ts

import { Request, Response } from 'express';
import ProductService from '../services/product.service';

class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener productos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const product = await ProductService.getById(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el producto' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newProduct = await ProductService.create(req.body);
      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear producto' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const updated = await ProductService.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'No se pudo actualizar el producto' });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al actualizar el producto' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const deleted = await ProductService.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al eliminar el producto' });
    }
  }
}

export default new ProductController();
