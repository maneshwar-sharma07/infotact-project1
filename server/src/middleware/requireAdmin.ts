import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict access to users with the 'admin' role.
 * Assumes verifyToken middleware has already been executed.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' });
    return;
  }
  next();
};
