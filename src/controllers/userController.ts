import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await UserService.registerUser({ username, password });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await UserService.loginUser({ username, password });

      if (result) {
        res.json(result);
      } else {
        res.status(403).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
