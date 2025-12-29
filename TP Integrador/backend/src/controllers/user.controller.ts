// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import  UserService  from '../services/user.service';

class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newUser = await UserService.create(req.body);
      res.status(201).json(newUser);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await UserService.update(id, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await UserService.delete(id);
      if (!success) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
