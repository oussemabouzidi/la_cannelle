import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'ADMIN' | 'CLIENT';
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Temporarily allow all requests without requiring a token.
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      req.user = {
        id: 0,
        email: 'guest@local',
        role: 'CLIENT'
      };
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      role: 'ADMIN' | 'CLIENT';
    };

    req.user = decoded;
    next();
  } catch (error) {
    // Temporarily allow requests even if token verification fails
    next();
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Temporarily bypass admin requirement
  next();
};

export const requireClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Temporarily bypass client requirement
  next();
};
