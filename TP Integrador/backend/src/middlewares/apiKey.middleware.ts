// src/middlewares/apiKey.middleware.ts
import env from '../config/env.config';
import { Request, Response, NextFunction } from 'express';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //console.log('API_KEY ENV:', env.API_KEY);

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API_KEY requerida' });
  }

  if (apiKey !== env.API_KEY) {
    return res.status(403).json({ message: 'API_KEY inválida' });
  }

  next();
};
