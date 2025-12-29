// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

interface LoginBody {
  name: string;
  password: string;
}

class AuthController {
  async login(req: Request<{}, {}, LoginBody>, res: Response) {
    try {
      const { name, password } = req.body;

      const user = await AuthService.validateUserByName(name, password);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = await AuthService.generateToken(user);

      return res.json({
        message: 'Login exitoso',
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const sent = await AuthService.sendPasswordReset(email);

      if (!sent) {
        return res.status(404).json({ message: 'No existe un usuario con ese email' });
      }

      return res.json({ message: 'Se enviaron instrucciones a su correo electrónico' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new AuthController();
