// middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (
  schema: ZodSchema<any>,
  property: 'body' | 'query' | 'params' = 'body', // por defecto valida body
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('📌 Validate middleware, property:', property, 'valor:', req[property]);
    try {
      const parsed = schema.parse(req[property]);
      req[property] = parsed; // opcional: guarda el dato parseado
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({ errors: err.issues });
      }
      return res.status(400).json({ error: (err as Error).message });
    }
  };
};
