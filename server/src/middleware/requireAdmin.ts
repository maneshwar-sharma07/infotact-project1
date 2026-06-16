import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware to restrict access to users with the 'admin' role.
 * Assumes verifyToken middleware has already been executed.
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' });
    return;
  }
  next();
};
