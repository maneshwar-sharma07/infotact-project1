import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Global application error-handling middleware for Express.
 * Catches all thrown errors from route handlers and returns structured JSON response payloads.
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
  });
};
