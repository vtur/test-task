import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

interface UserInput {
  username: string;
  password: string;
}

interface AuthenticatedUser {
  username: string;
  token: string;
}

export class UserService {
  static async registerUser({ username, password }: UserInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ username }, 'supersecretkey');

    return { username, token };
  }

  static async loginUser({ username, password }: UserInput): Promise<AuthenticatedUser | null> {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign({ username }, 'supersecretkey');
      return { username, token };
    }

    return null;
  }
}
